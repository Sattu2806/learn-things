/**
 * Brings the page to life as it is read: blocks fade and rise into place the
 * first time they scroll into view, and display equations write themselves
 * symbol by symbol (see the .reveal rules in styles.css). Nothing is hidden
 * unless this runs, and nothing moves for readers who ask for less motion.
 */
const SELECTOR = [
  '.article-head',
  '.t-section > :not(.t-head)',
  '.t-head',
  '.t-list > li',
  '.example',
  '.step',
  '.answer',
  '.eq',
  '.t-figure',
  '.t-table tr',
  '.mistake',
  '.question',
  '.q-card',
  '.calc-stat',
  '.closing',
  '.course-note',
].join(', ');

export function startReveal(): () => void {
  if (typeof IntersectionObserver === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      }
    },
    { rootMargin: '0px 0px -6% 0px' },
  );
  const take = (el: Element) => {
    if (el.classList.contains('reveal')) return;
    el.classList.add('reveal');
    io.observe(el);
  };
  const scan = (root: Element | Document) => {
    if (root instanceof Element && root.matches(SELECTOR)) take(root);
    root.querySelectorAll(SELECTOR).forEach(take);
  };
  scan(document);
  // Views and chapters mount later; pick up their blocks as they appear.
  const mo = new MutationObserver((records) => {
    for (const r of records) r.addedNodes.forEach((n) => n instanceof Element && scan(n));
  });
  mo.observe(document.body, { childList: true, subtree: true });
  return () => {
    io.disconnect();
    mo.disconnect();
  };
}
