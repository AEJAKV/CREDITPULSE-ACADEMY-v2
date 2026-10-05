export async function post(url: string, data: unknown) {
  let response: Response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  } catch {
    throw new Error(
      'The site could not reach its server. Make sure npm run dev is still running, then reload this page.',
    );
  }
  let result: { error?: string; redirect?: string; ok?: boolean };
  try {
    result = await response.json();
  } catch {
    throw new Error(
      'The server returned an unexpected response. Check the VS Code terminal and reload.',
    );
  }
  if (!response.ok) throw new Error(result.error || 'The request could not be completed.');
  return result;
}
