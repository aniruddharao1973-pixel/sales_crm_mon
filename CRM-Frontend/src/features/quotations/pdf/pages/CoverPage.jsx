// src/features/quotations/pdf/pages/CoverPage.jsx

import { Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import { PDF_COLORS, PDF_META } from "../quotationPdfTheme";
import { fmtDate, safeText } from "../quotationPdfUtils";

const styles = StyleSheet.create({
  page: {
    paddingTop: 22,
    paddingHorizontal: 18,
    paddingBottom: 22,
    fontSize: 8.4,
    fontFamily: "Helvetica",
    color: PDF_COLORS.text,
    lineHeight: 1.32,
    backgroundColor: PDF_COLORS.pageBg,
  },
  logo: {
    alignItems: "center",
    marginTop: 6,
    marginBottom: 10,
  },
  logoText: {
    fontSize: 20,
    fontStyle: "italic",
    fontWeight: "bold",
    color: "#1E3A8A",
    letterSpacing: 0.3,
  },
  refBar: {
    alignSelf: "center",
    flexDirection: "row",
    border: `1 solid ${PDF_COLORS.border}`,
    backgroundColor: PDF_COLORS.white,
    marginBottom: 16,
  },
  refCell: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRight: `1 solid ${PDF_COLORS.border}`,
    fontSize: 8,
  },
  refCellLast: {
    borderRight: "0 solid #000000",
  },
  refLabel: {
    color: PDF_COLORS.muted,
    marginRight: 5,
  },
  refValue: {
    color: PDF_COLORS.blue,
    fontWeight: "bold",
  },
  title: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    color: PDF_COLORS.ink,
    marginBottom: 14,
  },
  twoColWrap: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  twoCol: {
    width: "49%",
  },
  box: {
    border: `1 solid ${PDF_COLORS.border}`,
    backgroundColor: PDF_COLORS.white,
    marginBottom: 15,
  },
  boxHeader: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderBottom: `1 solid ${PDF_COLORS.border}`,
    fontWeight: "bold",
    fontSize: 9,
    backgroundColor: PDF_COLORS.graySoft,
  },
  row: {
    flexDirection: "row",
    borderBottom: `1 solid ${PDF_COLORS.borderSoft}`,
  },
  rowLast: {
    borderBottom: "0 solid #000000",
  },
  label: {
    width: "24%",
    paddingHorizontal: 8,
    paddingVertical: 5,
    fontWeight: "bold",
    color: PDF_COLORS.text,
    borderRight: `1 solid ${PDF_COLORS.borderSoft}`,
    backgroundColor: "#FAFAFA",
  },
  value: {
    width: "76%",
    paddingHorizontal: 8,
    paddingVertical: 5,
    color: PDF_COLORS.blue,
  },
  companyFooter: {
    marginTop: 42,
    alignItems: "center",
  },
  companyName: {
    fontSize: 10,
    fontWeight: "bold",
    color: PDF_COLORS.text,
    textAlign: "center",
  },
  companyAddr: {
    fontSize: 8,
    textAlign: "center",
    color: PDF_COLORS.text,
    marginTop: 2,
  },
  website: {
    fontSize: 9,
    textAlign: "center",
    color: PDF_COLORS.blue,
    textDecoration: "underline",
    marginTop: 2,
  },
  micrologicContactBox: {
    marginTop: 10,
    border: `1 solid ${PDF_COLORS.border}`,
    width: "100%",
  },
  contactHeader: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    backgroundColor: PDF_COLORS.graySoft,
    borderBottom: `1 solid ${PDF_COLORS.border}`,
    fontSize: 9,
    fontWeight: "bold",
  },
  contactRow: {
    flexDirection: "row",
    borderBottom: `1 solid ${PDF_COLORS.borderSoft}`,
  },
  contactRowLast: {
    borderBottom: "0 solid #000000",
  },
  contactCell: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRight: `1 solid ${PDF_COLORS.borderSoft}`,
  },
  contactCellLast: {
    borderRight: "0 solid #000000",
  },
  contactName: {
    color: PDF_COLORS.blue,
    fontWeight: "bold",
  },
  contactEmail: {
    color: PDF_COLORS.blue,
    textDecoration: "underline",
  },
});

function Row({ label, value, last = false }) {
  return (
    <View style={[styles.row, last ? styles.rowLast : null]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{safeText(value)}</Text>
    </View>
  );
}

export default function CoverPage({ data }) {
  const cover = data?.cover || {};

  const refNo = safeText(cover.refNo || PDF_META.refNo);
  const revNo = safeText(cover.revNo || PDF_META.revNo);
  const dateText = fmtDate(cover.dateText);

  const companyContacts =
    cover.micrologicContacts?.length > 0
      ? cover.micrologicContacts
      : [
          {
            name: "Nagendra Prasad B M",
            email: "nagendraprasad@micrologicglobal.com",
            phone: "+91 99863 77189",
          },
          {
            name: "Bhavya K S",
            email: "bhavyaks@micrologicglobal.com",
            phone: "+91 96636 56783",
          },
        ];

  const referenceDocuments = Array.isArray(cover.referenceDocuments)
    ? cover.referenceDocuments
    : [];

  return (
    <Page size="A4" style={styles.page} wrap>
      <View style={styles.logo}>
        <Text style={styles.logoText}>{PDF_META.shortCompany}</Text>
      </View>

      <View style={styles.refBar}>
        <View style={styles.refCell}>
          <Text>
            <Text style={styles.refLabel}>Ref </Text>
            <Text style={styles.refValue}>{refNo}</Text>
          </Text>
        </View>
        <View style={styles.refCell}>
          <Text>
            <Text style={styles.refLabel}>Rev </Text>
            <Text style={styles.refValue}>{revNo}</Text>
          </Text>
        </View>
        <View style={[styles.refCell, styles.refCellLast]}>
          <Text>
            <Text style={styles.refLabel}>Date </Text>
            <Text style={styles.refValue}>{dateText}</Text>
          </Text>
        </View>
      </View>

      <Text style={styles.title}>COMMERCIAL PROPOSAL</Text>

      <View style={styles.twoColWrap}>
        <View style={styles.twoCol}>
          <View style={styles.box}>
            <Text style={styles.boxHeader}>Proposal Submitted to:</Text>
            <Row label="Customer" value={cover.customerName} />
            <Row label="Address" value={cover.address} />
            <Row label="Contact" value={cover.contactName} />
            <Row label="Department" value={cover.department} />
            <Row label="Phone No." value={cover.phone} />
            <Row label="Email" value={cover.email} last />
          </View>
        </View>

        <View style={styles.twoCol}>
          <View style={styles.box}>
            <Text style={styles.boxHeader}>Project Details</Text>
            <Row label="Project" value={cover.projectName} />
            <Row
              label="Reference Docs"
              value={referenceDocuments.map((x) => `➢ ${x}`).join("\n")}
            />
            <Row label="Technical Proposal Ref" value={cover.technicalProposalRef} />
            <Row label="Document Owner" value={cover.documentOwner} />
            <Row label="Verified & Approved By" value={cover.verifiedApprovedBy} last />
          </View>
        </View>
      </View>

      <View style={styles.companyFooter}>
        <Text style={styles.companyName}>{PDF_META.companyName}</Text>
        <Text style={styles.companyAddr}>{PDF_META.addressLine1}</Text>
        <Text style={styles.website}>{PDF_META.website}</Text>
        <Text style={styles.companyAddr}>{PDF_META.mainPhone}</Text>
      </View>

      <View style={styles.micrologicContactBox}>
        <Text style={styles.contactHeader}>Micrologic Contact</Text>

        {companyContacts.map((c, idx) => (
          <View
            key={idx}
            style={[
              styles.contactRow,
              idx === companyContacts.length - 1 ? styles.contactRowLast : null,
            ]}
          >
            <View style={styles.contactCell}>
              <Text>{`Contact ${idx + 1}`}</Text>
            </View>
            <View style={styles.contactCell}>
              <Text style={styles.contactName}>{safeText(c.name)}</Text>
            </View>
            <View style={styles.contactCell}>
              <Text style={styles.contactEmail}>{safeText(c.email)}</Text>
            </View>
            <View style={[styles.contactCell, styles.contactCellLast]}>
              <Text>{safeText(c.phone)}</Text>
            </View>
          </View>
        ))}
      </View>
    </Page>
  );
}