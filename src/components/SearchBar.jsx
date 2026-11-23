import { useId } from "react";
import Icon from "./Icons";

export default function SearchBar({ value, onChange, placeholder = "Search product..." }) {
  const id = useId();

  return (
    <div className="search-row">
      <div className="search-bar">
        <Icon name="search" size={22} />
        <label htmlFor={id} className="sr-only">
          Search products
        </label>
        <input
          id={id}
          type="search"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      <button type="button" className="filter-btn" aria-label="Filters">
        <Icon name="sliders" size={22} />
      </button>
    </div>
  );
}
