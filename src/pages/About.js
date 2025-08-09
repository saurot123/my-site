import React from 'react';
import ContactForm from '../components/ContactForm';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <h1>About Us</h1>
      <p>We curate beautiful artificial jewellery and gift items with love.</p>
      <ContactForm center={true} />
    </div>
  );
};

export default About;
