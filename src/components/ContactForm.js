import React, { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import CONFIG from '../config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import leoProfanity from 'leo-profanity';
import './ContactForm.css';

const ContactForm = ({ center = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    query: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Load default English profanity list
    leoProfanity.loadDictionary();

    // Add Hinglish & Hindi abusive words (some common variants)
    const hinglishHindiWords = [
  "bhosdi", "bhosdike", "bhosdika", "bhosdi ke", "bhosdike chutiye", 
  "chutiya", "chutiye", "chutiyapa", "chut", "chut ke", "chut mar", "chut marna", 
  "gandu", "gand", "gand mein", "gandu ke", "gandu ki", 
  "madarchod", "madarchod ke", "madarchod ki", 
  "behenchod", "behenchod ke", "behenchod ki", 
  "lund", "lund ka", "lund ke", "lund mar", "lund ki", 
  "lavde", "lavde ke", "lavde ki", 
  "randi", "randi ki", "randi ke", "randi beta", 
  "kamina", "kamina ke", "kamina ki", 
  "harami", "harami ke", "harami ki", 
  "bhen ke lode", "bhen ke lodu", "bhen ke lode ke", 
  "gaand", "gaand mein", "gaand fat", "gaand mar", "gaand me", "gaand ke", 
  "bhadwe", "bhadve", "kutte", "kutta", "kutta ke", "kuttay", 
  "kamine", "kamini", "saala", "saali", "chinal", "suar", 
  "jhantu", "ullu", "kutti", "tatti", "choot", "choot ke", "chooth", "choothi", 
  "gand", "gand me", "gand mein", "gand fat", "gand mar", 
  "maderchod", "madarchod", "madarchod ke", "madarchod ki",
  "lund ke", "lund ki", "lund ko", "lund pe", "lund me",
  "chut ke", "chut ka", "chut pe",
  "nali", "nali ka", "nali mein",
  "lund ka", "lund ke",
  "lauda", "laude",
  "lode", "lodu",
  "choothi",
  "gandi",
  "gand marna",
  "gand mara",
  "gand mari",
  "haramzada", "haramzade",
  "haramkhor", "haramkhor",
  "chinki",
  "gand mara",
  "chooth mar",
  "chooth mara",
  "chooth mari",
  "launda",
  "laundi",
  "randi ka", "randi ke", "randi ki",
  "launda",
  "kutta",
  "chodu",
  "chod",
  "chodna",
  "choda",
  "chodna",
  "chodi",
  "chodti",
  "chodti hai",
  "chodunga",
  "chodungi",
  "chudail",
  "chudai",
  "chudai karna",
  "chuda",
  "chutiya",
  "chutiyapa",
  "chutiya",
  "lodu",
  "lodu ka",
  "lodu ke",
  "madar chodu",
  "madar chod",
  "madar chodi",
  "madar chodna",
  "madar chodi karna",
  "gandi",
  "gandfat",
  "gand mar",
  "gand mari",
  "gandfatna",
  "gandfatna",
  "randi",
  "randi ki",
  "randi ke",
  "randi ka",
  "kutti",
  "kutti ka",
  "kutti ke",
  "kutti ki",
  "chodna",
  "chudai",
  "chudai karna",
  "chodai",
  "chodai karna"
];
    leoProfanity.add(hinglishHindiWords);
  }, []);

  const validate = () => {
    const newErrors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
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

  // Check if any input contains profanity
  const containsProfanity = () => {
    return (
      leoProfanity.check(formData.name) ||
      leoProfanity.check(formData.email) ||
      leoProfanity.check(formData.phone) ||
      leoProfanity.check(formData.query)
    );
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error('Please fix errors before submitting.');
      return;
    }

    if (containsProfanity()) {
      toast.error('Your message contains inappropriate language 🚫');
      return;
    }

    const templateParams = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      message: formData.query.trim(),
      from_email: CONFIG.DEFAULT_EMAIL,
      to_email: CONFIG.DEFAULT_TO_EMAIL,
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
        toast.dismiss();
        toast.success('Message sent!');
        setFormData({ name: '', email: '', phone: '', query: '' });
        setErrors({});
      })
      .catch(() => {
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
