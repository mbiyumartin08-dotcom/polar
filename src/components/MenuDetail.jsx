// Edward - Mwai - detail page
// Edit price with PATCH
// Delete with confirmation
// Handle product not found

import { useEffect, useId, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import useProductActions from "../hooks/useProductActions";
import { PRODUCTS_URL } from "../api";

export default function MenuDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const priceId = useId();
  const { data: product, loading, error, refetch } = useFetch(`${PRODUCTS_URL}/${id}`);
  const { updatePrice, deleteProduct, saving, error: actionError } = useProductActions();
  const [newPrice, setNewPrice] = useState("");
  const [message, setMessage] = useState(null);

  // Put the current price in the input once the product has loaded
  useEffect(() => {
    if (product) setNewPrice(String(product.price));
  }, [product]);

  if (loading && !product) return <p className="page status-message">Loading product...</p>;

  if (error || !product) {
    return (
      <section className="page empty-state">
        <h1>Product not found</h1>
        <p className="muted">It may have been deleted.</p>
        <Link to="/menu" className="btn btn-primary">
          Back to Menu
        </Link>
      </section>
    );
  }

  async function handleSave(e) {
    e.preventDefault();
    const price = Number(newPrice);
    if (newPrice === "" || Number.isNaN(price) || price <= 0) {
      setMessage({ type: "error", text: "Enter a price greater than 0" });
      return;
    }
    const ok = await updatePrice(product.id, price);
    if (ok) {
      setMessage({ type: "success", text: "Price updated" });
      refetch(); // reload this product so the page shows the new price
    }
  }

  async function handleDelete() {
    if (!window.confirm(`Delete ${product.name}?`)) return;
    const ok = await deleteProduct(product.id);
    if (ok) navigate("/menu");
  }

  return (
    <section className="page">
      <div className="page-header">
        <Link to="/menu" className="btn btn-outline btn-sm">
          Back to Menu
        </Link>
      </div>

      <div className="detail">
        <div className="detail-image">
          {product.image && <img src={product.image} alt={product.name} />}
        </div>

        <div className="detail-info">
          <span className="badge">{product.category}</span>
          <h2 className="page-title">{product.name}</h2>
          <p className="muted">{product.description}</p>
          <p className="detail-price">${Number(product.price).toFixed(2)}</p>

          <form className="edit-price" onSubmit={handleSave}>
            <div className="field">
              <label htmlFor={priceId}>New price ($)</label>
              <input
                id={priceId}
                type="number"
                step="0.01"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              Save price
            </button>
          </form>

          {message && (
            <p className={`form-message ${message.type}`} role="status">
              {message.text}
            </p>
          )}
          {actionError && <p className="form-message error">Could not save: {actionError}</p>}

          <div className="detail-actions">
            <button type="button" className="btn btn-danger" onClick={handleDelete} disabled={saving}>
              Delete product
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
