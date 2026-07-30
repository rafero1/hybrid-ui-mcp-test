export function parseMcpToolResponseBody<T>(body: any): T {
  try {
    const parsed = JSON.parse(body.content[0].text);
    return parsed as T;
  } catch (error) {
    console.error(`Error parsing JSON content:`, error, ". body: ", body);
    throw error;
  }
}
