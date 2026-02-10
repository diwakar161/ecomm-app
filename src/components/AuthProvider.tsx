// src/components/AuthProvider.tsx - UPDATED
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'member' | 'public_member' | 'admin';
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
  debugData: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugData, setDebugData] = useState<any>(null);
  const router = useRouter();

  // Check for saved session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    
    if (savedUser && savedToken) {
      try {
        const parsedUser = JSON.parse(savedUser);
        const userWithToken = { ...parsedUser, token: savedToken };
        setUser(userWithToken);
        console.log('Loaded user from localStorage:', userWithToken);
      } catch (err) {
        console.error('Error parsing saved user:', err);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    setDebugData(null);

    try {
      console.log('🔵 Login attempt with:', { email });
      
      const loginData = {
        email: email.trim(),
        password: password.trim(),
        type: "password" // Add type field
      };

      console.log('🔵 Sending login request through proxy...');
      console.log('🔵 Request data:', loginData);
      
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      console.log('🔵 Proxy response status:', response.status);
      
      const data = await response.json();
      console.log('🔵 Full API Response:', data);

      // Save debug data
      setDebugData({
        request: loginData,
        response: data,
        status: response.status,
      });

      if (!response.ok) {
        console.error('🔴 Login failed:', data);
        
        // Provide more specific error messages
        let errorMessage = data.message || `Login failed with status: ${response.status}`;
        
        if (data.errors) {
          // Handle field-specific errors
          const errorDetails = Object.entries(data.errors)
            .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
            .join('; ');
          errorMessage = `Validation errors: ${errorDetails}`;
        }
        
        throw new Error(errorMessage);
      }

      if (!data.success) {
        console.error('🔴 API returned success: false', data);
        throw new Error(data.message || 'Login failed. Please check your credentials.');
      }

      console.log('🟢 Login successful, parsing data...');
      console.log('📊 Response structure:', {
        dataKeys: data.data ? Object.keys(data.data) : 'No data',
        rootKeys: Object.keys(data)
      });

      let userData: User;

      // Based on common API response patterns
      if (data.data) {
        const apiData = data.data;
        
        // Try to extract user info from different possible structures
        const extractedUser = apiData.user || apiData;
        const token = apiData.token || apiData.access_token || data.token;
        
        userData = {
          id: String(extractedUser.id || extractedUser.user_id || '0'),
          email: extractedUser.email || email,
          name: extractedUser.name || extractedUser.username || email.split('@')[0],
          role: mapRole(extractedUser.role || extractedUser.user_type || 'public_member'),
          token: token || 'demo-token',
        };
        
        console.log('🟢 Using data structure:', apiData);
      } else if (data.user) {
        // Direct user structure
        userData = {
          id: String(data.user.id || '0'),
          email: data.user.email || email,
          name: data.user.name || data.user.username || email.split('@')[0],
          role: mapRole(data.user.role || 'public_member'),
          token: data.token || data.access_token || 'demo-token',
        };
        console.log('🟢 Using direct user structure');
      } else {
        // Fallback to root level data
        userData = {
          id: String(data.id || data.user_id || '0'),
          email: data.email || email,
          name: data.name || data.username || email.split('@')[0],
          role: mapRole(data.role || data.user_type || 'public_member'),
          token: data.token || data.access_token || 'demo-token',
        };
        console.log('🟢 Using root structure');
      }

      console.log('🟢 Parsed user data:', userData);

      // Validate required fields
      if (!userData.token || userData.token === 'demo-token') {
        console.warn('⚠️ No token received from API');
        // You might want to handle this differently based on your needs
      }

      // Save user data and token separately
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', userData.token);
      
      setUser(userData);

      // Redirect based on role
      console.log('🟢 User role:', userData.role);
      if (userData.role === 'member') {
        console.log('🟢 Redirecting to /events');
        router.push('/events');
      } else if (userData.role === 'public_member') {
        console.log('🟢 Redirecting to /upgrade-account');
        router.push('/upgrade-account');
      } else {
        console.log('🟢 Redirecting to /dashboard');
        router.push('/dashboard');
      }

    } catch (err) {
      console.error('🔴 Login error details:', err);
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Network error. Please check your connection and try again.';
      
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to map role
  const mapRole = (role: any): 'member' | 'public_member' | 'admin' => {
    if (!role) return 'public_member';
    
    const roleStr = String(role).toLowerCase().trim();
    
    if (roleStr.includes('admin')) return 'admin';
    if (roleStr.includes('member')) return 'member';
    if (roleStr.includes('public')) return 'public_member';
    
    // Try to match common role patterns from your API
    if (roleStr.includes('bob')) return 'member'; // Assuming "bob" refers to member
    if (['user', 'customer', 'subscriber', 'basic'].includes(roleStr)) return 'public_member';
    
    return 'member'; // Default to member
  };

  const logout = () => {
    console.log('🔵 Logging out user');
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, error, debugData }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}