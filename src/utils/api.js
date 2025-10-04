const OPEN_CHARGE_MAP_API = 'https://api.openchargemap.io/v3/poi';
const API_KEY = 'YOUR_API_KEY_HERE'; // Optional - works without key but with rate limits

export async function fetchNearbyStations(latitude, longitude, maxResults = 50, distance = 25) {
  try {
    const params = new URLSearchParams({
      output: 'json',
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      distance: distance.toString(),
      maxresults: maxResults.toString(),
      compact: 'true',
      verbose: 'false',
    });

    if (API_KEY && API_KEY !== 'YOUR_API_KEY_HERE') {
      params.append('key', API_KEY);
    }

    const response = await fetch(`${OPEN_CHARGE_MAP_API}?${params}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return transformStationData(data);
  } catch (error) {
    console.error('Error fetching stations:', error);
    throw error;
  }
}

export async function fetchStationById(stationId) {
  try {
    const response = await fetch(`${OPEN_CHARGE_MAP_API}?output=json&chargepointid=${stationId}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.length > 0 ? transformStationData([data[0]])[0] : null;
  } catch (error) {
    console.error('Error fetching station:', error);
    throw error;
  }
}

function transformStationData(rawData) {
  return rawData.map(station => {
    const connections = station.Connections || [];
    const fastCharger = connections.some(c => 
      c.PowerKW && c.PowerKW >= 50
    );
    
    const level2Charger = connections.some(c => 
      c.Level && (c.Level.ID === 2 || c.Level.Title?.includes('Level 2'))
    );

    // Determine availability status
    let status = 'unknown';
    if (station.StatusType) {
      const statusId = station.StatusType.ID;
      if (statusId === 50) status = 'available'; // Operational
      else if (statusId === 0 || statusId === 100) status = 'occupied'; // Unknown or Temporarily Unavailable
      else status = 'unknown';
    }

    return {
      id: station.ID,
      name: station.AddressInfo?.Title || 'Unnamed Station',
      address: formatAddress(station.AddressInfo),
      latitude: station.AddressInfo?.Latitude,
      longitude: station.AddressInfo?.Longitude,
      distance: station.AddressInfo?.Distance || 0,
      status: status,
      chargerTypes: {
        level2: level2Charger,
        dcFast: fastCharger,
      },
      connections: connections.map(c => ({
        type: c.ConnectionType?.Title || 'Unknown',
        powerKW: c.PowerKW || 0,
        quantity: c.Quantity || 1,
        level: c.Level?.Title || 'Unknown',
      })),
      operator: station.OperatorInfo?.Title || 'Unknown',
      usageCost: station.UsageCost || 'Unknown',
      numberOfPoints: station.NumberOfPoints || connections.length,
      lastUpdated: station.DateLastStatusUpdate || station.DateLastVerified || null,
    };
  });
}

function formatAddress(addressInfo) {
  if (!addressInfo) return 'Address unavailable';
  
  const parts = [
    addressInfo.AddressLine1,
    addressInfo.Town,
    addressInfo.StateOrProvince,
    addressInfo.Postcode,
  ].filter(Boolean);
  
  return parts.join(', ') || 'Address unavailable';
}

// Calculate distance between two coordinates (Haversine formula)
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
}

function toRad(degrees) {
  return degrees * (Math.PI / 180);
}

// Mock data for offline/demo mode
export function getMockStations(latitude, longitude) {
  return [
    {
      id: 'mock-1',
      name: 'Downtown EV Hub',
      address: '123 Main St, City Center',
      latitude: latitude + 0.01,
      longitude: longitude + 0.01,
      distance: 1.2,
      status: 'available',
      chargerTypes: { level2: true, dcFast: true },
      connections: [
        { type: 'CCS', powerKW: 150, quantity: 2, level: 'DC Fast' },
        { type: 'CHAdeMO', powerKW: 50, quantity: 1, level: 'DC Fast' },
      ],
      operator: 'ChargePoint',
      usageCost: '$0.35/kWh',
      numberOfPoints: 3,
      lastUpdated: new Date().toISOString(),
    },
    {
      id: 'mock-2',
      name: 'Shopping Mall Chargers',
      address: '456 Commerce Blvd',
      latitude: latitude - 0.02,
      longitude: longitude + 0.015,
      distance: 2.5,
      status: 'occupied',
      chargerTypes: { level2: true, dcFast: false },
      connections: [
        { type: 'J1772', powerKW: 7.2, quantity: 4, level: 'Level 2' },
      ],
      operator: 'EVgo',
      usageCost: 'Free',
      numberOfPoints: 4,
      lastUpdated: new Date().toISOString(),
    },
    {
      id: 'mock-3',
      name: 'Highway Rest Stop',
      address: 'Interstate 95, Mile Marker 42',
      latitude: latitude + 0.03,
      longitude: longitude - 0.02,
      distance: 4.1,
      status: 'available',
      chargerTypes: { level2: false, dcFast: true },
      connections: [
        { type: 'CCS', powerKW: 350, quantity: 4, level: 'DC Ultra Fast' },
      ],
      operator: 'Electrify America',
      usageCost: '$0.43/kWh',
      numberOfPoints: 4,
      lastUpdated: new Date().toISOString(),
    },
  ];
}
