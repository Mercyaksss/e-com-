export default function Hero() {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-orange-900/20">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h1 className="text-6xl md:text-8xl font-bold text-white mb-6">
          Step Into <span className="text-orange-500">Style</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
          Discover premium footwear from the world's leading brands. Your perfect pair is waiting.
        </p>
        <a 
          href="#products" 
          className="inline-block bg-orange-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-orange-600 transition"
        >
          Shop Now
        </a>
      </div>
    </section>
  );
}