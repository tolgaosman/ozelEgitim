import type { Metadata } from "next";
import Image from "next/image";
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

const avatarPalette = ["bg-aqua-100 text-navy-800", "bg-peach-100 text-navy-800", "bg-grass-100 text-navy-800"];
const accentBarPalette = ["bg-aqua-500", "bg-peach-400", "bg-grass-500"];

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
        lead="Uzman"
        accent="KADROMUZ"
        description="Alanında uzman, deneyimli ve şefkatli bir ekiple çocuğunuzun yanındayız."
        breadcrumbItems={[{ label: "Kadromuz" }]}
        image="/images/hero-staff.jpg"
      />

      <section className="bg-white py-16 sm:py-20 lg:py-32">
        <Container>
          <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {staffMembers.map((staffMember, index) => (
              <Reveal
                key={staffMember.id}
                delaySeconds={Math.min(index * 0.06, 0.24)}
                className="h-full"
              >
                <li className="flex h-full flex-col gap-5">
                  <span
                    className={`block h-1.5 w-14 rounded-full ${accentBarPalette[index % accentBarPalette.length]}`}
                    aria-hidden="true"
                  />
                  {staffMember.photo ? (
                    <Image
                      src={staffMember.photo}
                      alt=""
                      width={64}
                      height={64}
                      className="size-16 rounded-full object-cover"
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className={`flex size-16 items-center justify-center rounded-full font-display text-xl font-bold ${avatarPalette[index % avatarPalette.length]}`}
                    >
                      {getInitials(staffMember.fullName)}
                    </span>
                  )}
                  <div>
                    <h2 className="font-display text-lg font-bold text-ink">{staffMember.fullName}</h2>
                    <p className="text-sm font-medium text-navy-600">{staffMember.title}</p>
                  </div>
                  <p className="flex-1 text-sm leading-relaxed text-ink-soft">{staffMember.bio}</p>
                  <ul className="flex flex-wrap gap-2">
                    {staffMember.specialties.map((specialty) => (
                      <li
                        key={specialty}
                        className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-ink-soft"
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
