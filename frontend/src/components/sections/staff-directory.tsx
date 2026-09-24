"use client";

import { useState } from "react";
import Image from "next/image";
import { GraduationCap } from "lucide-react";
import { Reveal } from "@/components/shared/reveal";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import type { StaffMember } from "@/lib/schemas/staff";

const avatarPalette = ["bg-aqua-100 text-navy-800", "bg-peach-100 text-navy-800", "bg-grass-100 text-navy-800"];

function getInitials(fullName: string): string {
  return fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function StaffAvatar({ staffMember, index, className }: { staffMember: StaffMember; index: number; className?: string }) {
  return staffMember.photo ? (
    <Image
      src={staffMember.photo}
      alt={staffMember.fullName}
      fill
      className={className}
      unoptimized
    />
  ) : (
    <div className={`flex h-full w-full items-center justify-center font-display text-2xl font-bold ${avatarPalette[index % avatarPalette.length]}`}>
      {getInitials(staffMember.fullName)}
    </div>
  );
}

export function StaffDirectory({ staffMembers }: { staffMembers: StaffMember[] }) {
  const [activeStaffMember, setActiveStaffMember] = useState<StaffMember | null>(null);

  return (
    <>
      <ul className="grid grid-cols-1 gap-6 min-[420px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
        {staffMembers.map((staffMember, index) => (
          <Reveal key={staffMember.id} as="li" delaySeconds={Math.min(index * 0.06, 0.24)} className="h-full">
            <button
              type="button"
              onClick={() => setActiveStaffMember(staffMember)}
              className="group flex h-full w-full flex-col overflow-hidden rounded-2xl bg-white text-left shadow-sm ring-1 ring-border transition-shadow hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-600"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted">
                <StaffAvatar
                  staffMember={staffMember}
                  index={index}
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="flex flex-1 flex-col gap-2 p-4">
                <div>
                  <h2 className="font-display text-base font-bold text-ink">{staffMember.fullName}</h2>
                  <p className="mt-0.5 text-xs font-bold text-navy-600">{staffMember.title}</p>
                </div>
                <p className="flex-1 text-xs leading-relaxed text-ink-soft">{staffMember.bio}</p>
                <ul className="mt-2 flex flex-wrap gap-1.5">
                  {staffMember.specialties.map((specialty) => (
                    <li
                      key={specialty}
                      className="rounded-full bg-paper px-2 py-1 text-[10px] font-semibold tracking-wide text-ink-soft"
                    >
                      {specialty}
                    </li>
                  ))}
                </ul>
              </div>
            </button>
          </Reveal>
        ))}
      </ul>

      <Dialog open={activeStaffMember !== null} onOpenChange={(open) => !open && setActiveStaffMember(null)}>
        {activeStaffMember && (
          <DialogContent className="sm:max-w-2xl lg:max-w-3xl p-0 sm:rounded-3xl">
            <div className="grid grid-cols-1 sm:grid-cols-5">
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted sm:col-span-2 sm:aspect-auto sm:rounded-l-3xl">
                <StaffAvatar staffMember={activeStaffMember} index={0} className="object-cover object-top" />
              </div>

              <div className="flex flex-col gap-5 p-6 sm:col-span-3 sm:p-8">
                <DialogHeader staffMember={activeStaffMember} />

                <div>
                  <h3 className="text-xs font-bold tracking-wide text-navy-600 uppercase">Hakkında</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{activeStaffMember.bio}</p>
                </div>

                <div>
                  <h3 className="text-xs font-bold tracking-wide text-navy-600 uppercase">Uzmanlık alanları</h3>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {activeStaffMember.specialties.map((specialty) => (
                      <li
                        key={specialty}
                        className="rounded-full bg-paper px-3 py-1.5 text-xs font-semibold tracking-wide text-ink-soft"
                      >
                        {specialty}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-xs font-bold tracking-wide text-navy-600 uppercase">Eğitim</h3>
                  <ul className="mt-2 space-y-2">
                    {activeStaffMember.education.map((line) => (
                      <li key={line} className="flex items-start gap-2 text-sm text-ink-soft">
                        <GraduationCap className="mt-0.5 size-4 shrink-0 text-navy-600" aria-hidden="true" />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}

function DialogHeader({ staffMember }: { staffMember: StaffMember }) {
  return (
    <div>
      <DialogTitle className="font-display text-2xl font-bold text-ink">{staffMember.fullName}</DialogTitle>
      <DialogDescription className="mt-1 text-sm font-bold text-navy-600">{staffMember.title}</DialogDescription>
    </div>
  );
}
