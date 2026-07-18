import { Helmet } from '../components/common/Helmet';

const PrivacyPolicy = () => (
  <div className="container-custom py-16 max-w-3xl prose-sm">
    <Helmet title="Privacy Policy | Shreedha Vastra" />
    <h1 className="font-serif text-4xl mb-8">Privacy Policy</h1>
    <div className="space-y-5 text-sm text-charcoal/80 dark:text-ivory/80 leading-relaxed">
      <p>Last updated: July 2026</p>
      <p>
        Shreedha Vastra ("we", "us", "our") respects your privacy. This policy explains what
        information we collect, how we use it, and the choices you have.
      </p>
      <h2 className="font-serif text-xl text-charcoal dark:text-ivory mt-6">Information We Collect</h2>
      <p>
        We collect information you provide directly — name, email, phone number, shipping
        addresses — and information generated through your use of our site, such as order history
        and browsing preferences.
      </p>
      <h2 className="font-serif text-xl text-charcoal dark:text-ivory mt-6">How We Use Your Information</h2>
      <p>
        We use your information to process orders, provide customer support, send order and
        shipping updates, and — where you've opted in — send you promotional emails about new
        collections and offers.
      </p>
      <h2 className="font-serif text-xl text-charcoal dark:text-ivory mt-6">Payment Information</h2>
      <p>
        Payments are processed securely through Razorpay. We do not store your card, UPI, or net
        banking credentials on our servers.
      </p>
      <h2 className="font-serif text-xl text-charcoal dark:text-ivory mt-6">Your Rights</h2>
      <p>
        You may access, update, or request deletion of your personal information at any time by
        contacting us at support@shreedhavastra.in.
      </p>
    </div>
  </div>
);

export default PrivacyPolicy;
