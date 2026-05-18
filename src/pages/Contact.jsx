import { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div>
      <section className="bg-gradient-to-br from-ink-800 via-ink-700 to-library-700 relative overflow-hidden">
        <div className="absolute inset-0 book-pattern opacity-20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-white leading-tight mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-library-200 leading-relaxed">
              Have a question, suggestion, or just want to say hello? We'd love to hear from you.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-heading font-bold text-ink-800 mb-6">Contact Us</h2>
            <p className="text-ink-600 mb-8">
              Fill out the form and our team will get back to you as soon as possible.
            </p>

            <div className="space-y-6">
              {[
                { icon: '📧', label: 'Email', value: 'support@librashare.com' },
                { icon: '📍', label: 'Location', value: 'Digital Library HQ, Knowledge City' },
                { icon: '🕐', label: 'Hours', value: 'Mon-Fri, 9AM-6PM' },
              ].map(item => (
                <div key={item.label} className="flex items-start gap-4">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <p className="font-semibold text-ink-800">{item.label}</p>
                    <p className="text-ink-500">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-library-200 p-8">
            {sent ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-emerald-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-heading font-bold text-ink-800 mb-2">Message Sent!</h3>
                <p className="text-ink-500">We'll get back to you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-ink-700 mb-1.5">Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required
                    className="w-full px-4 py-3 border border-library-200 rounded-xl focus:ring-2 focus:ring-library-300 focus:border-library-500 outline-none" placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink-700 mb-1.5">Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required
                    className="w-full px-4 py-3 border border-library-200 rounded-xl focus:ring-2 focus:ring-library-300 focus:border-library-500 outline-none" placeholder="you@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink-700 mb-1.5">Subject</label>
                  <input type="text" name="subject" value={formData.subject} onChange={handleChange} required
                    className="w-full px-4 py-3 border border-library-200 rounded-xl focus:ring-2 focus:ring-library-300 focus:border-library-500 outline-none" placeholder="How can we help?" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink-700 mb-1.5">Message</label>
                  <textarea name="message" value={formData.message} onChange={handleChange} rows={5} required
                    className="w-full px-4 py-3 border border-library-200 rounded-xl focus:ring-2 focus:ring-library-300 focus:border-library-500 outline-none resize-none" placeholder="Your message..." />
                </div>
                <button type="submit"
                  className="w-full py-3 bg-library-500 text-white rounded-xl font-semibold hover:bg-library-600 transition-colors">
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;