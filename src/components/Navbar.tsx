// 'use client';

// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { useCart } from '@/components/CartProvider';
// import { useWishlist } from '@/components/WishlistProvider';
// import { ShoppingCartIcon, HeartIcon, HomeIcon } from '@heroicons/react/24/outline';

// export default function Navbar() {
//   const { getCartCount } = useCart();
//   const { getWishlistCount } = useWishlist();
//   const pathname = usePathname();
  
//   const cartCount = getCartCount();
//   const wishlistCount = getWishlistCount();

//   return (
//     <nav className="bg-white shadow-md">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-16">
//           <div className="flex items-center">
//             <Link href="/" className="text-2xl font-bold text-blue-600">
//               ShopNow
//             </Link>
//             <div className="hidden md:ml-10 md:flex md:space-x-8">
//               <Link 
//                 href="/" 
//                 className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
//                   pathname === '/' 
//                     ? 'text-blue-600 bg-blue-50' 
//                     : 'text-gray-700 hover:text-blue-600'
//                 }`}
//               >
//                 <HomeIcon className="h-4 w-4 mr-2" />
//                 Home
//               </Link>
//               <Link 
//                 href="/products" 
//                 className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
//                   pathname === '/products' 
//                     ? 'text-blue-600 bg-blue-50' 
//                     : 'text-gray-700 hover:text-blue-600'
//                 }`}
//               >
//                 Products
//               </Link>
//             </div>
//           </div>
          
//           <div className="flex items-center space-x-4">
//             <Link 
//               href="/wishlist" 
//               className="relative p-2 text-gray-700 hover:text-red-600 transition-colors"
//             >
//               <HeartIcon className="h-6 w-6" />
//               {wishlistCount > 0 && (
//                 <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
//                   {wishlistCount}
//                 </span>
//               )}
//             </Link>
            
//             <Link 
//               href="/cart" 
//               className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors"
//             >
//               <ShoppingCartIcon className="h-6 w-6" />
//               {cartCount > 0 && (
//                 <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
//                   {cartCount}
//                 </span>
//               )}
//             </Link>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// }

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/components/CartProvider';
import { useWishlist } from '@/components/WishlistProvider';
import { ShoppingCartIcon, HeartIcon, HomeIcon } from '@heroicons/react/24/outline';
import SearchBar from './SearchBar';

export default function Navbar() {
  const { getCartCount } = useCart();
  const { getWishlistCount } = useWishlist();
  const pathname = usePathname();
  
  const cartCount = getCartCount();
  const wishlistCount = getWishlistCount();

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between h-auto md:h-16 py-3 md:py-0">
          <div className="flex items-center justify-between md:justify-start">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              ShopNow
            </Link>
            
            <div className="md:hidden flex items-center space-x-4">
              <Link 
                href="/wishlist" 
                className="relative p-2 text-gray-700 hover:text-red-600 transition-colors"
              >
                <HeartIcon className="h-6 w-6" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              
              <Link 
                href="/cart" 
                className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <ShoppingCartIcon className="h-6 w-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Search Bar - Center on desktop */}
          <div className="mt-3 md:mt-0 md:flex-1 md:max-w-xl md:mx-6">
            <SearchBar />
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <div className="hidden md:flex md:space-x-8">
              <Link 
                href="/" 
                className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  pathname === '/' 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                <HomeIcon className="h-4 w-4 mr-2" />
                Home
              </Link>
              <Link 
                href="/products" 
                className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  pathname === '/products' 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                Products
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link 
                href="/wishlist" 
                className="relative p-2 text-gray-700 hover:text-red-600 transition-colors"
              >
                <HeartIcon className="h-6 w-6" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              
              <Link 
                href="/cart" 
                className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <ShoppingCartIcon className="h-6 w-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}