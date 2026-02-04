'use client';

import { useCart } from './CartProvider';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';

interface AddToCartButtonProps {
  product: any;
  quantity?: number;
  className?: string;
}

export default function AddToCartButton({ 
  product, 
  quantity = 1,
  className = ''
}: AddToCartButtonProps) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({ ...product, quantity });
  };

  return (
    <button
      onClick={handleAddToCart}
      className={`flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors ${className}`}
    >
      <ShoppingCartIcon className="h-5 w-5 mr-2" />
      Add to Cart
    </button>
  );
}