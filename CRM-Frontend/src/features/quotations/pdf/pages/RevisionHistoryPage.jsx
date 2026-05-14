// src/features/quotations/pdf/pages/RevisionHistoryPage.jsx

import { View, Text, StyleSheet } from "@react-pdf/renderer";
import PdfPageShell from "../components/PdfPageShell";
import { PDF_COLORS } from "../quotationPdfTheme";
import { safeText } from "../quotationPdfUtils";

const styles = StyleSheet.create({
  sectionTitle: {
    marginTop: 8,
    marginBottom: 10,
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    color: PDF_COLORS.ink,
  },
  table: {
    border: `1 solid ${PDF_COLORS.border}`,
    backgroundColor: PDF_COLORS.white,
  },
  head: {
    flexDirection: "row",
    backgroundColor: PDF_COLORS.tableHead,
    borderBottom: `1 solid ${PDF_COLORS.border}`,
  },
  bodyRow: {
    flexDirection: "row",
    borderBottom: `1 solid ${PDF_COLORS.borderSoft}`,
  },
  bodyRowLast: {
    borderBottom: "0 solid #000000",
  },
  cell: {
    paddingHorizontal: 7,
    paddingVertical: 6,
    fontSize: 8,
    borderRight: `1 solid ${PDF_COLORS.borderSoft}`,
  },
  cellLast: {
    borderRight: "0 solid #000000",
  },
  h1: { width: "12%", fontWeight: "bold" },
  h2: { width: "20%", fontWeight: "bold" },
  h3: { width: "22%", fontWeight: "bold" },
  h4: { width: "46%", fontWeight: "bold" },
});

export default function RevisionHistoryPage({ data }) {
  const rows = data?.revisionHistory || [];

  return (
    <PdfPageShell>
      <Text style={styles.sectionTitle}>Revision History</Text>

      <View style={styles.table}>
        <View style={styles.head}>
          <Text style={[styles.cell, styles.h1]}>SL#</Text>
          <Text style={[styles.cell, styles.h2]}>Revision No.</Text>
          <Text style={[styles.cell, styles.h3]}>Revision Date</Text>
          <Text style={[styles.cell, styles.h4, styles.cellLast]}>History</Text>
        </View>

        {rows.length > 0 ? (
          rows.map((row, index) => (
            <View
              key={index}
              style={[
                styles.bodyRow,
                index === rows.length - 1 ? styles.bodyRowLast : null,
              ]}
            >
              <Text style={[styles.cell, styles.h1]}>{safeText(row.slNo || index + 1)}</Text>
              <Text style={[styles.cell, styles.h2]}>{safeText(row.revisionNo)}</Text>
              <Text style={[styles.cell, styles.h3]}>{safeText(row.revisionDate)}</Text>
              <Text style={[styles.cell, styles.h4, styles.cellLast]}>
                {safeText(row.history)}
              </Text>
            </View>
          ))
        ) : (
          <View style={styles.bodyRow}>
            <Text style={[styles.cell, styles.h1]}>1</Text>
            <Text style={[styles.cell, styles.h2]}>-</Text>
            <Text style={[styles.cell, styles.h3]}>-</Text>
            <Text style={[styles.cell, styles.h4, styles.cellLast]}>-</Text>
          </View>
        )}
      </View>
    </PdfPageShell>
  );
}

