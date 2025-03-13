const Footer = () => {
  return (
    <footer className="bg-gray-100 p-3 mt-2">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        {/* Left Side */}
        <div className="text-gray-600">
          © {new Date().getFullYear()}  Stay Easy
        </div>

        {/* Right Side */}
        <div className="flex items-center text-gray-600">
          <a href="#" className="mx-2 no-underline hover:underline">
            Privacy
          </a>
          ·
          <a href="#" className="mx-2 no-underline hover:underline">
            Terms
          </a>
          ·
          <a href="#" className="mx-2 no-underline hover:underline">
            Sitemap
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
