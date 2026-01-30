import { useState, FormEvent } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../App';

type Mode = 'login' | 'signup';
type Role = 'student' | 'parent';

export default function Login() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [mode, setMode] = useState<Mode>('login');
  const [role, setRole] = useState<Role>((searchParams.get('role') as Role) || 'student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [gradeLevel, setGradeLevel] = useState(5);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/signup';
      const body: Record<string, unknown> = { email, password };

      if (mode === 'signup') {
        body.role = role;
        body.displayName = displayName || undefined;
        if (role === 'student') {
          body.gradeLevel = gradeLevel;
        }
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      login(data.token, data.user);
      navigate(data.user.role === 'student' ? '/dashboard' : '/parent');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const gradeLabels: Record<number, string> = {
    0: 'Kindergarten',
    1: '1st Grade',
    2: '2nd Grade',
    3: '3rd Grade',
    4: '4th Grade',
    5: '5th Grade',
    6: '6th Grade',
    7: '7th Grade',
    8: '8th Grade',
    9: '9th Grade (Freshman)',
    10: '10th Grade (Sophomore)',
    11: '11th Grade (Junior)',
    12: '12th Grade (Senior)',
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
        <Link to="/" style={{ display: 'block', textAlign: 'center', marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>Open Alpha</h1>
        </Link>

        {/* Role Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <button
            type="button"
            onClick={() => setRole('student')}
            className={`btn ${role === 'student' ? 'btn-primary' : 'btn-outline'}`}
            style={{ flex: 1 }}
          >
            Student
          </button>
          <button
            type="button"
            onClick={() => setRole('parent')}
            className={`btn ${role === 'parent' ? 'btn-primary' : 'btn-outline'}`}
            style={{ flex: 1 }}
          >
            Parent
          </button>
        </div>

        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem', textAlign: 'center' }}>
          {mode === 'login' ? `${role === 'student' ? 'Student' : 'Parent'} Sign In` : 'Create Account'}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          {mode === 'signup' && (
            <>
              <div className="form-group">
                <label htmlFor="displayName">Display Name (optional)</label>
                <input
                  id="displayName"
                  type="text"
                  className="input"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder={role === 'student' ? 'Your nickname' : 'Your name'}
                />
              </div>

              {role === 'student' && (
                <div className="form-group">
                  <label htmlFor="gradeLevel">Grade Level</label>
                  <select
                    id="gradeLevel"
                    className="input"
                    value={gradeLevel}
                    onChange={(e) => setGradeLevel(parseInt(e.target.value, 10))}
                  >
                    {Object.entries(gradeLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </>
          )}

          {error && <p className="error-message">{error}</p>}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1rem' }}
            disabled={loading}
          >
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-light)' }}>
          {mode === 'login' ? (
            <>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('signup')}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: 0 }}
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: 0 }}
              >
                Sign in
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
