// src/hooks/useProductActions.js
// Custom hook #2: the write side of CRUD (POST, PATCH, DELETE).
// Every action sets "saving", catches errors, and refreshes the shared product list.
import { useState } from "react";
import { PRODUCTS_URL } from "../api";
import { useProducts } from "../context/ProductsContext";

async function request(url, options) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res;
}

export default function useProductActions() {
  const { refetch } = useProducts();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

//Runs one request, returns true on success and false on failure.
async function run(send) {
  setSaving(true);
  setError(null);
  try {
    await send();
    refetch();
    return true;
  } catch (err) {
    setError(err.message);
    return false;
  } finally {
    setSaving(false);
  }
}

const addProduct = (product) =>
  run(() => request(PRODUCTS_URL, { method: "POST", body: JSON.stringify(product) }));

const updatePrice = (id, price) =>
  run(() =>
    request(`${PRODUCTS_URL}/${id}`, { method: "PATCH", body: JSON.stringify({ price }) })
  );

const deleteProduct = (id) =>
  run(() => request(`${PRODUCTS_URL}/${id}`, { method: "DELETE" }));

return { addProduct, updatePrice, deleteProduct, saving, error };
}

