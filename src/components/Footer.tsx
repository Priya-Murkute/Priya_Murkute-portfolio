export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer>
      <div className="container footer-inner">
        <p>© {year} Priya Murkute</p>
        <p className="footer-note">Built with React, TypeScript &amp; Framer Motion.</p>
      </div>
    </footer>
  );
}
