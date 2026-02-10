// src/app/events/page.tsx - COMPLETELY UPDATED
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import {
  CalendarIcon,
  MapPinIcon,
  UserGroupIcon,
  FunnelIcon,
  AdjustmentsHorizontalIcon,
  ClockIcon,
  BuildingOfficeIcon,
  MagnifyingGlassIcon,
  UsersIcon,
  TagIcon
} from '@heroicons/react/24/outline';

interface Event {
  id: number;
  title: string;
  description: string;
  event_type: string;
  mode_of_event: string;
  city: string;
  state: string;
  registration_type: string;
  who_can_register: string;
  event_date: string;
  start_time: string;
  end_time: string;
  registration_deadline: string;
  image_url?: string;
  brand_name: string;
  status?: string;
  price?: number;
  capacity?: number;
  registered_slots?: number;
  slots_left?: number;
  days_left?: number;
  user_data?: {
    company_name: string;
    name: string;
    company_logo?: string;
  };
}

interface Filters {
  event_type: string;
  mode_of_event: string;
  city: string;
  state: string;
  title: string;
  registration_type: string;
  who_can_register: string;
  start_date: string;
  end_date: string;
  my_events: boolean;
  my_events_status: string;
  schedule: string;
  q: string;
  brand_id: string;
  per_page: number;
  sort: string;
  page: number;
}

export default function EventsPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: 100
  });
  
  // Filter states
  const [filters, setFilters] = useState<Filters>({
    event_type: '',
    mode_of_event: '',
    city: '',
    state: '',
    title: '',
    registration_type: '',
    who_can_register: 'public_users_bob_members',
    start_date: '',
    end_date: '',
    my_events: false,
    my_events_status: '',
    schedule: '',
    q: '',
    brand_id: '',
    per_page: 100,
    sort: 'newest',
    page: 1
  });
  
  const [showFilters, setShowFilters] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    if (user.role === 'public_member') {
      router.push('/upgrade-account');
      return;
    }
    
    fetchEvents();
  }, [user, router, filters.page]);

  // Fetch events using proxy
  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get token from user object or localStorage
      const token = user?.token || localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required. Please login again.');
      }

      // Build query string from filters
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== '' && value !== false && value !== null && value !== undefined) {
          queryParams.set(key, value.toString());
        }
      });

      console.log('🔵 Fetching events through proxy...');
      console.log('🔵 Filters:', filters);
      
      // Use the Next.js API route as proxy
      const response = await fetch(
        `/api/events?${queryParams}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        }
      );

      console.log('🔵 Proxy response status:', response.status);

      if (response.status === 401) {
        // Token expired
        logout();
        router.push('/login');
        throw new Error('Session expired. Please login again.');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('🟢 API Response received');
      console.log('🟢 Response structure:', {
        hasData: !!data.data,
        hasNestedData: !!data.data?.data,
        status: data.status,
        message: data.message
      });

      if (!data.success && data.status !== 'success') {
        throw new Error(data.message || 'Failed to fetch events');
      }

      // Handle the ACTUAL API response structure
      let eventsData: any[] = [];
      
      if (data.data && data.data.data && Array.isArray(data.data.data)) {
        // This is the correct structure based on your API response
        eventsData = data.data.data;
        console.log(`🟢 Found ${eventsData.length} events in data.data.data`);
        
        // Update pagination info
        setPagination({
          current_page: data.data.current_page || 1,
          last_page: data.data.last_page || 1,
          total: data.data.total || eventsData.length,
          per_page: parseInt(data.data.per_page) || 100
        });
      } else if (data.data && Array.isArray(data.data)) {
        // Fallback structure
        eventsData = data.data;
        console.log(`🟢 Found ${eventsData.length} events in data.data`);
      } else if (Array.isArray(data)) {
        // Direct array response
        eventsData = data;
        console.log(`🟢 Found ${eventsData.length} events in root array`);
      } else {
        console.warn('⚠️ No events array found in response');
        eventsData = [];
      }

      // Transform API data to match our Event interface
      const transformedEvents: Event[] = eventsData.map((event: any) => ({
        id: event.id,
        title: event.title || 'Untitled Event',
        description: event.description || '',
        event_type: event.event_type || 'connect',
        mode_of_event: event.mode_of_event || 'online',
        city: event.city || 'Online',
        state: event.state || '',
        registration_type: event.registration_type || 'free',
        who_can_register: event.who_can_register || 'public_users_bob_members',
        event_date: event.event_date || '',
        start_time: event.start_time || '',
        end_time: event.end_time || '',
        registration_deadline: event.registration_deadline || '',
        image_url: event.thumbnail,
        brand_name: event.user_data?.company_name || 'Unknown Company',
        status: event.status,
        price: parseFloat(event.registration_fee || '0'),
        capacity: event.capacity,
        registered_slots: event.registered_slots,
        slots_left: event.slots_left,
        days_left: event.days_left,
        user_data: event.user_data
      }));

      console.log('🟢 Transformed events:', transformedEvents.length);
      console.log('🟢 Sample event:', transformedEvents[0]);
      setEvents(transformedEvents);
      setFilteredEvents(transformedEvents);

    } catch (err) {
      console.error('🔴 Error fetching events:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load events';
      setError(errorMessage);
      
      if (errorMessage.includes('Session expired') || errorMessage.includes('Authentication')) {
        setTimeout(() => {
          logout();
          router.push('/login');
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  // Apply local filters (search, etc.)
  useEffect(() => {
    let result = [...events];

    // Apply text search
    if (filters.q) {
      const query = filters.q.toLowerCase();
      result = result.filter(event =>
        event.title?.toLowerCase().includes(query) ||
        event.description?.toLowerCase().includes(query) ||
        event.city?.toLowerCase().includes(query) ||
        event.brand_name?.toLowerCase().includes(query) ||
        event.user_data?.company_name?.toLowerCase().includes(query)
      );
    }

    // Apply event type filter
    if (filters.event_type) {
      result = result.filter(event => event.event_type === filters.event_type);
    }

    // Apply mode filter
    if (filters.mode_of_event) {
      result = result.filter(event => event.mode_of_event === filters.mode_of_event);
    }

    // Apply city filter
    if (filters.city) {
      result = result.filter(event => 
        event.city?.toLowerCase() === filters.city.toLowerCase()
      );
    }

    // Apply registration type filter
    if (filters.registration_type) {
      result = result.filter(event => event.registration_type === filters.registration_type);
    }

    setFilteredEvents(result);
  }, [events, filters.q, filters.event_type, filters.mode_of_event, filters.city, filters.registration_type]);

  const handleFilterChange = (key: keyof Filters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      event_type: '',
      mode_of_event: '',
      city: '',
      state: '',
      title: '',
      registration_type: '',
      who_can_register: 'public_users_bob_members',
      start_date: '',
      end_date: '',
      my_events: false,
      my_events_status: '',
      schedule: '',
      q: '',
      brand_id: '',
      per_page: 100,
      sort: 'newest',
      page: 1
    });
  };

  const uniqueEventTypes = useMemo(() => {
    const types = events.map(event => event.event_type).filter(Boolean);
    return Array.from(new Set(types));
  }, [events]);

  const uniqueCities = useMemo(() => {
    const cities = events.map(event => event.city).filter(Boolean);
    return Array.from(new Set(cities));
  }, [events]);

  const uniqueModes = useMemo(() => {
    const modes = events.map(event => event.mode_of_event).filter(Boolean);
    return Array.from(new Set(modes));
  }, [events]);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'TBD';
    
    // Handle different date formats from API
    if (dateString.includes('Feb 2026') || dateString.includes('Mar 2026') || 
        dateString.includes('Apr 2026') || dateString.includes('May 2026')) {
      // Format: "28 Feb 2026"
      return dateString;
    }
    
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return dateString; // Return as-is if parsing fails
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.last_page) {
      handleFilterChange('page', newPage);
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">Loading events...</p>
        <p className="text-gray-400 text-sm mt-2">Fetching data from API...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-red-800 mb-2">Error Loading Events</h2>
          <p className="text-red-700 mb-4">{error}</p>
          <div className="flex space-x-3">
            <button 
              onClick={fetchEvents}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Try Again
            </button>
            <button 
              onClick={handleLogout}
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50"
            >
              Re-login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Events</h1>
          <p className="text-gray-600 mt-2">
            Welcome back, {user?.name}! 
            {filteredEvents.length > 0 ? (
              ` Showing ${filteredEvents.length} of ${pagination.total} events`
            ) : (
              ' No events found'
            )}
            {filters.q && ` for "${filters.q}"`}
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={handleLogout}
            className="text-sm text-gray-600 hover:text-gray-900 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={filters.q}
              onChange={(e) => handleFilterChange('q', e.target.value)}
              placeholder="Search events by title, description, city, or company..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <FunnelIcon className="h-5 w-5 mr-2" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center">
            <AdjustmentsHorizontalIcon className="h-5 w-5 text-gray-500 mr-2" />
            <select
              value={filters.sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title_asc">Title A-Z</option>
              <option value="title_desc">Title Z-A</option>
            </select>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter Events</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Event Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Type
                </label>
                <select
                  value={filters.event_type}
                  onChange={(e) => handleFilterChange('event_type', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Types</option>
                  {uniqueEventTypes.map(type => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Mode */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mode
                </label>
                <select
                  value={filters.mode_of_event}
                  onChange={(e) => handleFilterChange('mode_of_event', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Modes</option>
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                </select>
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <select
                  value={filters.city}
                  onChange={(e) => handleFilterChange('city', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Cities</option>
                  {uniqueCities.map(city => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              {/* Registration Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Registration Type
                </label>
                <select
                  value={filters.registration_type}
                  onChange={(e) => handleFilterChange('registration_type', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Types</option>
                  <option value="free">Free</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
            </div>

            {/* Filter Actions */}
            <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <button
                onClick={resetFilters}
                className="text-red-600 hover:text-red-800 font-medium px-4 py-2 border border-red-200 rounded-lg hover:bg-red-50"
              >
                Clear all filters
              </button>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowFilters(false)}
                  className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={fetchEvents}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl">
          <CalendarIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No events found</h3>
          <p className="text-gray-600 mb-6">
            Try adjusting your search or filters to find what you're looking for.
          </p>
          <button
            onClick={resetFilters}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <div key={event.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
                {/* Event Image */}
                <div className="h-48 bg-gradient-to-r from-blue-100 to-blue-200 relative overflow-hidden">
                  {event.image_url ? (
                    <img
                      src={event.image_url}
                      alt={event.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement?.classList.add('bg-gradient-to-r', 'from-blue-100', 'to-blue-200');
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <CalendarIcon className="h-16 w-16 text-blue-400" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      event.registration_type === 'free' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {event.registration_type === 'free' ? 'FREE' : 'PAID'}
                    </span>
                    {event.days_left !== undefined && (
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        event.days_left > 7 ? 'bg-green-100 text-green-800' :
                        event.days_left > 3 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {event.days_left} days left
                      </span>
                    )}
                  </div>
                </div>

                {/* Event Details */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1">
                      {event.title}
                    </h3>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {event.description || 'No description available'}
                  </p>

                  {/* Event Info */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm">
                      <BuildingOfficeIcon className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                      <span className="text-gray-700 truncate">
                        {event.user_data?.company_name || event.brand_name}
                      </span>
                    </div>

                    <div className="flex items-center text-sm">
                      <MapPinIcon className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                      <span className="text-gray-700">
                        {event.city || 'Online'}
                        {event.state && `, ${event.state}`}
                        {event.mode_of_event === 'online' && ' (Online)'}
                      </span>
                    </div>

                    <div className="flex items-center text-sm">
                      <TagIcon className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-700 capitalize">{event.event_type}</span>
                        <span className="text-gray-300">•</span>
                        <span className="text-gray-700 capitalize">{event.mode_of_event}</span>
                      </div>
                    </div>

                    <div className="flex items-center text-sm">
                      <ClockIcon className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                      <div className="flex flex-col">
                        <span className="text-gray-700">{formatDate(event.event_date)}</span>
                        {event.start_time && event.end_time && (
                          <span className="text-gray-500 text-xs mt-1">
                            {event.start_time} - {event.end_time}
                          </span>
                        )}
                      </div>
                    </div>

                    {event.capacity && (
                      <div className="flex items-center text-sm">
                        <UsersIcon className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                        <span className="text-gray-700">
                          {event.registered_slots || 0} / {event.capacity} registered
                          {event.slots_left !== undefined && ` (${event.slots_left} slots left)`}
                        </span>
                      </div>
                    )}

                    {event.registration_deadline && (
                      <div className="flex items-center text-sm">
                        <CalendarIcon className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                        <span className="text-gray-700 text-xs">
                          Register by: {formatDate(event.registration_deadline)}
                        </span>
                      </div>
                    )}
                  </div>

                  <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    Register Now
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.total > 0 && pagination.last_page > 1 && (
            <div className="flex justify-center items-center space-x-4 pt-8">
              <button
                onClick={() => handlePageChange(pagination.current_page - 1)}
                disabled={pagination.current_page === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="text-gray-700">
                Page {pagination.current_page} of {pagination.last_page}
              </span>
              <button
                onClick={() => handlePageChange(pagination.current_page + 1)}
                disabled={pagination.current_page === pagination.last_page}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}