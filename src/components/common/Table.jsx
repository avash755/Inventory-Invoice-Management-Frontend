export function Table({ children, className = "" }) {
  return (
    <div className={`w-full overflow-x-auto ${className}`}>
      <table className="min-w-full text-sm">{children}</table>
    </div>
  );
}

export function THead({ children }) {
  return (
    <thead className="bg-surface-50 text-left text-xs uppercase tracking-wide text-ink-500">
      {children}
    </thead>
  );
}

export function TH({ children, className = "" }) {
  return <th className={`px-4 py-3 font-medium ${className}`}>{children}</th>;
}

export function TBody({ children }) {
  return <tbody className="divide-y divide-ink-300/50">{children}</tbody>;
}

export function TR({ children, className = "" }) {
  return <tr className={`hover:bg-surface-50 ${className}`}>{children}</tr>;
}

export function TD({ children, className = "" }) {
  return <td className={`px-4 py-3 text-ink-700 ${className}`}>{children}</td>;
}