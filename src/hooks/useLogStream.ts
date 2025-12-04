import React, { useState } from "react";
import { parseNDJson } from "../utils/parseNDJson";

const useLogStream = (url: string) => {
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = React.useCallback(async (url: string) => {
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
        const { events, rest } = parseNDJson(buffer);
        buffer = rest;

        if (events.length > 0) {
          setEvents((prev) => [...prev, ...events]);
        }
      }

      const { events: lastEvents } = parseNDJson(buffer + "\n");
      if (lastEvents.length > 0) {
        setEvents((prev) => [...prev, ...lastEvents]);
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
    fetchLogs(url);
  }, [fetchLogs, url]);
  return { events, isLoading, error, isDone };
};

export default useLogStream;
