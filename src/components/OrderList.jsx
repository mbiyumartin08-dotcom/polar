// Edward - Mwai - Orders page
import { useState } from "react";
import useFetch from "../hooks/useFetch";
import { ORDERS_URL } from "../api";

const STATUSES = ["All", "Pending", "Processing", "Delivered", "Completed", "Canceled"];

export default function OrderList() {
  const { data, loading, error } = useFetch(ORDERS_URL);
  const [status, setStatus] = useState("All");

  if (loading) return <p className="page status-message">Loading orders...</p>;
  if (error) return <p className="page status-message error">Could not load orders: {error}</p>;

  const orders = data || [];
  const visible = status === "All" ? orders : orders.filter((o) => o.status === status);
  const count = (s) => orders.filter((o) => o.status === s).length;

  return (
    <section className="page">
      <div className="page-header">
        <h2 className="page-title">Orders</h2>
      </div>

      <div className="stats-row">
        <div className="card">
          <span className="muted">All orders</span>
          <p className="stat-value">{orders.length}</p>
        </div>
        <div className="card">
          <span className="muted">Pending</span>
          <p className="stat-value">{count("Pending")}</p>
        </div>
        <div className="card">
          <span className="muted">Processing</span>
          <p className="stat-value">{count("Processing")}</p>
        </div>
        <div className="card">
          <span className="muted">Delivered</span>
          <p className="stat-value">{count("Delivered")}</p>
        </div>
      </div>

      <div className="chips">
        {STATUSES.map((s) => (
          <button
            key={s}
            type="button"
            className={`chip ${s === status ? "active" : ""}`}
            onClick={() => setStatus(s)}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="card table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Payment</th>
              <th>Price</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((o) => (
              <tr key={o.id}>
                <td>
                  <strong>{o.productName}</strong>
                  <br />
                  <span className="muted">{o.category}</span>
                </td>
                <td>{o.orderNumber}</td>
                <td>{o.customer}</td>
                <td className="muted">{o.date}</td>
                <td>{o.payment}</td>
                <td>${Number(o.price).toFixed(2)}</td>
                <td>
                  <span className={`badge badge-${o.status.toLowerCase()}`}>{o.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {visible.length === 0 && <p className="empty-state">No orders with this status.</p>}
      </div>
    </section>
  );
}
