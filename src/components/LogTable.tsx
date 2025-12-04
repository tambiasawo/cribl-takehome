import React, { useState } from "react";
import styles from "./LogTable.module.css";

const LogTable = ({ events }: { events: any[] }) => {
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
    <div className={styles.tableContainer}>
      <table className={styles.logTable}>
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
                  className={isOpen ? styles.rowExpanded : undefined}
                  onClick={() => handleToggle(idx)}
                >
                  <td className={styles.timeCell}>{time}</td>
                  <td className={styles.eventCell}>
                    <code className={styles.eventSingleLine}>
                      {singleLineEvent}
                    </code>
                  </td>
                </tr>
                {isOpen && (
                  <tr className={styles.rowDetails}>
                    <td colSpan={2}>
                      <pre className={styles.eventMultiLine}>
                        {multiLineEvent}
                      </pre>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default LogTable;
