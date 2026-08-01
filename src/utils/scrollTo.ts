export function scrollToSection(targetId: string) {
  const cleanId = targetId.startsWith("#") ? targetId.slice(1) : targetId;
  if (!cleanId) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  const elem = document.getElementById(cleanId);
  if (!elem) return;
  
  const lenis = (window as unknown as { lenis?: { scrollTo: (target: HTMLElement | string, opts?: object) => void } }).lenis;
  if (lenis) {
    lenis.scrollTo(elem, { duration: 1.2 });
  } else {
    elem.scrollIntoView({ behavior: "smooth" });
  }
}
