import { useEffect, useState } from "react";
import NavBar from "@/components/NavBar";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import About from "@/components/About";
import Work from "@/components/Work";
import Experience from "@/components/Experience";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function App() {
  // Session-only, deliberately: no storage, so every visit opens light.
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", isDark ? "#0e1113" : "#fafaf7");
  }, [isDark]);

  return (
    <>
      <div className="grain" />
      <a
        href="#work"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-60 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-paper"
      >
        Skip to the work
      </a>
      <NavBar isDark={isDark} onToggleTheme={() => setIsDark((value) => !value)} />
      <main>
        <Hero />
        <Stats />
        <About />
        <Work />
        <Experience />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
