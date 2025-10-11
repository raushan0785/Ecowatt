import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ExecutiveSummary } from "@/types/user";
import { TrendingDown, TrendingUp, Zap, Sun, Battery } from "lucide-react";

const ExecutiveSummaryCard = ({ data }: { data: ExecutiveSummary }) => (
  <Card className="w-full mb-6">
    <CardHeader>
      <CardTitle className="text-xl font-bold flex items-center gap-2">
        Executive Summary
        {data.costTrend ? (
          data.costTrend === "up" ? (
            <TrendingUp className="h-5 w-5 text-red-500" />
          ) : (
            <TrendingDown className="h-5 w-5 text-green-500" />
          )
        ) : null}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {data.currentMonthCost !== undefined && (
          <div className="p-4 rounded-lg bg-muted">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground">Current Month's Cost</span>
              <Zap className="h-5 w-5 text-blue-500" />
            </div>
            <p className="text-2xl font-bold">₹{data.currentMonthCost.toLocaleString()}</p>
            {data.costComparisonPercentage !== undefined && (
              <p
                className={`text-sm mt-2 ${
                  data.costTrend === "up" ? "text-red-500" : "text-green-500"
                }`}
              >
                {Math.abs(data.costComparisonPercentage)}% vs last month
              </p>
            )}
          </div>
        )}

        {data.solarGeneration !== undefined && (
          <div className="p-4 rounded-lg bg-muted">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground">Solar Generation</span>
              <Sun className="h-5 w-5 text-yellow-500" />
            </div>
            <p className="text-2xl font-bold">{data.solarGeneration} kWh</p>
            {data.totalEnergySavings !== undefined && (
              <p className="text-sm text-green-500 mt-2">
                Savings: ₹{data.totalEnergySavings.toLocaleString()}
              </p>
            )}
          </div>
        )}

        {data.batteryUsage !== undefined && (
          <div className="p-4 rounded-lg bg-muted">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground">Battery Usage</span>
              <Battery className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold">{data.batteryUsage} kWh</p>
          </div>
        )}
      </div>

      {data.keyRecommendations?.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold">Key Recommendations</h3>
          <div className="grid gap-3">
            {data.keyRecommendations.map((rec, index) => (
              <Alert key={index}>
                <div className="flex items-center gap-2">
                  <Badge variant={rec.priority || "default"}>{rec.priority}</Badge>
                  <AlertDescription className="flex-1">{rec.text}</AlertDescription>
                </div>
                {rec.estimatedImpact && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Impact: {rec.estimatedImpact}
                  </p>
                )}
              </Alert>
            ))}
          </div>
        </div>
      )}
    </CardContent>
  </Card>
);

export { ExecutiveSummaryCard };
