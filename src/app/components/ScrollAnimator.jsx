'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollAnimator() {
  const pathname = usePathname();

  useEffect(() => {
    const SEL = '.reveal, .reveal-left, .reveal-right, .reveal-scale';

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.06, rootMargin: '80px 0px 0px 0px' }
    );

    const attach = () => {
      document.querySelectorAll(SEL).forEach((el) => {
        if (!el.classList.contains('visible')) {
          observer.unobserve(el);
          observer.observe(el);
        }
      });
    };

    // First pass — observe elements already in DOM
    const t1 = setTimeout(attach, 80);
    // Second pass — catch elements added by client-side fetches (like campaigns)
    const t2 = setTimeout(attach, 600);
    const t3 = setTimeout(attach, 1500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}
