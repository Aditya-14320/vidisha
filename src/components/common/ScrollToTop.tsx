import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Automatically scrolls window and content containers to top on route pathname changes.
 * Preserves anchor hash navigation on the same page and disables browser automatic
 * scroll restoration interference.
 */
export const ScrollToTop: React.FC = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Prevent browser's default scroll restoration from fighting with React route transitions
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useEffect(() => {
    // If navigating to an anchor hash, scroll to that target element
    if (hash) {
      const targetId = hash.replace('#', '');
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }

    // Scroll window and document elements to top immediately
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    });

    document.documentElement.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    });

    document.body.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    });

    // Also reset scroll on any scrollable main containers (e.g. Admin layout)
    const mainContainers = document.querySelectorAll('main, [data-scroll-container]');
    mainContainers.forEach((container) => {
      container.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant',
      });
    });
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
