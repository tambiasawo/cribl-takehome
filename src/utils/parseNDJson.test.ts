import { describe, it, expect } from "vitest";
import { parseNDJson } from "./parseNDJson";

describe("parseNDJSON", () => {
  it("passes full lines and leaves no rest", () => {
    const testBuffer =
      '{"_time":1724323612592,"message":"first"}\n' +
      '{"_time":1724323613592,"message":"second"}\n';

    const { events, rest } = parseNDJson(testBuffer);

    expect(rest).toBe("");
    expect(events.length).toBe(2);
    expect(events[0]).toEqual({ _time: 1724323612592, message: "first" });
    expect(events[1]).toEqual({ _time: 1724323613592, message: "second" });
  });

  it("keeps partial last line as rest", () => {
    const testBuffer =
      '{"_time":1724323612592,"message":"first"}\n' +
      '{"_time":1724323613592,"message":"second';

    const { events, rest } = parseNDJson(testBuffer);

    expect(rest).toBe('{"_time":1724323613592,"message":"second');
    expect(events.length).toBe(1);
    expect(events[0]).toEqual({ _time: 1724323612592, message: "first" });
  });

  it("ignores empty lines", () => {
    const input = '\n{"_time":1,"message":"only"}\n\n';
    const { events, rest } = parseNDJson(input);
    expect(events.length).toBe(1);
    expect(events[0]).toEqual({ _time: 1, message: "only" });
    expect(rest).toBe("");
  });
});
