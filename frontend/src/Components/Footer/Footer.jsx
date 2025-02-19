import { FaGlobe } from "react-icons/fa";

import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer bg-light p-3">
      <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center">
        {/* Left Side */}
        <div className="footer-left text-muted">
          © {new Date().getFullYear()} Stay Easy
         
        </div>

        {/* Right Side */}
        <div className="footer-right d-flex align-items-center text-muted">
           <a href="#" className="text-decoration-none mx-2">
            Privacy
          </a>
          ·
          <a href="#" className="text-decoration-none mx-2">
            Terms
          </a>
          ·
          <a href="#" className="text-decoration-none mx-2">
            Sitemap
          </a>
          
         
        </div>
      </div>
    </footer>
  );
};

export default Footer;
