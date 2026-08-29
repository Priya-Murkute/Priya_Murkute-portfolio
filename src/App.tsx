import NavBar from "./components/NavBar";
import Hero from "./components/Hero";
import About from "./components/About";
import Garden from "./components/Garden";
import Experience from "./components/Experience";
import Skills from "./components/Skills";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function App() {
  return (
    <>
      <NavBar />
      <main>
        <Hero />
        <About />
        <Garden />
        <Experience />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
