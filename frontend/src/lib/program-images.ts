/**
 * Program slug'larını `public/images/` altındaki editoryal fotoğraflara
 * eşler. Görseller şu an Unsplash yer tutucusudur (bkz.
 * `public/images/CREDITS.md`); gerçek fotoğraflar aynı dosya adlarıyla
 * değiştirildiğinde bu eşleme hiç değişmeden çalışmaya devam eder.
 */
export const programImageMap: Record<string, string> = {
  "ozel-ogrenme-guclugu": "/images/program-ozel-ogrenme-guclugu.jpg",
  "dil-ve-konusma-terapisi": "/images/program-dil-ve-konusma-terapisi.jpg",
  "otizm-spektrum-destek": "/images/program-otizm-spektrum-destek.jpg",
  "zihinsel-yetersizlik-destek": "/images/program-zihinsel-yetersizlik-destek.jpg",
  "fizyoterapi-duyu-butunleme": "/images/program-fizyoterapi-duyu-butunleme.jpg",
  "erken-cocukluk-ozel-egitimi": "/images/program-erken-cocukluk-ozel-egitimi.jpg",
  "dehb-destek-programi": "/images/program-dehb-destek-programi.jpg",
  "aile-danismanligi": "/images/program-aile-danismanligi.jpg",
};

const FALLBACK_PROGRAM_IMAGE = "/images/hero-programs.jpg";

/**
 * Öncelik sırası:
 *  1. Yönetim panelinden yüklenen görsel (`Program.image`),
 *  2. yukarıdaki slug→dosya eşlemesindeki editoryal yer tutucu,
 *  3. genel program görseli.
 *
 * Eşleme kaldırılmadı: panelden görsel yüklenmemiş programlar, backend
 * devreye girdikten sonra da bugünkü görsellerini korur.
 */
export function resolveProgramImage(slug: string, uploadedImageUrl?: string): string {
  return uploadedImageUrl ?? programImageMap[slug] ?? FALLBACK_PROGRAM_IMAGE;
}
