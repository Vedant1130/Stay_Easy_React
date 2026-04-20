const Footer = () => {
  return (
    <footer className="mt-8 border-t border-brand-dark/5 bg-white/50 backdrop-blur-lg">
      <div className="container mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Left Side */}
        <div className="text-brand-dark/60 font-medium flex items-center gap-2">
          <span className="bg-brand-primary p-1.5 rounded-lg text-white">
            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 576 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-11.5 0-22.9-5.3-30.4-14.3l-15.6-18.7-15.6 18.7c-7.5 9-18.9 14.3-30.4 14.3H104c-22.1 0-40-17.9-40-40V455.9c-.3-2.7-.5-5.4-.5-8.1l.7-160.2h-32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-10 24-10s17 3 24 10L565.8 231.5c7 7 10 15 10 24zM511.9 287.6V255.5L290.4 34L68.8 255.5v32.1l11.1-.1l-.6 152.6v9.9c0 4.4 3.6 8 8 8H216v-96c0-17.7 14.3-32 32-32h80c17.7 0 32 14.3 32 32v96h128.7c4.4 0 8-3.6 8-8v-9.9l-.6-152.6l11.1 .1z"></path></svg>
          </span>
          © {new Date().getFullYear()} StayEasy, Inc.
        </div>

        {/* Right Side */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm font-medium text-brand-dark/60">
          <a href="#" className="hover:text-brand-primary transition-colors">
            Privacy Policy
          </a>
          <span className="text-brand-dark/20">•</span>
          <a href="#" className="hover:text-brand-primary transition-colors">
            Terms of Service
          </a>
          <span className="text-brand-dark/20">•</span>
          <a href="#" className="hover:text-brand-primary transition-colors">
            Sitemap
          </a>
          <span className="text-brand-dark/20">•</span>
          <a href="#" className="hover:text-brand-primary transition-colors">
            Company Details
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
