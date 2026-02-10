// src/components/Navbar.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { useCart } from '@/components/CartProvider';
import { useWishlist } from '@/components/WishlistProvider';
import {
  ShoppingCartIcon,
  HeartIcon,
  UserIcon,
  ChevronDownIcon,
  CalendarIcon,
  HomeIcon,
  Squares2X2Icon,
  InformationCircleIcon,
  PhoneIcon,
  ArrowRightOnRectangleIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { getTotalItems } = useCart();
  const { getWishlistCount } = useWishlist();

  const cartCount = getTotalItems();
  const wishlistCount = getWishlistCount();

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`);
  };

  const navItems = [
    { name: 'Home', href: '/', icon: <HomeIcon className="h-5 w-5" /> },
    { name: 'Products', href: '/products', icon: <Squares2X2Icon className="h-5 w-5" /> },
    { name: 'Categories', href: '/categories', icon: null },
    ...(user && user.role === 'member' ? [
      { name: 'Events', href: '/events', icon: <CalendarIcon className="h-5 w-5" /> }
    ] : []),
    { name: 'About', href: '/about', icon: <InformationCircleIcon className="h-5 w-5" /> },
    { name: 'Contact', href: '/contact', icon: <PhoneIcon className="h-5 w-5" /> },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <nav className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between h-auto md:h-16 py-3 md:py-0">
          
          {/* Logo + Mobile Icons */}
          <div className="flex items-center justify-between md:justify-start">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg"></div>
              <span className="text-xl font-bold text-gray-900">ShopNow</span>
            </Link>

            {/* Mobile Icons */}
            <div className="md:hidden flex items-center space-x-4">
              {user?.role === 'member' && (
                <Link 
                  href="/events" 
                  className="p-2 text-gray-600 hover:text-blue-600 rounded-full hover:bg-gray-100"
                >
                  <CalendarIcon className="h-6 w-6" />
                </Link>
              )}

              <Link 
                href="/wishlist" 
                className="relative p-2 text-gray-600 hover:text-red-600 rounded-full hover:bg-gray-100"
              >
                <HeartIcon className="h-6 w-6" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <Link 
                href="/cart" 
                className="relative p-2 text-gray-600 hover:text-blue-600 rounded-full hover:bg-gray-100"
              >
                <ShoppingCartIcon className="h-6 w-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-3 md:mt-0 md:flex-1 md:max-w-xl md:mx-6">
            <form onSubmit={handleSearch} className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </form>
          </div>

          {/* Desktop Menu & Actions */}
          <div className="hidden md:flex items-center space-x-6">
            
            {/* Navigation Links */}
            <div className="flex space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive(item.href)
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  {item.icon && <span>{item.icon}</span>}
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* User Menu */}
              <div className="relative">
                {user ? (
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {user.name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
                    </div>
                    <div className="hidden lg:block text-left">
                      <p className="text-sm font-medium">{user.name?.split(' ')[0] || user.email.split('@')[0]}</p>
                      <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                    </div>
                    <ChevronDownIcon className="h-4 w-4" />
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className="flex items-center space-x-2 p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                  >
                    <UserIcon className="h-6 w-6" />
                    <span className="text-sm font-medium">Sign In</span>
                  </Link>
                )}

                {/* User Dropdown Menu */}
                {isUserMenuOpen && user && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user.name || user.email}</p>
                      <p className="text-xs text-gray-500 capitalize mt-1">{user.role} Account</p>
                    </div>
                    
                    <Link
                      href="/dashboard"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <UserIcon className="h-4 w-4 mr-3 text-gray-500" />
                      Dashboard
                    </Link>
                    
                    {user.role === 'member' && (
                      <Link
                        href="/events"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <CalendarIcon className="h-4 w-4 mr-3 text-gray-500" />
                        Events
                      </Link>
                    )}
                    
                    {user.role === 'public_member' && (
                      <Link
                        href="/upgrade-account"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <div className="h-4 w-4 mr-3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded"></div>
                        Upgrade Account
                      </Link>
                    )}
                    
                    <div className="border-t border-gray-100 my-1"></div>
                    
                    <button
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <ArrowRightOnRectangleIcon className="h-4 w-4 mr-3" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="relative p-2 text-gray-600 hover:text-red-600 rounded-full hover:bg-gray-100"
                title="Wishlist"
              >
                <HeartIcon className="h-6 w-6" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                className="relative p-2 text-gray-600 hover:text-blue-600 rounded-full hover:bg-gray-100"
                title="Cart"
              >
                <ShoppingCartIcon className="h-6 w-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg self-start"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            {/* Mobile Navigation Links */}
            <div className="space-y-1 mb-6">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-3 text-base font-medium rounded-lg ${
                    isActive(item.href)
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.icon && <span className="text-gray-400">{item.icon}</span>}
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>

            {/* Mobile User Section */}
            <div className="border-t border-gray-200 pt-4">
              {user ? (
                <>
                  <div className="px-3 py-2 mb-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-base font-medium">
                        {user.name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.name || user.email}</p>
                        <p className="text-sm text-gray-500 capitalize">{user.role} Account</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Link
                      href="/dashboard"
                      className="flex items-center space-x-3 px-3 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <UserIcon className="h-5 w-5 text-gray-400" />
                      <span>Dashboard</span>
                    </Link>

                    {user.role === 'member' && (
                      <Link
                        href="/events"
                        className="flex items-center space-x-3 px-3 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <CalendarIcon className="h-5 w-5 text-gray-400" />
                        <span>Events</span>
                      </Link>
                    )}

                    {user.role === 'public_member' && (
                      <Link
                        href="/upgrade-account"
                        className="flex items-center space-x-3 px-3 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <div className="h-5 w-5 bg-gradient-to-r from-yellow-400 to-orange-400 rounded"></div>
                        <span>Upgrade Account</span>
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center w-full text-left space-x-3 px-3 py-3 text-base font-medium text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <ArrowRightOnRectangleIcon className="h-5 w-5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center justify-center space-x-2 w-full bg-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <UserIcon className="h-5 w-5" />
                  <span>Sign In</span>
                </Link>
              )}
            </div>

            {/* Mobile Quick Actions */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              <Link
                href="/wishlist"
                className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                <HeartIcon className="h-6 w-6 text-red-500 mb-2" />
                <span className="text-sm font-medium">Wishlist</span>
                {wishlistCount > 0 && (
                  <span className="mt-1 text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                    {wishlistCount} items
                  </span>
                )}
              </Link>

              <Link
                href="/cart"
                className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                <ShoppingCartIcon className="h-6 w-6 text-blue-500 mb-2" />
                <span className="text-sm font-medium">Cart</span>
                {cartCount > 0 && (
                  <span className="mt-1 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                    {cartCount} items
                  </span>
                )}
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}