import React, { useEffect, useState } from 'react';

const InstagramFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const result = await window.storage.get('instagram_links', true);
      if (result && result.value) {
        const links = JSON.parse(result.value);
        setPosts(links);
      } else {
        // Default posts if none are set
        setPosts([
          'https://www.instagram.com/reel/DPmbrgJE-ZQ/embed',
          'https://www.instagram.com/p/DOvBeMJCV4t/embed',
          'https://www.instagram.com/p/DNNzMcxpQrn/embed',
        ]);
      }
    } catch (error) {
      console.log('Error loading posts, using defaults');
      // Default posts on error
      setPosts([
        'https://www.instagram.com/reel/DPmbrgJE-ZQ/embed',
        'https://www.instagram.com/p/DOvBeMJCV4t/embed',
        'https://www.instagram.com/p/DNNzMcxpQrn/embed',
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl sm:rounded-2xl">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        </div>
      </section>
    );
  }

  if (posts.length === 0) {
    return (
      <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl sm:rounded-2xl">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-3 sm:mb-4 text-gray-800">
            Follow Our Journey
          </h2>
          <p className="text-center text-gray-600">
            No posts available at the moment. Check back soon!
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl sm:rounded-2xl">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-3 sm:mb-4 text-gray-800">
          Follow Our Journey
        </h2>
        <p className="text-center text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 lg:mb-12 max-w-2xl mx-auto">
          Stay connected with our latest initiatives and community impact
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
          {posts.map((postUrl, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
              style={{ height: '600px' }}
            >
              <iframe
                src={postUrl}
                className="w-full h-full"
                frameBorder="0"
                scrolling="no"
                allowTransparency="true"
                allow="autoplay; encrypted-media"
                title={`Instagram post ${index + 1}`}
              />
            </div>
          ))}
        </div>
        
        <div className="text-center mt-6 sm:mt-8">
          <a 
            href="https://www.instagram.com/eniracaringfoundation" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-sm sm:text-base font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            Follow Us on Instagram
          </a>
        </div>
      </div>
    </section>
  );
};

export default InstagramFeed;