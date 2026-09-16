import { Container } from "@/components/shared/container";
import { MarkerUnderline } from "@/components/shared/marker-underline";
import { Reveal } from "@/components/shared/reveal";

/** Geniş nefes alanlı, tek büyük editoryal cümle — kart yok, ikon yok. */
export function IntroStatement() {
  return (
    <section className="bg-paper py-24 lg:py-32">
      <Container>
        <Reveal>
          <p className="mx-auto max-w-4xl text-center font-display text-display-lg leading-tight text-ink">
            Bizim için başarı; not ortalamaları değil,{" "}
            <MarkerUnderline className="italic">bağımsızlık</MarkerUnderline>, özgüven ve
            gerçek bir aidiyet duygusudur.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
