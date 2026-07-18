import { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import { Helmet } from '../components/common/Helmet';

const faqs = [
  { q: 'What sizes do you offer?', a: 'We offer sizes from XS to XXL across most of our collections. Each product page includes a size chart to help you find your perfect fit.' },
  { q: 'How long does delivery take?', a: 'Standard delivery takes 5-9 business days across India. Express delivery options are available at checkout in select pin codes.' },
  { q: 'What is your return policy?', a: 'We offer a 7-day easy return from the date of delivery, provided the item is unused, unwashed, and has original tags attached.' },
  { q: 'Do you offer Cash on Delivery?', a: 'Yes, COD is available for most pin codes across India in addition to UPI, cards, and net banking via Razorpay.' },
  { q: 'How do I track my order?', a: 'Once your order ships, you can track it from the "My Orders" section in your account using the tracking number provided.' },
  { q: 'Can I cancel or modify my order?', a: 'Orders can be cancelled before they are shipped. Please contact our support team as soon as possible for assistance.' },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="container-custom py-16 max-w-2xl">
      <Helmet title="FAQ | Shreedha Vastra" />
      <h1 className="font-serif text-4xl mb-10 text-center">Frequently Asked Questions</h1>
      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <div key={i} className="card">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between p-5 text-left font-medium"
            >
              {faq.q}
              <FiChevronDown className={`transition-transform ${openIndex === i ? 'rotate-180' : ''}`} />
            </button>
            {openIndex === i && (
              <p className="px-5 pb-5 text-sm text-charcoal/70 dark:text-ivory/70">{faq.a}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
