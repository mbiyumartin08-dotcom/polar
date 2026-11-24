// src/utils.js
// Small helpers shared by several components.

export const money = (n) => `Ksh${Number(n || 0).toFixed(2)}`;

// Price after the product's discount (discount is a percentage, 0 if none)
export function finalPrice(product) {
  const d = Number(product.discount) || 0;
  return Math.round(Number(product.price) * (1 - d / 100) * 100) / 100;
}

export const LOW_STOCK_AT = 5;
export const isLowStock = (product) =>
  product.stock !== undefined && Number(product.stock) <= LOW_STOCK_AT;

// Soft background colours for product tiles that have no photo
export const TILE_COLORS = ["#DCFCE7", "#DBEAFE", "#FEF3C7", "#FCE7F3", "#FFEDD5", "#EDE9FE"];

// Image URLs from placehold.co are not real photos, so we show a tile instead
export const hasRealImage = (url) => Boolean(url) && !url.includes("placehold.co");
