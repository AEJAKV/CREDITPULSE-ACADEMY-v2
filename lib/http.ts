export class InputError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}
export function stringField(value: unknown, name: string, max = 200): string {
  if (typeof value !== 'string' || !value.trim() || value.length > max)
    throw new InputError(`Please enter a valid ${name}.`);
  return value.trim();
}
export function emailField(value: unknown) {
  const email = stringField(value, 'email address', 254).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    throw new InputError('Please enter a complete email address, such as name@example.com.');
  return email;
}
export function checkOrigin(request: Request) {
  const origin = request.headers.get('origin');
  const expected = process.env.APP_URL || new URL(request.url).origin;
  if (!origin || origin !== new URL(expected).origin) {
    throw new InputError(
      'This request came from a different site. Reload this page and try again.',
      403,
    );
  }
}
export async function body(request: Request) {
  const text = await request.text();
  if (text.length > 100000) throw new InputError('This submission is too large.', 413);
  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    throw new InputError('Please submit valid JSON.');
  }
}
export function errorResponse(error: unknown) {
  if (error instanceof InputError)
    return Response.json({ error: error.message }, { status: error.status });
  console.error('Credit Pulse request error:', error);
  return Response.json(
    {
      error:
        'We could not save this change. Check the server terminal or database connection and try again.',
    },
    { status: 500 },
  );
}
