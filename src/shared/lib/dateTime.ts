export const isValidDateFormat = (value: string): boolean =>
  /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.(\d{4})$/.test(value);

export const isValidTimeFormat = (value: string): boolean =>
  /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);

export const parseDate = (value: string): Date | null => {
  const [dd, mm, yyyy] = value.split(".").map((v) => Number(v));
  const d = new Date(yyyy, mm - 1, dd);
  if (
    d.getFullYear() !== yyyy ||
    d.getMonth() !== mm - 1 ||
    d.getDate() !== dd
  ) {
    return null;
  }
  return d;
};

export const isPastDate = (value: string): boolean => {
  const d = parseDate(value);
  if (!d) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);
  return d < today;
};

export const formatDateInput = (digitsOnly: string): string => {
  const digits = digitsOnly.slice(0, 8);
  const dd = digits.slice(0, 2);
  const mm = digits.slice(2, 4);
  const yyyy = digits.slice(4, 8);

  if (digits.length <= 2) return dd;
  if (digits.length <= 4) return `${dd}.${mm}`;
  return `${dd}.${mm}.${yyyy}`;
};

export const formatTimeInput = (digitsOnly: string): string => {
  const digits = digitsOnly.slice(0, 4);
  const hh = digits.slice(0, 2);
  const mm = digits.slice(2, 4);

  if (digits.length <= 2) return hh;
  return `${hh}:${mm}`;
};
