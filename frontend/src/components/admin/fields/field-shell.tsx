import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";

export function FieldShell({
  label,
  htmlFor,
  hint,
  error,
  required,
  children,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor}>
        {label}
        {required ? <span className="text-signal">*</span> : null}
      </Label>
      {children}
      {hint && !error ? <p className="text-xs text-ink-faint">{hint}</p> : null}
      {error ? (
        <p role="alert" className="text-xs font-medium text-signal">
          {error}
        </p>
      ) : null}
    </div>
  );
}
