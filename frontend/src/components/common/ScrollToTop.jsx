// ================================================================
// Shreedha Vastra — Scroll restoration on route change
// ================================================================
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// React Router does NOT scroll to top on navigation by default.
// This component watches the current URL (pathname) and scrolls
// the window back to the top every time it changes.
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default ScrollToTop;