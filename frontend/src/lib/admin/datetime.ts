/**
 * `<input type="datetime-local">` yerel saat dilimi bekler ve saniye/UTC
 * sonekini kabul etmez. Backend ISO Zulu (`…Z`) döner; bu yüzden yalnızca
 * form alanını doldururken `YYYY-MM-DDTHH:mm` biçimine kısaltılır.
 */
export function toDateTimeLocalValue(isoDate: string | null | undefined): string {
  if (!isoDate) return "";

  const parsedDate = new Date(isoDate);
  if (Number.isNaN(parsedDate.getTime())) return "";

  const pad = (value: number) => String(value).padStart(2, "0");
  return `${parsedDate.getFullYear()}-${pad(parsedDate.getMonth() + 1)}-${pad(parsedDate.getDate())}T${pad(parsedDate.getHours())}:${pad(parsedDate.getMinutes())}`;
}
