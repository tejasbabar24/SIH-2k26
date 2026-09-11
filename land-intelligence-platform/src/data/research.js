// AI Research mock responses

export const researchQuestions = [
  "How has agricultural land changed in Pune since 2015?",
  "Which districts have highest urban expansion?",
  "What is the flood risk around this parcel?",
  "Explain land conversion requirements in Maharashtra.",
  "Compare Pune and Nashik land-use trends.",
];

export const researchResponses = {
  "How has agricultural land changed in Pune since 2015?": {
    question: "How has agricultural land changed in Pune since 2015?",
    answer: `Agricultural land in Pune District has declined by approximately **7.5%** between 2015 and 2025, from an estimated 1,98,200 Ha to 1,84,200 Ha — a net loss of around 14,000 Ha over the decade.

**Key drivers of decline:**
- Rapid peri-urban expansion, particularly in Haveli, Maval, and Mulshi talukas
- Industrial zone development along the Pune-Solapur and Pune-Nashik highways
- IT and commercial real estate growth in Hinjewadi and Kharadi corridors

**Trend analysis:**
The rate of agricultural land loss accelerated post-2018, coinciding with Pune's expansion as a metropolitan region. Average annual conversion rate: **1,400 Ha/year** (2019–2024), up from **820 Ha/year** (2015–2018).

**Policy context:**
Maharashtra's Agricultural Land Ceiling Act continues to apply, though non-agricultural conversion applications have increased 340% over the same period. DGIPR data shows 68% of converted land moved to commercial or residential classification.`,
    sources: [
      { name: "Maharashtra Land Records Dataset", verified: true, year: "2024" },
      { name: "Bhuvan / ISRO Land Use Data (LISS-IV)", verified: true, year: "2024" },
      { name: "Pune District Statistical Report 2024", verified: true, year: "2024" },
      { name: "Maharashtra Revenue & Forest Dept Records", verified: true, year: "2023" },
    ],
    groundedness: 98.4,
    chartData: [
      { year: "2015", agri: 198200, builtup: 22100 },
      { year: "2017", agri: 194200, builtup: 25400 },
      { year: "2019", agri: 190400, builtup: 29800 },
      { year: "2021", agri: 187200, builtup: 33600 },
      { year: "2023", agri: 185000, builtup: 37100 },
      { year: "2025", agri: 183400, builtup: 40800 },
    ],
    chartType: "line",
    chartKeys: [
      { key: "agri", label: "Agricultural Land (Ha)", color: "#4a9e5c" },
      { key: "builtup", label: "Built-up Area (Ha)", color: "#e07b2a" }
    ]
  },
  "Which districts have highest urban expansion?": {
    question: "Which districts have highest urban expansion?",
    answer: `Analysis of satellite-derived land-use data across Maharashtra's districts reveals significant variation in urban expansion rates between 2015 and 2025.

**Top 5 Districts by Urban Expansion (2015-2025):**

1. **Pune** — +85% built-up growth (22,100 → 40,800 Ha). Driven by IT corridors, industrial zones, and residential development.
2. **Nagpur** — +57% growth (28,200 → 44,200 Ha). Expansion linked to MIHAN SEZ and central government infrastructure projects.
3. **Thane** — +52% growth. Mumbai metropolitan region overflow and coastal corridor development.
4. **Nashik** — +62% growth (18,200 → 29,400 Ha). Agro-industrial corridors and highway development.
5. **Aurangabad** — +48% growth. DMIC alignment and industrial estate expansion.

**Spatial pattern:**
Urban expansion is predominantly linear along national highways, railways, and river corridors. Pune shows the highest *peri-urban sprawl index* at 2.8 (against a state average of 1.6).`,
    sources: [
      { name: "ISRO National Remote Sensing Centre (NRSC)", verified: true, year: "2024" },
      { name: "Maharashtra Urban Development Report", verified: true, year: "2024" },
      { name: "DGIPR Cadastral Analytics Dataset", verified: true, year: "2023" },
    ],
    groundedness: 96.2,
    chartData: [
      { district: "Pune", expansion: 85 },
      { district: "Nashik", expansion: 62 },
      { district: "Nagpur", expansion: 57 },
      { district: "Thane", expansion: 52 },
      { district: "Aurangabad", expansion: 48 },
      { district: "Solapur", expansion: 32 },
    ],
    chartType: "bar",
    chartKeys: [
      { key: "expansion", label: "Urban Expansion %", color: "#5b8dd9" }
    ],
    xKey: "district"
  },
  "What is the flood risk around this parcel?": {
    question: "What is the flood risk around this parcel?",
    answer: `Based on topographic analysis, historical flood records and drainage network data for **Survey No. 142/3-A, Khadakwasla, Haveli Taluka**, the flood risk assessment is as follows:

**Flood Risk Rating: LOW**

**Assessment factors:**
- **Elevation:** Parcel sits at approximately 567m AMSL — well above the 100-year flood plain elevation of 542m
- **Distance from water body:** 2.8 km from Khadakwasla Reservoir (controlled body)
- **Drainage:** Part of the Mutha River sub-basin; natural drainage gradient is adequate
- **Historical events:** No flood inundation recorded in this parcel in 2019, 2021, or 2023 extreme events

**Caveats:**
- The downstream areas within 500m carry **Medium risk** due to reservoir spillway events
- Climate projections (IITM Pune model) suggest a 15% increase in extreme rainfall events by 2040
- Local micro-drainage infrastructure should be assessed before high-density development

**Recommendation:** Low-intensity commercial or agricultural development carries acceptable flood risk at this location, subject to standard drainage design.`,
    sources: [
      { name: "National Flood Risk Atlas — CWC", verified: true, year: "2023" },
      { name: "IMD Pune Rainfall Records (1990-2025)", verified: true, year: "2025" },
      { name: "Maharashtra Disaster Management Authority", verified: true, year: "2024" },
      { name: "IITM Climate Projection Report", verified: true, year: "2024" },
    ],
    groundedness: 94.8,
    chartData: [
      { zone: "Parcel Site", risk: 12 },
      { zone: "500m Buffer", risk: 28 },
      { zone: "1km Buffer", risk: 45 },
      { zone: "2km Buffer", risk: 62 },
      { zone: "5km Buffer", risk: 38 },
    ],
    chartType: "bar",
    chartKeys: [
      { key: "risk", label: "Flood Risk Index", color: "#5ba8d9" }
    ],
    xKey: "zone"
  },
  "Explain land conversion requirements in Maharashtra.": {
    question: "Explain land conversion requirements in Maharashtra.",
    answer: `Land conversion (Non-Agricultural use permission — NA) in Maharashtra is governed by the **Maharashtra Land Revenue Code, 1966 (Section 44)** and the **Maharashtra Regional and Town Planning Act, 1966**.

**Step-by-step process:**

**1. Application**
- Submit Form NA-1 to the District Collector / SDO
- Required documents: 7/12 Extract, Property Card, Mutation Records, Ownership Proof, Site Plan

**2. Preliminary Scrutiny**
- Revenue Department verifies land records
- Taluka Inspector site inspection
- Timeline: 30–60 days

**3. NOCs / Clearances Required**
- Town Planning (if within municipal/planning authority jurisdiction)
- Environment (if area > 20,000 m²)
- Agriculture Department (if classified prime agricultural land)
- Fire & Safety (for industrial use)

**4. Payment of Premium**
- NA premium calculated based on Ready Reckoner rates
- Typically 25–50% of land value as government premium

**5. NA Order Issuance**
- Collector issues NA Order under Section 44
- Entry in 7/12 record updated to "Non-Agricultural"
- Timeline: 3–6 months (standard); 12–18 months (if clearances delayed)

**Key restrictions:**
- Conversion of prime agricultural land (black soil zone) faces additional scrutiny
- Land within 500m of reserved forest requires Forest Department clearance
- Coastal Regulation Zone (CRZ) rules apply for coastal parcels`,
    sources: [
      { name: "Maharashtra Land Revenue Code, 1966", verified: true, year: "2024" },
      { name: "Maharashtra Revenue & Forest Dept Circular", verified: true, year: "2023" },
      { name: "DILRMP Implementation Guidelines", verified: true, year: "2024" },
    ],
    groundedness: 99.1,
    chartData: [
      { stage: "Application", days: 7 },
      { stage: "Scrutiny", days: 45 },
      { stage: "NOCs", days: 60 },
      { stage: "Payment", days: 14 },
      { stage: "NA Order", days: 30 },
    ],
    chartType: "bar",
    chartKeys: [
      { key: "days", label: "Average Processing Days", color: "#0f2d5c" }
    ],
    xKey: "stage"
  },
  "Compare Pune and Nashik land-use trends.": {
    question: "Compare Pune and Nashik land-use trends.",
    answer: `A comparative land-use analysis between **Pune** and **Nashik** districts for the period 2015–2025 reveals distinct patterns driven by their different economic and geographic contexts.

**Agricultural Land:**
- Pune: Declined 7.5% (198,200 → 184,200 Ha) — faster decline
- Nashik: Declined 5.5% (224,000 → 211,600 Ha) — slower, more stable

**Built-up Area:**
- Pune: +85% (22,100 → 40,800 Ha) — intense urban pressure
- Nashik: +62% (18,200 → 29,400 Ha) — significant but more managed

**Forest Cover:**
- Pune: +3.6% (43,200 → 44,750 Ha) — Western Ghats conservation effect
- Nashik: +2.2% (66,800 → 68,280 Ha) — relatively stable forest cover

**Key differentiators:**
1. **Economic driver:** Pune's IT/manufacturing sector versus Nashik's agro-industrial base
2. **Conversion pattern:** Pune shows radial peri-urban expansion; Nashik shows linear highway-corridor growth
3. **Water stress:** Pune's rapid urbanisation is creating higher groundwater stress (8m average, dropping); Nashik benefits from Godavari basin water availability
4. **Agricultural retention:** Nashik's grape/onion agriculture remains economically competitive against land conversion

**Policy implication:** Nashik offers a model for agricultural land retention alongside economic growth. Pune requires urgent urban growth boundary policy intervention.`,
    sources: [
      { name: "Maharashtra State Remote Sensing Application Centre", verified: true, year: "2024" },
      { name: "ISRO Bhuvan Land Use Dataset", verified: true, year: "2024" },
      { name: "Pune & Nashik District Statistical Reports", verified: true, year: "2024" },
      { name: "MSPC Agricultural Census 2022", verified: true, year: "2022" },
    ],
    groundedness: 97.5,
    chartData: [
      { category: "Agricultural", pune: 184200, nashik: 211600 },
      { category: "Forest", pune: 44750, nashik: 68280 },
      { category: "Built-up", pune: 40800, nashik: 29400 },
      { category: "Water", pune: 12400, nashik: 18600 },
    ],
    chartType: "bar",
    chartKeys: [
      { key: "pune", label: "Pune (Ha)", color: "#0f2d5c" },
      { key: "nashik", label: "Nashik (Ha)", color: "#1a6b3c" }
    ],
    xKey: "category"
  }
};
