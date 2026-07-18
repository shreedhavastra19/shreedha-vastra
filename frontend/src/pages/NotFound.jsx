import { Link } from 'react-router-dom';
import { Helmet } from '../components/common/Helmet';

const NotFound = () => (
  <div className="container-custom py-24 text-center">
    <Helmet title="Page Not Found | Shreedha Vastra" />
    <h1 className="font-serif text-6xl text-gold mb-4">404</h1>
    <p className="text-xl mb-8">The page you're looking for doesn't exist.</p>
    <Link to="/" className="btn-primary">Return Home</Link>
  </div>
);

export default NotFound;
