"use client";

import { Accessibility } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  useAccessibilityPreferences,
  type ContrastPreference,
  type FontPreference,
  type MotionPreference,
  type TextScalePreference,
} from "@/lib/accessibility/preferences";

type SegmentedOption<Value extends string> = {
  value: Value;
  label: string;
};

function SegmentedControl<Value extends string>({
  legend,
  options,
  activeValue,
  onSelect,
}: {
  legend: string;
  options: SegmentedOption<Value>[];
  activeValue: Value;
  onSelect: (value: Value) => void;
}) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium text-ink">{legend}</legend>
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={legend}>
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={activeValue === option.value}
            onClick={() => onSelect(option.value)}
            className={cn(
              "rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors",
              activeValue === option.value
                ? "border-sage-600 bg-sage-50 text-sage-700"
                : "border-border bg-background text-ink-soft hover:bg-muted",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

/**
 * Veliler ve özel gereksinimli bireyler için okuma ve duyusal deneyimi
 * kişiselleştiren panel. Tüm tercihler `useAccessibilityPreferences`
 * üzerinden anında `<html>` özniteliklerine yazılır ve localStorage'da
 * kalıcı hale gelir.
 */
export function AccessibilityMenu() {
  const { preferences, updatePreference, resetPreferences } = useAccessibilityPreferences();

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button variant="outline" size="sm" className="gap-1.5">
            <Accessibility className="size-4" aria-hidden="true" />
            <span className="hidden sm:inline">Erişilebilirlik</span>
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Erişilebilirlik Ayarları</DialogTitle>
          <DialogDescription>
            Okuma deneyimini kendinize veya çocuğunuza göre uyarlayın. Tercihleriniz bu
            cihazda hatırlanır.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-1">
          <SegmentedControl<TextScalePreference>
            legend="Yazı boyutu"
            activeValue={preferences.textScale}
            onSelect={(value) => updatePreference("textScale", value)}
            options={[
              { value: "base", label: "Normal" },
              { value: "lg", label: "Büyük" },
              { value: "xl", label: "Çok Büyük" },
            ]}
          />

          <SegmentedControl<ContrastPreference>
            legend="Kontrast"
            activeValue={preferences.contrast}
            onSelect={(value) => updatePreference("contrast", value)}
            options={[
              { value: "default", label: "Standart" },
              { value: "high", label: "Yüksek Kontrast" },
            ]}
          />

          <SegmentedControl<FontPreference>
            legend="Yazı tipi"
            activeValue={preferences.font}
            onSelect={(value) => updatePreference("font", value)}
            options={[
              { value: "default", label: "Standart" },
              { value: "legible", label: "Disleksi Dostu" },
            ]}
          />

          <SegmentedControl<MotionPreference>
            legend="Hareket ve animasyon"
            activeValue={preferences.motion}
            onSelect={(value) => updatePreference("motion", value)}
            options={[
              { value: "default", label: "Ölçülü Hareket" },
              { value: "reduced", label: "Hareketi Kapat" },
            ]}
          />
        </div>

        <Button variant="ghost" size="sm" onClick={resetPreferences} className="justify-self-start">
          Varsayılanlara dön
        </Button>
      </DialogContent>
    </Dialog>
  );
}
