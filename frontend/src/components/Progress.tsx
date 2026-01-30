interface ProgressBarProps {
  value: number;
  max?: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'success';
}

export function ProgressBar({
  value,
  max = 100,
  showLabel = true,
  size = 'md',
  color = 'secondary',
}: ProgressBarProps) {
  const percentage = Math.round((value / max) * 100);

  const heights = {
    sm: '4px',
    md: '8px',
    lg: '12px',
  };

  const colors = {
    primary: 'var(--primary)',
    secondary: 'var(--secondary)',
    success: 'var(--success)',
  };

  return (
    <div>
      {showLabel && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>Progress</span>
          <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{percentage}%</span>
        </div>
      )}
      <div
        style={{
          height: heights[size],
          background: 'var(--border)',
          borderRadius: '9999px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${percentage}%`,
            background: colors[color],
            borderRadius: '9999px',
            transition: 'width 0.3s ease',
          }}
        />
      </div>
    </div>
  );
}

interface MasteryBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
}

export function MasteryBadge({ score, size = 'md' }: MasteryBadgeProps) {
  const isMastered = score >= 80;

  const sizes = {
    sm: { padding: '0.125rem 0.5rem', fontSize: '0.75rem' },
    md: { padding: '0.25rem 0.75rem', fontSize: '0.875rem' },
    lg: { padding: '0.5rem 1rem', fontSize: '1rem' },
  };

  return (
    <span
      style={{
        display: 'inline-block',
        borderRadius: '9999px',
        fontWeight: 600,
        background: isMastered ? 'var(--success)' : score > 0 ? 'var(--primary)' : 'var(--border)',
        color: score > 0 ? 'white' : 'var(--text-light)',
        ...sizes[size],
      }}
    >
      {score > 0 ? `${score}%` : 'Not started'}
    </span>
  );
}

interface ConceptStatusProps {
  completed: boolean;
  inProgress: boolean;
  size?: 'sm' | 'md';
}

export function ConceptStatus({ completed, inProgress, size = 'md' }: ConceptStatusProps) {
  const sizes = {
    sm: { width: '16px', height: '16px', fontSize: '0.625rem' },
    md: { width: '24px', height: '24px', fontSize: '0.75rem' },
  };

  let background = 'var(--border)';
  let content = '';

  if (completed) {
    background = 'var(--success)';
    content = '✓';
  } else if (inProgress) {
    background = 'var(--primary)';
    content = '•';
  }

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        background,
        color: 'white',
        flexShrink: 0,
        ...sizes[size],
      }}
    >
      {content}
    </span>
  );
}

interface SubjectCardProps {
  name: string;
  emoji: string;
  completed: number;
  total: number;
  onClick?: () => void;
}

export function SubjectCard({ name, emoji, completed, total, onClick }: SubjectCardProps) {
  return (
    <div
      className="card"
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      onClick={onClick}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
        <span style={{ fontSize: '2rem' }}>{emoji}</span>
        <h4 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{name}</h4>
      </div>

      <ProgressBar value={completed} max={total} />

      <p style={{ fontSize: '0.875rem', color: 'var(--text-light)', marginTop: '0.5rem' }}>
        {completed} of {total} concepts mastered
      </p>
    </div>
  );
}

export default {
  ProgressBar,
  MasteryBadge,
  ConceptStatus,
  SubjectCard,
};
