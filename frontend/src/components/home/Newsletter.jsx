// ================================================================
// Shreedha Vastra — Newsletter Subscription Section
// ================================================================
// NOTE: The backend (already complete, per project scope) does not
// currently expose a newsletter/subscriber endpoint. This component
// validates the email client-side and confirms with the user, but
// does not persist the subscription anywhere yet. To make this
// fully functional, add a small Subscriber model + POST route on
// the backend and call it from handleSubmit below.
// ================================================================
import { useState } from 'react';
import toast from 'react-hot-toast';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const isValidEmail = /^\S+@\S+\.\S+$/.test(email);
    if (!isValidEmail) {
      toast.error('Please enter a valid email address');
      return;
    }

    setSubmitting(true);
    // Simulated confirmation — replace with a real API call once a
    // backend subscriber endpoint exists (see note above).
    setTimeout(() => {
      toast.success("Thank you for subscribing! Welcome to the Shreedha Vastra family.");
      setEmail('');
      setSubmitting(false);
    }, 500);
  };

  return (
    <section className="bg-gold py-16">
      <div className="container-custom text-center max-w-xl">
        <h2 className="font-serif text-3xl text-ivory mb-3">Join Our Inner Circle</h2>
        <p className="text-ivory/80 mb-8">
          Be the first to know about new collections, festive offers, and exclusive previews.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="flex-1 px-5 py-3 rounded-full border-none focus:outline-none focus:ring-2 focus:ring-ivory text-charcoal"
          />
          <button
            type="submit"
            disabled={submitting}
            className="bg-charcoal text-ivory font-medium px-6 py-3 rounded-full hover:bg-charcoal/80 transition-colors disabled:opacity-50"
          >
            {submitting ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Newsletter;
