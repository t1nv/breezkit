import { useCallback, useSyncExternalStore } from "react";

/**
 * Theme state lives on <html class="dark"> — treat the DOM as the store so
 * every component using this hook stays in sync (dashboard topbar, settings).
 */
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

function readDark() {
  return document.documentElement.classList.contains("dark");
}

export function useDarkMode() {
  const dark = useSyncExternalStore(subscribe, readDark, () => false);

  const toggleDark = useCallback(() => {
    const next = !readDark();
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }, []);

  return { dark, toggleDark };
}
