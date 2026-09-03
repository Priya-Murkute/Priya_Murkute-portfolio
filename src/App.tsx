import { useCallback, useState } from "react";
import { AnimatePresence, useReducedMotion } from "motion/react";
import { Route, Routes, useLocation } from "react-router-dom";
import Preloader from "@/components/Preloader";
import CursorGlow from "@/components/CursorGlow";
import NavBar from "@/components/NavBar";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import About from "@/components/About";
import Work from "@/components/Work";
import Projects from "@/components/Projects";
import PullQuote from "@/components/PullQuote";
import Experience from "@/components/Experience";
import Volunteering from "@/components/Volunteering";
import Skills from "@/components/Skills";
import Certifications from "@/components/Certifications";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import AboutMe from "@/pages/AboutMe";
import NotFound from "@/pages/NotFound";
import ErrorBoundary, { PageErrorFallback } from "@/components/ErrorBoundary";

function HomePage() {
  return (
    <main id="main-content">
      <Hero />
      <Stats />
      <About />
      <Work />
      <Projects />
      <PullQuote />
      <Experience />
      <Volunteering />
      <Skills />
      <Certifications />
      <Contact />
    </main>
  );
}

/**
 * The preloader is a nice piece of theatre, but it is also ~1.2s in front of
 * every page view — and it is the Largest Contentful Paint. Showing it once
 * per browser session keeps the first impression and stops charging returning
 * visitors, and anyone who navigates back to the site later still sees it.
 */
const PRELOADER_SESSION_KEY = "pm-preloaded";

function hasSeenPreloader(): boolean {
  try {
    return sessionStorage.getItem(PRELOADER_SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

function markPreloaderSeen() {
  try {
    sessionStorage.setItem(PRELOADER_SESSION_KEY, "1");
  } catch {
    // sessionStorage unavailable — the preloader just shows every load
  }
}

export default function App() {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const [isLoading, setIsLoading] = useState(() => !prefersReducedMotion && !hasSeenPreloader());
  const location = useLocation();
  const isHome = location.pathname === "/";

  const handlePreloaderComplete = useCallback(() => {
    markPreloaderSeen();
    setIsLoading(false);
  }, []);

  return (
    <>
      <AnimatePresence>
        {isLoading ? <Preloader key="preloader" onComplete={handlePreloaderComplete} /> : null}
      </AnimatePresence>

      {isLoading ? null : (
        <>
          <div className="grain" />
          <CursorGlow />
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-60 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-paper"
          >
            Skip to content
          </a>
          <NavBar showSectionLinks={isHome} />
          {/* Keyed on pathname so navigating away from a page that threw
              resets the boundary — otherwise the fallback would persist for
              the rest of the session. */}
          <ErrorBoundary key={location.pathname} fallback={<PageErrorFallback />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              {/* /off-hours is an alias for the same page — the Hero's "about
                  me" link and this task's brief for an off-hours route both
                  point at the one page rather than being duplicated. */}
              <Route path="/about-me" element={<AboutMe />} />
              <Route path="/off-hours" element={<AboutMe />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ErrorBoundary>
          <Footer />
        </>
      )}
    </>
  );
}
