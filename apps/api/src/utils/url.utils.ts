export function buildStaticUrl(host: string | null, port: number | null, secure = false): string {
  if (!host) {
    return '';
  }

  if (/^https?:\/\//i.test(host)) {
    try {
      const url = new URL(host);
      if (port && !url.port && port !== 80 && port !== 443) {
        url.port = String(port);
      }
      return url.origin;
    } catch {
      return host;
    }
  }

  const protocol = secure ? 'https' : 'http';
  if (!port || port === 80) {
    return `${protocol}://${host}`;
  }

  return `${protocol}://${host}:${port}`;
}
