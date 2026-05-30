export function SuiteIcon({ name, className = "h-6 w-6" }: { name: string; className?: string }) {
  const props = { className, fill: "none", stroke: "currentColor", strokeWidth: 1.5 };

  switch (name) {
    case "flower":
      return (
        <svg viewBox="0 0 24 24" {...props}>
          <circle cx="12" cy="12" r="2" fill="#FF0055" stroke="none" />
          {[0, 60, 120, 180, 240, 300].map((d) => (
            <ellipse key={d} cx="12" cy="7" rx="2" ry="5" transform={`rotate(${d} 12 12)`} />
          ))}
        </svg>
      );
    case "people":
      return (
        <svg viewBox="0 0 24 24" {...props}>
          <circle cx="9" cy="9" r="3" />
          <circle cx="16" cy="10" r="2.5" />
          <path d="M4 18c0-3 3-5 5-5s5 2 5 5M13 18c0-2.5 2.5-4.5 5-4.5" />
        </svg>
      );
    case "glasses":
      return (
        <svg viewBox="0 0 24 24" {...props}>
          <path d="M4 12h3l2-4h6l2 4h3M6 14v2M18 14v2" />
        </svg>
      );
    case "chair":
      return (
        <svg viewBox="0 0 24 24" {...props}>
          <path d="M8 10h8v6H8zM6 16h12v2H6zM10 6h4v4h-4z" />
        </svg>
      );
    case "book":
      return (
        <svg viewBox="0 0 24 24" {...props}>
          <path d="M6 4h8a4 4 0 0 1 4 4v12H6zM6 12h12" />
        </svg>
      );
    case "lotus":
      return (
        <svg viewBox="0 0 24 24" {...props}>
          <path d="M12 6c-2 4-6 5-6 9a6 6 0 0 0 12 0c0-4-4-5-6-9z" />
        </svg>
      );
    case "coffee":
      return (
        <svg viewBox="0 0 24 24" {...props}>
          <path d="M6 8h12v5a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8zM6 4h10" />
        </svg>
      );
    case "creative":
      return (
        <svg viewBox="0 0 24 24" {...props}>
          <path d="M12 3l2 7h7l-5.5 4 2 7-5.5-4-5.5 4 2-7-5.5-4z" />
        </svg>
      );
    case "business":
      return (
        <svg viewBox="0 0 24 24" {...props}>
          <rect x="4" y="8" width="16" height="10" rx="1" />
          <path d="M8 8V6h8v2" />
        </svg>
      );
    case "plane":
      return (
        <svg viewBox="0 0 24 24" {...props}>
          <path d="M3 12h18M12 3l9 9-9 9" />
        </svg>
      );
    case "key":
      return (
        <svg viewBox="0 0 24 24" {...props}>
          <circle cx="8" cy="15" r="4" />
          <path d="M12 15h8l-2-2 2-2" />
        </svg>
      );
    case "mail":
      return (
        <svg viewBox="0 0 24 24" {...props}>
          <rect x="4" y="6" width="16" height="12" rx="1" />
          <path d="M4 8l8 5 8-5" />
        </svg>
      );
    case "badge":
      return (
        <svg viewBox="0 0 24 24" {...props}>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 8v8M8 12h8" />
        </svg>
      );
    case "heart":
      return (
        <svg viewBox="0 0 24 24" {...props}>
          <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 5.5-7 10-7 10z" />
        </svg>
      );
    case "crown":
      return (
        <svg viewBox="0 0 24 24" {...props}>
          <path d="M4 16h16L12 6zM6 18h12" />
        </svg>
      );
    case "city":
      return (
        <svg viewBox="0 0 24 24" {...props}>
          <path d="M4 18V8l4-2v12M10 18V4l4-1v15M18 18V10l2-1v9" />
        </svg>
      );
    case "women":
      return (
        <svg viewBox="0 0 24 24" {...props}>
          <circle cx="12" cy="8" r="3" />
          <path d="M6 18c0-3 3-5 6-5s6 2 6 5" />
        </svg>
      );
    case "arrow":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor" stroke="none">
          <path d="M10 6l6 6-6 6V6z" />
        </svg>
      );
    default:
      return <span className={className} />;
  }
}
