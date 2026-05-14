// src/features/quotations/pdf/pages/BankDetailsPage.jsx

import { View, Text, StyleSheet } from "@react-pdf/renderer";
import PdfPageShell from "../components/PdfPageShell";
import { PDF_COLORS } from "../quotationPdfTheme";
import { safeText, splitText } from "../quotationPdfUtils";

const styles = StyleSheet.create({
  title: {
    marginTop: 8,
    marginBottom: 8,
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    color: PDF_COLORS.ink,
  },
  table: {
    border: `1 solid ${PDF_COLORS.border}`,
    backgroundColor: PDF_COLORS.white,
  },
  sectionHead: {
    paddingHorizontal: 6,
    paddingVertical: 5,
    backgroundColor: PDF_COLORS.blue,
    color: PDF_COLORS.white,
    borderBottom: `1 solid ${PDF_COLORS.border}`,
    fontSize: 8.8,
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    borderBottom: `1 solid ${PDF_COLORS.borderSoft}`,
  },
  rowLast: {
    borderBottom: "0 solid #000000",
  },
  num: {
    width: "10%",
    paddingHorizontal: 6,
    paddingVertical: 5,
    fontSize: 8,
    fontWeight: "bold",
    borderRight: `1 solid ${PDF_COLORS.borderSoft}`,
    backgroundColor: "#FAFAFA",
  },
  label: {
    width: "38%",
    paddingHorizontal: 6,
    paddingVertical: 5,
    fontSize: 8,
    fontWeight: "bold",
    borderRight: `1 solid ${PDF_COLORS.borderSoft}`,
  },
  value: {
    width: "52%",
    paddingHorizontal: 6,
    paddingVertical: 5,
    fontSize: 8,
  },
  bullet: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontSize: 8.2,
    borderBottom: `1 solid ${PDF_COLORS.borderSoft}`,
  },
  end: {
    marginTop: 18,
    textAlign: "center",
    fontSize: 9,
    color: PDF_COLORS.muted,
    letterSpacing: 0.3,
  },
});

function SimpleSection({ title, rows = [] }) {
  return (
    <>
      <Text style={styles.sectionHead}>{title}</Text>
      {rows.map((row, idx) => (
        <View key={idx} style={[styles.row, idx === rows.length - 1 ? styles.rowLast : null]}>
          <Text style={styles.num}>{safeText(row.code || row.no || row[0])}</Text>
          <Text style={styles.label}>{safeText(row.label || row[1])}</Text>
          <Text style={styles.value}>{safeText(row.value || row[2])}</Text>
        </View>
      ))}
    </>
  );
}

export default function BankDetailsPage({ data }) {
  const bank = data?.bankDetails || {};
  const accountDetails = bank.accountDetails || [];
  const paymentInstructions = bank.paymentInstructions || [];
  const registrationNumbers = bank.registrationNumbers || [];

  return (
    <PdfPageShell>
      <Text style={styles.title}>{safeText(bank.title, "MICROLOGIC BANK DETAILS")}</Text>

      <View style={styles.table}>
        {accountDetails.length > 0 ? (
          <>
            <SimpleSection title="1 ACCOUNT DETAILS" rows={accountDetails} />
            {paymentInstructions.length > 0 ? (
              <>
                <Text style={styles.sectionHead}>2 Micrologic Payment Cheque / DD / Pay Order</Text>
                {paymentInstructions.map((line, idx) => (
                  <Text key={idx} style={styles.bullet}>
                    {`➢ ${line}`}
                  </Text>
                ))}
              </>
            ) : null}

            {registrationNumbers.length > 0 ? (
              <SimpleSection title="3 Micrologic Registration Numbers" rows={registrationNumbers} />
            ) : null}
          </>
        ) : (
          <Text style={styles.sectionHead}>No bank details provided by backend</Text>
        )}
      </View>

      <Text style={styles.end}>-----------------------------------------End of Document---------------------------------------</Text>
    </PdfPageShell>
  );
}