import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import ContactForm from '../components/ContactForm';
import './Home.css';
import CONFIG from '../config';

const Home = () => {
  const [productsData, setProductsData] = useState({ categories: [], products: [] });

  useEffect(() => {
    fetch(CONFIG.PRODUCT_JSON_URL)
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => setProductsData(data))
      .catch(err => console.error('Fetch error:', err));
  }, []);

  return (
    <div className="home-container">
      {productsData.categories.map((cat) => {
        const productsInCategory = productsData.products.filter(
          (prod) => prod.categoryId === cat.id
        );

        return (
          <div key={cat.id} className="category-section">
            <h2>{cat.name}</h2>
            <div className="product-row">
              {productsInCategory.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </div>
        );
      })}
      <div className="contact-form-wrapper">
        <h2 className="contact-heading">Contact Us</h2>
        <ContactForm />
      </div>
    </div>
  );
};

export default Home;
