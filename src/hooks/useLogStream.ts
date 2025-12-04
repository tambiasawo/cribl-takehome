import React, { useState } from "react";

const useLogStream = (url: string) => {
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = React.useCallback(async () => {
    try {
      setIsLoading(true);
      setIsDone(false);
      setError(null);
      setEvents([]);

      const response = await fetch(url);
      if (!response.body) {
        throw new Error("Streaming is not supported");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (!trimmedLine) continue;

          try {
            const event = JSON.parse(trimmedLine);
            setEvents((prev) => [...prev, event]);
          } catch (err) {
            console.warn("Failed to parse log line", { trimmedLine, err });
          }
        }
      }

      const trimmedLastLine = buffer.trim();
      if (trimmedLastLine) {
        try {
          const lastEvent = JSON.parse(trimmedLastLine);
          setEvents((prev) => [...prev, lastEvent]);
        } catch (err) {
          console.warn("Failed to parse last log line", {
            trimmedLastLine,
            err,
          });
        }
      }
      setIsDone(true);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to stream logs"
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);
  return { events, isLoading, error, isDone };
};

export default useLogStream;
