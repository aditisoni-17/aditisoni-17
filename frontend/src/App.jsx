import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadProduct() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("https://dummyjson.com/products/1", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Unable to load product data.");
        }

        const data = await response.json();
        setProduct(data);
      } catch (fetchError) {
        if (fetchError.name !== "AbortError") {
          setError(
            fetchError.message || "Something went wrong while loading the product.",
          );
        }
      } finally {
        setLoading(false);
      }
    }

    loadProduct();

    return () => controller.abort();
  }, []);

  return (
    <main className="product-page">
      <section className="product-card" aria-label="Featured product card">
        <p className="eyebrow">Live product details</p>
        <h1>Featured product</h1>
        <p className="intro">
          This card pulls real sample data from a free public API and presents
          it with a simple, readable layout.
        </p>

        {loading ? (
          <div className="state-message">Loading product...</div>
        ) : error ? (
          <div className="state-message error" role="alert">
            {error}
          </div>
        ) : product ? (
          <article className="product-layout">
            <div className="product-image-wrap">
              <img
                className="product-image"
                src={product.thumbnail || product.images?.[0]}
                alt={product.title}
              />
            </div>

            <div className="product-content">
              <div className="product-header">
                <span className="category">{product.category}</span>
                <h2>{product.title}</h2>
              </div>

              <p className="description">{product.description}</p>

              <div className="price-row">
                <span className="price">${product.price}</span>
                <span className="rating">★ {product.rating}</span>
              </div>

              <dl className="meta-grid">
                <div>
                  <dt>Brand</dt>
                  <dd>{product.brand}</dd>
                </div>
                <div>
                  <dt>Stock</dt>
                  <dd>{product.stock}</dd>
                </div>
                <div>
                  <dt>Discount</dt>
                  <dd>{product.discountPercentage}%</dd>
                </div>
                <div>
                  <dt>SKU</dt>
                  <dd>{product.sku}</dd>
                </div>
              </dl>
            </div>
          </article>
        ) : null}
      </section>
    </main>
  );
}

export default App;
