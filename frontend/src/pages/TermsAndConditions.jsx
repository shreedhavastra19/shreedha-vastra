import { Helmet } from '../components/common/Helmet';

const TermsAndConditions = () => (
  <div className="container-custom py-16 max-w-3xl">
    <Helmet title="Terms & Conditions | Shreedha Vastra" />
    <h1 className="font-serif text-4xl mb-8">Terms & Conditions</h1>
    <div className="space-y-5 text-sm text-charcoal/80 dark:text-ivory/80 leading-relaxed">
      <p>Last updated: July 2026</p>
      <p>
        By accessing and using the Shreedha Vastra website, you agree to be bound by these Terms
        & Conditions. Please read them carefully before placing an order.
      </p>
      <h2 className="font-serif text-xl text-charcoal dark:text-ivory mt-6">Orders & Pricing</h2>
      <p>
        All prices are listed in Indian Rupees (INR) and are subject to change without notice.
        We reserve the right to refuse or cancel any order at our discretion, including in cases
        of suspected fraud or pricing errors.
      </p>
      <h2 className="font-serif text-xl text-charcoal dark:text-ivory mt-6">Product Accuracy</h2>
      <p>
        We strive to display product colors and details as accurately as possible; however, slight
        variations may occur due to screen settings and the handmade nature of some garments.
      </p>
      <h2 className="font-serif text-xl text-charcoal dark:text-ivory mt-6">Intellectual Property</h2>
      <p>
        All content on this site — including images, designs, and text — is the property of
        Shreedha Vastra and may not be reproduced without written permission.
      </p>
      <h2 className="font-serif text-xl text-charcoal dark:text-ivory mt-6">Governing Law</h2>
      <p>These terms are governed by the laws of India.</p>
    </div>
  </div>
);

export default TermsAndConditions;
