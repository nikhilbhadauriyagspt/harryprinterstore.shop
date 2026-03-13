import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SEO from '@/components/SEO';
import { Mail, MapPin, Send, ArrowRight, Loader2, CheckCircle2, Headphones, ChevronDown, Clock, Globe, ChevronRight } from 'lucide-react';
import API_BASE_URL from '../config';
import { Link } from 'react-router-dom';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const response = await fetch(`${API_BASE_URL}/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.status === 'success') {
        setStatus('success');
        setFormData({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' });
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen font-['Heebo'] text-slate-900 pb-20">
      <SEO
        title="Contact Us | Printer Mania Support"
        description="Connect with the Printer Mania team for support, orders, or hardware inquiries."
      />

      {/* --- PAGE HEADER --- */}
      <div className="bg-slate-50 border-b border-slate-100 py-12 md:py-16 mb-16">
        <div className="max-w-full mx-auto px-6 lg:px-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <nav className="flex items-center gap-2 text-[11px] font-bold text-[#4F46E5] uppercase tracking-[3px] mb-4">
              <Link to="/" className="hover:text-slate-900 transition-colors">Home</Link>
              <ChevronRight size={14} className="text-slate-300" />
              <span className="text-slate-400">Contact</span>
            </nav>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight capitalize leading-none">
              Get in touch
            </h1>
          </div>
          <div className="flex items-center gap-3 px-5 py-2.5 bg-white text-[#4F46E5] rounded-full border border-slate-100">
            <Headphones size={18} />
            <span className="text-[11px] font-black uppercase tracking-widest">Support Active</span>
          </div>
        </div>
      </div>

      <div className="max-w-full mx-auto px-6 lg:px-12 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

          {/* Contact Info Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <div className="p-10 bg-slate-50 border border-slate-100 rounded-[2.5rem] group hover:bg-white hover:border-[#4F46E5]/20 transition-all duration-500">
              <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center mb-10 text-[#4F46E5] border border-slate-100 group-hover:bg-[#4F46E5] group-hover:text-white transition-all">
                <Mail size={24} />
              </div>
              <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Email support</h4>
              <p className="text-xl font-bold text-slate-900 tracking-tight">info@printermania.shop</p>
              <div className="mt-6 flex items-center gap-2 text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
                <Clock size={12} />
                <span>Response in 24 hours</span>
              </div>
            </div>

            <div className="p-10 bg-slate-50 border border-slate-100 rounded-[2.5rem] group hover:bg-white hover:border-[#4F46E5]/20 transition-all duration-500">
              <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center mb-10 text-[#4F46E5] border border-slate-100 group-hover:bg-[#4F46E5] group-hover:text-white transition-all">
                <MapPin size={24} />
              </div>
              <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Store location</h4>
              <p className="text-xl font-bold text-slate-900 tracking-tight leading-snug">111 S Princess St, <br /> Shepherdstown, WV 25443, United States</p>
              <div className="mt-6 flex items-center gap-2 text-[11px] font-bold text-[#4F46E5] uppercase tracking-wider">
                <Globe size={12} />
                <span>United States Delivery</span>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-8">
            <div className="bg-white border border-slate-100 p-8 md:p-16 rounded-[3rem]">
              {status === 'success' ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-16">
                  <div className="h-20 w-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8">
                    <CheckCircle2 size={40} />
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 mb-4 capitalize">Message Sent Successfully</h2>
                  <p className="text-slate-500 text-lg mb-10 max-w-md mx-auto">Thank you for reaching out. Our team will review your request and get back to you shortly.</p>
                  <button onClick={() => setStatus(null)} className="px-10 py-4 bg-slate-950 text-white font-bold rounded-full hover:bg-[#4F46E5] transition-all">Send Another Message</button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4">Full name</label>
                      <input
                        required type="text" placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full h-16 px-8 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-[#4F46E5] outline-none text-[14px] font-bold text-slate-900 transition-all placeholder:text-slate-300"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4">Email address</label>
                      <input
                        required type="email" placeholder="email@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full h-16 px-8 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-[#4F46E5] outline-none text-[14px] font-bold text-slate-900 transition-all placeholder:text-slate-300"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4">Phone number</label>
                      <input
                        type="tel" placeholder="Your phone (optional)"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full h-16 px-8 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-[#4F46E5] outline-none text-[14px] font-bold text-slate-900 transition-all placeholder:text-slate-300"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4">Subject</label>
                      <div className="relative">
                        <select
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          className="w-full h-16 px-8 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-[#4F46E5] outline-none text-[14px] font-bold text-slate-900 transition-all appearance-none cursor-pointer"
                        >
                          <option>General Inquiry</option>
                          <option>Technical Support</option>
                          <option>Order Tracking</option>
                          <option>Bulk Orders</option>
                        </select>
                        <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4">Message</label>
                    <textarea
                      required rows="5" placeholder="How can we help you?"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full p-8 bg-slate-50 border border-slate-100 rounded-[2rem] focus:bg-white focus:border-[#4F46E5] outline-none text-[14px] font-bold text-slate-900 transition-all resize-none placeholder:text-slate-300"
                    ></textarea>
                  </div>

                  <button
                    disabled={loading}
                    className="w-full h-16 bg-slate-950 text-white flex items-center justify-center gap-3 text-sm font-bold uppercase tracking-widest rounded-full hover:bg-[#4F46E5] transition-all disabled:opacity-50 group"
                  >
                    {loading ? <Loader2 className="animate-spin" size={24} /> : <><Send size={18} /> Send message <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>}
                  </button>
                  {status === 'error' && <p className="text-center text-red-500 text-xs font-bold uppercase tracking-widest">Error sending message. Please try again.</p>}
                </form>
              )}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
