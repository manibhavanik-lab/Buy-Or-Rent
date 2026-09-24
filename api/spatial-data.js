/**
 * Curated Singapore spatial GIS datasets:
 * - MRT Stations with Line identification
 * - MOE Primary Schools with coordinates (for 1km & 2km Phase 2C radii)
 * - Major Hawker Centers
 * - Key Supermarkets
 * - Major Parks & Green Spaces
 */

export const MRT_STATIONS = [
  // North-South Line (NSL)
  { name: 'Ang Mo Kio (NS16)', lat: 1.3699, lon: 103.8496, line: 'North-South' },
  { name: 'Yio Chu Kang (NS15)', lat: 1.3817, lon: 103.8449, line: 'North-South' },
  { name: 'Bishan (NS17/CC15)', lat: 1.3508, lon: 103.8481, line: 'North-South / Circle' },
  { name: 'Braddell (NS18)', lat: 1.3405, lon: 103.8468, line: 'North-South' },
  { name: 'Toa Payoh (NS19)', lat: 1.3327, lon: 103.8476, line: 'North-South' },
  { name: 'Novena (NS20)', lat: 1.3204, lon: 103.8438, line: 'North-South' },
  { name: 'Newton (NS21/DT11)', lat: 1.3129, lon: 103.8380, line: 'North-South / Downtown' },
  { name: 'Orchard (NS22/TE14)', lat: 1.3040, lon: 103.8318, line: 'North-South / Thomson-East Coast' },
  { name: 'Somerset (NS23)', lat: 1.3003, lon: 103.8390, line: 'North-South' },
  { name: 'Dhoby Ghaut (NS24/NE6/CC1)', lat: 1.2987, lon: 103.8459, line: 'North-South / North-East / Circle' },
  { name: 'City Hall (NS25/EW13)', lat: 1.2930, lon: 103.8522, line: 'North-South / East-West' },
  { name: 'Raffles Place (NS26/EW14)', lat: 1.2839, lon: 103.8515, line: 'North-South / East-West' },
  { name: 'Marina Bay (NS27/CE2/TE20)', lat: 1.2764, lon: 103.8546, line: 'North-South / Circle / TEL' },
  { name: 'Khatib (NS14)', lat: 1.4172, lon: 103.8329, line: 'North-South' },
  { name: 'Yishun (NS13)', lat: 1.4294, lon: 103.8350, line: 'North-South' },
  { name: 'Woodlands (NS9/TE2)', lat: 1.4368, lon: 103.7865, line: 'North-South / TEL' },
  { name: 'Jurong East (NS1/EW24)', lat: 1.3331, lon: 103.7423, line: 'North-South / East-West' },

  // East-West Line (EWL)
  { name: 'Tampines (EW2/DT32)', lat: 1.3532, lon: 103.9452, line: 'East-West / Downtown' },
  { name: 'Bedok (EW5)', lat: 1.3240, lon: 103.9300, line: 'East-West' },
  { name: 'Paya Lebar (EW8/CC9)', lat: 1.3182, lon: 103.8931, line: 'East-West / Circle' },
  { name: 'Bugis (EW12/DT14)', lat: 1.3005, lon: 103.8560, line: 'East-West / Downtown' },
  { name: 'Tanjong Pagar (EW15)', lat: 1.2765, lon: 103.8458, line: 'East-West' },
  { name: 'Outram Park (EW16/NE3/TE17)', lat: 1.2803, lon: 103.8395, line: 'East-West / North-East / TEL' },
  { name: 'Tiong Bahru (EW17)', lat: 1.2865, lon: 103.8270, line: 'East-West' },
  { name: 'Redhill (EW18)', lat: 1.2896, lon: 103.8168, line: 'East-West' },
  { name: 'Queenstown (EW19)', lat: 1.2944, lon: 103.8060, line: 'East-West' },
  { name: 'Commonwealth (EW20)', lat: 1.3025, lon: 103.7983, line: 'East-West' },
  { name: 'Buona Vista (EW21/CC22)', lat: 1.3073, lon: 103.7900, line: 'East-West / Circle' },
  { name: 'Clementi (EW23)', lat: 1.3151, lon: 103.7652, line: 'East-West' },

  // North-East Line (NEL)
  { name: 'Serangoon (NE12/CC13)', lat: 1.3497, lon: 103.8736, line: 'North-East / Circle' },
  { name: 'Kovan (NE13)', lat: 1.3601, lon: 103.8850, line: 'North-East' },
  { name: 'Hougang (NE14/CR8)', lat: 1.3712, lon: 103.8924, line: 'North-East / Cross Island' },
  { name: 'Buangkok (NE15)', lat: 1.3828, lon: 103.8931, line: 'North-East' },
  { name: 'Sengkang (NE16/STC)', lat: 1.3916, lon: 103.8954, line: 'North-East / LRT' },
  { name: 'Punggol (NE17/PTC/CP4)', lat: 1.4052, lon: 103.9023, line: 'North-East / LRT / Cross Island' },

  // Circle Line (CCL)
  { name: 'Lorong Chuan (CC14)', lat: 1.3516, lon: 103.8637, line: 'Circle' },
  { name: 'Marymount (CC16)', lat: 1.3487, lon: 103.8394, line: 'Circle' },
  { name: 'Caldecott (CC17/TE9)', lat: 1.3378, lon: 103.8395, line: 'Circle / Thomson-East Coast' },
  { name: 'Botanic Gardens (CC19/DT9)', lat: 1.3223, lon: 103.8153, line: 'Circle / Downtown' },

  // Thomson-East Coast Line (TEL)
  { name: 'Mayflower (TE6)', lat: 1.3695, lon: 103.8365, line: 'Thomson-East Coast' },
  { name: 'Bright Hill (TE7/CR13)', lat: 1.3632, lon: 103.8330, line: 'Thomson-East Coast / Cross Island' },
  { name: 'Upper Thomson (TE8)', lat: 1.3544, lon: 103.8329, line: 'Thomson-East Coast' },
  { name: 'Lentor (TE5)', lat: 1.3855, lon: 103.8359, line: 'Thomson-East Coast' },
  { name: 'Marine Parade (TE26)', lat: 1.3032, lon: 103.9054, line: 'Thomson-East Coast' },
  { name: 'Tanjong Katong (TE25)', lat: 1.2995, lon: 103.8966, line: 'Thomson-East Coast' }
];

export const PRIMARY_SCHOOLS = [
  // Ang Mo Kio & Bishan & Serangoon
  { name: 'Townsville Primary School', lat: 1.3633, lon: 103.8548, town: 'ANG MO KIO' },
  { name: 'Teck Ghee Primary School', lat: 1.3601, lon: 103.8504, town: 'ANG MO KIO' },
  { name: 'Catholic High School (Primary)', lat: 1.3547, lon: 103.8447, town: 'BISHAN' },
  { name: 'CHIJ St. Nicholas Girls\' School', lat: 1.3734, lon: 103.8340, town: 'ANG MO KIO' },
  { name: 'Jing Shan Primary School', lat: 1.3702, lon: 103.8505, town: 'ANG MO KIO' },
  { name: 'Mayflower Primary School', lat: 1.3655, lon: 103.8398, town: 'ANG MO KIO' },
  { name: 'Ang Mo Kio Primary School', lat: 1.3691, lon: 103.8395, town: 'ANG MO KIO' },
  { name: 'Ai Tong School', lat: 1.3606, lon: 103.8358, town: 'BISHAN' },
  { name: 'Kuo Chuan Presbyterian Primary', lat: 1.3496, lon: 103.8549, town: 'BISHAN' },
  { name: 'Guangyang Primary School', lat: 1.3468, lon: 103.8542, town: 'BISHAN' },
  { name: 'Rosyth School', lat: 1.3728, lon: 103.8741, town: 'SERANGOON' },
  { name: 'Zhonghua Primary School', lat: 1.3602, lon: 103.8698, town: 'SERANGOON' },
  { name: 'CHIJ Our Lady of Good Counsel', lat: 1.3562, lon: 103.8649, town: 'SERANGOON' },

  // Toa Payoh & Novena
  { name: 'CHIJ Primary (Toa Payoh)', lat: 1.3326, lon: 103.8427, town: 'TOA PAYOH' },
  { name: 'Kheng Cheng School', lat: 1.3364, lon: 103.8496, town: 'TOA PAYOH' },
  { name: 'Pei Chun Public School', lat: 1.3377, lon: 103.8548, town: 'TOA PAYOH' },
  { name: 'First Toa Payoh Primary School', lat: 1.3398, lon: 103.8587, town: 'TOA PAYOH' },
  { name: 'St. Joseph\'s Institution Junior', lat: 1.3195, lon: 103.8471, town: 'NOVENA' },
  { name: 'Anglo-Chinese School (Junior)', lat: 1.3093, lon: 103.8415, town: 'NEWTON' },
  { name: 'Anglo-Chinese School (Primary)', lat: 1.3184, lon: 103.8356, town: 'BARKER' },

  // Bukit Timah & Central & Queenstown
  { name: 'Nanyang Primary School', lat: 1.3213, lon: 103.8078, town: 'BUKIT TIMAH' },
  { name: 'Raffles Girls\' Primary School', lat: 1.3298, lon: 103.8062, town: 'BUKIT TIMAH' },
  { name: 'Henry Park Primary School', lat: 1.3168, lon: 103.7778, town: 'BUKIT TIMAH' },
  { name: 'Pei Hwa Presbyterian Primary', lat: 1.3380, lon: 103.7761, town: 'BUKIT TIMAH' },
  { name: 'Fairfield Methodist School (Primary)', lat: 1.3005, lon: 103.7845, town: 'QUEENSTOWN' },
  { name: 'Queenstown Primary School', lat: 1.2995, lon: 103.8058, town: 'QUEENSTOWN' },
  { name: 'New Town Primary School', lat: 1.3021, lon: 103.7997, town: 'QUEENSTOWN' },

  // Tampines, Pasir Ris & Bedok
  { name: 'Poi Ching School', lat: 1.3577, lon: 103.9392, town: 'TAMPINES' },
  { name: 'St. Hilda\'s Primary School', lat: 1.3491, lon: 103.9366, town: 'TAMPINES' },
  { name: 'Tampines Primary School', lat: 1.3508, lon: 103.9482, town: 'TAMPINES' },
  { name: 'Chongzheng Primary School', lat: 1.3512, lon: 103.9529, town: 'TAMPINES' },
  { name: 'Red Swastika School', lat: 1.3323, lon: 103.9329, town: 'BEDOK' },
  { name: 'Yu Neng Primary School', lat: 1.3338, lon: 103.9341, town: 'BEDOK' },
  { name: 'Temasek Primary School', lat: 1.3175, lon: 103.9427, town: 'BEDOK' },
  { name: 'Casuarina Primary School', lat: 1.3734, lon: 103.9575, town: 'PASIR RIS' },
  { name: 'Elias Park Primary School', lat: 1.3756, lon: 103.9442, town: 'PASIR RIS' },

  // Sengkang & Punggol & Hougang
  { name: 'Nan Chiau Primary School', lat: 1.3934, lon: 103.8893, town: 'SENGKANG' },
  { name: 'Compassvale Primary School', lat: 1.3938, lon: 103.9002, town: 'SENGKANG' },
  { name: 'Anchor Green Primary School', lat: 1.3905, lon: 103.8872, town: 'SENGKANG' },
  { name: 'Mee Toh School', lat: 1.4019, lon: 103.9095, town: 'PUNGGOL' },
  { name: 'Horizon Primary School', lat: 1.4005, lon: 103.9142, town: 'PUNGGOL' },
  { name: 'Punggol Green Primary School', lat: 1.4022, lon: 103.8992, town: 'PUNGGOL' },
  { name: 'Holy Innocents\' Primary School', lat: 1.3686, lon: 103.8963, town: 'HOUGANG' },
  { name: 'CHIJ Our Lady of the Nativity', lat: 1.3725, lon: 103.8988, town: 'HOUGANG' },
  { name: 'Montfort Junior School', lat: 1.3721, lon: 103.8885, town: 'HOUGANG' },

  // Jurong & Clementi & Bukit Batok & Woodlands
  { name: 'Rulang Primary School', lat: 1.3468, lon: 103.7188, town: 'JURONG WEST' },
  { name: 'Jurong Primary School', lat: 1.3498, lon: 103.7292, town: 'JURONG WEST' },
  { name: 'Nan Hua Primary School', lat: 1.3218, lon: 103.7612, town: 'CLEMENTI' },
  { name: 'Clementi Primary School', lat: 1.3168, lon: 103.7668, town: 'CLEMENTI' },
  { name: 'Pei Tong Primary School', lat: 1.3164, lon: 103.7702, town: 'CLEMENTI' },
  { name: 'Princess Elizabeth Primary School', lat: 1.3492, lon: 103.7431, town: 'BUKIT BATOK' },
  { name: 'Bukit Panjang Primary School', lat: 1.3734, lon: 103.7692, town: 'BUKIT PANJANG' },
  { name: 'South View Primary School', lat: 1.3812, lon: 103.7475, town: 'CHOA CHU KANG' },
  { name: 'Innova Primary School', lat: 1.4302, lon: 103.7915, town: 'WOODLANDS' }
];

export const HAWKER_CENTERS = [
  { name: 'Chong Boon Market & Food Centre (Blk 453A)', lat: 1.3678, lon: 103.8550 },
  { name: 'Teck Ghee Square Food Centre (Blk 409)', lat: 1.3629, lon: 103.8549 },
  { name: 'Teck Ghee Court Market & Food Centre (Blk 341)', lat: 1.3637, lon: 103.8488 },
  { name: 'Kebun Baru Market & Food Centre (Blk 226H)', lat: 1.3672, lon: 103.8398 },
  { name: 'Mayflower Market & Food Centre (Blk 162)', lat: 1.3735, lon: 103.8392 },
  { name: 'Cheng San Market & Cooked Food Centre (Blk 527)', lat: 1.3728, lon: 103.8542 },
  { name: 'Bishan Cafeteria & Food Centre (Blk 514A)', lat: 1.3508, lon: 103.8487 },
  { name: 'Toa Payoh West Market & Food Centre (Blk 127)', lat: 1.3346, lon: 103.8440 },
  { name: 'Whampoa Makan Place (Blk 91/92)', lat: 1.3235, lon: 103.8553 },
  { name: 'Old Airport Road Food Centre (Blk 51)', lat: 1.3082, lon: 103.8858 },
  { name: 'Maxwell Food Centre', lat: 1.2803, lon: 103.8447 },
  { name: 'Amoy Street Food Centre', lat: 1.2792, lon: 103.8467 },
  { name: 'Tiong Bahru Market & Food Centre', lat: 1.2851, lon: 103.8322 },
  { name: 'Adam Road Food Centre', lat: 1.3241, lon: 103.8142 },
  { name: 'Chomp Chomp Food Centre (Serangoon Gardens)', lat: 1.3642, lon: 103.8665 },
  { name: 'Tampines Round Market & Food Centre (Blk 137)', lat: 1.3458, lon: 103.9442 },
  { name: 'Bedok 85 Fengshan Market & Food Centre', lat: 1.3318, lon: 103.9385 },
  { name: 'Yuhua Village Market & Food Centre', lat: 1.3435, lon: 103.7388 },
  { name: 'Bukit Panjang Hawker Centre & Market', lat: 1.3780, lon: 103.7665 }
];

export const SUPERMARKETS = [
  { name: 'Giant Supermarket (Ang Mo Kio Blk 422)', lat: 1.3657, lon: 103.8561 },
  { name: 'FairPrice Finest (AMK Hub B2)', lat: 1.3695, lon: 103.8488 },
  { name: 'Sheng Siong Supermarket (Blk 122 AMK)', lat: 1.3705, lon: 103.8410 },
  { name: 'FairPrice Xtra (AMK Hub)', lat: 1.3692, lon: 103.8485 },
  { name: 'Cold Storage (Junction 8)', lat: 1.3502, lon: 103.8489 },
  { name: 'FairPrice (Toa Payoh HDB Hub)', lat: 1.3323, lon: 103.8480 },
  { name: 'Cold Storage (Takashimaya / Orchard)', lat: 1.3025, lon: 103.8340 },
  { name: 'Don Don Donki (100 AM Tanjong Pagar)', lat: 1.2748, lon: 103.8433 },
  { name: 'FairPrice Finest (Waterway Point Punggol)', lat: 1.4065, lon: 103.9022 },
  { name: 'FairPrice (Tampines Mall)', lat: 1.3528, lon: 103.9450 },
  { name: 'Sheng Siong (Bedok Central)', lat: 1.3250, lon: 103.9312 },
  { name: 'FairPrice Xtra (Jem Jurong East)', lat: 1.3330, lon: 103.7432 }
];

export const PARKS = [
  { name: 'Bishan-Ang Mo Kio Park', lat: 1.3630, lon: 103.8465 },
  { name: 'Ang Mo Kio Town Garden East', lat: 1.3688, lon: 103.8525 },
  { name: 'Ang Mo Kio Town Garden West', lat: 1.3755, lon: 103.8398 },
  { name: 'MacRitchie Reservoir Park', lat: 1.3435, lon: 103.8345 },
  { name: 'Singapore Botanic Gardens (UNESCO)', lat: 1.3138, lon: 103.8159 },
  { name: 'East Coast Park', lat: 1.3015, lon: 103.9125 },
  { name: 'Punggol Waterway Park', lat: 1.4085, lon: 103.9055 },
  { name: 'Jurong Lake Gardens', lat: 1.3385, lon: 103.7290 },
  { name: 'Bukit Timah Nature Reserve', lat: 1.3547, lon: 103.7764 },
  { name: 'Telok Blangah Hill Park & Mount Faber', lat: 1.2785, lon: 103.8160 }
];
