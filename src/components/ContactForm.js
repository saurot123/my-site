import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import CONFIG from '../config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ContactForm.css';

const ContactForm = ({ center = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    query: '',
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email.';
    }

    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (phoneDigits.length < 9 || phoneDigits.length > 12) {
      newErrors.phone = 'Please enter a valid phone number!';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required.';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error('Please fix errors before submitting.');
      return;
    }

    const templateParams = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      message: formData.query,
      from_email: CONFIG.DEFAULT_EMAIL,
      to_email:CONFIG.DEFAULT_TO_EMAIL
    };

    toast.info('Sending...');

    emailjs
      .send(
        CONFIG.EMAILJS_SERVICE_ID,
        CONFIG.EMAILJS_TEMPLATE_ID,
        templateParams,
        CONFIG.EMAILJS_PUBLIC_KEY
      )
      .then(() => {
        toast.dismiss(); // remove "Sending..." toast
        toast.success('Message sent!');
        setFormData({ name: '', email: '', phone: '', query: '' });
        setErrors({});
      })
      .catch((e) => {
        toast.dismiss();
        toast.error('Failed to send. Try again later.');
      });
  };

  return (
    <div className={center ? 'contact-wrap center' : 'contact-wrap'}>
      <form className="contact-form" onSubmit={handleSubmit} noValidate>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your Name"
          required
        />
        {errors.name && <p className="error-msg">{errors.name}</p>}

        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Your Email"
          required
        />
        {errors.email && <p className="error-msg">{errors.email}</p>}

        <input
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Phone Number"
          required
        />
        {errors.phone && <p className="error-msg">{errors.phone}</p>}

        <textarea
          name="query"
          value={formData.query}
          onChange={handleChange}
          placeholder="Your Query"
        />

        <button type="submit">Submit</button>
      </form>

      {/* Toast container for rendering toasts */}
      <ToastContainer
        position="bottom-center"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        theme="colored"
      />
    </div>
  );
};

export default ContactForm;
