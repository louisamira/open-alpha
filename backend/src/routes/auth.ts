import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { executeSql } from '../services/atxp-db.js';

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'development-secret-change-in-production';

// Validation schemas
const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  displayName: z.string().min(1).optional(),
  role: z.enum(['student', 'parent']),
  gradeLevel: z.number().min(0).max(12).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

interface User {
  id: number;
  email: string;
  password_hash: string;
  display_name: string | null;
  role: 'student' | 'parent';
  grade_level: number | null;
  created_at: string;
}

// Signup
router.post('/signup', async (req: Request, res: Response) => {
  try {
    const data = signupSchema.parse(req.body);

    // Validate grade level for students
    if (data.role === 'student' && data.gradeLevel === undefined) {
      res.status(400).json({ error: 'Grade level is required for students' });
      return;
    }

    // Check if email already exists
    const existing = await executeSql<User>(
      'SELECT id FROM users WHERE email = $1',
      [data.email]
    );

    if (existing.rows.length > 0) {
      res.status(400).json({ error: 'Email already registered' });
      return;
    }

    // Hash password
    const passwordHash = await bcrypt.hash(data.password, 10);

    // Insert user
    const result = await executeSql<User>(
      `INSERT INTO users (email, password_hash, display_name, role, grade_level)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, email, display_name, role, grade_level, created_at`,
      [data.email, passwordHash, data.displayName || null, data.role, data.gradeLevel || null]
    );

    const user = result.rows[0];

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.display_name,
        role: user.role,
        gradeLevel: user.grade_level,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid input', details: error.errors });
      return;
    }
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Failed to create account' });
  }
});

// Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const data = loginSchema.parse(req.body);

    // Find user
    const result = await executeSql<User>(
      'SELECT id, email, password_hash, display_name, role, grade_level FROM users WHERE email = $1',
      [data.email]
    );

    if (result.rows.length === 0) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const user = result.rows[0];

    // Verify password
    const validPassword = await bcrypt.compare(data.password, user.password_hash);
    if (!validPassword) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.display_name,
        role: user.role,
        gradeLevel: user.grade_level,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid input', details: error.errors });
      return;
    }
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to log in' });
  }
});

// Get current user
router.get('/me', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; role: string };

    const result = await executeSql<User>(
      'SELECT id, email, display_name, role, grade_level FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const user = result.rows[0];
    res.json({
      id: user.id,
      email: user.email,
      displayName: user.display_name,
      role: user.role,
      gradeLevel: user.grade_level,
    });
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;
