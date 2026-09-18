export function fromSeconds(value?: bigint | number | null): Date | undefined {
  if (value === undefined || value === null) return undefined;
  const seconds = typeof value === 'bigint' ? Number(value) : value;
  if (!Number.isFinite(seconds) || seconds <= 0) return undefined;
  return new Date(seconds * 1000);
}
