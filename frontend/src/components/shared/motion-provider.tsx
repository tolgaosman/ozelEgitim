"use client";

import { useEffect, useState, type ReactNode } from "react";
import { MotionConfig } from "motion/react";

/**
 * Framer Motion'a hareket tercihini merkezi olarak uygular.
 *
 * İki kaynak vardır ve ikisi de karşılanmalıdır:
 *
 * 1. İşletim sistemi tercihi (`prefers-reduced-motion`) — `MotionConfig`'in
 *    kendi `"user"` modu bunu SSR-güvenli şekilde çözer.
 * 2. Sitenin erişilebilirlik menüsünden gelen `html[data-motion="reduced"]`.
 *    Bunu yalnız CSS ile durduramayız: `globals.css` içindeki kural CSS
 *    geçiş/animasyon sürelerini sıfırlar ama framer-motion satır içi
 *    `transform` yazarak çalıştığı için ondan etkilenmez. Bu yüzden
 *    özniteliği burada okuyup `reducedMotion="always"`a çeviriyoruz.
 *
 * Render ağacı hiçbir koşulda dallanmaz — yalnızca bir yapılandırma değeri
 * değişir. Dallanma, sunucunun tercihi bilmemesi yüzünden hidrasyon
 * uyuşmazlığına ve tam da azaltılmış hareket isteyen kullanıcılarda
 * içeriğin görünmez kalmasına yol açardı.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  const [prefersReducedFromSite, setPrefersReducedFromSite] = useState(false);

  useEffect(() => {
    const documentElement = document.documentElement;

    const syncFromAttribute = () => {
      setPrefersReducedFromSite(documentElement.dataset.motion === "reduced");
    };

    syncFromAttribute();

    // Erişilebilirlik menüsündeki değişiklik sayfa yenilenmeden yansısın.
    const attributeObserver = new MutationObserver(syncFromAttribute);
    attributeObserver.observe(documentElement, {
      attributes: true,
      attributeFilter: ["data-motion"],
    });

    return () => attributeObserver.disconnect();
  }, []);

  return (
    <MotionConfig reducedMotion={prefersReducedFromSite ? "always" : "user"}>
      {children}
    </MotionConfig>
  );
}
