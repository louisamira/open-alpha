import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import Spinner from '../components/Spinner';

interface SubjectSummary {
  subjectId: string;
  subjectName: string;
  completed: number;
  inProgress: number;
  notStarted: number;
  totalConcepts: number;
  percentComplete: number;
}

interface Activity {
  subject: string;
  concept_id: string;
  mastery_score: number;
  last_attempt_at: string;
}

export default function StudentDashboard() {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();
  const [summary, setSummary] = useState<SubjectSummary[]>([]);
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [summaryRes, activityRes] = await Promise.all([
          fetch('/api/progress/summary', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch('/api/progress/activity/recent', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (summaryRes.ok) {
          const data = await summaryRes.json();
          setSummary(data.summary);
        }

        if (activityRes.ok) {
          const data = await activityRes.json();
          setRecentActivity(data.recentProgress || []);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [token]);

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
    9: '9th Grade',
    10: '10th Grade',
    11: '11th Grade',
    12: '12th Grade',
  };

  const subjectEmojis: Record<string, string> = {
    math: '📐',
    reading: '📚',
    science: '🔬',
  };

  if (loading) {
    return <Spinner size="large" text="Loading your progress..." />;
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Header */}
      <header style={{ padding: '1rem 0', borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>Open Alpha</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ color: 'var(--text-light)' }}>
              {user?.displayName || user?.email} · {gradeLabels[user?.gradeLevel || 0]}
            </span>
            <button onClick={logout} className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container" style={{ padding: '2rem 1rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>
          Welcome back{user?.displayName ? `, ${user.displayName}` : ''}!
        </h2>

        {/* Subject Cards */}
        <section style={{ marginBottom: '3rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Choose a Subject</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {summary.map((subject) => (
              <div
                key={subject.subjectId}
                className="card"
                style={{ cursor: 'pointer', transition: 'transform 0.15s ease, box-shadow 0.15s ease' }}
                onClick={() => navigate(`/learn/${subject.subjectId}`)}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '2rem' }}>{subjectEmojis[subject.subjectId]}</span>
                  <h4 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{subject.subjectName}</h4>
                </div>

                {/* Progress Bar */}
                <div style={{ marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>Progress</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{subject.percentComplete}%</span>
                  </div>
                  <div style={{ height: '8px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${subject.percentComplete}%`,
                        background: 'var(--secondary)',
                        borderRadius: '4px',
                        transition: 'width 0.3s ease',
                      }}
                    />
                  </div>
                </div>

                <p style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>
                  {subject.completed} completed · {subject.inProgress} in progress · {subject.notStarted} to go
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Activity */}
        <section>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Recent Activity</h3>
          {recentActivity.length === 0 ? (
            <p style={{ color: 'var(--text-light)' }}>No activity yet. Start learning to see your progress!</p>
          ) : (
            <div className="card">
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {recentActivity.slice(0, 5).map((activity, index) => (
                  <li
                    key={index}
                    style={{
                      padding: '0.75rem 0',
                      borderBottom: index < recentActivity.length - 1 ? '1px solid var(--border)' : 'none',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <span style={{ marginRight: '0.5rem' }}>{subjectEmojis[activity.subject]}</span>
                      <span style={{ fontWeight: 500 }}>{activity.concept_id.replace(`${activity.subject}-`, '').replace(/-/g, ' ')}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span
                        style={{
                          padding: '0.25rem 0.5rem',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          background: activity.mastery_score >= 80 ? 'var(--success)' : 'var(--primary)',
                          color: 'white',
                        }}
                      >
                        {activity.mastery_score}%
                      </span>
                      <Link
                        to={`/learn/${activity.subject}/${activity.concept_id}`}
                        className="btn btn-outline"
                        style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        Continue
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
