## Cribl Log Viewer – Take‑Home Assignment

A small log viewer that streams a large NDJSON log file from S3, parses it incrementally in the browser, and renders it as an interactive table with a simple time‑based timeline.

### Goals

- **Efficient streaming**: Stream a large NDJSON log file without freezing the UI.
- **Incremental parsing**: Safely parse NDJSON as it arrives via `ReadableStream`.
- **Usable UI**: Present events in an easy‑to‑scan, interactive table.
- **Basic test coverage**: Cover core parsing and streaming logic with tests.

### Stack & Tooling

- **Frontend**: React + TypeScript (Vite)
- **Styling**: CSS Modules
- **Testing**: Vitest
- **Data Source**: NDJSON log file over HTTPS  
  `https://s3.amazonaws.com/io.cribl.c021.takehome/cribl.log`

### Requirements

- **Node.js**: LTS (e.g. 18+)
- **Package manager**: `npm`, `pnpm`, or `yarn`

### Getting Started

1. **Install dependencies**

   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn install
   ```

2. **Start the dev server**

   ```bash
   npm run dev
   ```

3. **Run tests**

   ```bash
   npm run test
   ```

### Design Overview

- **Data flow**: The app uses a custom `useLogStream` hook to `fetch` the NDJSON log, read it as a `ReadableStream`, incrementally decode chunks with `TextDecoder`, and parse them with `parseNDJson`.
- **State management**: Parsed events are appended into React state and passed down to `Timeline` and `LogTable` for visualization.
- **UI components**:
  - `LogTable`: Renders events in a table with expand/collapse rows to inspect full JSON details.
  - `Timeline`: Buckets events into fixed time windows and shows a density bar chart so you can see spikes at a glance.

### Usage

- **Starting the app**: Run `npm run dev` and open the printed local URL in your browser.
- **Exploring logs**:
  - Watch the **status badge** (“Streaming…”, “Finished”, or “Error”) at the top to understand current load state.
  - Click any row in the **log table** to expand and inspect the full JSON payload for a single event.
  - Use the **timeline** to visually spot high‑traffic periods; hover bars to see bucket timestamps and counts.
- **Data source**: Logs are streamed from  
  `https://s3.amazonaws.com/io.cribl.c021.takehome/cribl.log`.

### Testing

- **How to run tests**

  ```bash
  npm run test
  ```

- **What is tested**
  - `parseNDJson`: Correctly handles partial chunks, multiple lines, and malformed JSON.

### What I would test with more time

#### NDJSON Edge Cases

- Empty and whitespace-only lines are ignored.
- Invalid JSON lines are skipped with a logged warning but do not throw.
- Very long log lines still parse correctly.

#### Hook Behavior (`useLogStream`)

- Mock `fetch` and `ReadableStream` to simulate:
  - Lines that span multiple chunks.
  - Network failures or missing `response.body`.
- Assert state transitions:
  - `isLoading` is true while streaming.
  - `isDone` flips to true at the end.
  - `error` is populated on failure.

#### UI Behavior

- **LogTable**
  - Renders rows from a small set of fake events.
  - Clicking a row toggles visibility of the expanded JSON details.
- **Timeline**
  - I would write a pure test function around the `buildBuckets` logic to verify that events fall into expected buckets given a known time range.
