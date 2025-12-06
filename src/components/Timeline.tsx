import styles from "./Timeline.module.css";

type Bucket = {
  start: number;
  count: number;
};

type TimelineProps = {
  events: any[];
};

function buildBuckets(events: any[]): Bucket[] {
  if (events.length === 0) return [];

  const times = events.map((e) => e._time).filter((t) => typeof t === "number");

  if (times.length === 0) return [];

  const minTime = Math.min(...times);
  const maxTime = Math.max(...times);
  const span = Math.max(1, maxTime - minTime);

  const bucketMs = 60 * 60 * 1000;
  const bucketCount = Math.max(1, Math.ceil(span / bucketMs));

  const buckets: Bucket[] = Array.from({ length: bucketCount }, (_, i) => ({
    start: minTime + i * bucketMs,
    count: 0,
  }));

  for (const e of events) {
    const t = e._time;
    if (typeof t !== "number") continue;

    const rawIndex = Math.floor((t - minTime) / bucketMs);
    const index = Math.min(Math.max(rawIndex, 0), buckets.length - 1);
    buckets[index].count++;
  }
  return buckets;
}

const Timeline: React.FC<TimelineProps> = ({ events }) => {
  const buckets = buildBuckets(events);
  if (buckets.length === 0) return null;

  const maxCount = Math.max(...buckets.map((b) => b.count)) || 1;

  return (
    <div className={styles.timeline}>
      {buckets.map((b) => {
        const heightPercent = (b.count / maxCount) * 100;
        const label = `${new Date(b.start).toISOString()} — ${b.count} events`;

        return (
          <div
            key={b.start}
            className={styles.bucket}
            style={{ height: `${Math.max(8, heightPercent)}%` }}
            title={label}
          />
        );
      })}
    </div>
  );
};

export default Timeline;
