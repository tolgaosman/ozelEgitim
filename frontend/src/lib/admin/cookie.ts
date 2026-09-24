/**
 * `src/proxy.ts` (Edge runtime) ve sunucu tarafı admin kodu (Node runtime)
 * bu adı paylaşır — bilinçli olarak bağımsız, minimal bir dosyada tutulur
 * ki proxy'nin paketi büyümesin.
 */
export const ADMIN_TOKEN_COOKIE = "iz_admin_token";
