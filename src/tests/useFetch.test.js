import { renderHook, waitFor } from "@testing-library/react";
import useFetch from "../hooks/useFetch";

afterEach(() => vi.restoreAllMocks());

test("returns data after a successful fetch", async () => {
  globalThis.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => [{ id: 1 }] });
  const { result } = renderHook(() => useFetch("/x"));
  expect(result.current.loading).toBe(true);
  await waitFor(() => expect(result.current.loading).toBe(false));
  expect(result.current.data).toEqual([{ id: 1 }]);
  expect(result.current.error).toBeNull();
});

test("sets error when the response is not ok", async () => {
  globalThis.fetch = vi.fn().mockResolvedValue({ ok: false, status: 500, json: async () => ({}) });
  const { result } = renderHook(() => useFetch("/x"));
  await waitFor(() => expect(result.current.loading).toBe(false));
  expect(result.current.error).toMatch("500");
});
