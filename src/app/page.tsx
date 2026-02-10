// import ProductGrid from '@/components/ProductGrid';
// import { fetchProducts } from '@/lib/api';
// import { ArrowRightIcon, TruckIcon, ShieldCheckIcon, CreditCardIcon } from '@heroicons/react/24/outline';
// import Link from 'next/link';
// import { Product } from '@/lib/types';

// export default async function HomePage() {
//   let products: Product[] = [];
//   let error = null;

//   try {
//     products = await fetchProducts();
//   } catch (err) {
//     error = err instanceof Error ? err.message : 'Failed to load products';
//   }

//   const featuredProducts = products.slice(0, 8);

//   return (
//     <div className="space-y-12">
//       {/* Hero Section */}
//       <section className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white">
//         <div className="max-w-3xl">
//           <h1 className="text-4xl md:text-5xl font-bold mb-4">
//             Welcome to ShopNow
//           </h1>
//           <p className="text-xl mb-8 text-blue-100">
//             Discover amazing products at unbeatable prices
//           </p>
//           <div className="flex flex-wrap gap-4">
//             <Link 
//               href="/products" 
//               className="inline-flex items-center bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
//             >
//               Shop Now
//               <ArrowRightIcon className="ml-2 h-5 w-5" />
//             </Link>
//           </div>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <div className="bg-white rounded-lg shadow-sm p-6 text-center">
//           <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-full mb-4">
//             <TruckIcon className="h-6 w-6" />
//           </div>
//           <h3 className="text-lg font-semibold mb-2">Free Shipping</h3>
//           <p className="text-gray-600">On orders over $50</p>
//         </div>
        
//         <div className="bg-white rounded-lg shadow-sm p-6 text-center">
//           <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-full mb-4">
//             <ShieldCheckIcon className="h-6 w-6" />
//           </div>
//           <h3 className="text-lg font-semibold mb-2">Secure Payment</h3>
//           <p className="text-gray-600">100% secure payment</p>
//         </div>
        
//         <div className="bg-white rounded-lg shadow-sm p-6 text-center">
//           <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-full mb-4">
//             <CreditCardIcon className="h-6 w-6" />
//           </div>
//           <h3 className="text-lg font-semibold mb-2">Easy Returns</h3>
//           <p className="text-gray-600">30-day return policy</p>
//         </div>
//       </section>

//       {/* Featured Products */}
//       <section>
//         <div className="flex items-center justify-between mb-6">
//           <div>
//             <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
//             <p className="text-gray-600 mt-1">Handpicked selections</p>
//           </div>
//           <Link 
//             href="/products" 
//             className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
//           >
//             View All
//             <ArrowRightIcon className="ml-1 h-4 w-4" />
//           </Link>
//         </div>

//         {error ? (
//           <div className="bg-white rounded-lg shadow-sm p-8 text-center">
//             <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
//               <p className="font-bold">Error Loading Products</p>
//               <p>{error}</p>
//             </div>
//           </div>
//         ) : featuredProducts.length === 0 ? (
//           <div className="bg-white rounded-lg shadow-sm p-8 text-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//             <p className="mt-4 text-gray-600">Loading products...</p>
//           </div>
//         ) : (
//           <ProductGrid products={featuredProducts} />
//         )}
//       </section>
//     </div>
//   );
// }



// src/app/page.tsx
'use client';

import ProductGrid from '@/components/ProductGrid';
import { ArrowRightIcon, TruckIcon, ShieldCheckIcon, CreditCardIcon, CalendarIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import { useEffect, useState } from 'react';

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Using a public product API as example
        const response = await fetch('https://fakestoreapi.com/products?limit=8');
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const featuredProducts = products.slice(0, 8);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-purple-800 rounded-2xl p-8 md:p-12 text-white">
        <div className="relative z-10 max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Welcome to{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-orange-300">
              ShopNow
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl">
            Your one-stop destination for amazing products and exclusive events
          </p>
          <div className="flex flex-wrap gap-4">
            <Link 
              href="/products" 
              className="inline-flex items-center bg-white text-blue-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all transform hover:-translate-y-1 shadow-lg"
            >
              Shop Products
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
            
            {user?.role === 'member' ? (
              <Link 
                href="/events" 
                className="inline-flex items-center bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl font-bold hover:from-green-600 hover:to-emerald-700 transition-all transform hover:-translate-y-1 shadow-lg"
              >
                <CalendarIcon className="mr-2 h-5 w-5" />
                View Events
              </Link>
            ) : user?.role === 'public_member' ? (
              <Link 
                href="/upgrade-account" 
                className="inline-flex items-center bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-4 rounded-xl font-bold hover:from-yellow-600 hover:to-orange-600 transition-all transform hover:-translate-y-1 shadow-lg"
              >
                Upgrade Account
              </Link>
            ) : (
              <Link 
                href="/login" 
                className="inline-flex items-center bg-gradient-to-r from-purple-500 to-pink-600 text-white px-8 py-4 rounded-xl font-bold hover:from-purple-600 hover:to-pink-700 transition-all transform hover:-translate-y-1 shadow-lg"
              >
                <UserGroupIcon className="mr-2 h-5 w-5" />
                Join Events
              </Link>
            )}
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-white/5 to-transparent rounded-full translate-y-24 -translate-x-24"></div>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow border border-gray-100">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-xl mb-4">
            <TruckIcon className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Free Shipping</h3>
          <p className="text-gray-600">On orders over $50</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow border border-gray-100">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 text-green-600 rounded-xl mb-4">
            <ShieldCheckIcon className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Secure Payment</h3>
          <p className="text-gray-600">100% secure payment</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow border border-gray-100">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 text-purple-600 rounded-xl mb-4">
            <CreditCardIcon className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Easy Returns</h3>
          <p className="text-gray-600">30-day return policy</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow border border-gray-100">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 text-orange-600 rounded-xl mb-4">
            <CalendarIcon className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Exclusive Events</h3>
          <p className="text-gray-600">Member-only access</p>
        </div>
      </div>

      {/* Featured Products Section */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Featured Products</h2>
            <p className="text-gray-600 mt-2">Handpicked selections for you</p>
          </div>
          <Link 
            href="/products" 
            className="mt-4 sm:mt-0 inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold px-4 py-2 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
          >
            View All Products
            <ArrowRightIcon className="ml-2 h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="py-16 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
            <div className="text-red-600">
              <p className="font-bold text-lg">Error Loading Products</p>
              <p className="mt-2">{error}</p>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        ) : featuredProducts.length === 0 ? (
          <div className="py-16 text-center">
            <div className="text-gray-400">
              <CalendarIcon className="h-16 w-16 mx-auto mb-4" />
              <p className="text-xl">No products available</p>
              <p className="text-gray-500 mt-2">Check back soon for new arrivals</p>
            </div>
          </div>
        ) : (
          <ProductGrid products={featuredProducts} />
        )}
      </section>

      {/* Events CTA Section (for non-members) */}
      {!user && (
        <section className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            <div className="lg:w-2/3 p-8 lg:p-12 text-white">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Unlock Exclusive Events
              </h2>
              <p className="text-gray-300 mb-6 max-w-2xl">
                Join our community to access premium events, webinars, and networking opportunities. 
                Connect with industry leaders and grow your network.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-bold">✓</span>
                  </div>
                  <span>Access to premium events and webinars</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-bold">✓</span>
                  </div>
                  <span>Network with industry professionals</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-bold">✓</span>
                  </div>
                  <span>Early access to new product launches</span>
                </div>
              </div>
              <div className="mt-8">
                <Link
                  href="/login"
                  className="inline-flex items-center bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl font-bold hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg"
                >
                  Join Now - It&apos;s Free!
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
            <div className="lg:w-1/3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-8 flex items-center justify-center">
              <div className="text-center">
                <CalendarIcon className="h-24 w-24 text-white/30 mx-auto mb-4" />
                <p className="text-white/80 font-medium">Member Exclusive</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* For Members - Quick Event Access */}
      {user?.role === 'member' && (
        <section className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl p-8 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                Ready for Your Next Event?
              </h2>
              <p className="text-emerald-100">
                Browse upcoming events and register today
              </p>
            </div>
            <Link
              href="/events"
              className="mt-6 md:mt-0 inline-flex items-center bg-white text-emerald-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all transform hover:-translate-y-1 shadow-lg"
            >
              <CalendarIcon className="mr-2 h-5 w-5" />
              Explore Events
            </Link>
          </div>
        </section>
      )}

      {/* For Public Members - Upgrade CTA */}
      {user?.role === 'public_member' && (
        <section className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 rounded-2xl p-8 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                Upgrade Your Account
              </h2>
              <p className="text-yellow-100">
                Unlock full access to premium events and features
              </p>
            </div>
            <Link
              href="/upgrade-account"
              className="mt-6 md:mt-0 inline-flex items-center bg-white text-orange-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all transform hover:-translate-y-1 shadow-lg"
            >
              Upgrade Now
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}