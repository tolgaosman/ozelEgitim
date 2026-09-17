import "server-only";
import { fetchJson, isApiConfigured } from "@/lib/api/http";
import { resolveWithFallback } from "@/lib/repositories/with-fallback";
import { createCollectionEnvelopeSchema } from "@/lib/schemas/common";
import { TestimonialSchema, type Testimonial } from "@/lib/schemas/testimonial";
import { mockTestimonials } from "@/mocks/testimonials";

const TestimonialCollectionResponseSchema = createCollectionEnvelopeSchema(TestimonialSchema);

export async function fetchTestimonialCollection(): Promise<Testimonial[]> {
  if (!isApiConfigured()) {
    return mockTestimonials;
  }

  return resolveWithFallback(
    async () => {
      const response = await fetchJson("/api/testimonials", TestimonialCollectionResponseSchema, {
        tags: ["testimonials"],
      });
      return response.data;
    },
    mockTestimonials,
    "veli görüşleri",
  );
}
