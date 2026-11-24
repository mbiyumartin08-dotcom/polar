// Edward - Mwai - Dashboard page
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../context/ProductsContext";
import useFetch from "../hooks/useFetch";
import { ORDERS_URL } from "../api";

export default function Dashboard() {
  const { products } = useProducts();
  const { data, loading, error } = useFetch(ORDERS_URL);

  const orders = useMemo(() => data || [], [data]);

  const stats = useMemo(() => {
    const revenue = orders
      .filter((o) => o.status !== "Canceled")
      .reduce((sum, o) => sum + o.price, 0);
    return {
      revenue,
      pending: orders.filter((o) => o.status === "Pending").length,
    };
  }, [orders]);

  const recent = useMemo(
    () => [...orders].sort((a, b) => b.id - a.id).slice(0, 5),
    [orders]
  );

  const byCategory = useMemo(() => {
    const counts = {};
    products.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [products]);

  if (loading) return <p className="page status-message">Loading dashboard...</p>;
  if (error) return <p className="page status-message error">Could not load orders: {error}</p>;


  return (
    <section className="page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Dashboard</h2>
          <p className="muted">Welcome back, Anaya</p>
        </div>
        <Link to="/menu/new" className="btn btn-primary">
          New Product
        </Link>
      </div>

      <div className="stats-row">
        <div className="card">
          <span className="muted">Total revenue</span>
          <p className="stat-value">${stats.revenue.toFixed(2)}</p>
        </div>
        <div className="card">
          <span className="muted">Total products</span>
          <p className="stat-value">{products.length}</p>
        </div>
        <div className="card">
          <span className="muted">Total orders</span>
          <p className="stat-value">{orders.length}</p>
        </div>
        <div className="card">
          <span className="muted">Pending orders</span>
          <p className="stat-value">{stats.pending}</p>
        </div>
      </div>

      <div className="card table-wrap">
        <div className="page-header">
          <h3>Recent orders</h3>
          <Link to="/orders" className="text-green">
            View all
          </Link>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Price</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((o) => (
              <tr key={o.id}>
                <td>{o.productName}</td>
                <td>{o.orderNumber}</td>
                <td>{o.customer}</td>
                <td>${Number(o.price).toFixed(2)}</td>
                <td>
                  <span className={`badge badge-${o.status.toLowerCase()}`}>{o.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h3>Products by category</h3>
        <ul>
          {byCategory.map(([name, n]) => (
            <li key={name} className="product-row">
              <span>{name}</span>
              <span className="muted">{n}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
