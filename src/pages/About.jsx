import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-ink-800 via-ink-700 to-library-700 relative overflow-hidden">
        <div className="absolute inset-0 book-pattern opacity-20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-white leading-tight mb-6">
              About LibraShare
            </h1>
            <p className="text-xl text-library-200 leading-relaxed">
              We're on a mission to make knowledge accessible to everyone through our digital library marketplace.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-heading font-bold text-ink-800 mb-6">Our Mission</h2>
            <p className="text-ink-600 leading-relaxed mb-4">
              LibraShare is a digital marketplace that connects readers with authors and publishers. 
              We believe that knowledge should be accessible to everyone, anywhere, at any time.
            </p>
            <p className="text-ink-600 leading-relaxed mb-4">
              Our platform enables authors and publishers to reach a global audience, while providing 
              readers with a vast collection of digital books at competitive prices.
            </p>
            <p className="text-ink-600 leading-relaxed">
              Whether you're a passionate reader looking for your next great read, or an author wanting 
              to share your work with the world, LibraShare is the place for you.
            </p>
          </div>
          <div className="bg-gradient-to-br from-library-100 to-library-200 rounded-2xl p-8 flex items-center justify-center aspect-square">
            <svg className="w-48 h-48 text-library-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white border-y border-library-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-ink-800 mb-4">Why Choose LibraShare?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '📚', title: 'Vast Collection', desc: 'Thousands of digital books across multiple categories and genres.' },
              { icon: '💰', title: 'Fair Pricing', desc: 'Competitive prices with direct support for authors and publishers.' },
              { icon: '⚡', title: 'Instant Access', desc: 'Download and start reading immediately after purchase.' },
              { icon: '🌍', title: 'Global Reach', desc: 'Connect with readers and authors from around the world.' },
              { icon: '🔒', title: 'Secure Platform', desc: 'Your purchases and data are protected with industry-standard security.' },
              { icon: '💬', title: 'Community', desc: 'Join a growing community of passionate readers and creators.' },
            ].map(f => (
              <div key={f.title} className="bg-library-50 rounded-xl p-6 card-hover">
                <span className="text-3xl block mb-4">{f.icon}</span>
                <h3 className="font-heading font-bold text-ink-800 mb-2">{f.title}</h3>
                <p className="text-ink-600 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-3xl font-heading font-bold text-ink-800 mb-4">Ready to Get Started?</h2>
        <p className="text-ink-500 mb-8 max-w-lg mx-auto">
          Join LibraShare today and start exploring our vast digital library.
        </p>
        <Link to="/register" className="px-8 py-3 bg-library-500 text-white rounded-xl font-semibold hover:bg-library-600 transition-colors inline-flex">
          Create Free Account
        </Link>
      </section>
    </div>
  );
};

export default About;