import { MemoryRouter } from "react-router-dom";
import { ProductsProvider } from "../context/ProductsContext";

export const PRODUCTS = [
  { id: 1, name: "Street Runner", description: "Trainer", category: "Running", price: 59.99, image: "" },
  { id: 2, name: "Court Classic", description: "Leather", category: "Casual", price: 74.5, image: "" },
  { id: 3, name: "Trail Blazer", description: "Grip", category: "Hiking", price: 89, image: "" },
];

// Mocks fetch: routes by URL/method. Returns the vi.fn so tests can inspect calls.
export function mockFetch(extra = {}) {
  const fn = vi.fn(async (url, options = {}) => {
    const method = options.method || "GET";
    const key = `${method} ${url}`;
    if (extra[key]) return { ok: true, json: async () => extra[key] };
    if (method !== "GET") return { ok: true, json: async () => ({}) };
    const m = String(url).match(/\/products\/(\d+)$/);
    if (m) {
      const p = PRODUCTS.find((x) => x.id === Number(m[1]));
      return p ? { ok: true, json: async () => p } : { ok: false, status: 404, json: async () => ({}) };
    }
    if (String(url).endsWith("/products")) return { ok: true, json: async () => PRODUCTS };
    if (String(url).endsWith("/orders")) return { ok: true, json: async () => [] };
    return { ok: false, status: 404, json: async () => ({}) };
  });
  globalThis.fetch = fn;
  return fn;
}

export function renderWith(ui, route = "/") {
  return (
    <MemoryRouter initialEntries={[route]}>
      <ProductsProvider>{ui}</ProductsProvider>
    </MemoryRouter>
  );
}
