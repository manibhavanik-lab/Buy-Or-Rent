/**
 * Shared utility functions for Singapore Property Intelligence Handlers
 * Dual-environment compatible (Node / Vercel Serverless / Express)
 */

/**
 * Safely calculate PSF = Price / (Floor Area sqm * 10.7639)
 * Gracefully handles missing, zero, or invalid numbers. Never outputs NaN or Infinity.
 */
export function calculatePsf(price, floorAreaSqm) {
  const numPrice = Number(price);
  const numSqm = Number(floorAreaSqm);
  if (!Number.isFinite(numPrice) || numPrice <= 0) return 'N/A';
  if (!Number.isFinite(numSqm) || numSqm <= 0) return 'N/A';
  const sqft = numSqm * 10.7639104;
  if (!Number.isFinite(sqft) || sqft <= 0) return 'N/A';
  const psf = Math.round(numPrice / sqft);
  return Number.isFinite(psf) && psf > 0 ? psf : 'N/A';
}

/**
 * Safely calculate sqft from sqm
 */
export function calculateSqft(floorAreaSqm) {
  const numSqm = Number(floorAreaSqm);
  if (!Number.isFinite(numSqm) || numSqm <= 0) return 'N/A';
  const sqft = Math.round(numSqm * 10.7639104);
  return Number.isFinite(sqft) && sqft > 0 ? sqft : 'N/A';
}

/**
 * Calculate Haversine distance in meters between two lat/lon pairs
 */
export function getDistanceMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000; // meters
  const toRad = (x) => (x * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * Estimate walking time at ~80 meters per minute
 */
export function calculateWalkTimeMins(distanceMeters) {
  if (typeof distanceMeters !== 'number' || distanceMeters < 0) return 'N/A';
  return Math.max(1, Math.round(distanceMeters / 80));
}

/**
 * Common Singapore postal sector to Town / Planning Area mapping
 */
export const POSTAL_SECTOR_TO_TOWN = {
  '01': 'MARINA BAY / RAFFLES PLACE', '02': 'TANJONG PAGAR', '03': 'QUEENSTOWN', '04': 'TELOK BLANGAH',
  '05': 'PASIR PANJANG', '06': 'CITY HALL', '07': 'BEACH ROAD / BUGIS', '08': 'CHINATOWN',
  '09': 'BUKIT MERAH', '10': 'BUKIT MERAH', '11': 'PASIR PANJANG', '12': 'CLEMENTI',
  '13': 'QUEENSTOWN', '14': 'QUEENSTOWN', '15': 'QUEENSTOWN', '16': 'BUKIT MERAH',
  '17': 'HIGH STREET', '18': 'MIDDLE ROAD', '19': 'BUGIS', '20': 'LITTLE INDIA',
  '21': 'FARRER PARK', '22': 'ORCHARD', '23': 'SOMERSET / CAIRNHILL', '24': 'TANGLIN',
  '25': 'BOTANIC GARDENS', '26': 'BUKIT TIMAH', '27': 'HOLLAND VILLAGE', '28': 'BUKIT TIMAH',
  '29': 'NOVENA', '30': 'BALESTIER', '31': 'TOA PAYOH', '32': 'TOA PAYOH',
  '33': 'POTONG PASIR', '34': 'MACPHERSON', '35': 'PAYA LEBAR', '36': 'ALJUNIED',
  '37': 'GEYLANG', '38': 'GEYLANG', '39': 'KALLANG', '40': 'EUNOS',
  '41': 'UBI / KAKI BUKIT', '42': 'KATONG / JOO CHIAT', '43': 'MARINE PARADE', '44': 'EAST COAST',
  '45': 'SIGLAP', '46': 'BEDOK', '47': 'BEDOK', '48': 'BEDOK',
  '49': 'CHANGI', '50': 'CHANGI', '51': 'PASIR RIS', '52': 'TAMPINES',
  '53': 'HOUGANG', '54': 'SENGKANG', '55': 'SERANGOON', '56': 'ANG MO KIO',
  '57': 'BISHAN', '58': 'BUKIT TIMAH', '59': 'HILLVIEW', '60': 'JURONG EAST',
  '61': 'JURONG WEST', '62': 'JURONG INDUSTRIAL', '63': 'PIONEER', '64': 'JURONG WEST',
  '65': 'BUKIT BATOK', '66': 'BUKIT GOMBAK', '67': 'CHOA CHU KANG', '68': 'CHOA CHU KANG',
  '69': 'LIM CHU KANG', '70': 'TENGAH', '71': 'KRANJI', '72': 'WOODLANDS',
  '73': 'WOODLANDS', '74': 'MANDAI', '75': 'SEMBAWANG', '76': 'YISHUN',
  '77': 'UPPER THOMSON', '78': 'SPRINGLEAF', '79': 'SELETAR', '80': 'SELETAR AEROSPACE',
  '81': 'CHANGI AIRPORT', '82': 'PUNGGOL'
};

/**
 * Return resolved town from 6-digit postal code
 */
export function getTownFromPostal(postalCode) {
  if (!postalCode) return 'SINGAPORE';
  const clean = String(postalCode).trim().padStart(6, '0');
  const sector = clean.slice(0, 2);
  return POSTAL_SECTOR_TO_TOWN[sector] || 'SINGAPORE';
}
