
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useProducts } from "../context/ProductsContext";
import useFetch from "../hooks/useFetch";
import { ORDERS_URL } from "../api";
import SearchBar from "./SearchBar";
import MenuList from "./MenuList";
import OrderPanel from "./OrderPanel";
import Icon from "./Icons";

function nextOrderNumber(orders) {
  const nums = (orders || [])
    .map((o) => parseInt(String(o.orderNumber).replace(/\D/g, ""), 10))
    .filter((n) => !Number.isNaN(n));
  return `#SH-${(nums.length ? Math.max(...nums) : 4000) + 1}`;
}

export default function MenuPage() {
  const { products, loading, error } = useProducts();
  const { data: orders, refetch: refetchOrders } = useFetch(ORDERS_URL);
  const [params, setParams] = useSearchParams();
  const query = params.get("q") || "";
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState({}); 

  const items = useMemo(() => products.filter((p) => !p.draft), [products]);

  const categories = useMemo(() => {
    const counts = {};
    items.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return [["All", items.length], ...Object.entries(counts)];
  }, [items]);

  const visible = useMemo(() => {
    const text = query.trim().toLowerCase();
    return items.filter(
      (p) =>
        (category === "All" || p.category === category) &&
        p.name.toLowerCase().includes(text)
    );
  }, [items, query, category]);

  const lines = useMemo(
    () =>
      items
        .filter((p) => cart[p.id])
        .map((p) => ({ product: p, qty: cart[p.id] })),
    [items, cart]
  );

  function setQuery(text) {
    setParams(text ? { q: text } : {}, { replace: true });
  }

  function handleAdd(product) {
    setCart((c) => ({ ...c, [product.id]: Number(product.minOrder) || 1 }));
  }

  function handleStep(product, delta) {
    setCart((c) => {
      const next = (c[product.id] || 0) + delta;
      const copy = { ...c };
      if (next <= 0) delete copy[product.id];
      else if (product.stock !== undefined && next > Number(product.stock)) return c;
      else copy[product.id] = next;
      return copy;
    });
  }

  if (loading) return <p className="page status-message">Loading products...</p>;
  if (error) {
    return <p className="page status-message error">Could not load products: {error}</p>;
  }

  return (
    <div className="pos">
      <section className="pos-main">
        <SearchBar value={query} onChange={setQuery} />

        <div className="category-row" role="group" aria-label="Categories">
          {categories.map(([name, count]) => (
            <button
              key={name}
              type="button"
              className={`category-chip ${name === category ? "active" : ""}`}
              aria-pressed={name === category}
              onClick={() => setCategory(name)}
            >
              <span className="chip-icon">
                <Icon name={name === "All" ? "grid" : "tag"} size={18} />
              </span>
              <span>
                <strong>{name}</strong>
                <small>{count} {count === 1 ? "Item" : "Items"}</small>
              </span>
            </button>
          ))}
        </div>

        <MenuList items={visible} cart={cart} onAdd={handleAdd} onStep={handleStep} />
      </section>

      <OrderPanel
        lines={lines}
        orderNumber={nextOrderNumber(orders)}
        onPlaced={() => {
          setCart({});
          refetchOrders();
        }}
      />
    </div>
  );
}
