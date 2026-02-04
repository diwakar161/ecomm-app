"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import ProductGrid from "@/components/ProductGrid";
import { fetchProducts } from "@/lib/api";
import { Product } from "@/lib/types";
import {
  FunnelIcon,
  AdjustmentsHorizontalIcon,
  StarIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [minRating, setMinRating] = useState<number>(0);

  // Sorting state
  const [sortBy, setSortBy] = useState<string>("default");
  const [showFilters, setShowFilters] = useState(false);

  // Get unique categories
  const categories = useMemo(() => {
    const categorySet = new Set(products.map((p) => p.category));
    return ["all", ...Array.from(categorySet)];
  }, [products]);

  // Fetch products
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchProducts();
        setProducts(data);

        // Set max price for range
        const maxPrice = Math.max(...data.map((p) => p.price));
        setPriceRange([0, Math.ceil(maxPrice)]);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load products",
        );
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Apply filters, sorting, and search
  useEffect(() => {
    let result = [...products];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (product) =>
          product.title.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query),
      );
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      result = result.filter(
        (product) =>
          product.category.toLowerCase() === selectedCategory.toLowerCase(),
      );
    }

    // Apply price filter
    result = result.filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1],
    );

    // Apply rating filter
    if (minRating > 0) {
      result = result.filter((product) => product.rating.rate >= minRating);
    }

    // Apply sorting
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating.rate - a.rating.rate);
        break;
      case "name-asc":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "name-desc":
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        // Default: keep original order
        break;
    }

    setFilteredProducts(result);
  }, [products, selectedCategory, priceRange, minRating, sortBy, searchQuery]);

  const handlePriceChange = (min: number, max: number) => {
    setPriceRange([min, max]);
  };

  const handleRatingChange = (rating: number) => {
    setMinRating(rating);
  };

  const resetAllFilters = () => {
    setSelectedCategory("all");
    setPriceRange([0, 1000]);
    setMinRating(0);
    setSortBy("default");
  };

  const clearSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    window.history.replaceState(null, "", `?${params.toString()}`);
  };

  // Simple loading skeleton inline
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse"
        >
          <div className="aspect-square w-full bg-gray-200"></div>
          <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-full"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            <div className="flex justify-between items-center">
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Handle loading state
  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Products</h1>
          <p className="text-gray-600 mt-2">Loading products...</p>
        </div>
        <LoadingSkeleton />
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded max-w-md mx-auto">
          <p className="font-bold">Error Loading Products</p>
          <p className="mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">All Products</h1>
        <p className="text-gray-600 mt-2">
          Showing {filteredProducts.length} of {products.length} products
          {searchQuery && (
            <span className="ml-2">
              for "<span className="font-semibold">{searchQuery}</span>"
            </span>
          )}
        </p>
      </div>

      {/* Search Results Header */}
      {searchQuery && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <MagnifyingGlassIcon className="h-5 w-5 text-blue-500 mr-2" />
              <span className="font-medium text-blue-800">
                Search results for: "{searchQuery}"
              </span>
              <span className="ml-2 text-sm text-blue-600">
                ({filteredProducts.length}{" "}
                {filteredProducts.length === 1 ? "result" : "results"})
              </span>
            </div>
            <button
              onClick={clearSearch}
              className="flex items-center text-sm text-blue-600 hover:text-blue-800"
            >
              <XMarkIcon className="h-4 w-4 mr-1" />
              Clear search
            </button>
          </div>
        </div>
      )}

      {/* Filters & Sorting Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Mobile filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center text-gray-700 hover:text-blue-600"
          >
            <FunnelIcon className="h-5 w-5 mr-2" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>

          {/* Category Filter */}
          <div className={`${showFilters ? "block" : "hidden md:block"}`}>
            <div className="flex items-center mb-2">
              <FunnelIcon className="h-5 w-5 text-gray-500 mr-2" />
              <h3 className="font-semibold">Filter by Category</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Sorting Dropdown */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <AdjustmentsHorizontalIcon className="h-5 w-5 text-gray-500 mr-2" />
              <span className="font-medium">Sort by:</span>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="default">Default</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Rating</option>
              <option value="name-asc">Name: A-Z</option>
              <option value="name-desc">Name: Z-A</option>
            </select>
          </div>
        </div>

        {/* Advanced Filters */}
        <div className={`mt-4 ${showFilters ? "block" : "hidden md:block"}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Price Range Filter */}
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Price Range</h4>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">${priceRange[0]}</span>
                <span className="text-sm text-gray-600">${priceRange[1]}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1000"
                step="10"
                value={priceRange[1]}
                onChange={(e) =>
                  handlePriceChange(priceRange[0], parseInt(e.target.value))
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>$0</span>
                <span>$500</span>
                <span>$1000</span>
              </div>
            </div>

            {/* Rating Filter */}
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Minimum Rating</h4>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => handleRatingChange(rating)}
                    className={`flex items-center px-3 py-1 rounded-lg ${
                      minRating === rating
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <StarIcon
                      className={`h-4 w-4 mr-1 ${minRating >= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                    />
                    <span>{rating}+</span>
                  </button>
                ))}
                <button
                  onClick={() => handleRatingChange(0)}
                  className="text-sm text-gray-600 hover:text-blue-600"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {(selectedCategory !== "all" ||
            minRating > 0 ||
            priceRange[1] < 1000 ||
            searchQuery) && (
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center flex-wrap gap-2">
                <span className="text-sm text-gray-600">Active filters:</span>

                {searchQuery && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                    Search: "{searchQuery}"
                    <button
                      onClick={clearSearch}
                      className="ml-2 text-purple-600 hover:text-purple-800"
                    >
                      ×
                    </button>
                  </span>
                )}

                {selectedCategory !== "all" && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                    Category: {selectedCategory}
                    <button
                      onClick={() => setSelectedCategory("all")}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                )}

                {minRating > 0 && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">
                    Rating: {minRating}+
                    <button
                      onClick={() => setMinRating(0)}
                      className="ml-2 text-yellow-600 hover:text-yellow-800"
                    >
                      ×
                    </button>
                  </span>
                )}

                {priceRange[1] < 1000 && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                    Price: ≤${priceRange[1]}
                    <button
                      onClick={() => setPriceRange([0, 1000])}
                      className="ml-2 text-green-600 hover:text-green-800"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-50 rounded-lg p-8">
            {searchQuery ? (
              <>
                <MagnifyingGlassIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">
                  No products found for "{searchQuery}"
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  Try different keywords or clear your search
                </p>
                <div className="space-x-3">
                  <button
                    onClick={clearSearch}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Clear search
                  </button>
                  <button
                    onClick={resetAllFilters}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Clear all filters
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-gray-500 mb-4">
                  No products found matching your criteria.
                </p>
                <button
                  onClick={resetAllFilters}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Clear all filters
                </button>
              </>
            )}
          </div>
        </div>
      ) : (
        <>
          <ProductGrid products={filteredProducts} />

          {/* Results Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <p className="text-gray-600">
                  Showing{" "}
                  <span className="font-semibold">
                    {filteredProducts.length}
                  </span>{" "}
                  products
                  {searchQuery && (
                    <span className="ml-2">
                      for "<span className="font-semibold">{searchQuery}</span>"
                    </span>
                  )}
                </p>
                {filteredProducts.length < products.length && (
                  <p className="text-sm text-gray-500 mt-1">
                    Filtered from {products.length} total products
                  </p>
                )}
              </div>

              <div className="mt-2 md:mt-0 space-x-4">
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="text-purple-600 hover:text-purple-800 font-medium"
                  >
                    Clear search
                  </button>
                )}
                {(selectedCategory !== "all" ||
                  minRating > 0 ||
                  priceRange[1] < 1000 ||
                  searchQuery) && (
                  <button
                    onClick={resetAllFilters}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Reset all filters
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
