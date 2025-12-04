export function parseNDJson(buffer: string): { events: any[]; rest: string } {
  const lines = buffer.split("\n");
  const rest = lines.pop() || "";
  const events: any[] = [];

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;

    try {
      const event = JSON.parse(trimmedLine);
      events.push(event);
    } catch (err) {
      console.warn("Failed to parse log line", { trimmedLine, err });
    }
  }

  return { events, rest };
}
