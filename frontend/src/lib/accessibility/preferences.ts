"use client";

import { useCallback, useState } from "react";

export const ACCESSIBILITY_STORAGE_KEY = "iz-accessibility-preferences";

export type TextScalePreference = "base" | "lg" | "xl";
export type ContrastPreference = "default" | "high";
export type FontPreference = "default" | "legible";
export type MotionPreference = "default" | "reduced";

export type AccessibilityPreferences = {
  textScale: TextScalePreference;
  contrast: ContrastPreference;
  font: FontPreference;
  motion: MotionPreference;
};

export const DEFAULT_ACCESSIBILITY_PREFERENCES: AccessibilityPreferences = {
  textScale: "base",
  contrast: "default",
  font: "default",
  motion: "default",
};

function applyPreferencesToDocument(preferences: AccessibilityPreferences): void {
  const documentElement = document.documentElement;
  documentElement.setAttribute("data-text-scale", preferences.textScale);
  documentElement.setAttribute("data-contrast", preferences.contrast);
  documentElement.setAttribute("data-font", preferences.font);
  documentElement.setAttribute("data-motion", preferences.motion);
}

function readStoredPreferences(): AccessibilityPreferences {
  try {
    const rawValue = window.localStorage.getItem(ACCESSIBILITY_STORAGE_KEY);
    if (!rawValue) return DEFAULT_ACCESSIBILITY_PREFERENCES;
    const parsedValue = JSON.parse(rawValue) as Partial<AccessibilityPreferences>;
    return { ...DEFAULT_ACCESSIBILITY_PREFERENCES, ...parsedValue };
  } catch {
    return DEFAULT_ACCESSIBILITY_PREFERENCES;
  }
}

/**
 * Erişilebilirlik tercihlerini localStorage ile senkron tutan hook.
 * `layout.tsx` içindeki senkron bootstrap script'i ilk boyamayı doğru
 * uygular; bu hook yalnızca kullanıcı etkileşimiyle güncellemeleri yönetir.
 */
export function useAccessibilityPreferences() {
  // Sunucuda `window` erişilemez; istemcide ilk render'da (yalnızca bir kez
  // çalışan) lazy initializer ile localStorage okunur. Panel içeriği yalnızca
  // kullanıcı açtığında görünür olduğundan bu, hidrasyon uyuşmazlığı yaratmaz.
  const [preferences, setPreferences] = useState<AccessibilityPreferences>(() => {
    if (typeof window === "undefined") return DEFAULT_ACCESSIBILITY_PREFERENCES;
    return readStoredPreferences();
  });

  const updatePreference = useCallback(
    <PreferenceKey extends keyof AccessibilityPreferences>(
      key: PreferenceKey,
      value: AccessibilityPreferences[PreferenceKey],
    ) => {
      setPreferences((currentPreferences) => {
        const nextPreferences = { ...currentPreferences, [key]: value };
        applyPreferencesToDocument(nextPreferences);
        try {
          window.localStorage.setItem(ACCESSIBILITY_STORAGE_KEY, JSON.stringify(nextPreferences));
        } catch {
          /* localStorage yazılamıyorsa (gizli sekme vb.) sessizce yoksayılır */
        }
        return nextPreferences;
      });
    },
    [],
  );

  const resetPreferences = useCallback(() => {
    setPreferences(DEFAULT_ACCESSIBILITY_PREFERENCES);
    applyPreferencesToDocument(DEFAULT_ACCESSIBILITY_PREFERENCES);
    try {
      window.localStorage.removeItem(ACCESSIBILITY_STORAGE_KEY);
    } catch {
      /* yoksayılır */
    }
  }, []);

  return { preferences, updatePreference, resetPreferences };
}
