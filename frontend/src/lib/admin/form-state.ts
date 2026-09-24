/**
 * Tüm kaynak formlarının (`useActionState`) paylaştığı ortak durum şekli.
 * "use server" işaretli dosyalar yalnızca async fonksiyon export edebilir,
 * bu yüzden bu sabit/tip burada, ayrı bir dosyada tutulur.
 */
export type ResourceFormState = {
  status: "idle" | "error" | "success";
  message?: string;
  errors?: Record<string, string[]>;
  redirectUrl?: string;
};

export const INITIAL_RESOURCE_FORM_STATE: ResourceFormState = { status: "idle" };
