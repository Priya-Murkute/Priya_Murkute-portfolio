import { useEffect, useState } from "react";
import { AnimatePresence, useReducedMotion } from "motion/react";
import { Route, Routes, useLocation } from "react-router-dom";
import Preloader from "@/components/Preloader";
import NavBar from "@/components/NavBar";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import About from "@/components/About";
import Work from "@/components/Work";
import Projects from "@/components/Projects";
import PullQuote from "@/components/PullQuote";
import Experience from "@/components/Experience";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import AboutMe from "@/pages/AboutMe";

const THEME_STORAGE_KEY = "pm-theme";

function getStoredTheme(): boolean {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY) === "dark";
  } catch {
    return false;
  }
}

function HomePage({ isDark }: { isDark: boolean }) {
  return (
    <main id="main-content">
      <Hero isDark={isDark} />
      <Stats />
      <About />
      <Work />
      <Projects />
      <PullQuote />
      <Experience />
      <Skills />
      <Contact isDark={isDark} />
    </main>
  );
}

export default function App() {
  // Persisted across page loads — including the hard reload that a plain
  // `/#section` anchor triggers when navigating from another route back to
  // "/" — so switching pages never silently reverts the theme.
  const [isDark, setIsDark] = useState(getStoredTheme);
  const prefersReducedMotion = useReducedMotion() ?? false;
  const [isLoading, setIsLoading] = useState(!prefersReducedMotion);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", isDark ? "#0e1113" : "#fafaf7");
    try {
      localStorage.setItem(THEME_STORAGE_KEY, isDark ? "dark" : "light");
    } catch {
      // localStorage unavailable (private browsing, etc.) — theme just won't persist
    }
  }, [isDark]);

  return (
    <>
      <AnimatePresence>
        {isLoading ? <Preloader key="preloader" onComplete={() => setIsLoading(false)} /> : null}
      </AnimatePresence>

      {isLoading ? null : (
        <>
          <div className="grain" />
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-60 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-paper"
          >
            Skip to content
          </a>
          <NavBar
            isDark={isDark}
            onToggleTheme={() => setIsDark((value) => !value)}
            showSectionLinks={isHome}
          />
          <Routes>
            <Route path="/" element={<HomePage isDark={isDark} />} />
            {/* /off-hours is an alias for the same page — the Hero's "about
                me" link and this task's brief for an off-hours route both
                point at the one page rather than being duplicated. */}
            <Route path="/about-me" element={<AboutMe isDark={isDark} />} />
            <Route path="/off-hours" element={<AboutMe isDark={isDark} />} />
          </Routes>
          <Footer />
        </>
      )}
    </>
  );
}
