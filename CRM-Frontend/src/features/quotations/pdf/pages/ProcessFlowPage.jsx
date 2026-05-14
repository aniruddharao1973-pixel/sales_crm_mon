// src/features/quotations/pdf/pages/ProcessFlowPage.jsx

import { View, Text, StyleSheet } from "@react-pdf/renderer";
import PdfPageShell from "../components/PdfPageShell";
import { PDF_COLORS } from "../quotationPdfTheme";
import { safeText } from "../quotationPdfUtils";

const styles = StyleSheet.create({
  title: {
    marginTop: 8,
    marginBottom: 10,
    fontSize: 14,
    fontWeight: "bold",
    color: PDF_COLORS.ink,
  },
  canvas: {
    minHeight: 600,
    paddingTop: 4,
  },
  flowWrap: {
    alignItems: "center",
  },
  node: {
    width: 140,
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 4,
    textAlign: "center",
    fontSize: 7.8,
    color: PDF_COLORS.white,
    backgroundColor: PDF_COLORS.cyan,
    marginBottom: 6,
    border: `1 solid ${PDF_COLORS.border}`,
  },
  nodeAlt: {
    backgroundColor: "#F59E99",
    color: PDF_COLORS.ink,
  },
  arrow: {
    fontSize: 12,
    color: PDF_COLORS.violet,
    marginBottom: 4,
  },
  legendWrap: {
    position: "absolute",
    right: 8,
    bottom: 18,
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  legendSwatchA: {
    width: 22,
    height: 12,
    backgroundColor: PDF_COLORS.cyan,
    marginRight: 8,
    borderRadius: 2,
  },
  legendSwatchB: {
    width: 22,
    height: 12,
    backgroundColor: "#F59E9A",
    marginRight: 8,
    borderRadius: 2,
  },
  legendText: {
    fontSize: 8,
    color: PDF_COLORS.text,
  },
});

export default function ProcessFlowPage({ data }) {
  const steps = data?.processFlow?.steps || [];

  return (
    <PdfPageShell>
      <Text style={styles.title}>{safeText(data?.processFlow?.title, "Project Process Flow")}</Text>

      <View style={styles.canvas}>
        <View style={styles.flowWrap}>
          {steps.length > 0 ? (
            steps.map((step, index) => {
              const isAlt = !!step?.alt;
              return (
                <View key={index}>
                  <Text style={[styles.node, isAlt ? styles.nodeAlt : null]}>
                    {safeText(step.label)}
                  </Text>
                  {index !== steps.length - 1 ? <Text style={styles.arrow}>↓</Text> : null}
                </View>
              );
            })
          ) : (
            <Text style={styles.node}>No process flow data provided</Text>
          )}
        </View>

        <View style={styles.legendWrap}>
          <View style={styles.legendRow}>
            <View style={styles.legendSwatchA} />
            <Text style={styles.legendText}>Micrologic activity</Text>
          </View>
          <View style={styles.legendRow}>
            <View style={styles.legendSwatchB} />
            <Text style={styles.legendText}>Micrologic & Customer involvement</Text>
          </View>
        </View>
      </View>
    </PdfPageShell>
  );
}