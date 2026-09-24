import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function SwitchField({
  name,
  label,
  hint,
  defaultChecked,
}: {
  name: string;
  label: string;
  hint?: string;
  defaultChecked?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <Switch id={name} name={name} defaultChecked={defaultChecked} />
      <div>
        <Label htmlFor={name}>{label}</Label>
        {hint ? <p className="mt-0.5 text-xs text-ink-faint">{hint}</p> : null}
      </div>
    </div>
  );
}
