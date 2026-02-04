"use client";

import Link from "next/link";
import Image from "next/image";
import { useWishlist } from "@/components/WishlistProvider";
import { useCart } from "@/components/CartProvider";
import {
  HeartIcon,
  ShoppingCartIcon,
  TrashIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { Product } from "@/lib/types";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (product: Product) => {
    addToCart({ ...product, quantity: 1 });
  };

  if (wishlist.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-50 rounded-lg p-8">
          <HeartIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Your wishlist is empty
          </h2>
          <p className="text-gray-600 mb-6">
            Save your favorite products here!
          </p>
          <Link
            href="/products"
            className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="px-8 py-6 border-b">
        <div className="flex items-center">
          <HeartIconSolid className="h-8 w-8 text-red-500 mr-3" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
            <p className="text-gray-600 mt-1">{wishlist.length} items saved</p>
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((product) => (
            <div key={product.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
              <div className="relative h-48 w-full mb-4">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>

              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <Link href={`/products/${product.id}`}>
                    <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 hover:text-blue-600 transition-colors">
                      {product.title}
                    </h3>
                  </Link>
                  <p className="text-lg font-bold text-gray-900">
                    ${product.price.toFixed(2)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeFromWishlist(product.id)}
                  className="text-red-600 hover:text-red-800 ml-2 p-1"
                  aria-label={`Remove ${product.title} from wishlist`}
                  title="Remove from wishlist"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-4 flex space-x-2">
                <button
                  type="button"
                  onClick={() => handleAddToCart(product)}
                  className="flex-1 flex items-center justify-center bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                  aria-label={`Add ${product.title} to cart`}
                  title="Add to cart"
                >
                  <ShoppingCartIcon className="h-4 w-4 mr-1" />
                  Add to Cart
                </button>
                
                <Link
                  href={`/products/${product.id}`}
                  className="flex items-center justify-center border border-gray-300 text-gray-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
                  aria-label={`View details for ${product.title}`}
                  title="View details"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t">
          <div className="flex justify-between items-center">
            <p className="text-gray-600">
              You have {wishlist.length} item{wishlist.length !== 1 ? 's' : ''} in your wishlist
            </p>
            <Link
              href="/products"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}