import React, { useState } from "react";

const LogTable = ({
  events,
}: {
  events: any[];
  loading: boolean;
  error: string | null;
  done: boolean;
}) => {
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  const handleToggle = React.useCallback((index: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }, []);

  return (
    <table className="log-table">
      <thead>
        <tr>
          <th>Timestamp</th>
          <th>Event</th>
        </tr>
      </thead>

      <tbody>
        {events.map((event, idx) => {
          const isOpen = expanded.has(idx);
          const time = event._time ? new Date(event._time).toISOString() : "";
          const singleLineEvent = JSON.stringify(event);
          const multiLineEvent = JSON.stringify(event, null, 2);

          return (
            <React.Fragment key={idx}>
              <tr
                className={isOpen ? "row-expanded" : "row-collapsed"}
                onClick={() => handleToggle(idx)}
              >
                <td className="time-cell">{time}</td>
                <td className="event-cell">
                  <code className="event-single-line">{singleLineEvent}</code>
                </td>
              </tr>
              {isOpen && (
                <tr className="row-details">
                  <td colSpan={2}>
                    <pre className="event-multi-line">{multiLineEvent}</pre>
                  </td>
                </tr>
              )}
            </React.Fragment>
          );
        })}
      </tbody>
    </table>
  );
};

export default LogTable;
