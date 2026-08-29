import { motion } from "framer-motion";

const LINKS = [
  { href: "#about", label: "About" },
  { href: "#garden", label: "Garden" },
  { href: "#experience", label: "Experience" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
];

export default function NavBar() {
  return (
    <motion.header
      className="site-header"
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <nav className="nav container">
        <a className="logo" href="#top">
          <span className="logo-mark" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </span>
          Priya Murkute
        </a>
        <ul className="nav-links">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
      </nav>
    </motion.header>
  );
}
