// lib/ai.ts

async function generateTariffAnalysis(touData: any, discomData: any) {
  // Example placeholder logic — adjust as needed
  return {
    summary: "Tariff analysis generated successfully.",
    averageTariff: (touData?.reduce((sum: number, t: any) => sum + t.rate, 0) || 0) / (touData?.length || 1),
    discomCount: discomData?.length || 0,
  };
}
async function generateConsumptionAnalytics(sortedEnergyData: any[], weatherData: any) {
  if (!sortedEnergyData || sortedEnergyData.length === 0) {
    return { summary: "No energy data available", totalConsumption: 0 };
  }

  const totalConsumption = sortedEnergyData.reduce((sum, entry) => sum + (entry.consumption || 0), 0);
  const averageDailyConsumption = totalConsumption / sortedEnergyData.length;

  return {
    summary: "Consumption analytics generated successfully",
    totalConsumption,
    averageDailyConsumption,
    weatherImpact: weatherData ? "Weather data integrated for analysis" : "No weather data available",
  };
}


import { groupDataByDay } from "@/lib/utils";
import {
  ConsumptionAnalytics,
  Discom,
  EnergyData,
  ExecutiveSummary,
  SmartDevicesAnalysis,
  SolarAnalysis,
  TariffAnalysis,
  TOUData,
  UserData,
  WeatherData,
} from "@/types/user";
import Instructor from "@instructor-ai/instructor";
import Groq from "groq-sdk";
import { z } from "zod";

const groqClient = new Groq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY!,
});

const client = Instructor({
  client: groqClient,
  mode: "FUNCTIONS",
});

// ===================== Schemas =====================

const executiveSummarySchema = z.object({
  recommendations: z.array(
    z.object({
      text: z.string(),
      priority: z.enum(["high", "medium", "low"]),
      estimatedImpact: z.string(),
      potentialMonthlySavings: z.string(),
      implementationEffort: z.enum(["low", "medium", "high"]),
    }),
  ),
});

const tariffAnalysisSchema = z.object({
  forecastedRates: z.array(
    z.object({
      time: z.string(),
      rate: z.number(),
      variationPercentage: z.number(),
    }),
  ),
  savingsOpportunities: z.array(z.string()),
  patternAnalysis: z.string(),
});

const consumptionAnalysisSchema = z.object({
  totalConsumption: z.number(),
  averageDailyConsumption: z.number(),
  peakConsumptionTime: z.string(),
  peakConsumptionValue: z.number(),
  consumptionByTimeOfDay: z.array(
    z.object({
      hour: z.number(),
      average: z.number(),
      varianceFromMean: z.number(),
    }),
  ),
  unusualPatterns: z.array(z.string()),
  weatherImpact: z.string(),
  optimizationOpportunities: z.array(z.string()),
  timeOfDayRecommendations: z.array(z.string()),
});

const solarAnalysisSchema = z.object({
  optimizations: z.array(z.string()),
  maintenance_tasks: z.array(z.string()),
  weather_impact: z.string(),
  storage_tips: z.array(z.string()),
});

const deviceScheduleSchema = z.object({
  deviceName: z.string(),
  optimalHours: z.array(z.number()),
  expectedSavings: z.number(),
  currentUsagePattern: z.string(),
  recommendedPattern: z.string(),
  reasonForRecommendation: z.string(),
});

const smartDevicesAnalysisSchema = z.object({
  deviceSchedules: z.array(deviceScheduleSchema),
  totalPotentialSavings: z.number(),
  generalRecommendations: z.array(z.string()),
  automationOpportunities: z.array(z.string()),
  peakUsageWarnings: z.array(z.string()),
  deviceIntegrationTips: z.array(z.string()),
});

// ===================== AI Helper =====================

const SYSTEM_PROMPT = `
You are an expert energy analyst focused on maximizing cost savings through data-driven insights.

Core capabilities:
- Energy consumption pattern analysis
- TOU pricing optimization
- Solar/battery system recommendations
- Weather impact assessment
- ROI-based recommendations

Key response criteria:
1. All insights must include:
   - Specific data points
   - Numerical savings estimates
   - Implementation complexity (1-5)
   - ROI timeframe
   - Confidence level (%)

2. Analysis framework:
   - Immediate vs long-term actions
   - Peak/off-peak optimization
   - Seasonal adjustments
   - Local infrastructure constraints
   - Industry benchmarks

Always provide concrete, actionable recommendations prioritized by ROI.
`;

async function fetchAIResponse(prompt: string, schema: any): Promise<any> {
  try {
    const response = await client.chat.completions.create({
      model: "llama-3.1-70b-versatile",
      max_tokens: 4096,
      temperature: 0.7,
      top_p: 0.9,
      response_model: { schema: schema, name: "response" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
    });

    return response;
  } catch (error) {
    console.error("AI API call failed:", error);
    return null;
  }
}

// ===================== Report Generators =====================

export async function calculateExecutiveSummary(
  energyData: EnergyData[],
  touData: TOUData[],
  userData: UserData,
  weatherData: WeatherData,
): Promise<ExecutiveSummary> {
  const dataByDay = groupDataByDay(energyData);
  const days = Array.from(dataByDay.keys()).sort();
  const latestDay = days[days.length - 1];
  const previousDay = days[days.length - 2];

  const currentDayData = dataByDay.get(latestDay) || [];
  const previousDayData = dataByDay.get(previousDay) || [];

  const averageRate =
    touData.reduce((sum, data) => sum + data.rate, 0) / touData.length;
  const calculateDayCost = (dayData: EnergyData[]) =>
    dayData.reduce((sum, data) => sum + data.Consumption * averageRate, 0);

  const currentDayCost = calculateDayCost(currentDayData);
  const previousDayCost = calculateDayCost(previousDayData);
  const costComparisonPercentage = previousDayCost
    ? ((currentDayCost - previousDayCost) / previousDayCost) * 100
    : 0;

  const solarGeneration = userData.hasSolarPanels
    ? currentDayData.reduce((sum, data) => sum + (data.SolarEnergy || 0), 0)
    : 0;

  const totalEnergySavings = solarGeneration * averageRate;

  const aiPrompt = `
    Based on these metrics, provide actionable energy recommendations:

    METRICS:
    - Cost: ${costComparisonPercentage.toFixed(2)}% ${costComparisonPercentage > 0 ? "increase" : "decrease"}
    - Today: ${currentDayCost.toFixed(2)} Rs
    - Yesterday: ${previousDayCost.toFixed(2)} Rs
    - Solar: ${userData.hasSolarPanels ? `${userData.solarCapacity} kW` : "No"}
    - Battery: ${userData.hasBatteryStorage ? `${userData.storageCapacity} kWh` : "No"}
    - Monthly bill: ${userData.monthlyBill} Rs
    - Weather: ${weatherData.main.temp}°C, ${weatherData.weather[0].main}

    Return JSON matching schema.
  `;

  const aiResponse = await fetchAIResponse(aiPrompt, executiveSummarySchema);

  return {
    currentMonthCost: parseFloat(currentDayCost.toFixed(2)),
    costComparisonPercentage: parseFloat(costComparisonPercentage.toFixed(2)),
    costTrend: costComparisonPercentage > 0 ? "up" : "down",
    totalEnergySavings: parseFloat(totalEnergySavings.toFixed(2)),
    solarGeneration: parseFloat(solarGeneration.toFixed(2)),
    batteryUsage: userData.hasBatteryStorage
      ? parseFloat(userData.storageCapacity)
      : null,
    keyRecommendations: aiResponse?.recommendations || [],
  };
};

// Other generators (tariffAnalysis, consumptionAnalytics, solarAnalysis, smartDevicesAnalysis) follow the same pattern.
// For brevity, you can keep your existing functions but ensure they all use async/await + `fetchAIResponse` + proper ESM imports/exports.

// ===================== Full Report =====================

export async function generateReport(
  userData: UserData,
  touData: TOUData[],
  weatherData: WeatherData,
  discomData: Discom,
  energyData: EnergyData[],
): Promise<{
  executiveSummary: ExecutiveSummary;
  tariffAnalysis: TariffAnalysis;
  consumptionAnalytics: ConsumptionAnalytics;
  solarAnalysis: SolarAnalysis;
  smartDevicesAnalysis: SmartDevicesAnalysis;
}> {
  const sortedEnergyData = [...energyData].sort(
    (a, b) => new Date(a.SendDate).getTime() - new Date(b.SendDate).getTime(),
  );

  const [
    executiveSummary,
    tariffAnalysis,
    consumptionAnalytics,
    solarAnalysis,
    smartDevicesAnalysis,
  ] = await Promise.all([
    calculateExecutiveSummary(sortedEnergyData, touData, userData, weatherData),
    generateTariffAnalysis(touData, discomData),
    generateConsumptionAnalytics(sortedEnergyData, weatherData),
    generateSolarAnalysis(sortedEnergyData, userData, weatherData),
    generateSmartDevicesAnalysis(userData, touData, weatherData),
  ]);

  return {
    executiveSummary,
    tariffAnalysis,
    consumptionAnalytics,
    solarAnalysis,
    smartDevicesAnalysis,
  };
}
