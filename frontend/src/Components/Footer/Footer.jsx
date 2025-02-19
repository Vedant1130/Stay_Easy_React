import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";

import "./Footer.css";

const Footer = () => {
  return (
    <div className="f-info">
      <div className="f-info-socials">
        <FaFacebook />
        <FaInstagram />
        <FaLinkedin />
      </div>
      <div className="f-info-brand">&copy;StayEasy Private Limited</div>
      <div className="f-info-links">
        <a href="/privacy">Privacy</a>
        <a href="/terms">Terms</a>
      </div>
    </div>
  );
};

export default Footer;
