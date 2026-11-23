import MenuCard from "./MenuCard";

export default function MenuList({ items, cart, onAdd, onStep }) {
  if (items.length === 0) {
    return <p className="empty-state">No products found.</p>;
  }

  return (
    <div className="product-grid">
      {items.map((product, i) => (
        <MenuCard
          key={product.id}
          product={product}
          tile={i}
          qty={cart[product.id] || 0}
          onAdd={() => onAdd(product)}
          onStep={(delta) => onStep(product, delta)}
        />
      ))}
    </div>
  );
}
