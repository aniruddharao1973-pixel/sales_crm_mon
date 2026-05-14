// src/features/quotations/pdf/pages/PricingPage.jsx

import { View, Text, StyleSheet } from "@react-pdf/renderer";
import PdfPageShell from "../components/PdfPageShell";
import { PDF_COLORS } from "../quotationPdfTheme";
import { formatMoney, safeText, splitText } from "../quotationPdfUtils";

const styles = StyleSheet.create({
  title: {
    marginTop: 8,
    marginBottom: 8,
    fontSize: 14,
    fontWeight: "bold",
    color: PDF_COLORS.ink,
  },
  category: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: PDF_COLORS.blueSoft,
    border: `1 solid ${PDF_COLORS.blue}`,
    fontSize: 9,
    fontWeight: "bold",
    color: PDF_COLORS.blue,
  },
  subTitle: {
    marginTop: 5,
    marginBottom: 8,
    fontSize: 9,
    color: PDF_COLORS.text,
  },
  projectTitle: {
    marginBottom: 8,
    fontSize: 10,
    fontWeight: "bold",
    color: PDF_COLORS.blue,
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
  row: {
    flexDirection: "row",
    borderBottom: `1 solid ${PDF_COLORS.borderSoft}`,
  },
  rowAlt: {
    backgroundColor: PDF_COLORS.rowAlt,
  },
  rowLast: {
    borderBottom: "0 solid #000000",
  },
  cell: {
    paddingHorizontal: 5,
    paddingVertical: 5,
    fontSize: 7.5,
    borderRight: `1 solid ${PDF_COLORS.borderSoft}`,
    color: PDF_COLORS.text,
  },
  cellLast: {
    borderRight: "0 solid #000000",
  },
  hSl: { width: "6%", fontWeight: "bold" },
  hHsn: { width: "10%", fontWeight: "bold" },
  hGst: { width: "8%", fontWeight: "bold" },
  hDesc: { width: "44%", fontWeight: "bold" },
  hUnit: { width: "12%", fontWeight: "bold", textAlign: "right" },
  hQty: { width: "6%", fontWeight: "bold", textAlign: "right" },
  hTotal: { width: "14%", fontWeight: "bold", textAlign: "right" },

  colSl: { width: "6%" },
  colHsn: { width: "10%" },
  colGst: { width: "8%" },
  colDesc: { width: "44%" },
  colUnit: { width: "12%", textAlign: "right" },
  colQty: { width: "6%", textAlign: "right" },
  colTotal: { width: "14%", textAlign: "right" },

  descTitle: {
    fontWeight: "bold",
    marginBottom: 2,
  },
  descText: {
    fontSize: 7.2,
    color: PDF_COLORS.text,
  },

  noteBlock: {
    marginTop: 10,
    border: `1 solid ${PDF_COLORS.border}`,
    backgroundColor: PDF_COLORS.white,
    padding: 8,
  },
  label: {
    fontWeight: "bold",
    color: PDF_COLORS.ink,
    marginTop: 2,
    marginBottom: 3,
  },
  paragraph: {
    fontSize: 8.2,
    marginBottom: 4,
    color: PDF_COLORS.text,
  },
  orangeNote: {
    color: "#EA580C",
    fontWeight: "bold",
  },
});

export default function PricingPage({ data }) {
  const pricing = data?.pricing || {};
  const rows = pricing.rows || [];

  return (
    <PdfPageShell>
      <Text style={styles.title}>PRICE:</Text>
      {pricing.category ? (
        <Text style={styles.category}>{pricing.category}</Text>
      ) : null}

      {pricing.leadText ? <Text style={styles.subTitle}>{pricing.leadText}</Text> : null}
      <Text style={styles.projectTitle}>{safeText(pricing.projectTitle)}</Text>

      <View style={styles.table}>
        <View style={styles.head}>
          <Text style={[styles.cell, styles.hSl]}>SL#</Text>
          <Text style={[styles.cell, styles.hHsn]}>HSN/SAC Code</Text>
          <Text style={[styles.cell, styles.hGst]}>GST*</Text>
          <Text style={[styles.cell, styles.hDesc]}>Description</Text>
          <Text style={[styles.cell, styles.hUnit]}>Unit Price (INR)*</Text>
          <Text style={[styles.cell, styles.hQty]}>QTY</Text>
          <Text style={[styles.cell, styles.hTotal, styles.cellLast]}>
            Final Total (INR)*
          </Text>
        </View>

        {rows.length > 0 ? (
          rows.map((row, index) => {
            const descLines = row.descriptionLines?.length
              ? row.descriptionLines
              : splitText(row.description);

            return (
              <View
                key={index}
                style={[styles.row, index % 2 === 1 ? styles.rowAlt : null]}
              >
                <Text style={[styles.cell, styles.colSl]}>{safeText(row.slNo)}</Text>
                <Text style={[styles.cell, styles.colHsn]}>{safeText(row.hsnSac)}</Text>
                <Text style={[styles.cell, styles.colGst]}>
                  {safeText(row.gst)}
                </Text>

                <View style={[styles.cell, styles.colDesc]}>
                  {row.descriptionTitle ? (
                    <Text style={styles.descTitle}>{row.descriptionTitle}</Text>
                  ) : null}
                  {descLines.map((line, idx) => (
                    <Text key={idx} style={styles.descText}>
                      {line}
                    </Text>
                  ))}
                </View>

                <Text style={[styles.cell, styles.colUnit]}>
                  {formatMoney(row.unitPrice)}
                </Text>
                <Text style={[styles.cell, styles.colQty]}>
                  {safeText(row.qty)}
                </Text>
                <Text style={[styles.cell, styles.colTotal, styles.cellLast]}>
                  {formatMoney(row.finalTotal)}
                </Text>
              </View>
            );
          })
        ) : (
          <View style={styles.row}>
            <Text style={[styles.cell, styles.colSl]}>-</Text>
            <Text style={[styles.cell, styles.colHsn]}>-</Text>
            <Text style={[styles.cell, styles.colGst]}>-</Text>
            <Text style={[styles.cell, styles.colDesc]}>-</Text>
            <Text style={[styles.cell, styles.colUnit]}>-</Text>
            <Text style={[styles.cell, styles.colQty]}>-</Text>
            <Text style={[styles.cell, styles.colTotal, styles.cellLast]}>-</Text>
          </View>
        )}
      </View>

      <View style={styles.noteBlock}>
        {pricing.notes?.length > 0 ? (
          pricing.notes.map((n, idx) => (
            <Text key={idx} style={[styles.paragraph, idx === 0 ? styles.orangeNote : null]}>
              {n}
            </Text>
          ))
        ) : null}

        {pricing.priceBasis ? (
          <>
            <Text style={styles.label}>Price Basis:</Text>
            <Text style={styles.paragraph}>{pricing.priceBasis}</Text>
          </>
        ) : null}

        {pricing.delivery?.length > 0 ? (
          <>
            <Text style={styles.label}>Delivery</Text>
            {pricing.delivery.map((d, idx) => (
              <Text key={idx} style={styles.paragraph}>
                {idx + 1}. {d}
              </Text>
            ))}
          </>
        ) : null}
      </View>
    </PdfPageShell>
  );
}