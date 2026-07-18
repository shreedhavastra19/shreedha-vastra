// ================================================================
// Shreedha Vastra — Lightweight SEO Helmet (no external dependency)
// ================================================================
// Sets the document title and meta description per-page. Kept
// dependency-free (no react-helmet-async) since our needs are simple.
// ================================================================
import { useEffect } from 'react';

export const Helmet = ({ title, description }) => {
  useEffect(() => {
    if (title) document.title = title;

    if (description) {
      let tag = document.querySelector('meta[name="description"]');
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', 'description');
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', description);
    }
  }, [title, description]);

  return null;
};

export default Helmet;
