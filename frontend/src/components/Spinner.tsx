interface SpinnerProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
}

export default function Spinner({ size = 'medium', text }: SpinnerProps) {
  const sizeMap = {
    small: 20,
    medium: 36,
    large: 48,
  };

  const dimension = sizeMap[size];

  return (
    <div className="spinner-container">
      <div
        className="spinner"
        style={{
          width: dimension,
          height: dimension,
          borderWidth: size === 'small' ? 2 : 3,
        }}
        role="status"
        aria-label="Loading"
      />
      {text && <p className="spinner-text">{text}</p>}
    </div>
  );
}
