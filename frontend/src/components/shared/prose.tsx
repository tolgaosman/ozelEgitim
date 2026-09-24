import { cn } from "@/lib/utils";

type ProseProps = {
  paragraphs: string[];
  className?: string;
};

/**
 * Backend'den gelecek çok paragraflı içerikleri (program açıklaması, duyuru
 * gövdesi) render eder. Zengin metin/HTML değil düz metin paragrafları
 * kullanılır; bu sayede `dangerouslySetInnerHTML` ve dolayısıyla XSS riski
 * hiç oluşmaz (Rule 03). İleride zengin metin gerekirse mutlaka
 * `isomorphic-dompurify` ile sanitize edilmelidir.
 */
export function Prose({ paragraphs, className }: ProseProps) {
  return (
    <div className={cn("prose-copy space-y-4 text-base leading-relaxed text-ink-soft", className)}>
      {paragraphs.map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
    </div>
  );
}
