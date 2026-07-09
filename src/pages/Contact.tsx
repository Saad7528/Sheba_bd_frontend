import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, HelpCircle, ShieldCheck } from 'lucide-react';

const Contact: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) return;
    
    // Simulate support ticket submit
    setSuccess(true);
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow space-y-12 text-left">
      
      {/* Page Title */}
      <div className="text-left space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-sans">Contact Support</h1>
        <p className="text-slate-600 text-sm">Have questions about appointments or telemedicine? Get in touch with our helpdesk.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Direct Info Cards */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Office Address */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-start space-x-4">
            <span className="p-3 bg-primary/10 text-primary rounded-xl flex-shrink-0">
              <MapPin className="w-6 h-6" />
            </span>
            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 text-sm">Corporate Headquarters</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-light">
                Level 7, Venture Tower, Banani C/A,<br />
                Dhaka-1213, Bangladesh
              </p>
            </div>
          </div>

          {/* Support Phone Hotlines */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-start space-x-4">
            <span className="p-3 bg-indigo-50 text-indigo-600 rounded-xl flex-shrink-0">
              <Phone className="w-6 h-6" />
            </span>
            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 text-sm">Phone Hotlines</h3>
              <a href="tel:+8809612123456" className="block text-xs font-semibold text-slate-800 hover:text-primary transition-colors">
                +880 9612 123456
              </a>
              <span className="block text-[10px] text-slate-400">Available Daily: 9:00 AM - 9:00 PM</span>
            </div>
          </div>

          {/* Support Mail */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-start space-x-4">
            <span className="p-3 bg-rose-50 text-rose-600 rounded-xl flex-shrink-0">
              <Mail className="w-6 h-6" />
            </span>
            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 text-sm">Helpdesk Email</h3>
              <a href="mailto:support@shebabd.com" className="block text-xs font-semibold text-slate-800 hover:text-primary transition-colors">
                support@shebabd.com
              </a>
              <span className="block text-[10px] text-slate-400">For business proposals & support queries</span>
            </div>
          </div>

        </div>

        {/* Right Column: Support Query Form */}
        <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm">
          
          {success ? (
            <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 text-center space-y-3">
              <ShieldCheck className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="font-extrabold text-slate-900 text-lg">Support Query Received</h3>
              <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
                Thank you for contacting ShebaBD support. A ticket has been created and our helpdesk team will get back to you within 24 hours.
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="mt-2 text-xs font-bold text-primary hover:underline focus:outline-none"
              >
                Submit another request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <h3 className="font-bold text-slate-900 text-lg flex items-center border-b border-slate-100 pb-3">
                <HelpCircle className="w-5 h-5 mr-2 text-primary" /> Send Support Message
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase">Your Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Rahim Uddin"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                  />
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase">Subject</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Appointment rescheduling help"
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                />
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase">Message</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your issue or query details here..."
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                ></textarea>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-primary/10 flex items-center justify-center space-x-1.5"
              >
                <Send className="w-4 h-4" />
                <span>Submit Ticket</span>
              </button>
            </form>
          )}

        </div>

      </div>

    </div>
  );
};

export default Contact;
