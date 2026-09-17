"use client";

import { PersonStanding } from "lucide-react";
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
    <fieldset className="space-y-3">
      <legend className="text-xs font-extrabold tracking-wider text-navy-800 uppercase">{legend}</legend>
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={legend}>
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={activeValue === option.value}
            onClick={() => onSelect(option.value)}
            className={cn(
              "flex min-h-11 items-center rounded-full border px-4 py-2 text-sm font-bold transition-colors",
              activeValue === option.value
                ? "border-transparent bg-aqua-100 text-navy-800"
                : "border-border bg-white text-ink-soft hover:border-navy-800/30 hover:text-ink",
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
          <button
            type="button"
            className="hover-bar flex min-h-11 items-center gap-2 px-3 text-sm font-bold tracking-wide text-white uppercase sm:px-6"
          >
            <PersonStanding className="size-5" aria-hidden="true" />
            {/*
             * `sr-only` — ikon `aria-hidden` olduğu için etiket telefonda
             * tamamen gizlenseydi butonun erişilebilir adı hiç kalmazdı.
             */}
            <span className="sr-only sm:not-sr-only">Erişilebilirlik</span>
          </button>
        }
      />
      <DialogContent className="rounded-2xl border border-border p-6 shadow-[var(--shadow-raised)] sm:max-w-md sm:p-7">
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-extrabold tracking-[-0.01em] text-ink sm:text-2xl">
            Erişilebilirlik Ayarları
          </DialogTitle>
          <DialogDescription className="text-sm leading-relaxed text-ink-soft">
            Okuma deneyimini kendinize veya çocuğunuza göre uyarlayın. Tercihleriniz bu
            cihazda hatırlanır.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-1">
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

        <Button
          variant="ghost"
          size="sm"
          onClick={resetPreferences}
          className="hover-bar justify-self-start text-xs font-extrabold tracking-wider text-navy-800 uppercase hover:bg-transparent"
        >
          Varsayılanlara dön
        </Button>
      </DialogContent>
    </Dialog>
  );
}
