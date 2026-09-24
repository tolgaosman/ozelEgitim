"use client";

import { useState, useTransition } from "react";
import { GripVertical, Loader2, Plus, Save, Trash2 } from "lucide-react";
import { Reorder } from "motion/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createStatAction, deleteStatAction, reorderStatsAction, updateStatAction } from "@/lib/admin/actions/stats";
import type { AdminSiteStat } from "@/lib/admin/types";

function StatRow({ stat, onSaved, onDeleted }: { stat: AdminSiteStat; onSaved: (stat: AdminSiteStat) => void; onDeleted: () => void }) {
  const [label, setLabel] = useState(stat.label);
  const [targetValue, setTargetValue] = useState(String(stat.targetValue));
  const [suffix, setSuffix] = useState(stat.suffix);
  const [isPending, startTransition] = useTransition();

  function handleSave(): void {
    const formData = new FormData();
    formData.set("label", label);
    formData.set("targetValue", targetValue);
    formData.set("suffix", suffix);
    formData.set("sortOrder", String(stat.sortOrder));

    startTransition(async () => {
      const result = await updateStatAction(stat.id, formData);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      onSaved({ ...stat, label, targetValue: Number(targetValue), suffix });
      toast.success("Kaydedildi.");
    });
  }

  function handleDelete(): void {
    startTransition(async () => {
      const result = await deleteStatAction(stat.id);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      onDeleted();
    });
  }

  return (
    <div className="flex flex-wrap items-end gap-3 rounded-xl border border-border bg-paper/60 p-3">
      <span className="mb-2 cursor-grab text-ink-faint active:cursor-grabbing">
        <GripVertical className="size-4" aria-hidden="true" />
      </span>
      <div className="min-w-40 flex-1">
        <Label className="text-xs text-ink-faint">Etiket</Label>
        <Input value={label} onChange={(event) => setLabel(event.target.value)} placeholder="Yıllık Deneyim" />
      </div>
      <div className="w-24">
        <Label className="text-xs text-ink-faint">Değer</Label>
        <Input value={targetValue} onChange={(event) => setTargetValue(event.target.value)} type="number" min={0} />
      </div>
      <div className="w-20">
        <Label className="text-xs text-ink-faint">Son ek</Label>
        <Input value={suffix} onChange={(event) => setSuffix(event.target.value)} maxLength={8} placeholder="+" />
      </div>
      <Button type="button" size="icon-sm" onClick={handleSave} disabled={isPending} aria-label="Kaydet">
        {isPending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
      </Button>
      <Button type="button" variant="ghost" size="icon-sm" onClick={handleDelete} disabled={isPending} aria-label="Sil">
        <Trash2 className="size-4" />
      </Button>
    </div>
  );
}

export function StatsManager({ initialStats }: { initialStats: AdminSiteStat[] }) {
  const [stats, setStats] = useState(initialStats);
  const [isAdding, startAddTransition] = useTransition();
  const [draft, setDraft] = useState({ label: "", targetValue: "0", suffix: "" });

  function handleAdd(): void {
    if (!draft.label.trim()) {
      toast.error("Etiket gerekli.");
      return;
    }
    const formData = new FormData();
    formData.set("label", draft.label);
    formData.set("targetValue", draft.targetValue);
    formData.set("suffix", draft.suffix);
    formData.set("sortOrder", String(stats.length));

    startAddTransition(async () => {
      const result = await createStatAction(formData);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      setStats((current) => [
        ...current,
        { id: Date.now(), label: draft.label, targetValue: Number(draft.targetValue), suffix: draft.suffix, sortOrder: current.length },
      ]);
      setDraft({ label: "", targetValue: "0", suffix: "" });
      toast.success("Sayaç eklendi.");
    });
  }

  function handleReorder(newOrder: AdminSiteStat[]): void {
    setStats(newOrder);
    void reorderStatsAction(newOrder.map((stat) => stat.id));
  }

  return (
    <div className="rounded-2xl border border-border bg-white shadow-[var(--shadow-card)] p-5 sm:p-6">
      <h2 className="font-display text-base font-bold text-ink">İstatistik Sayaçları</h2>
      <p className="mt-1 text-sm text-ink-soft">Ana sayfa ve Hakkımızda sayfasındaki animasyonlu sayaçlar.</p>

      <Reorder.Group axis="y" values={stats} onReorder={handleReorder} className="mt-4 space-y-2">
        {stats.map((stat) => (
          <Reorder.Item key={stat.id} value={stat}>
            <StatRow
              stat={stat}
              onSaved={(updated) => setStats((current) => current.map((entry) => (entry.id === updated.id ? updated : entry)))}
              onDeleted={() => setStats((current) => current.filter((entry) => entry.id !== stat.id))}
            />
          </Reorder.Item>
        ))}
      </Reorder.Group>

      <div className="mt-4 flex flex-wrap items-end gap-3 border-t border-border pt-4">
        <div className="min-w-40 flex-1">
          <Label className="text-xs text-ink-faint">Yeni etiket</Label>
          <Input value={draft.label} onChange={(event) => setDraft((current) => ({ ...current, label: event.target.value }))} placeholder="Yeni sayaç" />
        </div>
        <div className="w-24">
          <Label className="text-xs text-ink-faint">Değer</Label>
          <Input
            value={draft.targetValue}
            onChange={(event) => setDraft((current) => ({ ...current, targetValue: event.target.value }))}
            type="number"
            min={0}
          />
        </div>
        <div className="w-20">
          <Label className="text-xs text-ink-faint">Son ek</Label>
          <Input value={draft.suffix} onChange={(event) => setDraft((current) => ({ ...current, suffix: event.target.value }))} maxLength={8} placeholder="+" />
        </div>
        <Button type="button" variant="outline" onClick={handleAdd} disabled={isAdding}>
          {isAdding ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
          Ekle
        </Button>
      </div>
    </div>
  );
}
