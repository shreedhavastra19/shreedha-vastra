import { Link } from 'react-router-dom';
import { FiInstagram, FiFacebook, FiTwitter, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { useState } from 'react';
import toast from 'react-hot-toast';

const Footer = () => {
  const [email, setEmail] = useState('');

  // const handleSubscribe = (e) => {
  //   e.preventDefault();
  //   if (!email) return;
  //   toast.success('Subscribed! Welcome to the Shreedha Vastra family.');
  //   setEmail('');
  // };

  return (
    <footer className="bg-charcoal text-ivory/90 mt-20">
      {/* Newsletter
      <div className="border-b border-ivory/10">
        <div className="container-custom py-12 text-center">
          <h3 className="font-serif text-2xl md:text-3xl mb-2">Join the Shreedha Vastra Family</h3>
          <p className="text-ivory/60 mb-6 max-w-md mx-auto">
            Subscribe for early access to new collections, festive offers, and styling tips.
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-full bg-white/10 border border-ivory/20 focus:outline-none focus:border-gold placeholder:text-ivory/40"
            />
            <button type="submit" className="btn-primary">
              Subscribe
            </button>
          </form>
        </div>
      </div> */}

      <div className="container-custom py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h4 className="font-serif text-xl text-gold mb-4">Shreedha Vastra</h4>
          <p className="text-sm text-ivory/60 mb-4">
            Premium, royal, elegant Indian ethnic wear crafted for the modern woman.
          </p>
          <div className="flex gap-4">
            <a href="#" aria-label="Instagram" className="hover:text-gold"><FiInstagram size={18} /></a>
            <a href="#" aria-label="Facebook" className="hover:text-gold"><FiFacebook size={18} /></a>
            {/* <a href="#" aria-label="Twitter" className="hover:text-gold"><FiTwitter size={18} /></a> */}
          </div>
        </div>

        <div>
          <h5 className="font-semibold mb-4">Shop</h5>
          <ul className="space-y-2 text-sm text-ivory/60">
            <li><Link to="/shop?collection=Suit Sets" className="hover:text-gold">Suit Sets</Link></li>
            <li><Link to="/shop?collection=Kurta Sets" className="hover:text-gold">Kurta Sets</Link></li>
            <li><Link to="/shop?collection=Wedding Collection" className="hover:text-gold">Wedding Collection</Link></li>
            <li><Link to="/shop?collection=New Arrivals" className="hover:text-gold">New Arrivals</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="font-semibold mb-4">Company</h5>
          <ul className="space-y-2 text-sm text-ivory/60">
            <li><Link to="/about" className="hover:text-gold">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-gold">Contact Us</Link></li>
            <li><Link to="/faq" className="hover:text-gold">FAQ</Link></li>
            <li><Link to="/privacy-policy" className="hover:text-gold">Privacy Policy</Link></li>
            <li><Link to="/terms-and-conditions" className="hover:text-gold">Terms & Conditions</Link></li>
            {/* <li><Link to="/refund-policy" className="hover:text-gold">Refund Policy</Link></li> */}
          </ul>
        </div>

        <div>
          <h5 className="font-semibold mb-4">Get in Touch</h5>
          <ul className="space-y-3 text-sm text-ivory/60">
            <li className="flex items-center gap-2"><FiMapPin size={16} /> Ghaziabad, India</li>
            {/* <li className="flex items-center gap-2"><FiPhone size={16} /> +91 98765 43210</li> */}
            <li className="flex items-center gap-2"><FiMail size={16} /> shreedhavastra19@gmail.com</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-ivory/10 py-6 text-center text-xs text-ivory/40">
        © {new Date().getFullYear()} Shreedha Vastra. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
