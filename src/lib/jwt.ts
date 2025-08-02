export function parseJwt(token: string) {
  try {
    const [, payload] = token.split('.');
    const decoded = JSON.parse(atob(payload));
    return decoded as {
      sub: number;
      email: string;
      role: string;
      exp: number;
    };
  } catch {
    return null;
  }
}