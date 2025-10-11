import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ExecutiveSummary, ConsumptionAnalytics, SmartDevicesAnalysis, SolarAnalysis, TariffAnalysis } from "@/types/user";
import { TrendingUp, TrendingDown, Zap, Sun, Battery, Smartphone } from "lucide-react";

// ---------------- Executive Summary ----------------
const ExecutiveSummaryCard = ({ data }: { data: ExecutiveSummary }) => (
  <Card className="w-full mb-6">
    <CardHeader>
      <CardTitle className="text-xl font-bold flex items-center gap-2">
        Executive Summary
        {data.costTrend && (
          data.costTrend === "up" ? (
            <TrendingUp className="h-5 w-5 text-red-500" />
          ) : (
            <TrendingDown className="h-5 w-5 text-green-500" />
          )
        )}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-lg bg-muted">
          <div className="flex items-center justify-between mb-2">
            <span className="text-muted-foreground">Current Month's Cost</span>
            <Zap className="h-5 w-5 text-blue-500" />
          </div>
          <p className="text-2xl font-bold">
            ₹{data.currentMonthCost.toLocaleString()}
          </p>
          <p className={`text-sm mt-2 ${data.costTrend === "up" ? "text-red-500" : "text-green-500"}`}>
            {Math.abs(data.costComparisonPercentage)}% vs last month
          </p>
        </div>

        {data.solarGeneration != null && (
          <div className="p-4 rounded-lg bg-muted">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground">Solar Generation</span>
              <Sun className="h-5 w-5 text-yellow-500" />
            </div>
            <p className="text-2xl font-bold">{data.solarGeneration} kWh</p>
            <p className="text-sm text-green-500 mt-2">
              Savings: ₹{data.totalEnergySavings?.toLocaleString()}
            </p>
          </div>
        )}

        {data.batteryUsage != null && (
          <div className="p-4 rounded-lg bg-muted">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground">Battery Usage</span>
              <Battery className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold">{data.batteryUsage} kWh</p>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold">Key Recommendations</h3>
        <div className="grid gap-3">
          {data.keyRecommendations.map((rec, index) => (
            <Alert key={index}>
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    rec.priority === "high"
                      ? "destructive"
                      : rec.priority === "medium"
                        ? "default"
                        : "secondary"
                  }
                >
                  {rec.priority}
                </Badge>
                <AlertDescription className="flex-1">
                  {rec.text}
                </AlertDescription>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Impact: {rec.estimatedImpact}
              </p>
            </Alert>
          ))}
        </div>
      </div>
    </CardContent>
  </Card>
);

// ---------------- Consumption Analytics ----------------
const ConsumptionAnalyticsCard = ({ data }: { data: ConsumptionAnalytics }) => (
  <Card className="w-full mb-6">
    <CardHeader>
      <CardTitle className="text-xl font-bold">Consumption Analytics</CardTitle>
    </CardHeader>
    <CardContent>
      <p>Total Consumption: {data.totalConsumption} kWh</p>
      <p>Daily Average: {data.averageDailyConsumption} kWh</p>
    </CardContent>
  </Card>
);

// ---------------- Solar Analysis ----------------
const SolarAnalysisCard = ({ data }: { data: SolarAnalysis }) => (
  <Card className="w-full mb-6">
    <CardHeader>
      <CardTitle className="text-xl font-bold">Solar Analysis</CardTitle>
    </CardHeader>
    <CardContent>
      <p>Daily Generation: {data.dailyGeneration} kWh</p>
      <p>Monthly Generation: {data.monthlyGeneration} kWh</p>
      <p>System Efficiency: {data.efficiency}%</p>
    </CardContent>
  </Card>
);

// ---------------- Smart Devices Analysis ----------------
const SmartDevicesAnalysisCard = ({ data }: { data: SmartDevicesAnalysis }) => (
  <Card className="w-full mb-6">
    <CardHeader>
      <CardTitle className="text-xl font-bold flex items-center gap-2">
        Smart Devices Analysis
        <Smartphone className="h-5 w-5 text-blue-500" />
      </CardTitle>
    </CardHeader>
    <CardContent>
      <p>Total Potential Savings: ₹{data.totalPotentialSavings}</p>
    </CardContent>
  </Card>
);

// ---------------- Tariff Analysis ----------------
const TariffAnalysisCard = ({ data }: { data: TariffAnalysis }) => (
  <Card className="w-full mb-6">
    <CardHeader>
      <CardTitle className="text-xl font-bold">Tariff Analysis</CardTitle>
    </CardHeader>
    <CardContent>
      <p>Current Rate: ₹{data.currentRate}/kWh</p>
    </CardContent>
  </Card>
);

// ---------------- Export All ----------------
export {
  ConsumptionAnalyticsCard,
  ExecutiveSummaryCard,
  SmartDevicesAnalysisCard,
  SolarAnalysisCard,
  TariffAnalysisCard,
};
