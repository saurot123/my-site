import React, { useEffect, useState } from 'react';
import CONFIG from '../config';
import ProductCard from '../components/ProductCard';
import ContactForm from '../components/ContactForm';
import './Home.css';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(CONFIG.PRODUCT_JSON_URL)
      .then(res => res.json())
      .then(data => {
        const merged = (data.categories || []).map(cat => ({
          ...cat,
          products: (data.products || []).filter(
            prod => prod.categoryId === cat.id
          )
        }));
        setCategories(merged);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load products', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="home-page">
      {categories.map(cat => (
        <section key={cat.id} className="category-section">
          <h2 className="category-title">{cat.name}</h2>
          <div className="product-row">
            {cat.products.slice(0, 4).map(prod => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </section>
      ))}

      {/* Bottom center form */}
      <div className="contact-form-wrapper">
        <h2 className="contact-heading">Contact Us</h2>
        <ContactForm />
      </div>
    </div>
  );
};

export default Home;
