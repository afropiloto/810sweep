import { Market, User, Position } from '../types';
import { addDays } from 'date-fns';

export const currentUser: User = {
  id: 'u1',
  username: 'trader_joe',
  avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&q=80',
  balance: 1500.50,
  bio: 'Prediction market degenerate. Betting on the future, one trade at a time.',
  socials: {
    twitter: 'trader_joe',
    tiktok: 'trader_joe_official',
  },
  stats: {
    winRate: 68,
    totalProfit: 4250.00,
    marketsCreated: 12,
    trades: 145,
  },
  badges: ['Early Adopter', 'Whale', 'Pro Trader'],
};

const avatars = [
  '1534528741775-53994a69daeb', '1506794778202-cad84cf45f1d', '1531746020798-e6953c6e8e04', '1570295999919-56ceb5ecca61', '1560250097-0b93528c311a',
  '1519085360753-af0119f7cbe7', '1522075469751-3a6694fb2f61', '1500648767791-00dcc994a43e', '1507003211169-0a1dd7228f2d', '1544005313-94ddf0286df2'
];

const backgrounds = [
  '1540039155732-68473678c4b5', '1470229722913-7c090b332f7f', '1515886657613-9f3515b0c78f', '1522337360788-8b13dee7a37e', '1518605368461-1ee123dc3c52',
  '1504450758481-7338eba7524a', '1579952363873-27f3bade9f55', '1598550874175-4d0ef436c909', '1589903308904-1010c2294adc', '1611162617474-5b21e879e113'
];

export const rawMarketsData: Market[] = [
  // 1. CLIENT INVESTOR: Flovely (Tomorrowland, Coachella, Electify.Vote)
  {
    id: '0x810f1001',
    creator: {
      id: 'c_flovely',
      username: 'flovely',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
      balance: 500000,
      bio: 'Flovely Curates Luxury Festival Travel Experiences & Official Tomorrowland Partner',
      socials: { twitter: 'flovely_travel', tiktok: 'flovelyofficial' },
      badges: ['Official Client Partner', 'Tomorrowland Partner', 'VIP Hospitality']
    },
    marketCreator: {
      id: 'mc_810',
      username: '810_institutional',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
      balance: 1000000
    },
    contentUrl: '/images/flovely_experience.jpg',
    imageUrl: '/images/flovely_experience.jpg',
    contentType: 'image',
    question: 'Will Flovely sell out all Tomorrowland Belgium 2027 VIP Prologue & DreamVille packages within 24 hours of release?',
    metricLabel: 'Packages Sold',
    currentValue: 1890,
    targetValue: 2500,
    endTime: addDays(new Date(), 5).toISOString(),
    yesPrice: 0.74,
    noPrice: 0.26,
    volume: 4280000,
    liquidity: 680000,
    category: 'Events',
    whales: [
      { username: '0x89...2A', position: 'YES', amount: 85000 },
      { username: '0x3F...1B', position: 'YES', amount: 62000 }
    ]
  },
  {
    id: '0x810f1002',
    creator: {
      id: 'c_electify',
      username: 'electify.flovely',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
      balance: 250000,
      bio: 'Official Electify.vote Fan Governance Platform for Flovely Luxury Destinations & VIP Retreats',
      socials: { twitter: 'electify_vote', tiktok: 'electify_vote' },
      badges: ['Electify.Vote', 'Community Governance', 'Official Ballot']
    },
    marketCreator: {
      id: 'mc_electify',
      username: 'vote_curator',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80',
      balance: 500000
    },
    contentUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1000&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1000&q=80',
    contentType: 'image',
    question: 'Will the Flovely Electify.vote community ballot crown Ibiza over Aspen for the 2027 VIP Retreat Destination?',
    metricLabel: 'Electify.Vote Tally',
    currentValue: 38420,
    targetValue: 50000,
    endTime: addDays(new Date(), 4).toISOString(),
    yesPrice: 0.63,
    noPrice: 0.37,
    volume: 2190000,
    liquidity: 420000,
    category: 'Events',
    whales: [
      { username: '0x71...5C', position: 'YES', amount: 45000 }
    ]
  },
  {
    id: '0x810f1003',
    creator: {
      id: 'c_flovely',
      username: 'flovely',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
      balance: 500000,
      bio: 'Flovely Curates Luxury Festival Travel Experiences & Official Tomorrowland Partner',
      socials: { twitter: 'flovely_travel', tiktok: 'flovelyofficial' },
      badges: ['Official Client Partner', 'VIP Hospitality']
    },
    marketCreator: {
      id: 'mc_810',
      username: '810_institutional',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
      balance: 1000000
    },
    contentUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1000&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1000&q=80',
    contentType: 'image',
    question: 'Will Flovely\'s Coachella 2027 Ultra-VIP Safari Residence & Artist Pass bookings surpass $3.0M total volume?',
    metricLabel: 'VIP Bookings ($)',
    currentValue: 2420000,
    targetValue: 3000000,
    endTime: addDays(new Date(), 6).toISOString(),
    yesPrice: 0.68,
    noPrice: 0.32,
    volume: 3450000,
    liquidity: 510000,
    category: 'Events',
    whales: [
      { username: '0x4D...90', position: 'YES', amount: 90000 }
    ]
  },

  // 2. CLIENT INVESTOR: LOL International (Team Wang Under The Castle, Supersound, Agency)
  {
    id: '0x810c2001',
    creator: {
      id: 'c_lol',
      username: 'lolinternational',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
      balance: 750000,
      bio: 'LOL International Bangkok | Premier Entertainment Agency, Concert Organizer & Brand Ambassadors',
      socials: { twitter: 'lol_international', tiktok: 'lolinternational' },
      badges: ['Client Investor', 'Team Wang Partner', 'Agency Elite']
    },
    marketCreator: {
      id: 'mc_asia',
      username: 'asia_pulse',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&q=80',
      balance: 400000
    },
    contentUrl: '/images/lol_under_castle.jpg',
    imageUrl: '/images/lol_under_castle.jpg',
    contentType: 'image',
    question: 'Will TEAM WANG design (Jackson Wang) & LOL International expand "Under The Castle" (UTC) to Tokyo or Singapore this year?',
    metricLabel: 'City Expansion',
    currentValue: 1,
    targetValue: 2,
    endTime: addDays(new Date(), 5).toISOString(),
    yesPrice: 0.78,
    noPrice: 0.22,
    volume: 4620000,
    liquidity: 720000,
    category: 'Artists & AI',
    whales: [
      { username: '0x22...E1', position: 'YES', amount: 110000 }
    ]
  },
  {
    id: '0x810c2002',
    creator: {
      id: 'c_supersound',
      username: 'supersound.fest',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80',
      balance: 300000,
      bio: 'Supersound Festival Bangkok | World-Class R&B, Hip-Hop & Pop by LOL International',
      socials: { twitter: 'supersound_fest', tiktok: 'supersoundbkk' },
      badges: ['LOL International', 'Mega Festival']
    },
    marketCreator: {
      id: 'mc_asia',
      username: 'asia_pulse',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&q=80',
      balance: 400000
    },
    contentUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1000&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1000&q=80',
    contentType: 'image',
    question: 'Will LOL International\'s Supersound Festival Bangkok 2027 sell out 40,000 passes in wave 1 launch?',
    metricLabel: 'Wave 1 Passes',
    currentValue: 32400,
    targetValue: 40000,
    endTime: addDays(new Date(), 7).toISOString(),
    yesPrice: 0.65,
    noPrice: 0.35,
    volume: 2840000,
    liquidity: 380000,
    category: 'Music',
    whales: [
      { username: '0x66...B4', position: 'YES', amount: 50000 }
    ]
  },
  {
    id: '0x810c2003',
    creator: {
      id: 'c_jackson',
      username: 'jacksonwang',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80',
      balance: 900000,
      bio: 'Jackson Wang | TEAM WANG design | MAGICMAN World Tour & LOL International Creative Partner',
      socials: { twitter: 'jacksonwang852', tiktok: 'jacksonwang' },
      badges: ['Global Superstar', 'TEAM WANG', 'MagicMan']
    },
    marketCreator: {
      id: 'mc_asia',
      username: 'asia_pulse',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&q=80',
      balance: 400000
    },
    contentUrl: '/images/lol_under_castle.jpg',
    imageUrl: '/images/lol_under_castle.jpg',
    contentType: 'image',
    question: 'Will Jackson Wang\'s next MAGICMAN Asia stadium tour leg gross over $20M in primary box office revenue?',
    metricLabel: 'Box Office ($)',
    currentValue: 16800000,
    targetValue: 20000000,
    endTime: addDays(new Date(), 6).toISOString(),
    yesPrice: 0.82,
    noPrice: 0.18,
    volume: 5310000,
    liquidity: 840000,
    category: 'Music',
    whales: [
      { username: '0xAA...19', position: 'YES', amount: 120000 }
    ]
  },

  // 3. AI ARTISTS & DIGITAL CULTURE
  {
    id: '0x810a3001',
    creator: {
      id: 'c_refik',
      username: 'refikanadol',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&q=80',
      balance: 450000,
      bio: 'Refik Anadol Studio | Pioneer in Generative AI Data Sculptures & Media Architecture at MoMA and Sphere',
      socials: { twitter: 'refikanadol', tiktok: 'refikanadolstudio' },
      badges: ['AI Pioneer', 'Digital Fine Art', 'Sphere Artist']
    },
    marketCreator: {
      id: 'mc_ai',
      username: 'neural_collector',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&q=80',
      balance: 300000
    },
    contentUrl: '/images/refik_ai_art.jpg',
    imageUrl: '/images/refik_ai_art.jpg',
    contentType: 'image',
    question: 'Will Refik Anadol\'s generative AI data sculpture exhibit announce a permanent residency at the Las Vegas Sphere?',
    metricLabel: 'Sphere Residency',
    currentValue: 1,
    targetValue: 1,
    endTime: addDays(new Date(), 5).toISOString(),
    yesPrice: 0.71,
    noPrice: 0.29,
    volume: 3640000,
    liquidity: 590000,
    category: 'Artists & AI',
    whales: [
      { username: '0xEF...88', position: 'YES', amount: 75000 }
    ]
  },
  {
    id: '0x810a3002',
    creator: {
      id: 'c_grimes',
      username: 'grimes_ai',
      avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80',
      balance: 380000,
      bio: 'Elf.Tech by Grimes | Decentralized AI Voice Licensing, Web3 Music & Creator Royalties',
      socials: { twitter: 'grimezsz', tiktok: 'grimes' },
      badges: ['AI Music Innovator', 'Elf.Tech', 'Vocal Model']
    },
    marketCreator: {
      id: 'mc_ai',
      username: 'neural_collector',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&q=80',
      balance: 300000
    },
    contentUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&q=80',
    contentType: 'image',
    question: 'Will a community song created using Grimes\' Elf.Tech open-source AI voice model reach 50M Spotify streams?',
    metricLabel: 'Spotify Streams',
    currentValue: 37200000,
    targetValue: 50000000,
    endTime: addDays(new Date(), 8).toISOString(),
    yesPrice: 0.49,
    noPrice: 0.51,
    volume: 2950000,
    liquidity: 430000,
    category: 'Artists & AI',
    whales: [
      { username: '0x01...CC', position: 'NO', amount: 40000 }
    ]
  },
  {
    id: '0x810a3003',
    creator: {
      id: 'c_sora',
      username: 'sora_cinema',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&q=80',
      balance: 200000,
      bio: 'Generative AI Cinema & Next-Gen Music Visualizers Collective',
      badges: ['Generative Video', 'Cinema Tech']
    },
    marketCreator: {
      id: 'mc_ai',
      username: 'neural_collector',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&q=80',
      balance: 300000
    },
    contentUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1000&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1000&q=80',
    contentType: 'image',
    question: 'Will a fully AI-generated music video receive an official nomination at the 2027 MTV VMAs or Grammy Awards?',
    metricLabel: 'Major Award Nom',
    currentValue: 0,
    targetValue: 1,
    endTime: addDays(new Date(), 9).toISOString(),
    yesPrice: 0.56,
    noPrice: 0.44,
    volume: 2150000,
    liquidity: 310000,
    category: 'Artists & AI',
    whales: [
      { username: '0x5B...99', position: 'YES', amount: 35000 }
    ]
  },

  // 4. TRENDING US ATHLETES (2026/2027 TIMELINE)
  {
    id: '0x810s4001',
    creator: {
      id: 'c_caitlin',
      username: 'caitlinclark',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80',
      balance: 1200000,
      bio: 'Caitlin Clark | Indiana Fever #22 | All-Time Scoring Leader | Nike Signature Athlete',
      socials: { twitter: 'caitlinclark22', tiktok: 'caitlinclark22' },
      badges: ['WNBA All-Star', 'Nike Signature', 'Record Setter']
    },
    marketCreator: {
      id: 'mc_sports',
      username: 'hoops_prophet',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80',
      balance: 600000
    },
    contentUrl: '/images/caitlin_hoops.jpg',
    imageUrl: '/images/caitlin_hoops.jpg',
    contentType: 'image',
    question: 'Will Caitlin Clark\'s debut Nike signature sneaker line sell out globally within 15 minutes of launch?',
    metricLabel: 'Sellout Minutes',
    currentValue: 15,
    targetValue: 15,
    endTime: addDays(new Date(), 3).toISOString(),
    yesPrice: 0.86,
    noPrice: 0.14,
    volume: 7820000,
    liquidity: 1250000,
    category: 'Sports',
    whales: [
      { username: '0x99...3E', position: 'YES', amount: 250000 },
      { username: '0x1A...88', position: 'YES', amount: 180000 }
    ]
  },
  {
    id: '0x810s4002',
    creator: {
      id: 'c_edwards',
      username: 'theanthonyedwards',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80',
      balance: 1500000,
      bio: 'Anthony Edwards "Ant-Man" | Minnesota Timberwolves #5 | Olympic Gold Medalist | NBA Face of the League',
      socials: { twitter: 'theantedwards_', tiktok: 'anthonyedwards' },
      badges: ['NBA Superstar', 'Olympic Gold', 'AE1 Sneaker']
    },
    marketCreator: {
      id: 'mc_sports',
      username: 'hoops_prophet',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80',
      balance: 600000
    },
    contentUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1000&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1000&q=80',
    contentType: 'image',
    question: 'Will Anthony Edwards average 30.0+ PPG and lead the Timberwolves to the Western Conference Finals?',
    metricLabel: 'PPG & WCF',
    currentValue: 28.6,
    targetValue: 30.0,
    endTime: addDays(new Date(), 5).toISOString(),
    yesPrice: 0.64,
    noPrice: 0.36,
    volume: 5120000,
    liquidity: 820000,
    category: 'Sports',
    whales: [
      { username: '0xBB...44', position: 'YES', amount: 130000 }
    ]
  },
  {
    id: '0x810s4003',
    creator: {
      id: 'c_ohtani',
      username: 'shoheiohtani',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
      balance: 2000000,
      bio: 'Shohei Ohtani | Los Angeles Dodgers #17 | 50/50 Club Pioneer & 2x MVP',
      socials: { twitter: 'shoheiohtani', tiktok: 'dodgers' },
      badges: ['MLB Icon', 'Dodgers Champion', '50/50 Club']
    },
    marketCreator: {
      id: 'mc_sports',
      username: 'hoops_prophet',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80',
      balance: 600000
    },
    contentUrl: 'https://images.unsplash.com/photo-1508344928928-7165b67de128?w=1000&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1508344928928-7165b67de128?w=1000&q=80',
    contentType: 'image',
    question: 'Will Shohei Ohtani hit 55+ Home Runs and win back-to-back National League MVP Awards?',
    metricLabel: 'HRs & NL MVP',
    currentValue: 51,
    targetValue: 55,
    endTime: addDays(new Date(), 4).toISOString(),
    yesPrice: 0.79,
    noPrice: 0.21,
    volume: 8420000,
    liquidity: 1400000,
    category: 'Sports',
    whales: [
      { username: '0x77...8F', position: 'YES', amount: 210000 }
    ]
  },
  {
    id: '0x810s4004',
    creator: {
      id: 'c_mahomes',
      username: 'patrickmahomes',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80',
      balance: 2500000,
      bio: 'Patrick Mahomes | Kansas City Chiefs #15 | 3x Super Bowl MVP',
      socials: { twitter: 'patrickmahomes', tiktok: 'patrickmahomes' },
      badges: ['Super Bowl MVP', 'Chiefs Kingdom']
    },
    marketCreator: {
      id: 'mc_sports',
      username: 'hoops_prophet',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80',
      balance: 600000
    },
    contentUrl: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=1000&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=1000&q=80',
    contentType: 'image',
    question: 'Will Patrick Mahomes and the Kansas City Chiefs complete the historic NFL 3-Peat Super Bowl Championship?',
    metricLabel: 'Super Bowl Ring',
    currentValue: 1,
    targetValue: 1,
    endTime: addDays(new Date(), 6).toISOString(),
    yesPrice: 0.54,
    noPrice: 0.46,
    volume: 9850000,
    liquidity: 1650000,
    category: 'Sports',
    whales: [
      { username: '0xKC...15', position: 'YES', amount: 300000 }
    ]
  },
  {
    id: '0x810s4005',
    creator: {
      id: 'c_reese',
      username: 'angelreese',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
      balance: 800000,
      bio: 'Angel Reese "Chi-Barbie" | Chicago Sky #5 | WNBA Double-Double Record Holder | Reebok Athlete',
      socials: { twitter: 'reeceanjel', tiktok: 'angelreese' },
      badges: ['WNBA All-Star', 'Reebok Athlete', 'Rebound Queen']
    },
    marketCreator: {
      id: 'mc_sports',
      username: 'hoops_prophet',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80',
      balance: 600000
    },
    contentUrl: 'https://images.unsplash.com/photo-1519766304817-4f37bda74a29?w=1000&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1519766304817-4f37bda74a29?w=1000&q=80',
    contentType: 'image',
    question: 'Will Angel Reese record 25+ consecutive double-doubles to set a new historic all-time WNBA record?',
    metricLabel: 'Double-Doubles',
    currentValue: 21,
    targetValue: 25,
    endTime: addDays(new Date(), 5).toISOString(),
    yesPrice: 0.67,
    noPrice: 0.33,
    volume: 3760000,
    liquidity: 590000,
    category: 'Sports',
    whales: [
      { username: '0xEE...55', position: 'YES', amount: 95000 }
    ]
  },
  {
    id: '0x810s4006',
    creator: {
      id: 'c_wemby',
      username: 'victorwembanyama',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80',
      balance: 1100000,
      bio: 'Victor Wembanyama | San Antonio Spurs #1 | Rookie of the Year & Defensive Phenom',
      socials: { twitter: 'wemby', tiktok: 'wemby' },
      badges: ['Spurs Center', 'DPOY Frontrunner']
    },
    marketCreator: {
      id: 'mc_sports',
      username: 'hoops_prophet',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80',
      balance: 600000
    },
    contentUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1000&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1000&q=80',
    contentType: 'image',
    question: 'Will Victor Wembanyama record multiple 5x5 statlines and capture NBA Defensive Player of the Year?',
    metricLabel: '5x5 & DPOY',
    currentValue: 1,
    targetValue: 2,
    endTime: addDays(new Date(), 6).toISOString(),
    yesPrice: 0.74,
    noPrice: 0.26,
    volume: 4910000,
    liquidity: 780000,
    category: 'Sports',
    whales: [
      { username: '0x99...21', position: 'YES', amount: 140000 }
    ]
  },
  {
    id: '0x810s4007',
    creator: {
      id: 'c_gauff',
      username: 'cocogauff',
      avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80',
      balance: 950000,
      bio: 'Coco Gauff | US Open Champion | Team USA Olympic Flag Bearer',
      socials: { twitter: 'cocogauff', tiktok: 'cocogauff' },
      badges: ['Grand Slam Champion', 'Olympian']
    },
    marketCreator: {
      id: 'mc_sports',
      username: 'hoops_prophet',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80',
      balance: 600000
    },
    contentUrl: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=1000&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=1000&q=80',
    contentType: 'image',
    question: 'Will Coco Gauff capture two Grand Slam singles titles this tennis season?',
    metricLabel: 'Grand Slam Titles',
    currentValue: 1,
    targetValue: 2,
    endTime: addDays(new Date(), 7).toISOString(),
    yesPrice: 0.51,
    noPrice: 0.49,
    volume: 3140000,
    liquidity: 490000,
    category: 'Sports',
    whales: [
      { username: '0x43...10', position: 'YES', amount: 65000 }
    ]
  },

  // 5. TRENDING SOCIAL CULTURE & EVENTS
  {
    id: '0x810e5001',
    creator: {
      id: 'c_tomorrowland',
      username: 'tomorrowland',
      avatar: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80',
      balance: 2000000,
      bio: 'Tomorrowland Belgium | The World\'s Premier Electronic Dance Music Gathering',
      socials: { twitter: 'tomorrowland', tiktok: 'tomorrowland' },
      badges: ['Global Festival', 'Mainstage EDM']
    },
    marketCreator: {
      id: 'mc_culture',
      username: 'festival_insider',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&q=80',
      balance: 500000
    },
    contentUrl: 'https://images.unsplash.com/photo-1470229722913-7c090b332f7f?w=1000&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c090b332f7f?w=1000&q=80',
    contentType: 'image',
    question: 'Will Tomorrowland 2027 add a 3rd consecutive festival weekend to meet 1M+ global ticket waitlists?',
    metricLabel: '3rd Weekend',
    currentValue: 2,
    targetValue: 3,
    endTime: addDays(new Date(), 6).toISOString(),
    yesPrice: 0.62,
    noPrice: 0.38,
    volume: 5780000,
    liquidity: 920000,
    category: 'Events',
    whales: [
      { username: '0x99...3A', position: 'YES', amount: 160000 }
    ]
  },
  {
    id: '0x810g6001',
    creator: {
      id: 'c_rockstar',
      username: 'rockstargames',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80',
      balance: 3000000,
      bio: 'Rockstar Games | Grand Theft Auto VI Official Telemetry & Launch Milestone Tracking',
      socials: { twitter: 'rockstargames', tiktok: 'rockstargames' },
      badges: ['Gaming Titan', 'GTA VI']
    },
    marketCreator: {
      id: 'mc_culture',
      username: 'gaming_oracle',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80',
      balance: 700000
    },
    contentUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1000&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1000&q=80',
    contentType: 'image',
    question: 'Will GTA 6 Trailer 2 smash 120M views on YouTube in under 24 hours of premiere?',
    metricLabel: '24h Views',
    currentValue: 89000000,
    targetValue: 120000000,
    endTime: addDays(new Date(), 4).toISOString(),
    yesPrice: 0.89,
    noPrice: 0.11,
    volume: 11240000,
    liquidity: 2100000,
    category: 'Gaming',
    whales: [
      { username: '0xGT...06', position: 'YES', amount: 450000 }
    ]
  },
  {
    id: '0x810g6002',
    creator: {
      id: 'c_kaicenat',
      username: 'kaicenat',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
      balance: 1800000,
      bio: 'Kai Cenat | 2x Streamer of the Year | AMP | Cultural Phenom',
      socials: { twitter: 'kaicenat', tiktok: 'kaicenat' },
      badges: ['Twitch King', 'Streamer of Year']
    },
    marketCreator: {
      id: 'mc_culture',
      username: 'stream_radar',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
      balance: 300000
    },
    contentUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1000&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1000&q=80',
    contentType: 'image',
    question: 'Will Kai Cenat\'s next mega-marathon stream set a new peak concurrent viewership record over 800k viewers?',
    metricLabel: 'Peak CCV',
    currentValue: 712000,
    targetValue: 800000,
    endTime: addDays(new Date(), 5).toISOString(),
    yesPrice: 0.58,
    noPrice: 0.42,
    volume: 4420000,
    liquidity: 690000,
    category: 'Entertainment',
    whales: [
      { username: '0xKC...77', position: 'YES', amount: 110000 }
    ]
  },
  {
    id: '0x810g6003',
    creator: {
      id: 'c_speed',
      username: 'ishowspeed',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80',
      balance: 1400000,
      bio: 'IShowSpeed | Global IRL Streaming Icon | SUI',
      socials: { twitter: 'ishowspeedsui', tiktok: 'ishowspeed' },
      badges: ['IRL Legend', 'Breakout Streamer']
    },
    marketCreator: {
      id: 'mc_culture',
      username: 'stream_radar',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
      balance: 300000
    },
    contentUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1000&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1000&q=80',
    contentType: 'image',
    question: 'Will IShowSpeed do an in-person IRL livestream with Cristiano Ronaldo in Portugal before year-end?',
    metricLabel: 'IRL Collab',
    currentValue: 1,
    targetValue: 1,
    endTime: addDays(new Date(), 7).toISOString(),
    yesPrice: 0.67,
    noPrice: 0.33,
    volume: 7320000,
    liquidity: 1150000,
    category: 'Entertainment',
    whales: [
      { username: '0xCR...07', position: 'YES', amount: 240000 }
    ]
  },
  // 5. ATTENTION STOCK EXCHANGE: CONSUMER BRANDS & TECH GIANTS (Hype, Social Velocity, Viral Metrics)
  {
    id: '0x810t7001',
    creator: {
      id: 'c_apple',
      username: 'apple',
      avatar: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400&q=80',
      balance: 10000000,
      bio: 'Apple Inc. | Cupertino Official Keynote Telemetry & Product Velocity Exchange',
      socials: { twitter: 'apple', tiktok: 'apple' },
      badges: ['Tech Titan', 'Hardware King', '$AAPL Attention']
    },
    marketCreator: {
      id: 'mc_wallst',
      username: 'silicon_trader',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&q=80',
      balance: 2400000
    },
    contentUrl: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=1000&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=1000&q=80',
    contentType: 'image',
    question: 'Will Apple\'s M5 Vision Pro announcement video surpass 50M cross-platform views in 48 hours of premiere?',
    metricLabel: '48h Views',
    currentValue: 38200000,
    targetValue: 50000000,
    endTime: addDays(new Date(), 4).toISOString(),
    yesPrice: 0.68,
    noPrice: 0.32,
    volume: 8450000,
    liquidity: 1420000,
    category: 'Tech & Brands',
    whales: [
      { username: '0xAP...99', position: 'YES', amount: 320000 },
      { username: '0xVC...11', position: 'YES', amount: 185000 }
    ]
  },
  {
    id: '0x810t7002',
    creator: {
      id: 'c_openai',
      username: 'openai',
      avatar: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&q=80',
      balance: 8500000,
      bio: 'OpenAI | Frontier AI Lab | ChatGPT & Sora Attention Velocity',
      socials: { twitter: 'openai', tiktok: 'openai' },
      badges: ['Frontier AI', 'Sora & GPT-5', 'Hype Sovereign']
    },
    marketCreator: {
      id: 'mc_ai_desk',
      username: 'singularity_cap',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
      balance: 3100000
    },
    contentUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1000&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1000&q=80',
    contentType: 'image',
    question: 'Will OpenAI\'s GPT-5 launch livestream shatter 1.5M concurrent viewers across YouTube and X?',
    metricLabel: 'Peak Concurrent Viewers',
    currentValue: 1180000,
    targetValue: 1500000,
    endTime: addDays(new Date(), 3).toISOString(),
    yesPrice: 0.77,
    noPrice: 0.23,
    volume: 14200000,
    liquidity: 2350000,
    category: 'Tech & Brands',
    whales: [
      { username: '0xAI...42', position: 'YES', amount: 550000 },
      { username: '0x00...88', position: 'YES', amount: 390000 }
    ]
  },
  {
    id: '0x810t7003',
    creator: {
      id: 'c_tesla',
      username: 'tesla',
      avatar: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=400&q=80',
      balance: 9000000,
      bio: 'Tesla | Cybercab & Optimus Attention Capital Market',
      socials: { twitter: 'tesla', tiktok: 'tesla' },
      badges: ['Autonomous Fleet', 'Elon Cult', '$TSLA Hype']
    },
    marketCreator: {
      id: 'mc_wallst',
      username: 'silicon_trader',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&q=80',
      balance: 2400000
    },
    contentUrl: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1000&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1000&q=80',
    contentType: 'image',
    question: 'Will Tesla Cybercab autonomous ride demo dominate as the #1 global trending topic on X for >12 consecutive hours?',
    metricLabel: 'Trending Hours #1',
    currentValue: 9.5,
    targetValue: 12,
    endTime: addDays(new Date(), 5).toISOString(),
    yesPrice: 0.62,
    noPrice: 0.38,
    volume: 9640000,
    liquidity: 1650000,
    category: 'Tech & Brands',
    whales: [
      { username: '0xTS...33', position: 'YES', amount: 280000 }
    ]
  },
  {
    id: '0x810t7004',
    creator: {
      id: 'c_liquiddeath',
      username: 'liquiddeath',
      avatar: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400&q=80',
      balance: 4000000,
      bio: 'Liquid Death | Murder Your Thirst | The King of Guerrilla Hype Marketing',
      socials: { twitter: 'liquiddeath', tiktok: 'liquiddeath' },
      badges: ['Guerrilla Marketing', 'Viral Monster', 'Gen-Z Obsession']
    },
    marketCreator: {
      id: 'mc_culture',
      username: 'brand_insider',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
      balance: 600000
    },
    contentUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=1000&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=1000&q=80',
    contentType: 'image',
    question: 'Will Liquid Death\'s viral stunt campaign hit 100M organic impressions on TikTok & Instagram in 72 hours?',
    metricLabel: '72h Impressions',
    currentValue: 76400000,
    targetValue: 100000000,
    endTime: addDays(new Date(), 4).toISOString(),
    yesPrice: 0.71,
    noPrice: 0.29,
    volume: 5120000,
    liquidity: 890000,
    category: 'Tech & Brands',
    whales: [
      { username: '0xLD...66', position: 'YES', amount: 150000 }
    ]
  },
  {
    id: '0x810t7005',
    creator: {
      id: 'c_nike',
      username: 'nike',
      avatar: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
      balance: 9500000,
      bio: 'Nike | Just Do It | Global Athlete Culture & Hype Release Center',
      socials: { twitter: 'nike', tiktok: 'nike' },
      badges: ['Sneaker Royalty', 'Athlete Equity', 'Brand Hegemony']
    },
    marketCreator: {
      id: 'mc_culture',
      username: 'kicks_analyst',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80',
      balance: 1100000
    },
    contentUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1000&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1000&q=80',
    contentType: 'image',
    question: 'Will Nike\'s Caitlin Clark signature shoe reveal post become Nike\'s most liked Instagram post of the year (>5M likes)?',
    metricLabel: 'IG Post Likes',
    currentValue: 3840000,
    targetValue: 5000000,
    endTime: addDays(new Date(), 6).toISOString(),
    yesPrice: 0.81,
    noPrice: 0.19,
    volume: 6890000,
    liquidity: 1120000,
    category: 'Tech & Brands',
    whales: [
      { username: '0xNK...88', position: 'YES', amount: 210000 }
    ]
  },
  {
    id: '0x810t7006',
    creator: {
      id: 'c_anthropic',
      username: 'anthropic',
      avatar: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&q=80',
      balance: 6000000,
      bio: 'Anthropic | Claude 3.7 / Claude 4 Frontier Intelligence Lab',
      socials: { twitter: 'anthropicai', tiktok: 'anthropic' },
      badges: ['Claude 3.7 Sonnet', 'Arena Leader', 'AI Frontier']
    },
    marketCreator: {
      id: 'mc_ai_desk',
      username: 'singularity_cap',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
      balance: 3100000
    },
    contentUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1000&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1000&q=80',
    contentType: 'image',
    question: 'Will Claude 3.7 maintain the #1 Elo rating on LMSYS Chatbot Arena Leaderboard for 30 consecutive days?',
    metricLabel: 'Consecutive Days #1',
    currentValue: 22,
    targetValue: 30,
    endTime: addDays(new Date(), 8).toISOString(),
    yesPrice: 0.73,
    noPrice: 0.27,
    volume: 8190000,
    liquidity: 1350000,
    category: 'Tech & Brands',
    whales: [
      { username: '0xCL...04', position: 'YES', amount: 340000 }
    ]
  },
  {
    id: '0x810t7007',
    creator: {
      id: 'c_meta',
      username: 'meta',
      avatar: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&q=80',
      balance: 8000000,
      bio: 'Meta | Ray-Ban Smart Glasses & Wearable AI Social Platform',
      socials: { twitter: 'meta', tiktok: 'meta' },
      badges: ['Wearable AI', 'TikTok Viral Tech', 'Smart Eyewear']
    },
    marketCreator: {
      id: 'mc_wallst',
      username: 'silicon_trader',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&q=80',
      balance: 2400000
    },
    contentUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=1000&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=1000&q=80',
    contentType: 'image',
    question: 'Will Ray-Ban Meta Smart Glasses POV videos exceed 2 Billion cumulative hashtag views on TikTok this quarter?',
    metricLabel: 'TikTok Hashtag Views',
    currentValue: 1640000000,
    targetValue: 2000000000,
    endTime: addDays(new Date(), 7).toISOString(),
    yesPrice: 0.84,
    noPrice: 0.16,
    volume: 7420000,
    liquidity: 1200000,
    category: 'Tech & Brands',
    whales: [
      { username: '0xRB...55', position: 'YES', amount: 190000 }
    ]
  },
  {
    id: '0x810t7008',
    creator: {
      id: 'c_nvidia',
      username: 'nvidia',
      avatar: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&q=80',
      balance: 12000000,
      bio: 'NVIDIA | Compute Engine of the Modern AI Era & Jensen Keynote Radar',
      socials: { twitter: 'nvidia', tiktok: 'nvidia' },
      badges: ['Compute King', 'GTC Keynote', '$NVDA Attention']
    },
    marketCreator: {
      id: 'mc_wallst',
      username: 'silicon_trader',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&q=80',
      balance: 2400000
    },
    contentUrl: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=1000&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=1000&q=80',
    contentType: 'image',
    question: 'Will Jensen Huang\'s keynote speech generate over 300,000 live social media posts with #NVIDIAGTC during the event window?',
    metricLabel: 'Social Post Volume',
    currentValue: 215000,
    targetValue: 300000,
    endTime: addDays(new Date(), 5).toISOString(),
    yesPrice: 0.65,
    noPrice: 0.35,
    volume: 10850000,
    liquidity: 1780000,
    category: 'Tech & Brands',
    whales: [
      { username: '0xNV...77', position: 'YES', amount: 480000 }
    ]
  },
  {
    id: '0x810t7009',
    creator: {
      id: 'c_duolingo',
      username: 'duolingo',
      avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80',
      balance: 3200000,
      bio: 'Duolingo | The Owl | Master of Unhinged TikTok Growth Marketing',
      socials: { twitter: 'duolingo', tiktok: 'duolingo' },
      badges: ['Viral Maestro', 'Mascot Hype', 'Brand Memetics']
    },
    marketCreator: {
      id: 'mc_culture',
      username: 'brand_insider',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
      balance: 600000
    },
    contentUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&q=80',
    contentType: 'image',
    question: 'Will Duolingo\'s mascot TikTok marketing video hit 50M views and become TikTok\'s most viral brand clip of the month?',
    metricLabel: 'TikTok Video Views',
    currentValue: 39100000,
    targetValue: 50000000,
    endTime: addDays(new Date(), 4).toISOString(),
    yesPrice: 0.69,
    noPrice: 0.31,
    volume: 4350000,
    liquidity: 750000,
    category: 'Tech & Brands',
    whales: [
      { username: '0xDU...12', position: 'YES', amount: 135000 }
    ]
  },
  {
    id: '0x810t7010',
    creator: {
      id: 'c_netflix',
      username: 'netflix',
      avatar: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=400&q=80',
      balance: 8500000,
      bio: 'Netflix | Global Streaming Giant | Squid Game 3 Attention Milestone',
      socials: { twitter: 'netflix', tiktok: 'netflix' },
      badges: ['Streaming King', 'Squid Game 3', 'Global Phenomenon']
    },
    marketCreator: {
      id: 'mc_culture',
      username: 'hollywood_quant',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80',
      balance: 1500000
    },
    contentUrl: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=1000&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=1000&q=80',
    contentType: 'image',
    question: 'Will Squid Game Season 3 record over 150 Million viewing hours in its debut weekend on Netflix Global Top 10?',
    metricLabel: 'Debut Hours Watched',
    currentValue: 124000000,
    targetValue: 150000000,
    endTime: addDays(new Date(), 6).toISOString(),
    yesPrice: 0.82,
    noPrice: 0.18,
    volume: 9140000,
    liquidity: 1530000,
    category: 'Entertainment',
    whales: [
      { username: '0xSQ...45', position: 'YES', amount: 260000 }
    ]
  },

  // ==========================================
  // HISTORIC & RESOLVED MARKETS (OLD MARKETS)
  // ==========================================
  {
    id: '0x810_old_1',
    creator: {
      id: 'c_caitlin_settled',
      username: 'caitlinclark22',
      avatar: '/images/caitlin_hoops.jpg',
      balance: 920000,
      bio: 'WNBA All-Star & Record Setter',
      badges: ['WNBA ROTY', 'Record Breaker', 'Nike Athlete']
    },
    marketCreator: {
      id: 'mc_hoops_archive',
      username: 'hoops_indexer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
      balance: 1000000
    },
    contentUrl: '/images/caitlin_hoops.jpg',
    imageUrl: '/images/caitlin_hoops.jpg',
    contentType: 'image',
    question: 'Will Caitlin Clark record a triple-double in her WNBA Rookie playoff debut?',
    metricLabel: 'Triple Double',
    currentValue: 1,
    targetValue: 1,
    endTime: '2026-05-28T22:00:00.000Z',
    yesPrice: 1.00,
    noPrice: 0.00,
    volume: 5840000,
    liquidity: 920000,
    category: 'Sports',
    status: 'resolved',
    resolutionOutcome: 'YES',
    resolvedAt: 'May 28, 2026',
    resolutionSource: 'Official WNBA Box Score & Elias Sports Bureau',
    whales: [
      { username: '0xFE...99', position: 'YES', amount: 140000 },
      { username: '0xCA...11', position: 'YES', amount: 98000 }
    ]
  },
  {
    id: '0x810_old_2',
    creator: {
      id: 'c_rockstar_settled',
      username: 'rockstargames',
      avatar: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&q=80',
      balance: 12000000,
      bio: 'Rockstar Games Official YouTube & Hype Registry',
      badges: ['Grand Theft Auto', 'Triple-A Gaming']
    },
    marketCreator: {
      id: 'mc_gaming_curator',
      username: 'game_stat_oracle',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
      balance: 850000
    },
    contentUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1000&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1000&q=80',
    contentType: 'image',
    question: 'Will GTA VI reveal trailer 2 hit 100M views in 24 hours on YouTube?',
    metricLabel: '24h YouTube Views',
    currentValue: 88400000,
    targetValue: 100000000,
    endTime: '2026-06-02T16:00:00.000Z',
    yesPrice: 0.00,
    noPrice: 1.00,
    volume: 14200000,
    liquidity: 2100000,
    category: 'Gaming',
    status: 'resolved',
    resolutionOutcome: 'NO',
    resolvedAt: 'June 02, 2026',
    resolutionSource: 'YouTube Data API v3 Verified Metric: 88.4M Views',
    whales: [
      { username: '0xBE...66', position: 'NO', amount: 320000 },
      { username: '0xGT...44', position: 'NO', amount: 210000 }
    ]
  },
  {
    id: '0x810_old_3',
    creator: {
      id: 'c_taylor_settled',
      username: 'taylorswift',
      avatar: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&q=80',
      balance: 15000000,
      bio: 'Taylor Swift Official Eras Film Box Office Distribution',
      badges: ['Grammy Legend', 'Eras Tour', 'Box Office Record']
    },
    marketCreator: {
      id: 'mc_boxoffice_oracle',
      username: 'boxoffice_pro',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80',
      balance: 1200000
    },
    contentUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1000&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1000&q=80',
    contentType: 'image',
    question: 'Will Taylor Swift\'s Eras Tour Film surpass $250M at the worldwide box office?',
    metricLabel: 'Worldwide Box Office ($)',
    currentValue: 261700000,
    targetValue: 250000000,
    endTime: '2026-06-14T23:59:59.000Z',
    yesPrice: 1.00,
    noPrice: 0.00,
    volume: 8900000,
    liquidity: 1400000,
    category: 'Entertainment',
    status: 'resolved',
    resolutionOutcome: 'YES',
    resolvedAt: 'June 14, 2026',
    resolutionSource: 'Box Office Mojo / Comscore Certified Total: $261.7M',
    whales: [
      { username: '0xSW...13', position: 'YES', amount: 210000 }
    ]
  },
  {
    id: '0x810_old_4',
    creator: {
      id: 'c_apple_settled',
      username: 'apple',
      avatar: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400&q=80',
      balance: 20000000,
      bio: 'Apple Inc. Keynote Product Architecture & WWDC Release',
      badges: ['Hardware Titan', 'WWDC 2026']
    },
    marketCreator: {
      id: 'mc_silicon_oracle',
      username: 'cupertino_leaks',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&q=80',
      balance: 1800000
    },
    contentUrl: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=1000&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=1000&q=80',
    contentType: 'image',
    question: 'Will Apple reveal an Ultra Foldable iPhone at WWDC 2026 keynote?',
    metricLabel: 'Hardware Announcement',
    currentValue: 0,
    targetValue: 1,
    endTime: '2026-06-10T19:00:00.000Z',
    yesPrice: 0.00,
    noPrice: 1.00,
    volume: 11400000,
    liquidity: 1800000,
    category: 'Tech & Brands',
    status: 'resolved',
    resolutionOutcome: 'NO',
    resolvedAt: 'June 10, 2026',
    resolutionSource: 'Apple Event Official Livestream Keynote (No Foldable announced)',
    whales: [
      { username: '0xAP...77', position: 'NO', amount: 280000 }
    ]
  }
];

export const mockMarkets: Market[] = rawMarketsData;

export const mockPositions: Position[] = [
  {
    marketId: '0x810f1001',
    position: 'YES',
    shares: 250,
    avgPrice: 0.65
  },
  {
    marketId: '0x810c2002',
    position: 'YES',
    shares: 300,
    avgPrice: 0.60
  }
];

export const mockSettledHistory: import('../types').SettledHistoryItem[] = [
  {
    id: 'sh-1',
    marketId: '0x810_old_1',
    title: 'Will Caitlin Clark record a triple-double in her WNBA Rookie playoff debut?',
    category: 'Sports',
    position: 'YES',
    outcome: 'YES',
    shares: 400,
    cost: 180,
    payout: 400,
    profit: 220,
    date: 'May 28, 2026',
    isWin: true
  },
  {
    id: 'sh-2',
    marketId: '0x810_old_2',
    title: 'Will GTA VI reveal trailer 2 hit 100M views in 24 hours on YouTube?',
    category: 'Gaming',
    position: 'YES',
    outcome: 'NO',
    shares: 300,
    cost: 165,
    payout: 0,
    profit: -165,
    date: 'Jun 02, 2026',
    isWin: false
  },
  {
    id: 'sh-3',
    marketId: '0x810_old_3',
    title: 'Will Taylor Swift\'s Eras Tour Film surpass $250M at the worldwide box office?',
    category: 'Entertainment',
    position: 'YES',
    outcome: 'YES',
    shares: 250,
    cost: 110,
    payout: 250,
    profit: 140,
    date: 'Jun 14, 2026',
    isWin: true
  }
];
