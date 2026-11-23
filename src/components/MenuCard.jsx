import { Link } from "react-router-dom";
import Icon from "./Icons";
import { money, finalPrice, isLowStock, TILE_COLORS, hasRealImage } from "../utils";

export default function MenuCard({ product, qty, tile, onAdd, onStep }) {
  const { id, name, image, discount } = product;
  const low = isLowStock(product);
  const out = product.stock !== undefined && Number(product.stock) === 0;
  const price = finalPrice(product);

  return (
    <article className={`product-card ${qty > 0 ? "selected" : ""}`}>
      <div className="product-image" style={{ background: TILE_COLORS[tile % TILE_COLORS.length] }}>
        {hasRealImage(image) ? <img src={image} alt={name} /> : <Icon name="image" size={44} />}
        {Number(discount) > 0 && <span className="badge-sale">-{discount}%</span>}
      </div>

      <span className={`stock-tag ${low ? "low" : ""}`}>
        <i className="dot" />
        {out ? "Out of Stock" : low ? "Low Stock" : "In Stock"}
      </span>

      <h3 className="product-name">
        <Link to={`/menu/${id}`}>{name}</Link>
      </h3>

      <div className="product-row">
        <div className="product-price">
          {money(price)}
          {Number(discount) > 0 && <s>{money(product.price)}</s>}
        </div>

        {qty > 0 ? (
          <div className="stepper">
            <button type="button" aria-label={`Remove one ${name}`} onClick={() => onStep(-1)}>
              <Icon name="minus" size={14} />
            </button>
            <span aria-label={`${name} quantity`}>{qty}</span>
            <button type="button" className="plus" aria-label={`Add one ${name}`} onClick={() => onStep(1)}>
              <Icon name="plus" size={14} />
            </button>
          </div>
        ) : (
          <button type="button" className="btn btn-primary btn-sm" onClick={onAdd} disabled={out}>
            Add to Order
          </button>
        )}
      </div>
    </article>
  );
}
