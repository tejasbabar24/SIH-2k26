// Policy simulator data and computations

export const policyRegions = [
  { id: "pune-peri", label: "Pune Peri-Urban Zone" },
  { id: "haveli", label: "Haveli Taluka" },
  { id: "pune-district", label: "Pune District" },
];

export const policyTypes = [
  { id: "agri-conversion", label: "Agricultural Land Conversion" },
  { id: "forest-buffer", label: "Forest Buffer Zone Policy" },
  { id: "green-belt", label: "Green Belt Designation" },
];

export const timeHorizons = [5, 10, 25];

// Compute simulation results based on slider and time horizon
export function computeSimulation(conversionPct, timeHorizon, region) {
  const baseEconomicYield = 1420; // Cr/year
  const baseEmployment = 100;
  const baseFoodSecurity = 100;
  const baseWaterStress = 100;

  // Economic grows with conversion but with diminishing returns
  const economicMultiplier = 1 + (conversionPct / 100) * 0.8 * (timeHorizon / 10);
  const economicYield = Math.round(baseEconomicYield * economicMultiplier);
  const economicChange = Math.round((economicMultiplier - 1) * 100);

  // Employment grows
  const employmentChange = Math.round(conversionPct * 0.6 * (timeHorizon / 10));

  // Food security drops
  const foodSecurityChange = -Math.round(conversionPct * 0.5 * (timeHorizon / 10));

  // Water stress increases
  const waterStressChange = Math.round(conversionPct * 0.9 * (timeHorizon / 10));

  // Biodiversity
  let biodiversityImpact = "LOW";
  if (conversionPct > 40) biodiversityImpact = "CRITICAL";
  else if (conversionPct > 25) biodiversityImpact = "HIGH";
  else if (conversionPct > 15) biodiversityImpact = "MODERATE";

  // Risk level
  let riskLevel = "LOW RISK";
  let riskColor = "green";
  if (conversionPct > 50) { riskLevel = "CRITICAL RISK"; riskColor = "red"; }
  else if (conversionPct > 35) { riskLevel = "HIGH RISK"; riskColor = "red"; }
  else if (conversionPct > 20) { riskLevel = "MODERATE-HIGH RISK"; riskColor = "orange"; }
  else if (conversionPct > 10) { riskLevel = "MODERATE RISK"; riskColor = "yellow"; }

  // Affected area (Ha)
  const totalArea = region === "haveli" ? 32000 : region === "pune-peri" ? 84000 : 184200;
  const affectedArea = Math.round(totalArea * conversionPct / 100);
  const agriLoss = Math.round(affectedArea * 0.82);
  const populationImpact = Math.round(affectedArea * 12); // 12 people per Ha

  // Chart data for impact over time
  const scenarioChart = Array.from({ length: timeHorizon > 10 ? 6 : 5 }, (_, i) => {
    const year = 2026 + Math.round((i / (timeHorizon > 10 ? 5 : 4)) * timeHorizon);
    const t = i / (timeHorizon > 10 ? 5 : 4);
    return {
      year: year.toString(),
      economic: Math.round(baseEconomicYield * (1 + t * (economicMultiplier - 1))),
      foodSecurity: Math.round(100 + t * foodSecurityChange),
      waterStress: Math.round(100 + t * waterStressChange),
      employment: Math.round(100 + t * employmentChange),
    };
  });

  return {
    economicYield,
    economicYieldBase: baseEconomicYield,
    economicChange: `+${economicChange}%`,
    employmentChange: `+${employmentChange}%`,
    foodSecurityChange: `${foodSecurityChange}%`,
    waterStressChange: `+${waterStressChange}%`,
    biodiversityImpact,
    riskLevel,
    riskColor,
    showWarning: conversionPct > 20,
    affectedArea: affectedArea.toLocaleString(),
    agriLoss: agriLoss.toLocaleString(),
    populationImpact: populationImpact.toLocaleString(),
    waterStressLevel: conversionPct > 30 ? "High" : conversionPct > 15 ? "Moderate" : "Low",
    envImpact: conversionPct > 40 ? "Severe" : conversionPct > 25 ? "High" : conversionPct > 10 ? "Moderate" : "Low",
    scenarioChart
  };
}

export const policyBriefTopics = [
  "Agricultural Land Conversion in Pune District",
  "Peri-Urban Sprawl Management",
  "Groundwater Depletion and Land Use",
  "Forest Buffer Zone Policy",
  "Flood Risk Mitigation through Land Use",
  "Green Belt Designation — Haveli Taluka",
];
