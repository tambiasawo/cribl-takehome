import useLogStream from "./hooks/useLogStream";
import LogTable from "./components/LogTable";
import styles from "./App.module.css";

const URL = "https://s3.amazonaws.com/io.cribl.c021.takehome/cribl.log";

function App() {
  const { events, isLoading, error, isDone } = useLogStream(URL);

  return (
    <div className={styles.appRoot}>
      <header className={styles.appHeader}>
        <h1>Take-Home Log Viewer</h1>

        <div className={styles.appStatus}>
          {error && <span className={styles.statusBadgeError}>Error</span>}
          {!error && isLoading && !isDone && (
            <span className={styles.statusBadgeLoading}>Streaming...</span>
          )}
          {!error && !isLoading && isDone && (
            <span className={styles.statusBadgeDone}>Finished</span>
          )}
        </div>
      </header>

      {error && (
        <div className={styles.appMessageError}>
          Failed to load logs: {error}
        </div>
      )}

      {!error && (events.length > 0 || isLoading) && (
        <LogTable events={events} />
      )}

      {!error && !isLoading && isDone && events.length === 0 && (
        <div className={styles.appMessage}>No log events found.</div>
      )}
    </div>
  );
}

export default App;
