import { executeSql } from '../_lib/db.js';
import { getAuthFromRequest, unauthorized } from '../_lib/auth.js';

interface User {
  id: number;
  email: string;
  display_name: string | null;
  role: 'student' | 'parent';
  grade_level: number | null;
}

export async function PATCH(request: Request) {
  try {
    const auth = getAuthFromRequest(request);
    if (!auth) return unauthorized();

    const body = await request.json() as { displayName?: string; gradeLevel?: number };
    const { displayName, gradeLevel } = body;

    // Only students can update grade level
    if (gradeLevel !== undefined && auth.role !== 'student') {
      return Response.json({ error: 'Only students can update grade level' }, { status: 403 });
    }

    // Validate grade level
    if (gradeLevel !== undefined && (gradeLevel < 0 || gradeLevel > 12)) {
      return Response.json({ error: 'Grade level must be between 0 (Kindergarten) and 12' }, { status: 400 });
    }

    // Build update query dynamically based on what's provided
    const updates: string[] = [];
    const params: unknown[] = [];
    let paramIndex = 1;

    if (displayName !== undefined) {
      updates.push(`display_name = $${paramIndex}`);
      params.push(displayName);
      paramIndex++;
    }

    if (gradeLevel !== undefined) {
      updates.push(`grade_level = $${paramIndex}`);
      params.push(gradeLevel);
      paramIndex++;
    }

    if (updates.length === 0) {
      return Response.json({ error: 'No fields to update' }, { status: 400 });
    }

    params.push(auth.userId);

    await executeSql(
      `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramIndex}`,
      params
    );

    // Fetch updated user
    const result = await executeSql<User>(
      'SELECT id, email, display_name, role, grade_level FROM users WHERE id = $1',
      [auth.userId]
    );

    const user = result.rows[0];
    return Response.json({
      id: user.id,
      email: user.email,
      displayName: user.display_name,
      role: user.role,
      gradeLevel: user.grade_level,
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return Response.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
