import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-ink-800 text-library-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-8 h-8 text-library-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
              <span className="text-xl font-heading font-bold text-white">LibraShare</span>
            </div>
            <p className="text-library-300 text-sm leading-relaxed max-w-md">
              Your premier digital library marketplace. Discover, buy, and sell e-books, 
              audiobooks, and digital courses. Join our community of readers and creators.
            </p>
          </div>

          <div>
            <h3 className="text-white font-heading font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-library-300 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/about" className="text-library-300 hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-library-300 hover:text-white transition-colors">Contact</Link></li>
              <li><Link to="/cart" className="text-library-300 hover:text-white transition-colors">Cart</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-heading font-bold mb-4">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li><span className="text-library-300">Fiction</span></li>
              <li><span className="text-library-300">Non-Fiction</span></li>
              <li><span className="text-library-300">Technology</span></li>
              <li><span className="text-library-300">Science</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-ink-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-library-400 text-sm">
            &copy; {new Date().getFullYear()} LibraShare. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-library-400 text-sm">Built with passion for readers</span>
            <span className="text-library-500">&#10086;</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;