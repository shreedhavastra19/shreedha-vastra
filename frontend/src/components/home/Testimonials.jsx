const testimonials = [
  {
    name: 'Ananya Sharma',
    location: 'Mumbai',
    text: 'The fabric quality and stitching are absolutely stunning. I wore the Raja Rani set to my sister\u2019s wedding and got so many compliments!',
    rating: 5,
  },
  {
    name: 'Priya Reddy',
    location: 'Hyderabad',
    text: 'Shreedha Vastra has become my go-to for festive wear. The colors are exactly as shown online and delivery was fast.',
    rating: 5,
  },
  {
    name: 'Kavita Nair',
    location: 'Bengaluru',
    text: 'Beautiful craftsmanship at a fair price. The customer service team helped me pick the right size and it fit perfectly.',
    rating: 4,
  },
];

const Testimonials = () => (
  <section className="bg-blush-light/40 py-16">
    <div className="container-custom">
      <h2 className="section-heading mb-10">What Our Customers Say</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <div key={i} className="card p-6 animate-fadeIn">
            <div className="flex gap-1 mb-3 text-gold">
              {'★'.repeat(t.rating)}
              <span className="text-beige">{'★'.repeat(5 - t.rating)}</span>
            </div>
            <p className="text-sm text-charcoal/80 mb-4 italic">"{t.text}"</p>
            <p className="font-medium text-sm">{t.name}</p>
            <p className="text-xs text-charcoal/50">{t.location}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;
