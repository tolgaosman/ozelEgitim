import { Quote } from "lucide-react";
import { ArchImage } from "@/components/shared/arch-image";
import { Container } from "@/components/shared/container";
import { Reveal } from "@/components/shared/reveal";
import type { Testimonial } from "@/lib/schemas/testimonial";

/**
 * Şeftali renkli bant: solda dekoratif portre (`ArchImage`), sağda öne
 * çıkan aile görüşü. Görsel gerçek bir veliyi temsil etmez — tamamen
 * dekoratiftir (bkz. `public/images/CREDITS.md`).
 */
export function ParentTestimonials({ testimonials }: { testimonials: Testimonial[] }) {
  if (testimonials.length === 0) return null;

  const [featuredTestimonial, ...remainingTestimonials] = testimonials;

  return (
    <section className="bg-peach-100 py-24 lg:py-32">
      <Container>
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:items-center">
          <Reveal>
            <ArchImage
              src="/images/testimonial-feature.jpg"
              alt=""
              className="mx-auto aspect-[3/4] w-full max-w-sm lg:mx-0"
              sizes="(min-width: 1024px) 32vw, 80vw"
            />
          </Reveal>

          <div>
            <p className="text-sm font-semibold tracking-wide text-clay-600">Aile Deneyimleri</p>
            <Reveal delaySeconds={0.08}>
              <Quote className="mt-4 size-10 text-clay-500" aria-hidden="true" />
              <blockquote className="mt-3 font-display text-display-md text-ink">
                “{featuredTestimonial.quote}”
              </blockquote>
            </Reveal>
            <p className="mt-5 text-sm font-medium text-ink">
              {featuredTestimonial.parentName}
              <span className="text-ink-soft"> — {featuredTestimonial.relationLabel}</span>
            </p>
          </div>
        </div>

        {remainingTestimonials.length > 0 ? (
          <div className="mt-16 grid grid-cols-1 gap-8 border-t border-ink/10 pt-12 sm:grid-cols-2">
            {remainingTestimonials.map((testimonial, index) => (
              <Reveal key={testimonial.id} delaySeconds={index * 0.08}>
                <blockquote className="text-base leading-relaxed text-ink-soft">
                  “{testimonial.quote}”
                </blockquote>
                <p className="mt-3 text-sm font-medium text-ink">
                  {testimonial.parentName}
                  <span className="text-ink-faint"> — {testimonial.relationLabel}</span>
                </p>
              </Reveal>
            ))}
          </div>
        ) : null}
      </Container>
    </section>
  );
}
