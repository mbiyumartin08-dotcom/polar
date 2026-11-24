import { useState } from "react";
import Icon from "./Icons";
import { ORDERS_URL } from "../api";
import { money, finalPrice } from "../utils";

const TYPES = ["Pick Up", "Delivery", "In Store"];
const PAYMENTS = [
  { label: "M-Pesa", icon: "phone" },
  { label: "Card", icon: "card" },
  { label: "Cash", icon: "dollar" },
];
const TAX_RATE = 0.05;

export default function OrderPanel({ lines, orderNumber, onPlaced }) {
  const [type, setType] = useState("Pick Up");
  const [payment, setPayment] = useState("M-Pesa");
  const [customer, setCustomer] = useState("Walk-in customer");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  // Round each amount to cents so the numbers shown always add up
  const round2 = (n) => Math.round(n * 100) / 100;
  const subtotal = round2(lines.reduce((sum, l) => sum + finalPrice(l.product) * l.qty, 0));
  const tax = round2(subtotal * TAX_RATE);
  const total = round2(subtotal + tax);

  async function placeOrder() {
    if (lines.length === 0) return;
    setSaving(true);
    setMessage(null);
    const first = lines[0].product;
    const summary =
      lines.length === 1 ? first.name : `${first.name} +${lines.length - 1} more`;
    const date = new Date().toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });

    try {
      const res = await fetch(ORDERS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderNumber,
          productName: summary,
          category: first.category,
          customer: customer.trim() || "Walk-in customer",
          date,
          payment,
          type,
          price: total,
          status: "Pending",
          items: lines.map((l) => ({
            productId: l.product.id,
            name: l.product.name,
            qty: l.qty,
            unitPrice: finalPrice(l.product),
          })),
        }),
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      setMessage({ type: "success", text: `Order ${orderNumber} placed` });
      onPlaced();
    } catch (err) {
      setMessage({ type: "error", text: `Could not place order: ${err.message}` });
    } finally {
      setSaving(false);
    }
  }

  return (
    <aside className="order-panel" aria-label="Current order">
      <p className="order-label">Payment Method</p>

      <div className="order-head">
        <div>
          <h2>Order {orderNumber}</h2>
          {editing ? (
            <input
              className="customer-input"
              aria-label="Customer name"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              onBlur={() => setEditing(false)}
              onKeyDown={(e) => e.key === "Enter" && setEditing(false)}
              autoFocus
            />
          ) : (
            <span className="muted">{customer}</span>
          )}
        </div>
        <button type="button" className="btn btn-outline btn-sm" onClick={() => setEditing(true)}>
          <Icon name="edit" size={16} /> Edit
        </button>
      </div>

      <div className="segmented" role="tablist" aria-label="Order type">
        {TYPES.map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={t === type}
            className={t === type ? "active" : ""}
            onClick={() => setType(t)}
          >
            {t}
          </button>
        ))}
      </div>

      <ul className="order-lines">
        {lines.length === 0 && <li className="muted">No items yet. Add something from the menu.</li>}
        {lines.map(({ product, qty }, i) => (
          <li key={product.id} className="order-line">
            <span className="line-thumb" style={{ background: ["#DCFCE7", "#DBEAFE", "#FFEDD5"][i % 3] }}>
              <Icon name="image" size={18} />
            </span>
            <div className="line-info">
              <strong>{product.name}</strong>
              <span className="muted">
                {money(finalPrice(product))} × {qty}
              </span>
            </div>
            <strong>{money(finalPrice(product) * qty)}</strong>
          </li>
        ))}
      </ul>

      <dl className="totals">
        <div>
          <dt>Subtotal</dt>
          <dd>{money(subtotal)}</dd>
        </div>
        <div>
          <dt>Tax 5%</dt>
          <dd>{money(tax)}</dd>
        </div>
        <div className="grand">
          <dt>Total Amount</dt>
          <dd>{money(total)}</dd>
        </div>
      </dl>

      <div className="pay-row" role="radiogroup" aria-label="Payment method">
        {PAYMENTS.map((p) => (
          <button
            key={p.label}
            type="button"
            role="radio"
            aria-checked={p.label === payment}
            className={`pay-btn ${p.label === payment ? "active" : ""}`}
            onClick={() => setPayment(p.label)}
          >
            <Icon name={p.icon} size={26} />
            {p.label}
          </button>
        ))}
      </div>

      {message && (
        <p className={`form-message ${message.type}`} role="status">
          {message.text}
        </p>
      )}

      <button
        type="button"
        className="btn btn-primary btn-block"
        onClick={placeOrder}
        disabled={saving || lines.length === 0}
      >
        {saving ? "Placing..." : "Place Order"}
      </button>
    </aside>
  );
}
