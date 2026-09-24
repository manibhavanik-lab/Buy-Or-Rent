export interface HdbCaveat {
  month: string;
  blockStreet: string;
  model: string;
  floorAreaSqm: number;
  floorAreaSqft: number;
  leaseBalYears: number;
  leaseBalMonths: number;
  price: number;
  safePsf: number;
  flatType: string;
}

export interface UraCaveat {
  development: string;
  tenure: string;
  unitType: string;
  floorAreaSqft: number;
  price: number;
  psf: number;
  district: string;
  completionYear?: number;
}

export interface SchoolRadius {
  name: string;
  tag?: string; // e.g. "SAP"
  pathway: string;
  distanceMeters: number;
  distanceCategory: 'Within 1km' | '1km - 2km Band';
  ballotRisk: string; // e.g. "Low Ballot Risk", "Priority Cap", "Ballot Risk"
  isPrimaryChoice?: boolean;
}

export interface TransitItem {
  id: string;
  type: 'mrt' | 'market' | 'park' | 'bus';
  name: string;
  subtitle: string;
  distanceMeters: number;
  walkTimeMins: number;
  mrtLines?: { code: string; color: string; bg: string }[];
}

export interface AiBriefingModule {
  id: string;
  moduleNumber: string;
  tag: string;
  title: string;
  body: string;
  metricBadge: {
    icon: string;
    text: string;
    highlightColor: 'primary' | 'secondary';
  };
}

export interface PrecinctProfile {
  postal: string;
  address: string;
  town: string;
  region: string;
  cadastralLot: string;
  masterPlanGpr: string;
  microMarketZone: string;
  geoHash: string;
  lat: number;
  lng: number;
  svy21Northing: number;
  svy21Easting: number;
  historicalCaveatsCount: string;
  
  // Bento metrics
  hdbMedianPsf: number;
  hdbYoyChange: string;
  hdbModelDescription: string;
  hdbAvgTransacted: string;
  hdbSparkline: number[];

  privateMedianPsf: number;
  privateDistrictCode: string;
  privatePrecinctWeighting: string;
  privateCaveatBase: string;
  privateSparkline: number[];

  spreadRatio: string;
  spreadHdbPct: number;
  spreadPrivatePct: number;

  affordabilityMonthly: number;
  affordabilityTier: string;
  cpfOaCoverage: number;
  cashOutflowStatus: string;
  loanPegDescription: string;

  // Tables
  hdbCaveats: HdbCaveat[];
  uraCaveats: UraCaveat[];
  schools: SchoolRadius[];
  transits: TransitItem[];
  briefing: AiBriefingModule[];
}

export const PRESETS_DATA: Record<string, PrecinctProfile> = {
  '560421': {
    postal: '560421',
    address: '421 Ang Mo Kio Ave 10, Singapore',
    town: 'ANG MO KIO',
    region: 'Central-North Region',
    cadastralLot: 'SLA Cadastral Lot 04192X',
    masterPlanGpr: 'Master Plan 2019 Residential GPR 2.8',
    microMarketZone: 'Micro-Market Zone 20B',
    geoHash: '1.3621° N, 103.8569° E',
    lat: 1.3621,
    lng: 103.8569,
    svy21Northing: 38942.12,
    svy21Easting: 29841.55,
    historicalCaveatsCount: '1,842 Records (1990 - 2026)',

    hdbMedianPsf: 545,
    hdbYoyChange: '+4.2% YoY',
    hdbModelDescription: 'Model: 92 sqm New Gen',
    hdbAvgTransacted: 'Transacted: $540k avg',
    hdbSparkline: [20, 17, 19, 14, 15, 10, 7, 4],

    privateMedianPsf: 1714,
    privateDistrictCode: 'D20 OCR',
    privatePrecinctWeighting: 'Precinct Weighting: 99-yr',
    privateCaveatBase: '$1.68M Caveat Base',
    privateSparkline: [18, 16, 12, 13, 8, 5],

    spreadRatio: '3.1x',
    spreadHdbPct: 32,
    spreadPrivatePct: 68,

    affordabilityMonthly: 2180,
    affordabilityTier: 'Tier A - Balanced',
    cpfOaCoverage: 2420,
    cashOutflowStatus: 'Zero Cash Outflow',
    loanPegDescription: 'HDB 2.60% Concessionary Peg',

    hdbCaveats: [
      {
        month: '2026-02',
        blockStreet: 'Blk 421 AMK Ave 10',
        model: 'New Generation',
        floorAreaSqm: 92,
        floorAreaSqft: 990,
        leaseBalYears: 52,
        leaseBalMonths: 3,
        price: 540000,
        safePsf: 545,
        flatType: '4 ROOM',
      },
      {
        month: '2026-01',
        blockStreet: 'Blk 420 AMK Ave 10',
        model: 'New Generation',
        floorAreaSqm: 92,
        floorAreaSqft: 990,
        leaseBalYears: 52,
        leaseBalMonths: 4,
        price: 565000,
        safePsf: 570,
        flatType: '4 ROOM',
      },
      {
        month: '2025-12',
        blockStreet: 'Blk 422 AMK Ave 10',
        model: 'Improved 4R',
        floorAreaSqm: 118,
        floorAreaSqft: 1270,
        leaseBalYears: 52,
        leaseBalMonths: 5,
        price: 720000,
        safePsf: 567,
        flatType: '4 ROOM',
      },
      {
        month: '2025-11',
        blockStreet: 'Blk 419 AMK Ave 10',
        model: 'Simplified 3R',
        floorAreaSqm: 68,
        floorAreaSqft: 731,
        leaseBalYears: 52,
        leaseBalMonths: 6,
        price: 395000,
        safePsf: 540,
        flatType: '3 ROOM',
      },
      {
        month: '2025-10',
        blockStreet: 'Blk 425 AMK Ave 10',
        model: 'New Generation',
        floorAreaSqm: 92,
        floorAreaSqft: 990,
        leaseBalYears: 52,
        leaseBalMonths: 7,
        price: 550000,
        safePsf: 555,
        flatType: '4 ROOM',
      },
      {
        month: '2025-09',
        blockStreet: 'Blk 424 AMK Ave 10',
        model: 'Simplified 3R',
        floorAreaSqm: 68,
        floorAreaSqft: 731,
        leaseBalYears: 52,
        leaseBalMonths: 8,
        price: 390000,
        safePsf: 533,
        flatType: '3 ROOM',
      },
      {
        month: '2025-08',
        blockStreet: 'Blk 427 AMK Ave 10',
        model: 'Improved 5R',
        floorAreaSqm: 121,
        floorAreaSqft: 1302,
        leaseBalYears: 52,
        leaseBalMonths: 9,
        price: 780000,
        safePsf: 599,
        flatType: '5 ROOM',
      },
      {
        month: '2025-07',
        blockStreet: 'Blk 426 AMK Ave 10',
        model: 'New Generation',
        floorAreaSqm: 92,
        floorAreaSqft: 990,
        leaseBalYears: 52,
        leaseBalMonths: 10,
        price: 538000,
        safePsf: 543,
        flatType: '4 ROOM',
      },
    ],

    uraCaveats: [
      {
        development: 'Central Horizon Residences',
        tenure: '99-yr (2018)',
        unitType: '3-Bedroom',
        floorAreaSqft: 980,
        price: 1680000,
        psf: 1714,
        district: 'D20',
        completionYear: 2018,
      },
      {
        development: 'The Panorama',
        tenure: '99-yr (2013)',
        unitType: '2-Bedroom',
        floorAreaSqft: 850,
        price: 1520000,
        psf: 1788,
        district: 'D20',
        completionYear: 2017,
      },
      {
        development: 'Centro Residences',
        tenure: '99-yr (2010)',
        unitType: '2-Bedroom',
        floorAreaSqft: 882,
        price: 1590000,
        psf: 1802,
        district: 'D20',
        completionYear: 2014,
      },
      {
        development: 'Grande Vista',
        tenure: 'Freehold',
        unitType: '3-Bedroom',
        floorAreaSqft: 1313,
        price: 2180000,
        psf: 1660,
        district: 'D20',
        completionYear: 1993,
      },
      {
        development: 'Thomson Grand',
        tenure: '99-yr (2010)',
        unitType: '3-Bedroom',
        floorAreaSqft: 1345,
        price: 2450000,
        psf: 1821,
        district: 'D20',
        completionYear: 2015,
      },
      {
        development: 'Seletar Park Residence',
        tenure: '99-yr (2011)',
        unitType: '2-Bedroom',
        floorAreaSqft: 797,
        price: 1320000,
        psf: 1656,
        district: 'D28',
        completionYear: 2015,
      },
    ],

    schools: [
      {
        name: 'Townsville Primary School',
        pathway: 'Path: Via AMK Ave 10 Covered Walkway',
        distanceMeters: 420,
        distanceCategory: 'Within 1km',
        ballotRisk: '420m (Low Ballot Risk)',
        isPrimaryChoice: true,
      },
      {
        name: 'Teck Ghee Primary School',
        pathway: 'Path: Via AMK St 32 Linear Connector',
        distanceMeters: 780,
        distanceCategory: 'Within 1km',
        ballotRisk: '780m (Priority Cap)',
        isPrimaryChoice: true,
      },
      {
        name: 'Catholic High School (Pri)',
        tag: 'SAP',
        pathway: 'Historical Phase 2C >100% Subscription',
        distanceMeters: 1650,
        distanceCategory: '1km - 2km Band',
        ballotRisk: '1,650m (Ballot Risk)',
      },
      {
        name: 'Kuo Chuan Presbyterian Pri',
        pathway: 'District 20 / Bishan Border',
        distanceMeters: 1850,
        distanceCategory: '1km - 2km Band',
        ballotRisk: '1,850m (Ballot Risk)',
      },
      {
        name: 'Mayflower Primary School',
        pathway: 'Direct via AMK Ave 4',
        distanceMeters: 1420,
        distanceCategory: '1km - 2km Band',
        ballotRisk: '1,420m (Moderate Ballot Risk)',
      },
      {
        name: 'Jing Shan Primary School',
        pathway: 'Path: Via AMK Central Park Connector',
        distanceMeters: 1100,
        distanceCategory: '1km - 2km Band',
        ballotRisk: '1,100m (Stable Quota)',
      },
    ],

    transits: [
      {
        id: 'amk-mrt',
        type: 'mrt',
        name: 'Ang Mo Kio MRT Interchange',
        subtitle: 'Cross Island Line (Phase 1 Underway)',
        distanceMeters: 650,
        walkTimeMins: 8,
        mrtLines: [
          { code: 'NS16', color: '#ffffff', bg: '#e11e24' },
          { code: 'CR11', color: '#ffffff', bg: '#9b854e' },
        ],
      },
      {
        id: 'chong-boon-market',
        type: 'market',
        name: 'Chong Boon Market & Food Ctr',
        subtitle: 'Blk 453A Hawker & Wet Market',
        distanceMeters: 230,
        walkTimeMins: 3,
      },
      {
        id: 'bishan-amk-park',
        type: 'park',
        name: 'Bishan-Ang Mo Kio Park',
        subtitle: '62-Hectare NParks Riverine Asset',
        distanceMeters: 950,
        walkTimeMins: 11,
      },
      {
        id: 'amk-bus-ring',
        type: 'bus',
        name: 'AMK Ave 10 Bus Interchange Ring',
        subtitle: 'Direct trunk routes: 45, 88, 261, 55',
        distanceMeters: 80,
        walkTimeMins: 1,
      },
    ],

    briefing: [
      {
        id: 'mod-1',
        moduleNumber: 'MODULE 01',
        tag: 'TENURE DIVERGENCE',
        title: 'Executive Valuation & Pricing PSF Trends',
        body: 'Current median resale of $545 psf represents resilient consolidation (+4.2% YoY). While 1979-built New Generation 3R/4R assets encounter structural lease decay resistance, pricing spreads remain tightly anchored due to the impending Cross Island Line (CR11) operational milestone. In contrast, nearby private 99-year condominiums trade at an elevated 3.1x spread ($1,714 psf), preserving high equity buffers for HDB upgraders seeking prime OCR exposure.',
        metricBadge: {
          icon: 'insights',
          text: 'Quant Model: Downside capped by 4.8% net rental yields on 3-room configurations.',
          highlightColor: 'secondary',
        },
      },
      {
        id: 'mod-2',
        moduleNumber: 'MODULE 02',
        tag: 'CPF SUBSIDY GAIN',
        title: 'Young Homebuyer & BTO vs. Resale Assessment',
        body: "For first-timer couples under 35 with combined incomes ≤ $14,000, Blk 421 unlocks up to $80,000 Enhanced CPF Housing Grant (EHG) plus $50,000 CPF Family Grant. With 52 years remaining lease, Bala's curve depreciation will accelerate past year 40. However, the purchase satisfies full CPF withdrawal requirements since the youngest applicant's age + remaining lease exceeds 95 years.",
        metricBadge: {
          icon: 'savings',
          text: 'Net Effective Entry Price: $540,000 - $130,000 Grants = $410,000 base capital outlay.',
          highlightColor: 'primary',
        },
      },
      {
        id: 'mod-3',
        moduleNumber: 'MODULE 03',
        tag: 'CIVIC RADIUS AUDIT',
        title: 'OneMap Urban Connectivity & School Ballot Advantage',
        body: 'SLA GIS centroid triangulation confirms Townsville Primary (420m) and Teck Ghee Primary (780m) rest inside the decisive <1km MOE Phase 2C priority envelope, guaranteeing top-tier home-school distance eligibility without competitive ballot attrition. Catholic High School (1,650m) falls into the 1-2km ballot risk zone, requiring Phase 2A/2B legacy prioritization.',
        metricBadge: {
          icon: 'explore',
          text: 'Connectivity Vector: Direct North-South / Cross-Island interchange node within 8 mins walk.',
          highlightColor: 'secondary',
        },
      },
      {
        id: 'mod-4',
        moduleNumber: 'MODULE 04',
        tag: 'CASH-FLOW SENSITIVITY',
        title: 'Buy vs. Rent Financial Summary',
        body: 'At an prevailing OCR rental benchmark of $3,200/mo for a 3-bedroom unit, leasing incurs a cumulative 5-year unrecoverable sink of $192,000. Under an HDB loan structure at 2.60% concessionary interest, principal amortisation builds $78,400 in net home equity over the same period, yielding a decisive breakeven horizon at 14.2 months.',
        metricBadge: {
          icon: 'price_check',
          text: 'Verdict: Overwhelming financial bias toward acquisition over tenancy under current rate regime.',
          highlightColor: 'secondary',
        },
      },
    ],
  },

  '310150': {
    postal: '310150',
    address: '150 Lor 1 Toa Payoh, Singapore',
    town: 'TOA PAYOH',
    region: 'Central Region',
    cadastralLot: 'SLA Cadastral Lot 02871A',
    masterPlanGpr: 'Master Plan 2019 Residential GPR 3.0',
    microMarketZone: 'Micro-Market Zone 12A',
    geoHash: '1.3328° N, 103.8475° E',
    lat: 1.3328,
    lng: 103.8475,
    svy21Northing: 35702.44,
    svy21Easting: 28795.12,
    historicalCaveatsCount: '2,410 Records (1990 - 2026)',

    hdbMedianPsf: 642,
    hdbYoyChange: '+5.8% YoY',
    hdbModelDescription: 'Model: 96 sqm 4-Room Model A',
    hdbAvgTransacted: 'Transacted: $665k avg',
    hdbSparkline: [19, 18, 15, 16, 12, 9, 6, 2],

    privateMedianPsf: 2085,
    privateDistrictCode: 'D12 RCR',
    privatePrecinctWeighting: 'Precinct Weighting: 99-yr / Freehold Mix',
    privateCaveatBase: '$2.05M Caveat Base',
    privateSparkline: [22, 19, 16, 14, 11, 7],

    spreadRatio: '3.25x',
    spreadHdbPct: 30,
    spreadPrivatePct: 70,

    affordabilityMonthly: 2680,
    affordabilityTier: 'Tier A - Balanced',
    cpfOaCoverage: 2850,
    cashOutflowStatus: 'Zero Cash Outflow',
    loanPegDescription: 'HDB 2.60% Concessionary Peg',

    hdbCaveats: [
      {
        month: '2026-02',
        blockStreet: 'Blk 150 Lor 1 Toa Payoh',
        model: 'Model A',
        floorAreaSqm: 96,
        floorAreaSqft: 1033,
        leaseBalYears: 68,
        leaseBalMonths: 2,
        price: 665000,
        safePsf: 644,
        flatType: '4 ROOM',
      },
      {
        month: '2026-01',
        blockStreet: 'Blk 148 Lor 1 Toa Payoh',
        model: 'Simplified',
        floorAreaSqm: 65,
        floorAreaSqft: 700,
        leaseBalYears: 68,
        leaseBalMonths: 3,
        price: 450000,
        safePsf: 643,
        flatType: '3 ROOM',
      },
      {
        month: '2025-12',
        blockStreet: 'Blk 152 Lor 2 Toa Payoh',
        model: 'Improved',
        floorAreaSqm: 110,
        floorAreaSqft: 1184,
        leaseBalYears: 71,
        leaseBalMonths: 8,
        price: 810000,
        safePsf: 684,
        flatType: '5 ROOM',
      },
      {
        month: '2025-11',
        blockStreet: 'The Peak @ Toa Payoh',
        model: 'DBSS',
        floorAreaSqm: 112,
        floorAreaSqft: 1205,
        leaseBalYears: 87,
        leaseBalMonths: 5,
        price: 1180000,
        safePsf: 979,
        flatType: '5 ROOM',
      },
    ],

    uraCaveats: [
      {
        development: 'Gem Residences',
        tenure: '99-yr (2015)',
        unitType: '3-Bedroom',
        floorAreaSqft: 936,
        price: 1950000,
        psf: 2083,
        district: 'D12',
        completionYear: 2020,
      },
      {
        development: 'Trevista',
        tenure: '99-yr (2008)',
        unitType: '3-Bedroom',
        floorAreaSqft: 1141,
        price: 2280000,
        psf: 1998,
        district: 'D12',
        completionYear: 2011,
      },
      {
        development: 'Sky@Eleven',
        tenure: 'Freehold',
        unitType: '4-Bedroom',
        floorAreaSqft: 1851,
        price: 4120000,
        psf: 2225,
        district: 'D11',
        completionYear: 2010,
      },
    ],

    schools: [
      {
        name: 'CHIJ Primary (Toa Payoh)',
        pathway: 'Path: Direct Lor 1 Overhead Link',
        distanceMeters: 380,
        distanceCategory: 'Within 1km',
        ballotRisk: '380m (Phase 2B/2C Cap)',
        isPrimaryChoice: true,
      },
      {
        name: 'Kheng Cheng School',
        pathway: 'Path: Via Lor 2 Covered Walkway',
        distanceMeters: 550,
        distanceCategory: 'Within 1km',
        ballotRisk: '550m (Low Ballot Risk)',
        isPrimaryChoice: true,
      },
      {
        name: 'Pei Chun Public School',
        tag: 'SAP',
        pathway: 'Historical Phase 2C High Balloting',
        distanceMeters: 890,
        distanceCategory: 'Within 1km',
        ballotRisk: '890m (Fierce Ballot)',
      },
      {
        name: 'First Toa Payoh Primary School',
        pathway: 'District 12 Core Sector',
        distanceMeters: 1320,
        distanceCategory: '1km - 2km Band',
        ballotRisk: '1,320m (Safe Quota)',
      },
    ],

    transits: [
      {
        id: 'tp-mrt',
        type: 'mrt',
        name: 'Toa Payoh MRT Station & Hub',
        subtitle: 'North-South Line & Central Bus Interchange',
        distanceMeters: 410,
        walkTimeMins: 5,
        mrtLines: [{ code: 'NS19', color: '#ffffff', bg: '#e11e24' }],
      },
      {
        id: 'caldecott-mrt',
        type: 'mrt',
        name: 'Caldecott MRT Interchange',
        subtitle: 'Circle Line & Thomson-East Coast Line Interchange',
        distanceMeters: 750,
        walkTimeMins: 9,
        mrtLines: [
          { code: 'CC17', color: '#ffffff', bg: '#fa9e0d' },
          { code: 'TE9', color: '#ffffff', bg: '#9d5b25' },
        ],
      },
      {
        id: 'tp-central-market',
        type: 'market',
        name: 'Toa Payoh Central Market & Hawker',
        subtitle: 'Blk 127 Hawker Center & Gourmet Enclave',
        distanceMeters: 320,
        walkTimeMins: 4,
      },
      {
        id: 'tp-town-park',
        type: 'park',
        name: 'Toa Payoh Town Park',
        subtitle: 'Historic Heritage Landscaped Parklands',
        distanceMeters: 620,
        walkTimeMins: 7,
      },
    ],

    briefing: [
      {
        id: 'mod-1',
        moduleNumber: 'MODULE 01',
        tag: 'CITY FRINGE PREMIUM',
        title: 'Executive Valuation & Prime RCR Compression',
        body: 'Toa Payoh commands a city-fringe premium with median resale at $642 psf (+5.8% YoY). Being just 3 MRT stops from Orchard and Marina Bay, capital values display remarkable beta resilience against interest rate fluctuations. Premium DBSS developments like The Peak continue trading above $1.15M, signaling strong pent-up upgrader liquidity.',
        metricBadge: {
          icon: 'insights',
          text: 'Rental Yield Vector: Central fringe location underpins 5.1% gross yield profile.',
          highlightColor: 'secondary',
        },
      },
      {
        id: 'mod-2',
        moduleNumber: 'MODULE 02',
        tag: 'MULTI-MRT PROXIMITY',
        title: 'Dual Line Connectivity (NS19 & CC17/TE9)',
        body: 'Centrally anchored between North-South Line (Toa Payoh NS19) and the Caldecott interchange (Circle / TEL lines), residents tap directly into three rapid transit corridors within a 9-minute walking envelope, optimizing commute times to both Jurong Lake District and Marina South CBD.',
        metricBadge: {
          icon: 'explore',
          text: 'Commute Efficiency: Under 18 minutes door-to-door to Raffles Place financial hub.',
          highlightColor: 'primary',
        },
      },
      {
        id: 'mod-3',
        moduleNumber: 'MODULE 03',
        tag: 'SAP & BRANDED SCHOOLS',
        title: 'Triple School Priority Envelope',
        body: 'Blk 150 captures an exceptional education quadrant with CHIJ Primary (380m), Kheng Cheng (550m), and Pei Chun Public School (890m) within the <1km Phase 2C quota, establishing one of the highest parent-relocation demand indices in Singapore.',
        metricBadge: {
          icon: 'stars',
          text: 'Educational Alpha: Sustained long-term family demand floor preserves resale values.',
          highlightColor: 'secondary',
        },
      },
      {
        id: 'mod-4',
        moduleNumber: 'MODULE 04',
        tag: 'EQUITY ACCUMULATION',
        title: 'Resale vs RCR Condo Lease Comparison',
        body: 'Compared to a 3-bedroom RCR rental rate of $4,500/mo, purchasing a 4-room flat at $665k with CPF OA support yields a net interest cost of only $1,440/mo, generating $36,720 in annual capital preservation relative to tenancy unrecoverable expenditures.',
        metricBadge: {
          icon: 'price_check',
          text: 'Breakeven Timeline: 11.4 months to full positive capital amortisation.',
          highlightColor: 'secondary',
        },
      },
    ],
  },

  '120401': {
    postal: '120401',
    address: '401 Clementi Ave 1, Singapore',
    town: 'CLEMENTI',
    region: 'West Region',
    cadastralLot: 'SLA Cadastral Lot 05118W',
    masterPlanGpr: 'Master Plan 2019 Residential GPR 2.8',
    microMarketZone: 'Micro-Market Zone 05C',
    geoHash: '1.3152° N, 103.7654° E',
    lat: 1.3152,
    lng: 103.7654,
    svy21Northing: 33750.18,
    svy21Easting: 19680.75,
    historicalCaveatsCount: '1,620 Records (1990 - 2026)',

    hdbMedianPsf: 610,
    hdbYoyChange: '+3.9% YoY',
    hdbModelDescription: 'Model: 90 sqm 4-Room Simplified',
    hdbAvgTransacted: 'Transacted: $590k avg',
    hdbSparkline: [21, 18, 17, 15, 12, 11, 8, 4],

    privateMedianPsf: 1980,
    privateDistrictCode: 'D05 RCR / OCR',
    privatePrecinctWeighting: 'Precinct Weighting: 99-yr Tech Hub Anchor',
    privateCaveatBase: '$1.85M Caveat Base',
    privateSparkline: [20, 17, 15, 12, 10, 6],

    spreadRatio: '3.24x',
    spreadHdbPct: 31,
    spreadPrivatePct: 69,

    affordabilityMonthly: 2390,
    affordabilityTier: 'Tier A - Balanced',
    cpfOaCoverage: 2600,
    cashOutflowStatus: 'Zero Cash Outflow',
    loanPegDescription: 'HDB 2.60% Concessionary Peg',

    hdbCaveats: [
      {
        month: '2026-02',
        blockStreet: 'Blk 401 Clementi Ave 1',
        model: 'New Generation',
        floorAreaSqm: 90,
        floorAreaSqft: 968,
        leaseBalYears: 54,
        leaseBalMonths: 8,
        price: 590000,
        safePsf: 609,
        flatType: '4 ROOM',
      },
      {
        month: '2026-01',
        blockStreet: 'Blk 402 Clementi Ave 1',
        model: 'Simplified 3R',
        floorAreaSqm: 67,
        floorAreaSqft: 721,
        leaseBalYears: 54,
        leaseBalMonths: 9,
        price: 435000,
        safePsf: 603,
        flatType: '3 ROOM',
      },
      {
        month: '2025-12',
        blockStreet: 'Clementi Cascadia',
        model: 'Premium 4R',
        floorAreaSqm: 93,
        floorAreaSqft: 1001,
        leaseBalYears: 92,
        leaseBalMonths: 1,
        price: 940000,
        safePsf: 939,
        flatType: '4 ROOM',
      },
    ],

    uraCaveats: [
      {
        development: 'The Trilinq',
        tenure: '99-yr (2012)',
        unitType: '2-Bedroom',
        floorAreaSqft: 753,
        price: 1480000,
        psf: 1965,
        district: 'D05',
        completionYear: 2017,
      },
      {
        development: 'Parc Clematis',
        tenure: '99-yr (2018)',
        unitType: '3-Bedroom',
        floorAreaSqft: 1044,
        price: 2120000,
        psf: 2030,
        district: 'D05',
        completionYear: 2023,
      },
      {
        development: 'The Clement Canopy',
        tenure: '99-yr (2015)',
        unitType: '2-Bedroom',
        floorAreaSqft: 635,
        price: 1330000,
        psf: 2094,
        district: 'D05',
        completionYear: 2020,
      },
    ],

    schools: [
      {
        name: 'Nan Hua Primary School',
        tag: 'SAP',
        pathway: 'Path: Via Clementi Ave 1 Corridor',
        distanceMeters: 620,
        distanceCategory: 'Within 1km',
        ballotRisk: '620m (Fierce Phase 2C Ballot)',
        isPrimaryChoice: true,
      },
      {
        name: 'Clementi Primary School',
        pathway: 'Path: Directly beside Town Centre',
        distanceMeters: 450,
        distanceCategory: 'Within 1km',
        ballotRisk: '450m (Low Ballot Risk)',
        isPrimaryChoice: true,
      },
      {
        name: 'Pei Tong Primary School',
        pathway: 'West Corridor Connector',
        distanceMeters: 920,
        distanceCategory: 'Within 1km',
        ballotRisk: '920m (Stable Quota)',
      },
      {
        name: 'Qifa Primary School',
        pathway: 'West Coast Link',
        distanceMeters: 1480,
        distanceCategory: '1km - 2km Band',
        ballotRisk: '1,480m (Moderate Ballot)',
      },
    ],

    transits: [
      {
        id: 'clem-mrt',
        type: 'mrt',
        name: 'Clementi MRT Station & Mall',
        subtitle: 'East-West Line & Future CRL Interchange Ring',
        distanceMeters: 550,
        walkTimeMins: 7,
        mrtLines: [
          { code: 'EW23', color: '#ffffff', bg: '#009640' },
          { code: 'CR-Opt', color: '#ffffff', bg: '#9b854e' },
        ],
      },
      {
        id: 'clem-market',
        type: 'market',
        name: 'Clementi 448 Market & Food Centre',
        subtitle: 'Michelin Bib Gourmand Hawker Enclave',
        distanceMeters: 480,
        walkTimeMins: 6,
      },
      {
        id: 'west-coast-park',
        type: 'park',
        name: 'West Coast Park & NUS Green Corridor',
        subtitle: '50-Hectare Coastal Parklands and Linear Links',
        distanceMeters: 1100,
        walkTimeMins: 13,
      },
      {
        id: 'nus-bus-hub',
        type: 'bus',
        name: 'Ayer Rajah Express Transit Ring',
        subtitle: 'Direct trunk connection to one-north & Science Park',
        distanceMeters: 120,
        walkTimeMins: 2,
      },
    ],

    briefing: [
      {
        id: 'mod-1',
        moduleNumber: 'MODULE 01',
        tag: 'TECH & TERTIARY CLUSTER',
        title: 'Knowledge Corridor & NUS/one-north Nexus',
        body: 'Clementi enjoys structural demand elasticity driven by tertiary institutions (NUS, Singapore Poly) and the one-north tech/biomedical clusters. Median resale yields of $610 psf offer defensive consolidation with low vacancy risks across 1-room to 4-room rental inventories.',
        metricBadge: {
          icon: 'insights',
          text: 'Tech Expat Tenant Base: Continuous leasing pressure from one-north researcher workforce.',
          highlightColor: 'secondary',
        },
      },
      {
        id: 'mod-2',
        moduleNumber: 'MODULE 02',
        tag: 'TOP SAP CONVICTION',
        title: 'Nan Hua Primary School <1km Anchor',
        body: 'Securing residency within the 1km radius of Nan Hua Primary School (620m) represents one of the strongest capital shielding moats in West Singapore, generating resilient transaction pricing even during broader market cooling cycles.',
        metricBadge: {
          icon: 'school',
          text: 'Radius Priority: Top 5 national primary school within direct walking reach.',
          highlightColor: 'primary',
        },
      },
      {
        id: 'mod-3',
        moduleNumber: 'MODULE 03',
        tag: 'WEST REGION HUB',
        title: 'Jurong Lake District 2nd CBD Spillovers',
        body: 'Only 1 MRT stop from Jurong East (JEM, Westgate, future High Speed / Regional Hub), Clementi functions as the premier mature residential springboard benefiting from western Singapore decentralization initiatives.',
        metricBadge: {
          icon: 'explore',
          text: 'Decentralization Vector: Direct 4-minute train ride to Singapore 2nd Central Business District.',
          highlightColor: 'secondary',
        },
      },
      {
        id: 'mod-4',
        moduleNumber: 'MODULE 04',
        tag: 'AFFORDABILITY VECTOR',
        title: 'Conservative Debt Servicing Profile',
        body: 'Estimated monthly repayments of $2,390 remain well within the 30% MSR threshold for median Singaporean households, ensuring that 100% of mortgage payments can be covered via CPF Ordinary Account balances without cash friction.',
        metricBadge: {
          icon: 'price_check',
          text: 'Fiduciary Stability: MSR comfortably indexed at 22.4% on combined median income.',
          highlightColor: 'secondary',
        },
      },
    ],
  },

  '238882': {
    postal: '238882',
    address: 'Orchard Residences, 238 Orchard Blvd, Singapore',
    town: 'ORCHARD',
    region: 'Central Core (CCR)',
    cadastralLot: 'SLA Cadastral Lot 01099V',
    masterPlanGpr: 'Commercial & Residential GPR 5.6',
    microMarketZone: 'Micro-Market Zone 09A',
    geoHash: '1.3040° N, 103.8318° E',
    lat: 1.3040,
    lng: 103.8318,
    svy21Northing: 32540.22,
    svy21Easting: 27045.88,
    historicalCaveatsCount: '3,890 Records (1990 - 2026)',

    hdbMedianPsf: 890,
    hdbYoyChange: '+6.5% YoY',
    hdbModelDescription: 'Model: Prime Central Pinnacle / Bras Basah Base',
    hdbAvgTransacted: 'Transacted: $920k avg',
    hdbSparkline: [25, 23, 20, 18, 15, 12, 8, 3],

    privateMedianPsf: 3450,
    privateDistrictCode: 'D09 CCR Prime',
    privatePrecinctWeighting: 'Precinct Weighting: Ultra-Luxury Freehold / 99-yr',
    privateCaveatBase: '$4.80M Caveat Base',
    privateSparkline: [26, 24, 21, 18, 14, 9],

    spreadRatio: '3.88x',
    spreadHdbPct: 20,
    spreadPrivatePct: 80,

    affordabilityMonthly: 6450,
    affordabilityTier: 'Tier S - High Net Worth',
    cpfOaCoverage: 3200,
    cashOutflowStatus: 'Cash Co-payment Required',
    loanPegDescription: 'MAS 3.10% Commercial Banking Peg',

    hdbCaveats: [
      {
        month: '2026-02',
        blockStreet: 'The Pinnacle@Duxton',
        model: 'Type S2',
        floorAreaSqm: 105,
        floorAreaSqft: 1130,
        leaseBalYears: 85,
        leaseBalMonths: 2,
        price: 1480000,
        safePsf: 1309,
        flatType: '5 ROOM',
      },
      {
        month: '2026-01',
        blockStreet: 'Blk 262 Waterloo St',
        model: 'Improved 4R',
        floorAreaSqm: 90,
        floorAreaSqft: 968,
        leaseBalYears: 56,
        leaseBalMonths: 4,
        price: 740000,
        safePsf: 764,
        flatType: '4 ROOM',
      },
    ],

    uraCaveats: [
      {
        development: 'The Orchard Residences',
        tenure: '99-yr (2006)',
        unitType: '4-Bedroom',
        floorAreaSqft: 2465,
        price: 8850000,
        psf: 3590,
        district: 'D09',
        completionYear: 2010,
      },
      {
        development: 'Boulevard 88',
        tenure: 'Freehold',
        unitType: '3-Bedroom',
        floorAreaSqft: 1776,
        price: 7100000,
        psf: 3997,
        district: 'D10',
        completionYear: 2023,
      },
      {
        development: 'TwentyOne Angullia Park',
        tenure: 'Freehold',
        unitType: '3-Bedroom',
        floorAreaSqft: 2260,
        price: 8200000,
        psf: 3628,
        district: 'D09',
        completionYear: 2014,
      },
      {
        development: 'Park Nova',
        tenure: 'Freehold',
        unitType: '3-Bedroom',
        floorAreaSqft: 2207,
        price: 10200000,
        psf: 4621,
        district: 'D10',
        completionYear: 2024,
      },
    ],

    schools: [
      {
        name: 'Anglo-Chinese School (Junior)',
        pathway: 'Path: Via Newton Road link',
        distanceMeters: 1450,
        distanceCategory: '1km - 2km Band',
        ballotRisk: '1,450m (Legacy Ballot Zone)',
      },
      {
        name: "St. Margaret's School (Pri)",
        pathway: 'Path: Direct via Wilkie Road',
        distanceMeters: 1750,
        distanceCategory: '1km - 2km Band',
        ballotRisk: '1,750m (Priority Cap)',
      },
      {
        name: 'River Valley Primary School',
        pathway: 'Direct via Killiney / River Valley Rd',
        distanceMeters: 1100,
        distanceCategory: '1km - 2km Band',
        ballotRisk: '1,100m (Fierce Ballot)',
      },
    ],

    transits: [
      {
        id: 'orchard-mrt',
        type: 'mrt',
        name: 'Orchard MRT Triple Interchange',
        subtitle: 'North-South Line & Thomson-East Coast Line Directly Below ION',
        distanceMeters: 50,
        walkTimeMins: 1,
        mrtLines: [
          { code: 'NS22', color: '#ffffff', bg: '#e11e24' },
          { code: 'TE14', color: '#ffffff', bg: '#9d5b25' },
        ],
      },
      {
        id: 'ion-orchard',
        type: 'market',
        name: 'ION Orchard & Gourmet Supermarket',
        subtitle: 'Flagship Global Luxury Retail and Fine Dining Haven',
        distanceMeters: 30,
        walkTimeMins: 1,
      },
      {
        id: 'fort-canning-park',
        type: 'park',
        name: 'Fort Canning Historic Parklands',
        subtitle: '18-Hectare National Heritage and Cultural Oasis',
        distanceMeters: 1300,
        walkTimeMins: 16,
      },
      {
        id: 'orchard-bus-corridor',
        type: 'bus',
        name: 'Orchard Boulevard Transit Corridor',
        subtitle: 'Direct rapid connections to Raffles Place and Marina Bay',
        distanceMeters: 40,
        walkTimeMins: 1,
      },
    ],

    briefing: [
      {
        id: 'mod-1',
        moduleNumber: 'MODULE 01',
        tag: 'SOVEREIGN CAPITAL PRESERVATION',
        title: 'Core Central Region (CCR) Safe-Haven Moat',
        body: 'Prime District 09 benchmarks at $3,450 psf reflect institutional capital preservation. While 60% ABSD foreign buyer cooling measures created short-term transaction liquidity compressions, domestic family offices and PR naturalizations maintain sovereign balance sheet absorption.',
        metricBadge: {
          icon: 'insights',
          text: 'Trophy Asset Multiplier: Freehold and prime 99-year parcels retain generational value resilience.',
          highlightColor: 'primary',
        },
      },
      {
        id: 'mod-2',
        moduleNumber: 'MODULE 02',
        tag: 'INFRASTRUCTURE APPRECIATION',
        title: 'TEL Line Completion & Master Plan Enhancements',
        body: 'With Thomson-East Coast Line Stage 3 fully operational and URA Orchard Master Plan green corridor pedestrianization underway, seamless direct links to Shenton Way (6 mins) enhance prime rental yields for expatriate directors.',
        metricBadge: {
          icon: 'explore',
          text: 'CBD Vector: 3 stops to Financial District via TE14 to TE19 Shenton Way.',
          highlightColor: 'secondary',
        },
      },
      {
        id: 'mod-3',
        moduleNumber: 'MODULE 03',
        tag: 'HIGH NET WORTH BALANCE',
        title: 'Rental Yield vs Capital Gain Dynamic',
        body: 'At gross rental yields averaging 2.9% - 3.4% on luxury 3-bedroom suites ($12,000 to $16,500/mo), the primary thesis hinges on USD/SGD currency arbitrage, geopolitical neutrality, and long-term land scarce inflation hedging.',
        metricBadge: {
          icon: 'savings',
          text: 'Sovereign Hedge: Global wealth inflow continues fueling resilient capital floors.',
          highlightColor: 'secondary',
        },
      },
      {
        id: 'mod-4',
        moduleNumber: 'MODULE 04',
        tag: 'TAX & FIDUCIARY STRUCTURE',
        title: 'Trust & Corporate Holding Sensitivity',
        body: 'Under current IRAS protocols, acquisitions under trust arrangements trigger upfront 65% ABSD refundable upon condition compliance. Portfolio structuring favors entity-level co-investment to optimize stamp liabilities.',
        metricBadge: {
          icon: 'policy',
          text: 'Regulatory Compliance: Strict adherence to MAS Notice 645 and IRAS trust taxation.',
          highlightColor: 'primary',
        },
      },
    ],
  },
};

// Fallback algorithm to generate dynamic data for any 6-digit postal code entered
export function getPrecinctProfile(postalCode: string): PrecinctProfile {
  const clean = postalCode.trim();
  if (PRESETS_DATA[clean]) {
    return PRESETS_DATA[clean];
  }

  // Derive pseudo-realistic metrics from postal code sector (first 2 digits)
  const sector = parseInt(clean.substring(0, 2), 10) || 56;
  const isCcr = sector >= 1 && sector <= 11;
  const isRcr = (sector >= 12 && sector <= 16) || (sector >= 31 && sector <= 37);
  
  let townName = 'ANG MO KIO';
  let regionName = 'Central-North Region';
  let districtCode = 'D20 OCR';
  let baseHdb = 530;
  let basePrivate = 1680;

  if (isCcr) {
    townName = 'CENTRAL CORE';
    regionName = 'Core Central Region (CCR)';
    districtCode = 'D09/D10 CCR';
    baseHdb = 850;
    basePrivate = 3200;
  } else if (isRcr) {
    townName = 'QUEENSTOWN / TOA PAYOH';
    regionName = 'Rest of Central Region (RCR)';
    districtCode = 'D03/D12 RCR';
    baseHdb = 660;
    basePrivate = 2150;
  } else if (sector >= 51 && sector <= 53) {
    townName = 'PASIR RIS / TAMPINES';
    regionName = 'East Region';
    districtCode = 'D18 OCR';
    baseHdb = 520;
    basePrivate = 1580;
  } else if (sector >= 60 && sector <= 68) {
    townName = 'JURONG / BUKIT BATOK';
    regionName = 'West Region';
    districtCode = 'D22 OCR';
    baseHdb = 490;
    basePrivate = 1520;
  } else if (sector >= 72 && sector <= 76) {
    townName = 'WOODLANDS / YISHUN';
    regionName = 'North Region';
    districtCode = 'D25/D27 OCR';
    baseHdb = 470;
    basePrivate = 1440;
  }

  const hdbPsf = baseHdb + (clean.charCodeAt(0) % 30);
  const privatePsf = basePrivate + (clean.charCodeAt(1) % 60);
  const spread = (privatePsf / hdbPsf).toFixed(1) + 'x';
  const monthly = Math.round((hdbPsf * 950 * 0.75 * 0.0048));

  return {
    postal: clean,
    address: `Blk ${clean.substring(2, 5) || '421'} Sector ${clean.substring(0, 2)}, Singapore`,
    town: townName,
    region: regionName,
    cadastralLot: `SLA Cadastral Lot 0${clean.substring(1, 5)}X`,
    masterPlanGpr: 'Master Plan 2019 Residential GPR 2.8',
    microMarketZone: `Micro-Market Sector ${clean.substring(0, 2)}`,
    geoHash: `1.${3000 + (sector * 12)}° N, 103.${8000 + (sector * 18)}° E`,
    lat: 1.3 + (sector * 0.001),
    lng: 103.8 + (sector * 0.0015),
    svy21Northing: 38000 + sector * 100,
    svy21Easting: 29000 + sector * 150,
    historicalCaveatsCount: '1,420 Records (1990 - 2026)',

    hdbMedianPsf: hdbPsf,
    hdbYoyChange: '+4.1% YoY',
    hdbModelDescription: 'Model: 92 sqm Standard Resale',
    hdbAvgTransacted: `Transacted: $${Math.round(hdbPsf * 980 / 1000)}k avg`,
    hdbSparkline: [19, 17, 16, 14, 12, 10, 8, 4],

    privateMedianPsf: privatePsf,
    privateDistrictCode: districtCode,
    privatePrecinctWeighting: 'Precinct Weighting: 99-yr / Sub-market',
    privateCaveatBase: `$${(privatePsf * 1000 / 1000000).toFixed(2)}M Caveat Base`,
    privateSparkline: [21, 18, 16, 13, 10, 6],

    spreadRatio: spread,
    spreadHdbPct: Math.round((hdbPsf / (hdbPsf + privatePsf)) * 100),
    spreadPrivatePct: 100 - Math.round((hdbPsf / (hdbPsf + privatePsf)) * 100),

    affordabilityMonthly: monthly,
    affordabilityTier: 'Tier A - Balanced',
    cpfOaCoverage: Math.round(monthly * 1.15),
    cashOutflowStatus: 'Zero Cash Outflow',
    loanPegDescription: 'HDB 2.60% Concessionary Peg',

    hdbCaveats: [
      {
        month: '2026-02',
        blockStreet: `Blk ${clean.substring(2, 5)} Sector Road`,
        model: 'New Generation',
        floorAreaSqm: 92,
        floorAreaSqft: 990,
        leaseBalYears: 55,
        leaseBalMonths: 4,
        price: Math.round(hdbPsf * 990),
        safePsf: hdbPsf,
        flatType: '4 ROOM',
      },
      {
        month: '2026-01',
        blockStreet: `Blk ${clean.substring(2, 5)} Sector Road`,
        model: 'Simplified 3R',
        floorAreaSqm: 68,
        floorAreaSqft: 731,
        leaseBalYears: 55,
        leaseBalMonths: 5,
        price: Math.round(hdbPsf * 731),
        safePsf: hdbPsf - 5,
        flatType: '3 ROOM',
      },
      {
        month: '2025-12',
        blockStreet: `Blk ${clean.substring(2, 5)} Adjacent Block`,
        model: 'Improved 4R',
        floorAreaSqm: 115,
        floorAreaSqft: 1238,
        leaseBalYears: 55,
        leaseBalMonths: 6,
        price: Math.round(hdbPsf * 1238 * 0.98),
        safePsf: hdbPsf + 12,
        flatType: '4 ROOM',
      },
    ],

    uraCaveats: [
      {
        development: `${townName} Park Residences`,
        tenure: '99-yr (2016)',
        unitType: '3-Bedroom',
        floorAreaSqft: 980,
        price: Math.round(privatePsf * 980),
        psf: privatePsf,
        district: districtCode.split(' ')[0],
        completionYear: 2020,
      },
      {
        development: 'Grand View Enclave',
        tenure: 'Freehold',
        unitType: '2-Bedroom',
        floorAreaSqft: 790,
        price: Math.round((privatePsf + 180) * 790),
        psf: privatePsf + 180,
        district: districtCode.split(' ')[0],
        completionYear: 2012,
      },
    ],

    schools: [
      {
        name: `${townName} Primary School`,
        pathway: 'Direct covered neighborhood walkway',
        distanceMeters: 460,
        distanceCategory: 'Within 1km',
        ballotRisk: '460m (Low Ballot Risk)',
        isPrimaryChoice: true,
      },
      {
        name: 'Community Integrated Primary',
        pathway: 'District Linear Park Connector',
        distanceMeters: 810,
        distanceCategory: 'Within 1km',
        ballotRisk: '810m (Priority Cap)',
        isPrimaryChoice: true,
      },
      {
        name: 'National Heritage School',
        tag: 'SAP',
        pathway: 'Avenue connector corridor',
        distanceMeters: 1550,
        distanceCategory: '1km - 2km Band',
        ballotRisk: '1,550m (Ballot Risk)',
      },
    ],

    transits: [
      {
        id: 'sector-mrt',
        type: 'mrt',
        name: `${townName} Sector MRT Station`,
        subtitle: 'Key Rapid Transit Node & Bus Ring',
        distanceMeters: 580,
        walkTimeMins: 7,
        mrtLines: [{ code: 'NS/EW', color: '#ffffff', bg: '#009640' }],
      },
      {
        id: 'sector-market',
        type: 'market',
        name: `${townName} Neighborhood Centre & Market`,
        subtitle: 'Hawker Food Centre & Wet Market Stalls',
        distanceMeters: 290,
        walkTimeMins: 4,
      },
      {
        id: 'sector-park',
        type: 'park',
        name: `${townName} Town Park & Green Spine`,
        subtitle: 'NParks Riverine Connector and Community Spaces',
        distanceMeters: 840,
        walkTimeMins: 10,
      },
      {
        id: 'sector-bus',
        type: 'bus',
        name: 'Avenue Bus Ring Trunk Stop',
        subtitle: 'Direct rapid transit connections to CBD & City',
        distanceMeters: 90,
        walkTimeMins: 1,
      },
    ],

    briefing: [
      {
        id: 'mod-1',
        moduleNumber: 'MODULE 01',
        tag: 'VALUATION SYNTHESIS',
        title: 'Executive Valuation & Pricing PSF Trends',
        body: `Ingested caveats for Postal ${clean} record a median resale of $${hdbPsf} psf with solid consolidation. Structural demand remains anchored by proximity to regional commercial nodes and essential public infrastructure. Nearby private condominiums transact at a ${spread} premium, creating a distinct buffer for upgrader families.`,
        metricBadge: {
          icon: 'insights',
          text: `Quant Model: Downside protected by estimated 4.7% net rental yields.`,
          highlightColor: 'secondary',
        },
      },
      {
        id: 'mod-2',
        moduleNumber: 'MODULE 02',
        tag: 'CPF SUBSIDY ANALYSIS',
        title: 'First-Timer Grants & Loan Assessment',
        body: `Eligible first-timer buyers qualify for up to $80,000 EHG plus Family Grant subsidies. With remaining leasehold longevity compliant with MAS guidelines, total capital expenditure amortizes cleanly with zero out-of-pocket cash requirements under CPF OA payroll deductions.`,
        metricBadge: {
          icon: 'savings',
          text: `Net Capital Outlay: Subsidies absorb up to $120,000 in direct acquisition expenses.`,
          highlightColor: 'primary',
        },
      },
      {
        id: 'mod-3',
        moduleNumber: 'MODULE 03',
        tag: 'CIVIC RADIUS AUDIT',
        title: 'OneMap Geospatial & School Prioritization',
        body: `Centroid calculations establish primary schooling options within the vital <1km Phase 2C envelope, optimizing home-school distance prioritization without extreme oversubscription attrition.`,
        metricBadge: {
          icon: 'explore',
          text: `Civic Envelope: Direct primary school choice under 500 meters walking distance.`,
          highlightColor: 'secondary',
        },
      },
      {
        id: 'mod-4',
        moduleNumber: 'MODULE 04',
        tag: 'BUY VS RENT QUANT',
        title: 'Buy vs. Rent Financial Summary',
        body: `At prevailing local market lease rates, renting over a 5-year tenure represents an unrecoverable capital drain exceeding $175,000. Amortising under a 2.60% concessionary loan builds tangible equity, achieving financial breakeven within 15 months.`,
        metricBadge: {
          icon: 'price_check',
          text: `Verdict: Decisive financial advantage favor acquisition over leasing.`,
          highlightColor: 'secondary',
        },
      },
    ],
  };
}
