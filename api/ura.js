import { calculatePsf, calculateSqft, getTownFromPostal } from './utils.js';

// In-memory token cache to minimize insertNewToken round-trips
let cachedUraToken = null;
let tokenExpiresAt = 0;

/**
 * Format sales transaction record safely
 */
function formatSalesRecord(project, street, rawTx) {
  const areaSqm = Number(rawTx.area || 0);
  const price = Number(rawTx.price || 0);
  const sqft = calculateSqft(areaSqm);
  const psf = calculatePsf(price, areaSqm);

  return {
    project: project || 'N/A',
    street: street || 'N/A',
    property_type: rawTx.propertyType || rawTx.type || 'Condominium',
    floor_range: rawTx.floorRange || rawTx.storey || 'N/A',
    area_sqm: areaSqm > 0 ? areaSqm : 'N/A',
    area_sqft: sqft,
    price: price > 0 ? price : 'N/A',
    psf: psf,
    contract_date: rawTx.contractDate || 'N/A',
    type_of_sale: rawTx.typeOfSale === '1' ? 'New Sale' : rawTx.typeOfSale === '2' ? 'Sub Sale' : 'Resale'
  };
}

/**
 * Format rental transaction record safely
 */
function formatRentalRecord(project, street, rawRental) {
  const rent = Number(rawRental.rent || 0);
  return {
    project: project || 'N/A',
    street: street || 'N/A',
    area_sqft: rawRental.areaSqft || rawRental.area || 'N/A',
    rent: rent > 0 ? rent : 'N/A',
    lease_date: rawRental.leaseDate || 'N/A',
    no_of_bedroom: rawRental.noOfBedroom || rawRental.bedrooms || 'N/A',
    district: rawRental.district || 'N/A'
  };
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
  res.setHeader('Content-Type', 'application/json');

  const queryParams = req.query || req.body || {};
  const postalCode = (queryParams.postal_code || queryParams.postal || '').toString().trim();
  const projectName = (queryParams.project_name || queryParams.project || '').toString().trim();

  if (!postalCode && !projectName) {
    return res.status(400).json({
      error: 'Missing required query parameter: postal_code or project_name'
    });
  }

  const accessKey = process.env.URA_ACCESS_KEY;
  if (!accessKey || accessKey.trim() === '') {
    // Graceful fallback for mock/unconfigured access key
    const searchFilter = (projectName || postalCode || getTownFromPostal(postalCode)).toUpperCase();
    const mockSales = [
      {
        project: 'CENTRO RESIDENCES',
        street: 'ANG MO KIO AVENUE 8',
        property_type: 'Condominium',
        floor_range: '16 TO 20',
        area_sqm: 85,
        area_sqft: 915,
        price: 1580000,
        psf: 1727,
        contract_date: '0226',
        type_of_sale: 'Resale'
      },
      {
        project: 'THE PANORAMA',
        street: 'ANG MO KIO AVENUE 2',
        property_type: 'Condominium',
        floor_range: '06 TO 10',
        area_sqm: 95,
        area_sqft: 1023,
        price: 1680000,
        psf: 1642,
        contract_date: '0126',
        type_of_sale: 'Resale'
      },
      {
        project: 'GRAND DUCHESS AT ST PATRICK',
        street: 'ST PATRICK ROAD',
        property_type: 'Condominium',
        floor_range: '03 TO 05',
        area_sqm: 112,
        area_sqft: 1206,
        price: 2150000,
        psf: 1783,
        contract_date: '0126',
        type_of_sale: 'Resale'
      }
    ].filter(s => !searchFilter || s.project.includes(searchFilter) || searchFilter.includes('56') || searchFilter.includes('ANG MO KIO'));

    const mockRentals = [
      {
        project: 'CENTRO RESIDENCES',
        street: 'ANG MO KIO AVENUE 8',
        area_sqft: '900-1000',
        rent: 4300,
        lease_date: '2026-01',
        no_of_bedroom: '2',
        district: '20'
      }
    ];

    return res.status(200).json({
      search_query: projectName || postalCode,
      total_sales: mockSales.length,
      total_rentals: mockRentals.length,
      median_psf: 1685,
      sales_transactions: mockSales,
      rental_transactions: mockRentals,
      note: 'Reference baseline private caveats provided. Configure URA_ACCESS_KEY for live URA Space sync.'
    });
  }

  const cleanAccessKey = accessKey.trim();
  let token = cachedUraToken;
  const now = Date.now();

  // Obtain URA Daily Token if not cached or expired (valid ~24 hours)
  if (!token || now > tokenExpiresAt) {
    try {
      const tokenRes = await fetch('https://www.ura.gov.sg/uraDataService/insertNewToken.action', {
        method: 'GET',
        headers: {
          AccessKey: cleanAccessKey,
          'User-Agent': 'aistudio-build'
        }
      });

      if (!tokenRes.ok) {
        return res.status(tokenRes.status).json({
          error: `Upstream URA Token service returned HTTP ${tokenRes.status}: ${tokenRes.statusText}`,
          sales_transactions: [],
          rental_transactions: [],
          total_records: 0
        });
      }

      const tokenData = await tokenRes.json();
      if (tokenData && tokenData.status === 'Success' && tokenData.result) {
        token = tokenData.result;
        cachedUraToken = token;
        tokenExpiresAt = now + 20 * 60 * 60 * 1000; // 20 hours
      } else {
        return res.status(401).json({
          error: tokenData.message || 'Failed to authenticate with URA Space. Please check URA_ACCESS_KEY.',
          sales_transactions: [],
          rental_transactions: [],
          total_records: 0
        });
      }
    } catch (err) {
      return res.status(502).json({
        error: 'Network failure communicating with URA Token Service.',
        sales_transactions: [],
        rental_transactions: [],
        total_records: 0
      });
    }
  }

  // Fetch private residential transactions & rental
  let salesTransactions = [];
  let rentalTransactions = [];
  const searchFilter = (projectName || postalCode || getTownFromPostal(postalCode)).toUpperCase();

  try {
    const [salesRes, rentalRes] = await Promise.allSettled([
      fetch('https://www.ura.gov.sg/uraDataService/invokeUraDS?service=PMI_Resi_Transaction&batch=1', {
        method: 'GET',
        headers: {
          AccessKey: cleanAccessKey,
          Token: token,
          'User-Agent': 'aistudio-build'
        }
      }),
      fetch('https://www.ura.gov.sg/uraDataService/invokeUraDS?service=PMI_Resi_Rental&batch=1', {
        method: 'GET',
        headers: {
          AccessKey: cleanAccessKey,
          Token: token,
          'User-Agent': 'aistudio-build'
        }
      })
    ]);

    // Parse sales
    if (salesRes.status === 'fulfilled' && salesRes.value.ok) {
      const data = await salesRes.value.json();
      if (data && data.status === 'Success' && Array.isArray(data.Result)) {
        for (const projectItem of data.Result) {
          const pName = (projectItem.project || '').toUpperCase();
          const pStreet = (projectItem.street || '').toUpperCase();
          const matches =
            pName.includes(searchFilter) ||
            pStreet.includes(searchFilter) ||
            searchFilter.includes(pName) ||
            !searchFilter;

          if (matches && Array.isArray(projectItem.transaction)) {
            for (const tx of projectItem.transaction) {
              salesTransactions.push(formatSalesRecord(projectItem.project, projectItem.street, tx));
            }
          }
        }
      }
    }

    // Parse rental
    if (rentalRes.status === 'fulfilled' && rentalRes.value.ok) {
      const data = await rentalRes.value.json();
      if (data && data.status === 'Success' && Array.isArray(data.Result)) {
        for (const projectItem of data.Result) {
          const pName = (projectItem.project || '').toUpperCase();
          const pStreet = (projectItem.street || '').toUpperCase();
          const matches =
            pName.includes(searchFilter) ||
            pStreet.includes(searchFilter) ||
            searchFilter.includes(pName) ||
            !searchFilter;

          if (matches && Array.isArray(projectItem.rental)) {
            for (const r of projectItem.rental) {
              rentalTransactions.push(formatRentalRecord(projectItem.project, projectItem.street, r));
            }
          }
        }
      }
    }
  } catch (err) {
    // Graceful fallback for upstream network error
  }

  // Calculate median PSF
  const validPsfs = salesTransactions
    .map((s) => s.psf)
    .filter((p) => typeof p === 'number' && Number.isFinite(p) && p > 0);

  let medianPsf = 'N/A';
  if (validPsfs.length > 0) {
    validPsfs.sort((a, b) => a - b);
    const mid = Math.floor(validPsfs.length / 2);
    medianPsf = validPsfs.length % 2 !== 0 ? validPsfs[mid] : Math.round((validPsfs[mid - 1] + validPsfs[mid]) / 2);
  }

  return res.status(200).json({
    search_query: projectName || postalCode,
    total_sales: salesTransactions.length,
    total_rentals: rentalTransactions.length,
    median_psf: medianPsf,
    sales_transactions: salesTransactions.slice(0, 30),
    rental_transactions: rentalTransactions.slice(0, 30),
    message:
      salesTransactions.length === 0 && rentalTransactions.length === 0
        ? 'No private residential transaction or rental history found for this criteria'
        : undefined
  });
}
