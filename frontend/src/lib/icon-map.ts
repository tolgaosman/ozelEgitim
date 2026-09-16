import { Activity, Brain, Ear, HandHeart, MessageCircle, Puzzle, Sprout, Users, type LucideIcon } from "lucide-react";
import type { ProgramIcon } from "@/lib/schemas/program";

/**
 * Backend'den gelen serbest metin bir ikon adını doğrudan bileşene
 * geçirmek yerine, ProgramIconSchema ile sınırlanan sonlu kümeyi somut
 * bileşenlere eşler. Böylece hem tip güvenliği sağlanır hem de tasarım
 * öngörülemeyen ikonlarla bozulmaz.
 */
export const programIconMap: Record<ProgramIcon, LucideIcon> = {
  puzzle: Puzzle,
  "message-circle": MessageCircle,
  brain: Brain,
  activity: Activity,
  sprout: Sprout,
  ear: Ear,
  "hand-heart": HandHeart,
  users: Users,
};
