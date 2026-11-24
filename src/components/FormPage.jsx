import { useEffect, useId, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useProductActions from "../hooks/useProductActions";
import { useProducts } from "../context/ProductsContext";
import Icon from "./Icons";
import { money, finalPrice } from "../utils";

const EMPTY_FORM = {
  name: "",
  tag: "",
  description: "",
  costPrice: "",
  price: "",
  discount: "0",
  minOrder: "1",
  category: "",
  subCategory: "",
  image: "",
};
const MAX_IMAGE_BYTES = 500 * 1024;

function validate(form, isDraft) {
  const errors = {};
  if (!form.name.trim()) errors.name = "Name is required";
  if (isDraft) return errors;
  if (!form.description.trim()) errors.description = "Description is required";
  if (!form.category.trim()) errors.category = "Category is required";
  const price = Number(form.price);
  if (form.price === "" || Number.isNaN(price) || price <= 0) {
    errors.price = "Enter a price greater than 0";
  }
  if (form.costPrice !== "" && (Number.isNaN(Number(form.costPrice)) || Number(form.costPrice) < 0)) {
    errors.costPrice = "Enter a valid cost";
  }
  if (Number(form.minOrder) < 1) errors.minOrder = "Minimum order is 1";
  return errors;
}
/*import { useEffect, useId, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useProductActions from "../hooks/useProductActions";
import { useProducts } from "../context/ProductsContext";
import Icon from "./Icons";
import { money, finalPrice } from "../utils";

const EMPTY_FORM = {
  name: "",
  tag: "",
  description: "",
  costPrice: "",
  price: "",
  discount: "0",
  minOrder: "1",
  category: "",
  subCategory: "",
  image: "",
};
const MAX_IMAGE_BYTES = 500 * 1024;

function validate(form, isDraft) {
  const errors = {};
  if (!form.name.trim()) errors.name = "Name is required";
  if (isDraft) return errors;
  if (!form.description.trim()) errors.description = "Description is required";
  if (!form.category.trim()) errors.category = "Category is required";
  const price = Number(form.price);
  if (form.price === "" || Number.isNaN(price) || price <= 0) {
    errors.price = "Enter a price greater than 0";
  }
  if (form.costPrice !== "" && (Number.isNaN(Number(form.costPrice)) || Number(form.costPrice) < 0)) {
    errors.costPrice = "Enter a valid cost";
  }
  if (Number(form.minOrder) < 1) errors.minOrder = "Minimum order is 1";
  return errors;
}

// Label + control + error message. Defined outside FormPage so it is not recreated each render.
function Field({ id, label, error, children }) {
  return (
    <div className={`field ${error ? "invalid" : ""}`}>
      <label htmlFor={id}>{label}</label>
      {children}
      {error && (
        <span className="field-error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

export default function FormPage() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [imageError, setImageError] = useState(null);
  const nameInput = useRef(null);
  const navigate = useNavigate();
  const uid = useId();
  const { products } = useProducts();
  const { addProduct, saving, error } = useProductActions();

  const categories = [...new Set(products.map((p) => p.category))];
  const subCategories = [...new Set(products.map((p) => p.subCategory).filter(Boolean))];

  useEffect(() => {
    nameInput.current?.focus();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleImage(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_IMAGE_BYTES) {
      setImageError("Image must be under 500 KB");
      return;
    }
    setImageError(null);
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, image: reader.result }));
    reader.readAsDataURL(file);
  }

  async function submit(isDraft) {
    const found = validate(form, isDraft);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const ok = await addProduct({
      name: form.name.trim(),
      tag: form.tag.trim(),
      description: form.description.trim(),
      category: form.category.trim() || "Uncategorised",
      subCategory: form.subCategory.trim(),
      costPrice: form.costPrice === "" ? null : Number(form.costPrice),
      price: Number(form.price) || 0,
      discount: Number(form.discount),
      minOrder: Number(form.minOrder) || 1,
      stock: 20,
      image: form.image,
      draft: isDraft,
    });
    if (ok) navigate("/menu");
  }

  function handleSubmit(e) {
    e.preventDefault();
    submit(false);
  }

  const previewPrice = finalPrice({ price: Number(form.price) || 0, discount: form.discount });

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Add New Product</h2>
          <p className="muted">Add a new product to your store</p>
        </div>
        <Link to="/menu" className="btn btn-outline">
          <Icon name="arrowLeft" size={18} /> Back to Menu
        </Link>
      </div>

      <form className="product-form" onSubmit={handleSubmit} noValidate>
        <h3 className="section-title">Name &amp; Description</h3>
        <div className="form-row">
          <Field id={`${uid}-name`} label="Product Name" error={errors.name}>
            <input id={`${uid}-name`} ref={nameInput} name="name" value={form.name} onChange={handleChange} />
          </Field>
          <Field id={`${uid}-tag`} label="Product Tag">
            <input
              id={`${uid}-tag`}
              name="tag"
              value={form.tag}
              onChange={handleChange}
              placeholder="e.g. Specialty Refresher"
            />
          </Field>
        </div>

        <Field id={`${uid}-description`} label="Product Description" error={errors.description}>
          <textarea
            id={`${uid}-description`}
            name="description"
            rows={8}
            value={form.description}
            onChange={handleChange}
          />
        </Field>

        <div className="form-cards">
          <div className="card form-card">
            <h3 className="section-title">Product Pricing</h3>
            <div className="form-row">
              <Field id={`${uid}-cost`} label="Cost Price" error={errors.costPrice}>
                <div className="input-prefix">
                  <span>Ksh</span>
                  <input id={`${uid}-cost`} name="costPrice" type="number" step="0.01" value={form.costPrice} onChange={handleChange} />
                </div>
              </Field>
              <Field id={`${uid}-price`} label="Sell Price" error={errors.price}>
                <div className="input-prefix">
                  <span>Ksh</span>
                  <input id={`${uid}-price`} name="price" type="number" step="0.01" value={form.price} onChange={handleChange} />
                </div>
              </Field>
              <Field id={`${uid}-discount`} label="Discount">
                <select id={`${uid}-discount`} name="discount" value={form.discount} onChange={handleChange}>
                  {[0, 5, 10, 15, 20].map((d) => (
                    <option key={d} value={d}>
                      {d}%
                    </option>
                  ))}
                </select>
              </Field>
              <Field id={`${uid}-min`} label="Minimum Order" error={errors.minOrder}>
                <input id={`${uid}-min`} name="minOrder" type="number" min="1" value={form.minOrder} onChange={handleChange} />
              </Field>
            </div>
          </div>

          <div className="card form-card">
            <h3 className="section-title">Category</h3>
            <Field id={`${uid}-category`} label="Product Category" error={errors.category}>
              <input id={`${uid}-category`} name="category" list={`${uid}-cats`} value={form.category} onChange={handleChange} placeholder="Choose or type a category" />
              <datalist id={`${uid}-cats`}>
                {categories.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </Field>
            <Field id={`${uid}-sub`} label="Product Sub-Category">
              <input id={`${uid}-sub`} name="subCategory" list={`${uid}-subs`} value={form.subCategory} onChange={handleChange} placeholder="Optional" />
              <datalist id={`${uid}-subs`}>
                {subCategories.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </Field>
          </div>
        </div>

        <div className="form-media">
          <label className="upload-box">
            <input type="file" accept="image/*" onChange={handleImage} className="sr-only" />
            {form.image ? (
              <img src={form.image} alt="Uploaded product" />
            ) : (
              <>
                <Icon name="image" size={40} />
                <strong>Upload Image</strong>
              </>
            )}
          </label>

          <div className="preview-box" aria-label="Product preview">
            {form.image ? (
              <img src={form.image} alt="" />
            ) : (
              <>
                <Icon name="tag" size={40} />
                <span>Preview</span>
              </>
            )}
            {form.name && (
              <div className="preview-caption">
                <strong>{form.name}</strong>
                <span>{money(previewPrice)}</span>
              </div>
            )}
          </div>
        </div>
        {imageError && <p className="form-message error">{imageError}</p>}
        {error && <p className="form-message error">Could not save: {error}</p>}

        <div className="form-actions">
          <button type="button" className="btn btn-outline" onClick={() => submit(true)} disabled={saving}>
            <Icon name="save" size={18} /> Save Draft
          </button>
          <button type="button" className="btn btn-soft" disabled title="Scheduling is coming soon">
            <Icon name="calendar" size={18} /> Schedule
          </button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Saving..." : "Add Product"} <Icon name="plus" size={18} />
          </button>
        </div>
      </form>
    </section>
  );
}*/
