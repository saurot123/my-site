import React, {useState} from 'react';
import emailjs from 'emailjs-com';
import CONFIG from '../config';
import './ContactForm.css';

const ContactForm = ({center=false}) => {
  const [formData,setFormData] = useState({name:'',email:'',phone:''});
  const [status,setStatus] = useState('');

  const handleChange = (e) => setFormData({...formData,[e.target.name]:e.target.value});

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('Sending...');
    const templateParams = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      to_email: CONFIG.DEFAULT_EMAIL
    };
    emailjs.send(CONFIG.EMAILJS_SERVICE_ID, CONFIG.EMAILJS_TEMPLATE_ID, templateParams, CONFIG.EMAILJS_PUBLIC_KEY)
      .then(() => {
        setStatus('Message sent!');
        setFormData({name:'',email:'',phone:''});
      })
      .catch(() => {
        setStatus('Failed to send. Try again later.');
      });
  };

  return (
    <div className={center ? 'contact-wrap center' : 'contact-wrap'}>
      <form className="contact-form" onSubmit={handleSubmit}>
        <input name="name" value={formData.name} onChange={handleChange} placeholder="Your Name" required />
        <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Your Email" required />
        <input name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="Phone Number" required />
        <button type="submit">Submit</button>
        {status && <p className="status">{status}</p>}
      </form>
    </div>
  );
};

export default ContactForm;
