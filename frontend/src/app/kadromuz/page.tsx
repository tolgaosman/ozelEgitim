import type { Metadata } from "next";
import { PageHero } from "@/components/shared/page-hero";
import { Container } from "@/components/shared/container";
import { Reveal } from "@/components/shared/reveal";
import { ContactCtaBand } from "@/components/sections/contact-cta-band";
import { fetchStaffCollection } from "@/lib/repositories/staff";

export const metadata: Metadata = {
  title: "Kadromuz",
  description:
    "İz Özel Eğitim Merkezi'nin özel eğitim uzmanları, dil ve konuşma terapistleri, ABA uzmanları ve fizyoterapistlerini tanıyın.",
};

const avatarPalette = ["bg-sage-100 text-sage-700", "bg-peach-100 text-clay-700", "bg-sky-100 text-sky-800"];

function getInitials(fullName: string): string {
  return fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default async function StaffPage() {
  const staffMembers = await fetchStaffCollection();

  return (
    <>
      <PageHero
        title="Kadromuz"
        description="Alanında uzman, deneyimli ve şefkatli bir ekiple çocuğunuzun yanındayız."
        breadcrumbItems={[{ label: "Kadromuz" }]}
        image="/images/hero-staff.jpg"
      />

      <section className="bg-white py-24 lg:py-32">
        <Container>
          <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {staffMembers.map((staffMember, index) => (
              <Reveal
                key={staffMember.id}
                delaySeconds={Math.min(index * 0.06, 0.24)}
                className="h-full"
              >
                <li className="flex h-full flex-col gap-4 rounded-2xl border border-border bg-card p-7 shadow-[var(--shadow-card)]">
                  <span
                    aria-hidden="true"
                    className={`flex size-16 items-center justify-center rounded-full font-display text-xl italic ${avatarPalette[index % avatarPalette.length]}`}
                  >
                    {getInitials(staffMember.fullName)}
                  </span>
                  <div>
                    <h2 className="font-display text-lg font-semibold text-ink">{staffMember.fullName}</h2>
                    <p className="text-sm font-medium text-clay-600">{staffMember.title}</p>
                  </div>
                  <p className="flex-1 text-sm leading-relaxed text-ink-soft">{staffMember.bio}</p>
                  <ul className="flex flex-wrap gap-2">
                    {staffMember.specialties.map((specialty) => (
                      <li
                        key={specialty}
                        className="rounded-full bg-peach-50 px-3 py-1 text-xs font-medium text-ink-soft"
                      >
                        {specialty}
                      </li>
                    ))}
                  </ul>
                </li>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      <ContactCtaBand />
    </>
  );
}
