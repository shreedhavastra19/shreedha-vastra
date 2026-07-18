import { Helmet } from '../components/common/Helmet';

const RefundPolicy = () => (
  <div className="container-custom py-16 max-w-3xl">
    <Helmet title="Refund Policy | Shreedha Vastra" />
    <h1 className="font-serif text-4xl mb-8">Refund & Return Policy</h1>
    <div className="space-y-5 text-sm text-charcoal/80 dark:text-ivory/80 leading-relaxed">
      <h2 className="font-serif text-xl text-charcoal dark:text-ivory">7-Day Easy Returns</h2>
      <p>
        We offer a 7-day return window from the date of delivery. To be eligible, items must be
        unused, unwashed, and returned with all original tags and packaging intact.
      </p>
      <h2 className="font-serif text-xl text-charcoal dark:text-ivory mt-6">Non-Returnable Items</h2>
      <p>
        Customized or made-to-order pieces, and items marked "final sale," are not eligible for
        return or exchange.
      </p>
      <h2 className="font-serif text-xl text-charcoal dark:text-ivory mt-6">Refund Timeline</h2>
      <p>
        Once we receive and inspect your returned item, refunds are processed to your original
        payment method within 5-7 business days. For Cash on Delivery orders, refunds are issued
        via bank transfer.
      </p>
      <h2 className="font-serif text-xl text-charcoal dark:text-ivory mt-6">How to Initiate a Return</h2>
      <p>
        Contact our support team at support@shreedhavastra.in with your order number, and we'll
        guide you through the process.
      </p>
    </div>
  </div>
);

export default RefundPolicy;
