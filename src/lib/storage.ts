import { CartItem, WishlistItem } from './types';

const CART_KEY = 'ecommerce_cart';
const WISHLIST_KEY = 'ecommerce_wishlist';

// Cart storage functions
export const getCartFromStorage = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  const cart = localStorage.getItem(CART_KEY);
  return cart ? JSON.parse(cart) : [];
};

export const saveCartToStorage = (cart: CartItem[]): void => {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

export const getWishlistFromStorage = (): WishlistItem[] => {
  if (typeof window === 'undefined') return [];
  const wishlist = localStorage.getItem(WISHLIST_KEY);
  return wishlist ? JSON.parse(wishlist) : [];
};

export const saveWishlistToStorage = (wishlist: WishlistItem[]): void => {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
};