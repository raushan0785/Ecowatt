import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ConsumptionAnalytics,
  ExecutiveSummary,
  SmartDevicesAnalysis,
  SolarAnalysis,
  TariffAnalysis,
} from "@/types/user";
import {
  AlertCircle,
  AlertTriangle,
  Battery,
  BatteryLow,
  BatteryWarning,
  BellRing,
  CheckCircle,
  Clock,
  CloudRain,
  NotepadText,
  PlugZap,
  Settings,
  Smartphone,
  Sun,
  Timer,
  TrendingDown,
  TrendingUp,
  Zap,
} from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Tooltip as Tooltip2,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

/* ---------------------- Executive Summary Card ---------------------- */
const ExecutiveSummaryCard = ({ data }: { data: ExecutiveSummary }) => (
  <Card className="w-full mb-6">
    <CardHeader>
      <CardTitle className="text-xl font-bold flex items-center gap-2">
        Executive Summary
        {data.costTrend === "up" ? (
          <TrendingUp className="h-5 w-5 text-red-500" />
        ) : (
          <TrendingDown className="h-5 w-5 text-green-500" />
        )}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-lg bg-muted">
          <p className="text-2xl font-bold">₹{data.currentMonthCost}</p>
          <p
            className={`text-sm mt-2 ${
              data.costTrend === "up" ? "text-red-500" : "text-green-500"
            }`}
          >
            {Math.abs(data.costComparisonPercentage)}% vs last month
          </p>
        </div>
        {data.solarGeneration !== null && (
          <div className="p-4 rounded-lg bg-muted">
            <p className="text-2xl font-bold">{data.solarGeneration} kWh</p>
          </div>
        )}
        {data.batteryUsage !== null && (
          <div className="p-4 rounded-lg bg-muted">
            <p className="text-2xl font-bold">{data.batteryUsage} kWh</p>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold">Key Recommendations</h3>
        <div className="grid gap-3">
          {data.keyRecommendations.map((rec, index) => (
            <Alert key={index}>
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
              <AlertDescription>{rec.text}</AlertDescription>
            </Alert>
          ))}
        </div>
      </div>
    </CardContent>
  </Card>
);

/* ---------------------- Tariff Analysis Card ---------------------- */
const TariffAnalysisCard = ({ data }: { data: TariffAnalysis }) => (
  <Card className="w-full mb-6">
    <CardHeader>
      <CardTitle className="text-xl font-bold">Tariff Analysis</CardTitle>
      <CardDescription>{data.patternAnalysis}</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-xl font-bold">₹{data.currentRate}/kWh</p>
          <p className="text-sm text-muted-foreground">Current Rate</p>
        </div>
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-xl font-bold">₹{data.averageRate}/kWh</p>
          <p className="text-sm text-muted-foreground">Average Rate</p>
        </div>
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-xl font-bold">₹{data.peakRate}/kWh</p>
          <p className="text-sm text-muted-foreground">Peak Rate</p>
        </div>
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-xl font-bold">₹{data.offPeakRate}/kWh</p>
          <p className="text-sm text-muted-foreground">Off-Peak Rate</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

/* ---------------------- Consumption Analytics Card ---------------------- */
const ConsumptionAnalyticsCard = ({ data }: { data: ConsumptionAnalytics }) => (
  <Card className="w-full mb-6">
    <CardHeader>
      <CardTitle className="text-xl font-bold">Consumption Analytics</CardTitle>
      <CardDescription>
        Overview of your energy consumption and trends.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-xl font-bold">{data.totalConsumption} kWh</p>
          <p className="text-sm text-muted-foreground">Total Consumption</p>
        </div>
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-xl font-bold">{data.averageDailyConsumption} kWh</p>
          <p className="text-sm text-muted-foreground">Daily Average</p>
        </div>
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-xl font-bold">{data.peakConsumptionValue} kW</p>
          <p className="text-sm text-muted-foreground">
            Peak at {new Date(data.peakConsumptionTime).toLocaleTimeString()}
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
);

/* ---------------------- Solar Analysis Card ---------------------- */
const SolarAnalysisCard = ({ data }: { data: SolarAnalysis }) => (
  <Card className="w-full mb-6">
    <CardHeader>
      <CardTitle className="text-xl font-bold">Solar Analysis</CardTitle>
    </CardHeader>
    <CardContent>
      <p>Daily Generation: {data.dailyGeneration} kWh</p>
      <p>Monthly Generation: {data.monthlyGeneration} kWh</p>
      <p>Efficiency: {data.efficiency}%</p>
      <p>Monthly Savings: ₹{data.savingsFromSolar}</p>
    </CardContent>
  </Card>
);

/* ---------------------- Smart Devices Analysis Card ---------------------- */
const SmartDevicesAnalysisCard = ({ data }: { data: SmartDevicesAnalysis }) => (
  <Card className="w-full mb-6">
    <CardHeader>
      <CardTitle className="text-xl font-bold">Smart Devices Analysis</CardTitle>
    </CardHeader>
    <CardContent>
      <p>Total Potential Savings: ₹{data.totalPotentialSavings}</p>
      <p>Device Schedules:</p>
      <ul>
        {data.deviceSchedules.map((device, idx) => (
          <li key={idx}>{device.deviceName}</li>
        ))}
      </ul>
    </CardContent>
  </Card>
);

/* ---------------------- Export All Cards ---------------------- */
export {
  ExecutiveSummaryCard,
  TariffAnalysisCard,
  ConsumptionAnalyticsCard,
  SolarAnalysisCard,
  SmartDevicesAnalysisCard,
};
