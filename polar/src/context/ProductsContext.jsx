// src/context/ProductsContext.jsx
// One shared source of product data for the whole app.
// Pages read it with useProducts(); after a POST, PATCH or DELETE they call refetch().
import { createContext, useContext } from "react";
import useFetch from "../hooks/useFetch";
import { PRODUCTS_URL } from "../api";

const ProductsContext = createContext(null);

export function ProductsProvider({ children }) {
  const { data, loading, error, refetch } = useFetch(PRODUCTS_URL);

  const value = {
    products: data || [],
    loading,
    error,
    refetch,
  };

  return (
    <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>
  );
}

// Helper so components write useProducts() instead of useContext(ProductsContext)
// eslint-disable-next-line react-refresh/only-export-components
export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error("useProducts must be used inside <ProductsProvider>");
  return ctx;
}
