import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'agrisaar_location';
const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/reverse';

const DEFAULT_LOCATION = {
  lat: 23.0225,
  lon: 72.5714,
  city: 'Ahmedabad',
  state: 'Gujarat',
  district: 'Ahmedabad',
  country: 'India',
  locationText: 'Ahmedabad, Gujarat'
};

export default function useLocation() {
  const [location, setLocation] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return { ...JSON.parse(saved), loading: false, error: null };
    } catch {}
    return { ...DEFAULT_LOCATION, loading: true, error: null };
  });

  const reverseGeocode = useCallback(async (lat, lon) => {
    try {
      const res = await fetch(
        `${NOMINATIM_URL}?lat=${lat}&lon=${lon}&format=json&accept-language=en&zoom=12`,
        { headers: { 'User-Agent': 'AgriSaar-SmartFarming/1.0' } }
      );
      if (!res.ok) throw new Error('Geocode failed');
      const data = await res.json();
      const addr = data.address || {};
      
      const city = addr.city || addr.town || addr.village || addr.county || addr.state_district || 'Unknown';
      const state = addr.state || 'Unknown';
      const district = addr.state_district || addr.county || city;
      const country = addr.country || 'India';

      return {
        lat,
        lon,
        city,
        state,
        district,
        country,
        locationText: `${city}, ${state}`
      };
    } catch (err) {
      console.warn('Reverse geocode failed:', err);
      return {
        lat,
        lon,
        city: 'Unknown',
        state: 'Unknown',
        district: 'Unknown',
        country: 'India',
        locationText: `${lat.toFixed(2)}°N, ${lon.toFixed(2)}°E`
      };
    }
  }, []);

  const detectLocation = useCallback(async () => {
    setLocation(prev => ({ ...prev, loading: true, error: null }));

    if (!navigator.geolocation) {
      const loc = { ...DEFAULT_LOCATION, loading: false, error: 'Geolocation not supported' };
      setLocation(loc);
      return;
    }

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 300000
        });
      });

      const { latitude: lat, longitude: lon } = position.coords;
      const geocoded = await reverseGeocode(lat, lon);
      const loc = { ...geocoded, loading: false, error: null };
      
      setLocation(loc);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(geocoded)); } catch {}
    } catch (err) {
      console.warn('Location detection failed:', err.message);
      const loc = { ...DEFAULT_LOCATION, loading: false, error: 'Location permission denied — using default' };
      setLocation(loc);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_LOCATION)); } catch {}
    }
  }, [reverseGeocode]);

  useEffect(() => {
    detectLocation();
  }, [detectLocation]);

  return {
    ...location,
    refresh: detectLocation
  };
}
