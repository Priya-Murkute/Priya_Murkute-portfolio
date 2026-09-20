import { useCallback, useState } from "react";
import { AnimatePresence, useReducedMotion } from "motion/react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Preloader from "@/components/Preloader";
import CursorGlow from "@/components/CursorGlow";
import NavBar from "@/components/NavBar";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import Education from "@/components/Education";
import Showcase from "@/components/Showcase";
import Projects from "@/components/Projects";
import PullQuote from "@/components/PullQuote";
import Experience from "@/components/Experience";
import Volunteering from "@/components/Volunteering";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import AboutMe from "@/pages/AboutMe";
import NotFound from "@/pages/NotFound";
import { Analytics } from "@vercel/analytics/react";
import ErrorBoundary, { PageErrorFallback } from "@/components/ErrorBoundary";
import { readStorage, writeStorage } from "@/lib/storage";
import { useScrollToHash } from "@/lib/useScrollToHash";

function HomePage() {
  useScrollToHash();

  return (
    <main id="main-content">
      <Hero />
      <Stats />
      <Experience />
      <Projects />
      <Showcase />
      <PullQuote />
      <Education />
      <Volunteering />
      <Skills />
      <Contact />
    </main>
  );
}

/** Shown once per session — it's the LCP, and returning visitors shouldn't pay for it. */
const PRELOADER_SESSION_KEY = "pm-preloaded";

const hasSeenPreloader = () => readStorage("session", PRELOADER_SESSION_KEY) === "1";
const markPreloaderSeen = () => writeStorage("session", PRELOADER_SESSION_KEY, "1");

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
          {/* Keyed on pathname so navigating away from a page that threw resets it. */}
          <ErrorBoundary key={location.pathname} fallback={<PageErrorFallback />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about-me" element={<AboutMe />} />
              {/* Redirect rather than render a second time — a real 301-ish
                  client-side redirect collapses this into one indexable URL
                  instead of two pages fighting over the same canonical. */}
              <Route path="/off-hours" element={<Navigate to="/about-me" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ErrorBoundary>
          <Footer />
        </>
      )}
      <Analytics />
    </>
  );
}
