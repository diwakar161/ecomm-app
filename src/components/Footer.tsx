export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">ShopNow</h3>
            <p className="text-gray-400 text-sm">
              Your one-stop shop for all your needs.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="/" className="hover:text-white transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/products"
                  className="hover:text-white transition-colors"
                >
                  Products
                </a>
              </li>
              <li>
                <a href="/cart" className="hover:text-white transition-colors">
                  Cart
                </a>
              </li>
              <li>
                <a
                  href="/wishlist"
                  className="hover:text-white transition-colors"
                >
                  Wishlist
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a
                  href="/products?category=electronics"
                  className="hover:text-white transition-colors"
                >
                  Electronics
                </a>
              </li>
              <li>
                <a
                  href="/products?category=jewelery"
                  className="hover:text-white transition-colors"
                >
                  Jewelry
                </a>
              </li>
              <li>
                <a
                  href="/products?category=men's clothing"
                  className="hover:text-white transition-colors"
                >
                  Men's Clothing
                </a>
              </li>
              <li>
                <a
                  href="/products?category=women's clothing"
                  className="hover:text-white transition-colors"
                >
                  Women's Clothing
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Email: support@shopnow.com</li>
              <li>Phone: (555) 123-4567</li>
              <li>Address: 123 Shop Street</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {currentYear} ShopNow. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
