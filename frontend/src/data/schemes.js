// Mock government schemes data

export const schemes = [
  {
    id: "S001",
    name: "PM Krishi Sinchayee Yojana",
    shortName: "PMKSY",
    department: "Ministry of Agriculture & Farmers Welfare",
    category: "Irrigation",
    state: "All India",
    eligibility: "Small and marginal farmers with land holding below 2 Ha",
    benefits: "Subsidy up to 55% on micro-irrigation infrastructure. Drip and sprinkler system installation support.",
    maxBenefit: "₹80,000 per hectare",
    documents: ["7/12 Extract", "Aadhaar Card", "Bank Passbook", "Land Ownership Certificate"],
    status: "Active",
    deadline: "31 March 2027",
    tag: "Irrigation",
    tagColor: "blue",
    matched: true,
    matchReason: "Land holding below 2 Ha — Eligible for micro-irrigation subsidy"
  },
  {
    id: "S002",
    name: "Pradhan Mantri Fasal Bima Yojana",
    shortName: "PMFBY",
    department: "Ministry of Agriculture & Farmers Welfare",
    category: "Insurance",
    state: "All India",
    eligibility: "All farmers growing notified crops in notified areas",
    benefits: "Crop insurance coverage against natural calamities, pests and diseases. Sum insured up to full coverage of crop value.",
    maxBenefit: "₹2,00,000 per crop season",
    documents: ["7/12 Extract", "Aadhaar Card", "Bank Account", "Sowing Certificate"],
    status: "Active",
    deadline: "Kharif: 31 July 2026",
    tag: "Insurance",
    tagColor: "green",
    matched: true,
    matchReason: "Agricultural land classification — eligible for crop insurance"
  },
  {
    id: "S003",
    name: "Kisan Credit Card Scheme",
    shortName: "KCC",
    department: "NABARD / RBI",
    category: "Credit",
    state: "All India",
    eligibility: "Farmers, tenant farmers, oral lessees, sharecroppers with cultivable land",
    benefits: "Short-term credit for agricultural operations at subsidised interest rates of 4-7%.",
    maxBenefit: "₹3,00,000 credit limit",
    documents: ["7/12 Extract", "Identity Proof", "Address Proof", "Passport Photo"],
    status: "Active",
    deadline: "Ongoing",
    tag: "Credit",
    tagColor: "purple",
    matched: true,
    matchReason: "Agricultural land owner — eligible for KCC"
  },
  {
    id: "S004",
    name: "Maharashtra Bhumi Sudharna Yojana",
    shortName: "MBSY",
    department: "Maharashtra Revenue Department",
    category: "Land Development",
    state: "Maharashtra",
    eligibility: "Farmers in Maharashtra owning land classified as agricultural in 7/12 records",
    benefits: "Financial assistance for soil health management, contour bunding, and farm pond construction.",
    maxBenefit: "₹50,000 per farm unit",
    documents: ["7/12 Extract", "Aadhaar Card", "Caste Certificate (if applicable)", "Bank Passbook"],
    status: "Active",
    deadline: "30 June 2026",
    tag: "Land Dev",
    tagColor: "orange",
    matched: true,
    matchReason: "Maharashtra agricultural land — eligible for land improvement grants"
  },
  {
    id: "S005",
    name: "National Land Records Modernisation Programme",
    shortName: "NLRMP",
    department: "Department of Land Resources, MoRD",
    category: "Records",
    state: "All India",
    eligibility: "All landowners. Focused on digitisation of existing records.",
    benefits: "Free digital land record access. Computerised mutation process. Integration with national registry.",
    maxBenefit: "Free service",
    documents: ["Application Form", "Aadhaar Card"],
    status: "Active",
    deadline: "Ongoing",
    tag: "Records",
    tagColor: "gray",
    matched: false,
    matchReason: "All landowners eligible"
  },
  {
    id: "S006",
    name: "PM Awas Yojana - Gramin",
    shortName: "PMAY-G",
    department: "Ministry of Rural Development",
    category: "Housing",
    state: "All India",
    eligibility: "Houseless families and those living in dilapidated houses in rural areas (BPL priority)",
    benefits: "Financial assistance of ₹1.20 Lakh (plain areas) or ₹1.30 Lakh (hilly/difficult areas) for house construction.",
    maxBenefit: "₹1,30,000",
    documents: ["Aadhaar Card", "BPL Certificate", "Land Ownership Proof", "Bank Account"],
    status: "Active",
    deadline: "31 March 2026",
    tag: "Housing",
    tagColor: "red",
    matched: false,
    matchReason: "BPL status required for priority eligibility"
  }
];

export const states = [
  "Maharashtra", "Uttar Pradesh", "Karnataka", "Rajasthan", "Madhya Pradesh",
  "Tamil Nadu", "Gujarat", "Bihar", "West Bengal", "Haryana"
];

export const districtsByState = {
  "Maharashtra": ["Pune", "Nashik", "Nagpur", "Mumbai", "Satara", "Kolhapur", "Aurangabad", "Solapur"],
  "Uttar Pradesh": ["Lucknow", "Agra", "Varanasi", "Kanpur", "Allahabad"],
  "Karnataka": ["Bengaluru", "Mysuru", "Mangaluru", "Hubli", "Belgaum"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer"],
  "Madhya Pradesh": ["Bhopal", "Indore", "Gwalior", "Jabalpur", "Ujjain"],
};

export const purposeOptions = [
  "Agriculture / Farming",
  "Housing / Residential",
  "Commercial Development",
  "Industrial Use",
  "Horticulture / Plantation",
  "Aquaculture / Fishery",
  "Agro-Processing Unit",
];
