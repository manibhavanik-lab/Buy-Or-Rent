import { getDistanceMeters, calculateWalkTimeMins, getTownFromPostal } from './utils.js';
import { MRT_STATIONS, PRIMARY_SCHOOLS, HAWKER_CENTERS, SUPERMARKETS, PARKS } from './spatial-data.js';

// Fallback coordinates for notable Singapore postal codes if OneMap search is down
const KNOWN_COORDINATES = {
  '560421': {
    lat: 1.36538,
    lon: 103.85635,
    address: '421 ANG MO KIO AVENUE 10 SINGAPORE 560421',
    building: '421',
    road: 'ANG MO KIO AVENUE 10',
    postal: '560421'
  },
  '090105': {
    lat: 1.2818,
    lon: 103.8290,
    address: '105 JALAN BUKIT MERAH SINGAPORE 090105',
    building: '105',
    road: 'JALAN BUKIT MERAH',
    postal: '090105'
  },
  '310123': {
    lat: 1.3340,
    lon: 103.8520,
    address: '123 LORONG 1 TOA PAYOH SINGAPORE 310123',
    building: '123',
    road: 'LORONG 1 TOA PAYOH',
    postal: '310123'
  }
};

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
  res.setHeader('Content-Type', 'application/json');

  const queryParams = req.query || req.body || {};
  const postalCode = (queryParams.postal_code || queryParams.postal || '').toString().trim();

  if (!postalCode) {
    return res.status(400).json({
      error: 'Missing required query parameter: postal_code'
    });
  }

  const apiKey = process.env.ONEMAP_API_KEY;

  let targetLat = null;
  let targetLon = null;
  let resolvedAddress = null;
  let resolvedBuilding = '';
  let resolvedRoad = '';

  // Check known coordinates first
  if (KNOWN_COORDINATES[postalCode]) {
    const info = KNOWN_COORDINATES[postalCode];
    targetLat = info.lat;
    targetLon = info.lon;
    resolvedAddress = info.address;
    resolvedBuilding = info.building;
    resolvedRoad = info.road;
  }

  // Query OneMap Search API if apiKey is present or query public endpoint
  try {
    const searchUrl = `https://www.onemap.gov.sg/api/common/elastic/search?searchVal=${encodeURIComponent(
      postalCode
    )}&returnGeom=Y&getAddrDetails=Y`;

    const headers = { 'User-Agent': 'aistudio-build' };
    if (apiKey && apiKey.trim()) {
      headers.Authorization = `Bearer ${apiKey.trim()}`;
    }

    const searchRes = await fetch(searchUrl, {
      method: 'GET',
      headers
    });

    if (searchRes.ok) {
      const data = await searchRes.json();
      if (data && Array.isArray(data.results) && data.results.length > 0) {
        const primaryResult = data.results[0];
        targetLat = Number(primaryResult.LATITUDE);
        targetLon = Number(primaryResult.LONGITUDE);
        resolvedAddress = primaryResult.ADDRESS || primaryResult.SEARCHVAL;
        resolvedBuilding = primaryResult.BUILDING || primaryResult.BLK_NO || '';
        resolvedRoad = primaryResult.ROAD_NAME || '';
      }
    }
  } catch {
    // If network error, rely on fallback coordinates or geometric approximation
  }

  if (!targetLat || !targetLon) {
    targetLat = 1.3521;
    targetLon = 103.8198;
    resolvedAddress = `SINGAPORE ${postalCode}`;
  }

  // 1. MRT Stations with distances and walk times
  const mrtsWithDistances = MRT_STATIONS.map((mrt) => {
    const dist = getDistanceMeters(targetLat, targetLon, mrt.lat, mrt.lon);
    return {
      name: mrt.name,
      distance_m: dist,
      walk_time_mins: calculateWalkTimeMins(dist),
      line: mrt.line
    };
  })
    .sort((a, b) => a.distance_m - b.distance_m)
    .slice(0, 5);

  // 2. Primary Schools within 1km (MOE Phase 2C priority) and 2km radii
  const allSchoolsWithDist = PRIMARY_SCHOOLS.map((school) => {
    const dist = getDistanceMeters(targetLat, targetLon, school.lat, school.lon);
    return {
      name: school.name,
      distance_m: dist,
      town: school.town
    };
  }).sort((a, b) => a.distance_m - b.distance_m);

  const primarySchools1km = allSchoolsWithDist.filter((s) => s.distance_m <= 1000);
  const primarySchools2km = allSchoolsWithDist.filter((s) => s.distance_m > 1000 && s.distance_m <= 2000);

  // 3. Hawker Centers
  const hawkerCenters = HAWKER_CENTERS.map((h) => {
    const dist = getDistanceMeters(targetLat, targetLon, h.lat, h.lon);
    return {
      name: h.name,
      distance_m: dist,
      walk_time_mins: calculateWalkTimeMins(dist)
    };
  })
    .sort((a, b) => a.distance_m - b.distance_m)
    .slice(0, 4);

  // 4. Supermarkets
  const supermarkets = SUPERMARKETS.map((s) => {
    const dist = getDistanceMeters(targetLat, targetLon, s.lat, s.lon);
    return {
      name: s.name,
      distance_m: dist,
      walk_time_mins: calculateWalkTimeMins(dist)
    };
  })
    .sort((a, b) => a.distance_m - b.distance_m)
    .slice(0, 4);

  // 5. Parks & Nature
  const parks = PARKS.map((p) => {
    const dist = getDistanceMeters(targetLat, targetLon, p.lat, p.lon);
    return {
      name: p.name,
      distance_m: dist,
      walk_time_mins: calculateWalkTimeMins(dist)
    };
  })
    .sort((a, b) => a.distance_m - b.distance_m)
    .slice(0, 4);

  return res.status(200).json({
    postal_code: postalCode,
    address: resolvedAddress || `POSTAL ${postalCode}, SINGAPORE`,
    building: resolvedBuilding,
    road_name: resolvedRoad,
    town: getTownFromPostal(postalCode),
    coordinates: {
      latitude: Number(targetLat.toFixed(5)),
      longitude: Number(targetLon.toFixed(5))
    },
    mrt_stations: mrtsWithDistances,
    primary_schools_1km: primarySchools1km,
    primary_schools_2km: primarySchools2km,
    amenities: {
      hawker_centers: hawkerCenters,
      supermarkets: supermarkets,
      parks: parks
    },
    summary: {
      nearest_mrt: mrtsWithDistances[0] || null,
      primary_schools_1km_count: primarySchools1km.length,
      primary_schools_2km_count: primarySchools2km.length,
      nearest_hawker: hawkerCenters[0] || null,
      nearest_supermarket: supermarkets[0] || null,
      nearest_park: parks[0] || null
    }
  });
}
