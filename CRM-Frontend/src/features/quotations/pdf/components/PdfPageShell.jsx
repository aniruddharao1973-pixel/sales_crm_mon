// src/features/quotations/pdf/components/PdfPageShell.jsx

import { Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import { PDF_COLORS, PDF_META } from "../quotationPdfTheme";

const styles = StyleSheet.create({
  page: {
    paddingTop: 18,
    paddingHorizontal: 18,
    paddingBottom: 34,
    fontSize: 8.4,
    fontFamily: "Helvetica",
    color: PDF_COLORS.text,
    lineHeight: 1.32,
    backgroundColor: PDF_COLORS.pageBg,
  },
  topStrip: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    border: `1 solid ${PDF_COLORS.border}`,
    backgroundColor: PDF_COLORS.white,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  brand: {
    fontSize: 11.5,
    fontWeight: "bold",
    color: PDF_COLORS.blue,
    letterSpacing: 0.4,
  },
  stripMeta: {
    fontSize: 7.4,
    color: PDF_COLORS.muted,
  },
  footerWrap: {
    position: "absolute",
    left: 18,
    right: 18,
    bottom: 12,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    borderTop: `1 solid ${PDF_COLORS.border}`,
    paddingTop: 5,
  },
  footerLeft: {
    fontSize: 6.8,
    color: PDF_COLORS.muted,
  },
  footerRight: {
    fontSize: 6.8,
    color: PDF_COLORS.muted,
    textAlign: "right",
  },
  pageNumber: {
    position: "absolute",
    bottom: 6,
    right: 18,
    fontSize: 6.8,
    color: PDF_COLORS.muted,
  },
});

export default function PdfPageShell({ children }) {
  return (
    <Page size="A4" style={styles.page} wrap>
      <View style={styles.topStrip} fixed>
        <Text style={styles.brand}>{PDF_META.shortCompany}</Text>
        <Text style={styles.stripMeta}>
          Ref {PDF_META.refNo} | {PDF_META.revNo} | Date Wednesday, April 23, 2025
        </Text>
      </View>

      {children}

      <View style={styles.footerWrap} fixed>
        <View style={styles.footer}>
          <Text style={styles.footerLeft}>
            Confidential – Intended for the Addressee & Recipient only
          </Text>
          <View>
            <Text style={styles.footerRight}>
              Doc No: {PDF_META.docNo}, Ver No: {PDF_META.docVer}, Date: {PDF_META.docDate}
            </Text>
            <Text style={styles.footerRight}>
              All Images & Drawings shown are Indicative only
            </Text>
          </View>
        </View>
      </View>

      <Text
        style={styles.pageNumber}
        render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
        fixed
      />
    </Page>
  );
}