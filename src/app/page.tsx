import ProductGrid from '@/components/ProductGrid';
import { fetchProducts } from '@/lib/api';
import { ArrowRightIcon, TruckIcon, ShieldCheckIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Product } from '@/lib/types';

export default async function HomePage() {
  let products: Product[] = [];
  let error = null;

  try {
    products = await fetchProducts();
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load products';
  }

  const featuredProducts = products.slice(0, 8);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome to ShopNow
          </h1>
          <p className="text-xl mb-8 text-blue-100">
            Discover amazing products at unbeatable prices
          </p>
          <div className="flex flex-wrap gap-4">
            <Link 
              href="/products" 
              className="inline-flex items-center bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Shop Now
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-full mb-4">
            <TruckIcon className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Free Shipping</h3>
          <p className="text-gray-600">On orders over $50</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-full mb-4">
            <ShieldCheckIcon className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Secure Payment</h3>
          <p className="text-gray-600">100% secure payment</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-full mb-4">
            <CreditCardIcon className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Easy Returns</h3>
          <p className="text-gray-600">30-day return policy</p>
        </div>
      </section>

      {/* Featured Products */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
            <p className="text-gray-600 mt-1">Handpicked selections</p>
          </div>
          <Link 
            href="/products" 
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
          >
            View All
            <ArrowRightIcon className="ml-1 h-4 w-4" />
          </Link>
        </div>

        {error ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              <p className="font-bold">Error Loading Products</p>
              <p>{error}</p>
            </div>
          </div>
        ) : featuredProducts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        ) : (
          <ProductGrid products={featuredProducts} />
        )}
      </section>
    </div>
  );
}