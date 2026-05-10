import clsx from 'clsx';

// ─── FormInput ────────────────────────────────────────────────────────────────
// Props: label, id, type, required, error, ...rest (passed to <input>)
export function FormInput({ label, id, type = 'text', required, error, className, ...rest }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="input-label">
          {label}{required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <input
        id={id}
        type={type}
        className={clsx('input-field', error && 'border-red-400 focus:border-red-500 focus:ring-red-500/30', className)}
        {...rest}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

// ─── FormSelect ───────────────────────────────────────────────────────────────
export function FormSelect({ label, id, required, error, children, className, ...rest }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="input-label">
          {label}{required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <select
        id={id}
        className={clsx(
          'input-field appearance-none bg-white cursor-pointer',
          error && 'border-red-400',
          className,
        )}
        {...rest}
      >
        {children}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

// ─── FormTextarea ─────────────────────────────────────────────────────────────
export function FormTextarea({ label, id, required, error, rows = 3, className, ...rest }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="input-label">
          {label}{required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <textarea
        id={id}
        rows={rows}
        className={clsx('input-field resize-none', error && 'border-red-400', className)}
        {...rest}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
