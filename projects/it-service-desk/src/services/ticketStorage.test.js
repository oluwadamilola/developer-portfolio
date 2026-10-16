import { describe, expect, it, vi } from "vitest";
import demoTickets from "../data/demoTickets.js";
import { loadTickets, saveTickets, TICKETS_STORAGE_KEY } from "./ticketStorage.js";

function createMemoryStorage(initialValue = null) {
  let value = initialValue;
  return {
    getItem: vi.fn(() => value),
    setItem: vi.fn((_key, nextValue) => {
      value = nextValue;
    }),
  };
}

describe("ticket storage", () => {
  it("loads demo tickets when no saved data exists", () => {
    const result = loadTickets(createMemoryStorage());

    expect(result.tickets).toEqual(demoTickets);
    expect(result.warning).toBeNull();
  });

  it("loads saved valid tickets", () => {
    const saved = JSON.stringify(demoTickets);
    const result = loadTickets(createMemoryStorage(saved));

    expect(result.tickets).toEqual(demoTickets);
    expect(result.warning).toBeNull();
  });

  it("falls back to demo data when saved JSON is corrupted", () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const result = loadTickets(createMemoryStorage("{invalid json"));

    expect(result.tickets).toEqual(demoTickets);
    expect(result.warning).toMatch(/could not be read/i);
  });

  it("falls back when the saved shape is invalid and reports write failures", () => {
    const storage = createMemoryStorage(JSON.stringify([{ id: "bad" }]));
    const invalidResult = loadTickets(storage);
    const failingStorage = {
      setItem: () => {
        throw new Error("storage quota");
      },
    };
    vi.spyOn(console, "warn").mockImplementation(() => {});

    expect(invalidResult.tickets).toEqual(demoTickets);
    expect(invalidResult.warning).toMatch(/invalid/i);
    expect(saveTickets(demoTickets, failingStorage)).toEqual({
      ok: false,
      error: expect.stringMatching(/could not be saved/i),
    });
  });

  it("rejects duplicate ticket IDs in saved data", () => {
    const duplicateTickets = [demoTickets[0], demoTickets[0]];
    const result = loadTickets(createMemoryStorage(JSON.stringify(duplicateTickets)));

    expect(result.tickets).toEqual(demoTickets);
    expect(result.warning).toMatch(/invalid/i);
  });

  it("persists tickets under the service desk storage key", () => {
    const storage = createMemoryStorage();
    expect(saveTickets(demoTickets, storage)).toEqual({
      ok: true,
      error: null,
    });
    expect(storage.setItem).toHaveBeenCalledWith(
      TICKETS_STORAGE_KEY,
      JSON.stringify(demoTickets),
    );
  });
});
