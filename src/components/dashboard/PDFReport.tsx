//@ts-nocheck

import {
  UserData,
  DetailedReport,
} from "@/types/user";
import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { User } from "firebase/auth";

// Enhanced styles
const styles = StyleSheet.create({
  page: { padding: 30, fontFamily: "Helvetica" },
  title: { fontSize: 24, marginBottom: 20, color: "#2c3e50" },
  section: { margin: 10, padding: 10, flexGrow: 1 },
  subtitle: { fontSize: 18, marginBottom: 10, color: "#34495e" },
  text: { fontSize: 12, marginBottom: 5 },
  recommendation: { marginBottom: 10, padding: 5 },
  recommendationTitle: { fontSize: 14, fontWeight: "bold", marginBottom: 5 },
  userInfo: { marginBottom: 20, padding: 10, backgroundColor: "#f8f9fa", borderRadius: 5 },
  userInfoTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 10, color: "#2c3e50" },
  userInfoItem: { fontSize: 12, marginBottom: 5, color: "#4a5568" },
});

interface PDFReportProps {
  user: User;
  userData: UserData;
  detailedReport: DetailedReport;
}

const PDFReport = ({ user, userData, detailedReport }: PDFReportProps) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.title}>Energy Consumption Report</Text>

          {/* User Information Section */}
          <View style={styles.userInfo}>
            <Text style={styles.userInfoTitle}>Report Analysis</Text>
            <Text style={styles.userInfoItem}>Name: {user.displayName || "User"}</Text>
            <Text style={styles.userInfoItem}>Email: {user.email || "Not provided"}</Text>
            <Text style={styles.userInfoItem}>Electricity Provider: {userData.electricityProvider || "Not specified"}</Text>
            <Text style={styles.userInfoItem}>User Category: {userData.userCategory || "Not specified"}</Text>
            <Text style={styles.userInfoItem}>Report Generated On: {new Date().toLocaleDateString()}</Text>
          </View>

          {/* Executive Summary */}
          <Text style={styles.subtitle}>Executive Summary</Text>
          <Text style={styles.text}>
            Your monthly electricity bill is Rs. {detailedReport.executiveSummary.monthlyBill}
          </Text>
          <Text style={styles.text}>
            Your primary goal is to {detailedReport.executiveSummary.primaryGoal}
          </Text>
          <Text style={styles.text}>
            You have a {detailedReport.executiveSummary.energyProfile.type} energy profile with a storage capacity of {detailedReport.executiveSummary.energyProfile.storageCapacity} kWh and solar capacity of {detailedReport.executiveSummary.energyProfile.solarCapacity} kW
          </Text>
          <Text style={styles.text}>
            Your DISCOM is {detailedReport.executiveSummary.discom}
          </Text>

          {/* Tariff Analysis */}
          <Text style={styles.subtitle}>Tariff Analysis</Text>
          <Text style={styles.text}>
            Your average power purchase cost is Rs. {detailedReport.tariffAnalysis.averagePowerPurchaseCost} per kWh
          </Text>
          <Text style={styles.text}>
            Your average cost of supply is Rs. {detailedReport.tariffAnalysis.averageCostOfSupply} per kWh
          </Text>
          <Text style={styles.text}>
            Your average billing rate is Rs. {detailedReport.tariffAnalysis.averageBillingRate} per kWh
          </Text>

          {/* Consumption Analytics */}
          <Text style={styles.subtitle}>Consumption Analytics</Text>
          <Text style={styles.text}>
            Peak demand: {detailedReport.consumptionAnalytics.peakDemand} kW during {detailedReport.consumptionAnalytics.peakDemandTime}
          </Text>
          <Text style={styles.text}>
            Consumption pattern: {detailedReport.consumptionAnalytics.consumptionPattern}, main consumers: {detailedReport.consumptionAnalytics.mainConsumers.join(" and ")}
          </Text>

          {/* Solar Analysis */}
          <Text style={styles.subtitle}>Solar Analysis</Text>
          <Text style={styles.text}>
            Solar panels: {detailedReport.solarAnalysis.status}
          </Text>
          <Text style={styles.text}>{detailedReport.solarAnalysis.potential}</Text>

          {/* Smart Devices Analysis */}
          <Text style={styles.subtitle}>Smart Devices Analysis</Text>
          <Text style={styles.text}>
            Installed: {detailedReport.smartDevicesAnalysis.installedDevices.map(d => d.name).join(" and ")}
          </Text>
          <Text style={styles.text}>
            Missing: {detailedReport.smartDevicesAnalysis.missingDevices.join(" or ")}
          </Text>

          {/* Recommendations */}
          <Text style={styles.subtitle}>Recommendations for Energy Efficiency</Text>
          {detailedReport.recommendations.map((rec, index) => (
            <View key={index} style={styles.recommendation}>
              <Text style={styles.recommendationTitle}>{rec.title}</Text>
              <Text style={styles.text}>{rec.details}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

export default PDFReport;
