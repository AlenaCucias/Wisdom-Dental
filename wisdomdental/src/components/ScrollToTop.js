import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    // Scroll to top when location changes
    window.scrollTo({
        top: 0,
        behavior: 'instant'
    });
  }, [location]);

  return null; // This component doesn't render anything
}

export default ScrollToTop;
