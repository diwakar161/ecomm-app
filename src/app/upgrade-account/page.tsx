// src/app/upgrade-account/page.tsx
'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ShieldExclamationIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/components/AuthProvider';

export default function UpgradeAccountPage() {
  const { user, logout } = useAuth();

  useEffect(() => {
    // Redirect if not a public member
    if (user && !user.role.includes('public')) {
      window.location.href = '/events';
    }
  }, [user]);

  const handleUpgrade = () => {
    // In a real app, this would redirect to payment/upgrade page
    alert('Redirecting to account upgrade page...');
    // For demo purposes, we'll simulate an upgrade
    setTimeout(() => {
      alert('Account upgraded successfully! You can now access all features.');
      logout();
    }, 1000);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center space-y-8">
        <div>
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-600 rounded-full mb-6">
            <ShieldExclamationIcon className="h-10 w-10" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Account Upgrade Required
          </h1>
          
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6 mb-8">
            <p className="text-gray-700 mb-3">
              Your current account type is <span className="font-bold text-yellow-700">Public Member</span>.
            </p>
            <p className="text-gray-600 text-sm">
              Public Members have limited access. Upgrade to a Member account to:
            </p>
            <ul className="text-left text-gray-600 text-sm mt-4 space-y-2">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                Access all events and webinars
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                Register for premium content
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                Network with other members
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                Get early access to new features
              </li>
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleUpgrade}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-4 rounded-xl font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl"
          >
            Upgrade to Member Account
          </button>
          
          <button
            onClick={logout}
            className="w-full border-2 border-gray-300 text-gray-700 px-6 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
          >
            Sign Out
          </button>
          
          <div className="pt-4">
            <Link
              href="/"
              className="inline-block text-blue-600 hover:text-blue-800 font-medium text-sm"
            >
              ← Back to Home Page
            </Link>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-200">
          <p className="text-gray-500 text-sm">
            Need help? <a href="mailto:support@example.com" className="text-blue-600 hover:underline">Contact support</a>
          </p>
        </div>
      </div>
    </div>
  );
}