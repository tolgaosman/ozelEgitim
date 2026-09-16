import { z } from "zod";

/**
 * Laravel API Resource'larının ürettiği standart zarf biçimleri.
 * Tekil kaynak: { data: T }
 * Koleksiyon: { data: T[], meta: { total, ... } }
 * Bu şemalar hem gerçek API yanıtlarını hem de src/mocks içindeki
 * yer tutucu veriyi doğrular — sözleşme sapması derleme/çalışma anında yakalanır.
 */
export function createResourceEnvelopeSchema<ItemSchema extends z.ZodTypeAny>(
  itemSchema: ItemSchema,
) {
  return z.object({
    data: itemSchema,
  });
}

export function createCollectionEnvelopeSchema<ItemSchema extends z.ZodTypeAny>(
  itemSchema: ItemSchema,
) {
  return z.object({
    data: z.array(itemSchema),
    meta: z
      .object({
        total: z.number().int().nonnegative(),
      })
      .optional(),
  });
}
