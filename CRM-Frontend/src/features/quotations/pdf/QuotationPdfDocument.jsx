// src\features\quotations\pdf\QuotationPdfDocument.jsx
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import logo from "../../../assets/micrologic_logo.png";
import { proposalData } from "./data/proposalData";

const styles = StyleSheet.create({
  page: {
    paddingTop: 22,
    paddingBottom: 70,
    paddingHorizontal: 36, // was 26
    fontSize: 9,
    fontFamily: "Helvetica",
    color: "#374151",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
  },
  header: {
    paddingBottom: 10,
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  logoRow: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  logoImage: {
    width: 110,
    height: 28,
    objectFit: "contain",
  },
  tagline: {
    fontSize: 8,
    color: "#2563EB",
    marginTop: 2,
    letterSpacing: 0.5,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  metaBox: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 3,
    overflow: "hidden",
    marginHorizontal: 3,
  },
  metaLabel: {
    backgroundColor: "#F1F5F9",
    paddingVertical: 3,
    paddingHorizontal: 6,
    fontSize: 8,
    fontWeight: "bold",
    color: "#4B5563",
    borderRightWidth: 1,
    borderRightColor: "#E5E7EB",
  },
  metaValue: {
    paddingVertical: 3,
    paddingHorizontal: 6,
    fontSize: 8,
    color: "#2563EB",
  },
  pageTitleWrap: {
    alignItems: "center",
    marginBottom: 12,
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0F172A",
    letterSpacing: 1,
    textAlign: "center",
  },
  titleUnderline: {
    width: 60,
    height: 3,
    backgroundColor: "#2563EB",
    marginTop: 6,
    borderRadius: 2,
  },
  sectionCard: {
    borderWidth: 1,
    borderColor: "#E5EAF2",
    borderRadius: 6,
    overflow: "hidden",
    marginBottom: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1.5,
    borderBottomColor: "#CBD5F5",
  },
  sectionCardSoft: {
    borderWidth: 1,
    borderColor: "#E5EAF2",
    borderRadius: 6,
    overflow: "hidden",
    marginBottom: 12,
    backgroundColor: "#F9FBFF",
    borderBottomWidth: 1.5,
    borderBottomColor: "#CBD5F5",
  },
  sectionHeaderBlue: {
    backgroundColor: "#EFF6FF",
    paddingVertical: 6,
    paddingHorizontal: 8, // was 10
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  sectionHeaderSoft: {
    backgroundColor: "#EEF2FF",
    paddingVertical: 7,
    paddingHorizontal: 8, // was 10
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    borderLeftWidth: 4,
    borderLeftColor: "#2563EB",
  },
  sectionHeaderTextBlue: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#2563EB",
  },
  sectionHeaderTextDark: {
    fontSize: 9.5,
    fontWeight: "bold",
    color: "#1E3A8A",
    letterSpacing: 0.3,
  },
  cardBody: {
    paddingVertical: 10,
    paddingHorizontal: 8, // was 10
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  infoRowNoGap: {
    flexDirection: "row",
  },
  infoLabel: {
    width: "28%",
    fontSize: 8.5,
    fontWeight: "bold",
    color: "#111827",
    paddingRight: 6,
  },
  infoValueText: {
    width: "72%",
    fontSize: 8.6,
    color: "#4B5563",
    lineHeight: 1.35,
  },
  infoValueNode: {
    width: "70%",
  },
  paragraph: {
    fontSize: 8.6,
    lineHeight: 1.6,
    color: "#4B5563",
    marginBottom: 8,
    textAlign: "justify",
  },
  highlightBox: {
    borderLeftWidth: 4,
    borderLeftColor: "#F59E0B",
    backgroundColor: "#FFFBEB",
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 8,
    marginTop: 6,
    marginBottom: 8,
  },
  highlightText: {
    fontSize: 8.3,
    lineHeight: 1.4,
    color: "#92400E",
    fontWeight: "bold",
  },
  tableWrap: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 4,
    marginBottom: 8,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#3B82F6",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  tableRowLast: {
    flexDirection: "row",
  },
  tableCellHeader: {
    paddingVertical: 6,
    paddingHorizontal: 4,
    fontSize: 8.2,
    fontWeight: "bold",
    color: "#FFFFFF",
    borderRightWidth: 1,
    borderRightColor: "rgba(255,255,255,0.18)",
  },
  tableCell: {
    paddingVertical: 6,
    paddingHorizontal: 4,
    fontSize: 8.2,
    color: "#4B5563",
    borderRightWidth: 1,
    borderRightColor: "#E5EAF2",
    lineHeight: 1.5,
  },
  tableCellLast: {
    paddingVertical: 5,
    paddingHorizontal: 4, // was 5
    fontSize: 8,
    color: "#4B5563",
    lineHeight: 1.35,
  },
  tableCellHighlighted: {
    paddingVertical: 5,
    paddingHorizontal: 5,
    fontSize: 8,
    color: "#2563EB",
    fontWeight: "bold",
    borderRightWidth: 1,
    borderRightColor: "#E5E7EB",
    lineHeight: 1.35,
  },
  tableCellHighlightedLast: {
    paddingVertical: 5,
    paddingHorizontal: 5,
    fontSize: 8,
    color: "#2563EB",
    fontWeight: "bold",
    lineHeight: 1.35,
  },
  groupRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  groupRowLast: {
    flexDirection: "row",
  },
  groupSpanCell: {
    borderRightWidth: 1,
    borderRightColor: "#E5EAF2",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  subRowsWrap: {
    flex: 1,
    flexDirection: "column",
  },
  subRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  subRowLast: {
    flexDirection: "row",
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 36,
    right: 36,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#CBD5F5",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  footerLeft: {
    flex: 1,
  },
  footerRight: {
    flex: 1,
    alignItems: "flex-end",
  },
  footerMain: {
    fontSize: 8.5,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 2,
  },
  footerSub: {
    fontSize: 7.8,
    color: "#9CA3AF",
    fontStyle: "italic",
    marginBottom: 1,
  },
  footerRightText: {
    fontSize: 7.8,
    color: "#9CA3AF",
    fontStyle: "italic",
    marginBottom: 1,
    textAlign: "right",
  },
  bulletLine: {
    flexDirection: "row",
    marginBottom: 4,
  },
  bulletMark: {
    width: 10,
    fontSize: 8,
    color: "#4B5563",
  },
  bulletText: {
    flex: 1,
    fontSize: 8.5,
    color: "#374151",
    lineHeight: 1.5,
  },
  twoColGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  modelCard: {
    width: "48.5%",

    backgroundColor: "#F8FAFC",

    borderWidth: 1,
    borderColor: "#DCE7F7",

    borderRadius: 8,

    paddingVertical: 10,
    paddingHorizontal: 10,

    marginBottom: 10,

    borderLeftWidth: 4,
    borderLeftColor: "#2563EB",
  },
  modelTitle: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#1D4ED8",
    marginBottom: 5,
    lineHeight: 1.3,
  },
  modelDesc: {
    fontSize: 8.2,
    color: "#475569",
    lineHeight: 1.6,
  },
  stepWrap: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 5,
    padding: 10,
  },
  stepRow: {
    flexDirection: "row",
    marginBottom: 9,
  },
  stepCircleWrap: {
    width: 22,
    alignItems: "center",
  },
  stepCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
  },
  stepNum: {
    color: "#FFFFFF",
    fontSize: 7.5,
    fontWeight: "bold",
  },
  stepLine: {
    width: 1,
    flex: 1,
    backgroundColor: "#DBEAFE",
    marginTop: -1,
  },
  stepContent: {
    flex: 1,
    paddingLeft: 8,
  },
  stepTitle: {
    fontSize: 8.5,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 2,
  },
  stepDesc: {
    fontSize: 8,
    color: "#4B5563",
    lineHeight: 1.35,
  },
  centeredIntro: {
    fontSize: 8.2,
    color: "#4B5563",
    lineHeight: 1.4,
    marginBottom: 8,
  },
  categoryBox: {
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 7,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 8.3,
    fontWeight: "bold",
    color: "#2563EB",
  },
  tinyMuted: {
    fontSize: 7.8,
    color: "#4B5563",
    lineHeight: 1.35,
  },
  gstSummaryWrap: {
    marginTop: 10,
    alignItems: "flex-end",
  },

  gstBox: {
    width: "45%",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 6,
    overflow: "hidden",
  },

  gstRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  gstRowLast: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 7,
    paddingHorizontal: 8,
  },

  gstLabel: {
    fontSize: 8.5,
    color: "#374151",
  },

  gstValue: {
    fontSize: 8.5,
    color: "#111827",
    fontWeight: "bold",
  },

  gstGrandRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 8,
    backgroundColor: "#ECFDF5",
  },

  gstGrandLabel: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#065F46",
  },

  gstGrandValue: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#059669",
  },
  endDocWrap: {
    marginTop: 18,
    alignItems: "center",
  },

  endDocLine: {
    fontSize: 8,
    color: "#6B7280",
    letterSpacing: 1,
  },

  divider: {
    height: 1,
    backgroundColor: "#CBD5F5",
    marginTop: 10,
  },
  categoryHeaderRow: {
    backgroundColor: "#F8FAFC",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    paddingVertical: 6,
    paddingHorizontal: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  categoryHeaderText: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#2563EB",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  benefitsCard: {
    marginTop: 4,

    borderWidth: 1,
    borderColor: "#DCE7F7",

    borderRadius: 8,

    overflow: "hidden",

    backgroundColor: "#FFFFFF",
  },
  benefitsHeader: {
    backgroundColor: "#EEF4FF",

    paddingVertical: 9,
    paddingHorizontal: 12,

    borderLeftWidth: 4,
    borderLeftColor: "#2563EB",
  },
  benefitsHeaderText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#1E3A8A",
  },
  benefitsBody: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  cancellationCard: {
    borderWidth: 1,
    borderColor: "#DCE7F7",
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    marginTop: 8,
  },
  cancellationHeader: {
    backgroundColor: "#EEF4FF",
    paddingVertical: 9,
    paddingHorizontal: 12,

    borderLeftWidth: 4,
    borderLeftColor: "#2563EB",
  },
  cancellationHeaderText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#1E3A8A",
  },
  cancellationBody: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  cancellationPara: {
    fontSize: 8.2,
    color: "#475569",
    lineHeight: 1.65,
    marginBottom: 10,
    textAlign: "justify",
  },
  cancellationListRow: {
    flexDirection: "row",
    marginBottom: 10,
  },
  cancellationListNo: {
    width: 18,
    fontSize: 8.5,
    fontWeight: "bold",
    color: "#1D4ED8",
  },
  cancellationListText: {
    flex: 1,
    fontSize: 8.2,
    color: "#475569",
    lineHeight: 1.55,
  },
  noteCard: {
    marginTop: 12,

    backgroundColor: "#FFFBEB",

    borderWidth: 1,
    borderColor: "#FCD34D",

    borderRadius: 8,

    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  noteTitle: {
    fontSize: 9.5,
    fontWeight: "bold",
    color: "#92400E",
    marginBottom: 10,
    textDecoration: "underline",
  },
  noteRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  noteNo: {
    width: 16,
    fontSize: 8.2,
    fontWeight: "bold",
    color: "#B45309",
  },
  noteText: {
    flex: 1,
    fontSize: 8,
    color: "#78350F",
    lineHeight: 1.5,
  },
});

const bankTableRows = [
  { no: "1", label: "ACCOUNT DETAILS", value: "" },

  { no: "1.1", label: "Name of the Bank", value: "Kotak Mahindra Bank" },
  {
    no: "1.2",
    label: "Account Holder’s Name",
    value: "MICROLOGIC INTEGRATED SYSTEMS PRIVATE LIMITED",
  },
  { no: "1.3", label: "Name of the Branch", value: "Sadashivanagar Branch" },
  {
    no: "1.4",
    label: "Address of the Branch",
    value:
      "G-2, No. 19 Old No.86, Lower Palace Orchards Main Road, Sanky Road, Sadashivanagar, Bengaluru – 560003 Karnataka, India",
  },
  {
    no: "1.5",
    label: "Telephone Number of the Branch",
    value: "1860 266 2666",
  },
  { no: "1.6", label: "IFSC code of the Branch", value: "KKBK0008060" },
  { no: "1.7", label: "SWIFT code of the Branch", value: "KKBKINBB" },
  { no: "1.8", label: "MICR Code", value: "560485064" },
  {
    no: "1.9",
    label: "Bank Account number",
    value: "7650258829 (As appearing on the Cheque book/pass book)",
  },
  { no: "1.10", label: "Account Type", value: "Overdraft Account" },

  {
    no: "2",
    label: "Micrologic Payment Cheque / DD / Pay Order",
    value:
      "In favor of Micrologic Integrated Systems Pvt. Ltd.\nPayable at Bangalore only",
  },

  { no: "3", label: "Micrologic Registration Numbers", value: "" },

  {
    no: "3.1",
    label: "Company Identity Number (CIN)",
    value: "U72200KA2006PTC041282",
  },
  { no: "3.2", label: "Excise Registration Number", value: "AAECM8994LEM004" },
  { no: "3.3", label: "VAT Registration Number", value: "29840733064" },
  { no: "3.4", label: "CST Registration Number", value: "29840733064" },
  { no: "3.5", label: "PAN Number", value: "AAECM8994L" },
  { no: "3.6", label: "GST Number", value: "29AAECM8994L1ZG" },
  { no: "3.7", label: "HSN Code", value: "90318000" },
  { no: "3.8", label: "State", value: "Karnataka" },
];

const models = [
  {
    title: "1. Fixed Price Model",
    desc: "Ideal for projects with well-defined requirements and scope. We provide a fixed quote and timeline, ensuring predictable costs and delivery schedules.",
  },
  {
    title: "2. Time & Material",
    desc: "Suitable for projects where scope is fluid or evolving. Billing is based on actual hours spent and materials used, offering maximum flexibility.",
  },
  {
    title: "3. Dedicated Team",
    desc: "We provide a dedicated team of experts who work exclusively on your project, acting as an extension of your own workforce.",
  },
  {
    title: "4. Support & Maintenance",
    desc: "Ongoing support post-deployment, ensuring system uptime, regular updates, and quick resolution of any issues.",
  },
];

const benefits = [
  "Flexibility to choose the model that best fits your project needs.",
  "Transparent communication and regular progress updates.",
  "Access to a pool of highly skilled and experienced professionals.",
  "Focus on delivering high-quality solutions on time and within budget.",
];

const processSteps = [
  {
    title: "Requirement Analysis & Kickoff",
    description:
      "Detailed review of customer requirements, finalizing the scope of work, and official project kickoff meeting.",
  },
  {
    title: "Design Approval Process (DAP)",
    description:
      "Submission of preliminary designs for customer review. Iterations and final approval of the design before manufacturing begins.",
  },
  {
    title: "Procurement & Manufacturing",
    description:
      "Sourcing of necessary components and materials. Fabrication and assembly of the equipment as per approved designs.",
  },
  {
    title: "Internal Testing & Validation",
    description:
      "Rigorous testing of the equipment at our facility to ensure it meets all functional and performance specifications.",
  },
  {
    title: "Factory Acceptance Test (FAT)",
    description:
      "Customer inspection and testing of the equipment at our facility before dispatch.",
  },
  {
    title: "Dispatch & Delivery",
    description:
      "Safe packaging and transportation of the equipment to the customer site.",
  },
  {
    title: "Installation & Commissioning",
    description:
      "On-site installation, integration, and final commissioning of the equipment.",
  },
  {
    title: "Site Acceptance Test (SAT) & Handover",
    description:
      "Final testing at the customer site, user training, and official handover of the equipment.",
  },
];

const commercialTermsRows = [
  {
    no: "1",
    heading: "PRICE BASIS",
    lines: ["Ex-Works Micrologic, Duties, Taxes, Freight, Insurance Extra"],
  },
  {
    no: "2",
    heading: "DELIVERY",
    lines: [
      "As above from the date of receipt of the Purchase order & advance",
    ],
  },
  {
    no: "3",
    heading: "PAYMENT TERMS",
    lines: [
      "Stage 1: Advance (Down payment) 50% of the order value, along with the Purchase Order",
      "Payment to be released within 1 week from the date of Pro forma Invoice to keep up the committed delivery time.",
      "Stage 2: 40% of the order value before dispatch on validation at Micrologic",
      "Stage 3: 10% of the order value against Installation & Commissioning",
    ],
  },
  {
    no: "4",
    heading: "Goods and Service Tax",
    lines: ["GST as above\nOr as applicable at the time of delivery"],
  },
  {
    no: "5",
    heading: "Warranty",
    lines: [
      "12 Months from the date of Invoice for Manufacturing Defects (Refer Micrologic General Warranty Terms below)",
    ],
  },
  {
    no: "6",
    heading: "Transit Insurance",
    lines: ["Buyers account"],
  },
  {
    no: "7",
    heading: "Equipment Validation & Acceptance",
    lines: [
      "The equipment will be fully tested in house prior to FAT (Factory Acceptance Test) and SAT (Site Acceptance Test). Our in-house test procedures will be in line with the Requirement Specification (RS) signed off by the Customer in the beginning of the Project.",
    ],
  },
  {
    no: "8",
    heading: "Inspection",
    lines: [
      "Inspection and validation by the customer.",
      "We suggest to validate with at least 100 samples",
    ],
  },
  {
    no: "9",
    heading: "Validity",
    lines: ["This quote is valid for 2 months from date"],
  },
  {
    no: "10",
    heading: "Placement of Purchase Order",
    lines: [
      "Please make the purchase order on:",
      "Micrologic Integrated Systems (P) Limited",
      "#22-D1, “Micrologic Drive”, KIADB Industrial Area, Phase 1, Kumbalagodu (Bengaluru-Mysuru Highway), Bengaluru-560 074, India",
    ],
  },
  {
    no: "11",
    heading: "Force Majeure",
    lines: [
      "The event either party is unable to perform its obligations under the terms of this Agreement because of acts of God, strikes, lockdowns, curfews, effects due to pandemic, equipment or transmission failure or damage reasonably beyond its control, or other causes reasonably beyond its control, such party shall not be liable for damages to the other for any damages resulting from such failure to perform or otherwise from such causes.",
    ],
  },
];

const delayedDeliveryRow = {
  no: "12",
  heading:
    "Delayed Delivery of the Project due to delays at customer’s end or force majeure",
  lines: [
    "In the event the customer does not take the delivery of the Project beyond 3 weeks of the readiness of the project at our factory or hold from the customer’s end for any other reason, the customer is liable to make the payment that is due as per the agreed terms with applicable taxes. Micrologic will intimate the readiness of the project with an internal test report.",
    "The reasons for such delays could be due to customer’s changed timelines, Lockdown/Curfew due to pandemic or any reasons causing a delay for the customer to take the delivery.",
  ],
};

const orderCancellationNotes = [
  "The deliverables proposed vide this proposal are completely customized and will be made specifically against your order. In order to deliver the project/product, there will be a set of stages which includes concept design, detailed design, software development, part manufacturing, integration, test & validation before it is ready for shipping. All these stages have cost content in effort & material.",
  "Orders once placed, and Micrologic accepts the order with an order acceptance, to meet the timelines, as a process the work begins internally.",
  "Cancellation of an order will have impact on the costs incurred at different stages;",
];

const cancellationItems = [
  { no: "1", text: "Order cancellation within 7 days of OA,\nNo charges" },
  {
    no: "2",
    text: "Cancellation of the order before DAP Signoff\n25% of the order value will be payable",
  },
  {
    no: "3",
    text: "Cancellation of the order after DAP Signoff\n50% of the order value will be payable",
  },
  {
    no: "4",
    text: "Cancellation of the order once the manufacturing has started\n100% of the order value will be payable",
  },
];

const noteItems = [
  "For Fast track deliveries with delivery timelines lesser than 7 days are not cancellable. 100% of the order value is payable",
  "For advances received, the cost as above will be forfeited at respective stages. The customer is deemed committed to pay the difference, where applicable",
  "For delayed payments an interest @2.5% per month",
];

const engagementRows = [
  {
    no: "1.1",
    heading: "Software",
    lines: [
      "The software applications (Suite) are the product and property of Micrologic and are licensed to the user under the license agreement. All Intellectual Properties (IP) used are property of the respective owners.",
      "The software suite cannot be reused without prior licensing from Micrologic.",
      "This model of engagement will not allow sharing, part or full source codes/snippets.",
    ],
  },
  {
    no: "1.2",
    heading: "Software Engagement Models",
    lines: [],
  },
  {
    no: "1.3",
    heading: "Application Development",
    lines: [
      "In this engagement model, a software application (software suite) will be supplied. The application remains a property of Micrologic and will be licensed to the buyer.",
    ],
  },
  {
    no: "1.4",
    heading: "Time and Effort",
    lines: [
      "In this engagement model, the software will be built for a given specification and the software will be the buyer’s property. Micrologic will charge on a Time and Effort basis, wherein the Man-hours spent on software development will be charged. The software can either be developed at Micrologic or at the buyer’s premises as necessary. The source code will be the property of the buyer.",
    ],
  },
  {
    no: "1.5",
    heading: "Modifications & Additions",
    lines: [
      "A DAP process will be followed where in the design and the requirement is discussed and vetted by the user. Modifications post DAP will call for a cost and time implication, to be borne by the buyer. Minor and reasonable modifications with respect to the requirement specifications can be made with mutual understanding from the seller and buyer.",
      "Modifications or additions requiring material and additional time and effort might call for a change in delivery time and there might be cost implications.",
    ],
  },
  {
    no: "1.6",
    heading: "Time lines",
    lines: [
      "Time lines quoted will be adhered by Micrologic. Where the buyer has to provide details like drawings, information, samples, if delayed from the buyer’s end, which would affect the project time lines, the affect of the delays will be borne by the buyer.",
      "If the equipment is not taken by the buyer after readiness, within a reasonable time, the buyer shall have to pay the full balance amount and Micrologic is entitled to impose demurrage charges to the buyer for keeping the equipment at Micrologic.",
    ],
  },
  {
    no: "1.7",
    heading: "Pre-Shipping Acceptance",
    lines: [
      "The buyer will validate the line/equipment before dispatch at his discretion and a ‘Dispatch Clearance’ is necessary for Micrologic to arrange dispatch.",
    ],
  },
  {
    no: "1.8",
    heading: "Information and Samples",
    lines: [
      "Information and samples needed to complete the project will be provided by the buyer at no cost to Micrologic. All costs involved to ship the samples will be borne by the buyer.",
    ],
  },
  {
    no: "1.9",
    heading: "Non-Disclosure",
    lines: [
      "Information and drawings submitted to the buyer for reviews and approvals remain property of Micrologic and cannot be shared or used for other purposes.",
      "At the same time Micrologic will commit to protect all properties of the customer from misuse.",
      "Where necessary a Non-Disclosure Agreement can be signed by both parties.",
    ],
  },
];

function PdfHeader({ refNo, revNo, date }) {
  return (
    <View style={styles.header} fixed>
      <View style={styles.logoRow}>
        <Image src={logo} style={styles.logoImage} />
        {/* <Text style={styles.tagline}>Efficiency Enhanced</Text> */}
      </View>

      <View style={styles.metaRow}>
        <View style={styles.metaBox}>
          <Text style={styles.metaLabel}>Ref</Text>
          <Text style={styles.metaValue}>{refNo}</Text>
        </View>
        <View style={styles.metaBox}>
          <Text style={styles.metaLabel}>Rev</Text>
          <Text style={styles.metaValue}>{revNo}</Text>
        </View>
        <View style={styles.metaBox}>
          <Text style={styles.metaLabel}>Date</Text>
          <Text style={styles.metaValue}>{date}</Text>
        </View>
      </View>
    </View>
  );
}

function PdfFooter() {
  return (
    <View style={styles.footer} fixed>
      <View style={styles.footerLeft}>
        <Text
          style={styles.footerMain}
          render={({ pageNumber, totalPages }) =>
            `Page ${pageNumber} of ${totalPages}`
          }
        />
        <Text style={styles.footerSub}>
          Confidential – Intended for the Addressee &amp; Recipient only
        </Text>
      </View>

      <View style={styles.footerRight}>
        <Text style={styles.footerRightText}>
          Doc No: 4001.0004, Ver No:1.1, Date:29-Apr-2026
        </Text>
        <Text style={styles.footerRightText}>
          All Images &amp; Drawings shown are Indicative only
        </Text>
      </View>
    </View>
  );
}

function SectionCard({ title, children, soft = false, ...props }) {
  return (
    <View {...props} style={soft ? styles.sectionCardSoft : styles.sectionCard}>
      {title ? (
        <View
          style={soft ? styles.sectionHeaderSoft : styles.sectionHeaderBlue}
        >
          <Text
            style={
              soft ? styles.sectionHeaderTextDark : styles.sectionHeaderTextBlue
            }
          >
            {title}
          </Text>
        </View>
      ) : null}
      <View style={styles.cardBody}>{children}</View>
    </View>
  );
}

function HighlightBox({ text }) {
  return (
    <View style={styles.highlightBox}>
      <Text style={styles.highlightText}>{text}</Text>
    </View>
  );
}

function InfoCard({ title, items }) {
  return (
    <SectionCard title={title}>
      {items.map((item, index) => (
        <View
          key={`${item.label}-${index}`}
          style={
            index < items.length - 1 ? styles.infoRow : styles.infoRowNoGap
          }
        >
          <Text style={styles.infoLabel}>{item.label}</Text>
          {typeof item.value === "string" ? (
            <Text style={styles.infoValueText}>{item.value}</Text>
          ) : (
            <View style={styles.infoValueNode}>{item.value}</View>
          )}
        </View>
      ))}
    </SectionCard>
  );
}

function PricingTable({ columns, data }) {
  // data is expected to be an array of objects: { category, sl, subRows: [] }

  return (
    <View style={styles.tableWrap} wrap>
      {/* HEADER */}
      <View style={styles.tableHeader} fixed>
        {columns.map((col, i) => (
          <View
            key={col.key}
            style={{
              width: col.width,
              paddingVertical: 6,
              paddingHorizontal: 4,
              justifyContent: "center",
              alignItems:
                col.align === "right"
                  ? "flex-end"
                  : col.align === "center"
                    ? "center"
                    : "flex-start",
              borderRightWidth: i === columns.length - 1 ? 0 : 1,
              borderRightColor: "#4169E1",
            }}
          >
            <Text
              style={{
                fontSize: 6.8,
                fontWeight: "bold",
                color: "#FFFFFF",
                textAlign: col.align || "left",
              }}
            >
              {col.title}
            </Text>
          </View>
        ))}
      </View>

      {/* GROUPS */}
      {data.map((group, groupIndex) => {
        const isLastGroup = groupIndex === data.length - 1;
        const subRows = group.subRows || [];

        // If it's a simple row (like Total Quotation Value), handle it separately
        if (group.isHeader) {
          const isGrandTotal = group.description === "GRAND TOTAL";

          return (
            <View
              key={groupIndex}
              wrap={false}
              minPresenceAhead={0}
              style={[
                styles.tableRow,
                {
                  backgroundColor: isGrandTotal ? "#DCFCE7" : "#E0F2FE",
                  borderBottomWidth: 0,
                },
              ]}
            >
              {columns.map((col, colIndex) => {
                const isLastCol = colIndex === columns.length - 1;

                const isLabelCell = col.key === "sku";
                const isTotalCell = col.key === "total";

                return (
                  <View
                    key={col.key}
                    style={{
                      width: isLabelCell ? "78%" : col.width,

                      display: isLabelCell || isTotalCell ? "flex" : "none",

                      borderRightWidth: isLastCol ? 0 : 1,
                      borderRightColor: "#E5EAF2",

                      paddingVertical: 9,
                      paddingHorizontal: 6,

                      justifyContent: "center",
                      alignItems: "flex-end",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 9,
                        fontWeight: "bold",

                        color: isGrandTotal ? "#15803D" : "#2563EB",

                        textAlign: "right",
                      }}
                    >
                      {isLabelCell
                        ? group.description
                        : isTotalCell
                          ? group.total
                          : ""}
                    </Text>
                  </View>
                );
              })}
            </View>
          );
        }

        return (
          // <View key={groupIndex} style={{ width: "100%" }}>
          <View key={groupIndex} style={{ width: "100%" }}>
            {/* Horizontal Category Heading */}
            {/* {group.category && group.category !== "-" && (
              <View style={styles.categoryHeaderRow}>
                <Text style={styles.categoryHeaderText}>
                  {group.sl ? `${group.sl}. ` : ""}
                  {group.category}
                </Text>
              </View>
            )} */}
            {group.category && group.category !== "-" && (
              <View style={styles.categoryHeaderRow} wrap={false}>
                <Text style={styles.categoryHeaderText}>
                  {group.sl ? `${group.sl}. ` : ""}
                  {group.category}
                </Text>
              </View>
            )}

            {/* DATA ROWS */}
            {subRows.map((row, rowIndex) => {
              const isLastSubRow = rowIndex === subRows.length - 1;
              return (
                <View
                  key={rowIndex}
                  style={[
                    isLastSubRow && isLastGroup
                      ? styles.tableRowLast
                      : styles.tableRow,
                    { borderBottomWidth: 1, borderBottomColor: "#E5EAF2" },
                  ]}
                  wrap={false}
                >
                  {columns.map((col, colIndex) => {
                    const isLastCol = colIndex === columns.length - 1;
                    const shouldBeBold =
                      row.isBold &&
                      (col.key === "unitPrice" || col.key === "total");

                    return (
                      <View
                        key={col.key}
                        style={{
                          width: col.width,
                          borderRightWidth: isLastCol ? 0 : 1,
                          borderRightColor: "#E5EAF2",
                          paddingVertical: 6,
                          paddingHorizontal: 4,
                          justifyContent:
                            col.verticalAlign === "center"
                              ? "center"
                              : "flex-start",
                          alignItems:
                            col.align === "right"
                              ? "flex-end"
                              : col.align === "center"
                                ? "center"
                                : "flex-start",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 7.5,
                            color: "#000000", // 🔥 Force black as requested
                            fontWeight: shouldBeBold ? "bold" : "normal",
                            textAlign: col.align || "left",
                            lineHeight: 1.3,
                          }}
                        >
                          {row[col.key]}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              );
            })}
          </View>
        );
      })}
    </View>
  );
}

function BudgetaryPricingTable({ columns, data, totals, proposalType }) {
  return (
    <View style={styles.tableWrap} wrap>
      {/* HEADER */}
      <View style={[styles.tableHeader, { backgroundColor: "#F1F5F9" }]} fixed>
        {columns.map((col, i) => (
          <View
            key={col.key}
            style={{
              width: col.width,
              paddingVertical: 8,
              paddingHorizontal: 4,
              justifyContent: "center",
              alignItems: "center",
              borderRightWidth: i === columns.length - 1 ? 0 : 1,
              borderRightColor: "#CBD5E1",
            }}
          >
            <Text
              style={{
                fontSize: 8,
                fontWeight: "bold",
                color: "#0F172A",
                textAlign: "center",
              }}
            >
              {col.title}
            </Text>
          </View>
        ))}
      </View>

      {/* DATA ROWS */}
      {data.map((row, rowIndex) => {
        const isSummaryItem = row.isSummaryItem;
        return (
          <View
            key={rowIndex}
            style={{
              flexDirection: "row",
              borderBottomWidth: 1,
              borderBottomColor: "#E2E8F0",
            }}
            wrap={false}
          >
            {columns.map((col, colIndex) => {
              // Merging logic: If it's a summary item and column is unitPrice or qty, skip rendering
              // The description cell will take up the combined width of description + unitPrice + qty
              if (isSummaryItem && (col.key === "unitPrice" || col.key === "qty")) {
                return null;
              }

              let cellWidth = col.width;
              if (isSummaryItem && col.key === "description") {
                // Combine widths: description(40%) + unitPrice(12%) + qty(5%) = 57%
                cellWidth = "57%";
              }

              return (
                <View
                  key={col.key}
                  style={{
                    width: cellWidth,
                    borderRightWidth: colIndex === columns.length - 1 ? 0 : 1,
                    borderRightColor: "#E2E8F0",
                    paddingVertical: 8,
                    paddingHorizontal: 6,
                    justifyContent: "center",
                    alignItems:
                      col.align === "right"
                        ? "flex-end"
                        : col.align === "center"
                          ? "center"
                          : "flex-start",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 8.5,
                      color: "#000000", // 🔥 Force black as requested
                      fontWeight: "bold", // 🔥 Force bold for everything as requested
                      textAlign: col.align || "left",
                    }}
                  >
                    {row[col.key]}
                  </Text>
                </View>
              );
            })}
          </View>
        );
      })}

      {/* SUMMARY ROWS */}
      <View style={{ marginTop: 0 }}>
        {/* Basic Total */}
        <View
          style={{
            flexDirection: "row",
            borderBottomWidth: 1,
            borderBottomColor: "#E2E8F0",
          }}
        >
          <View
            style={{
              flex: 1,
              paddingVertical: 6,
              paddingHorizontal: 8,
              alignItems: "flex-end",
            }}
          >
            <Text style={{ fontSize: 9, fontWeight: "bold", color: "#0F172A" }}>
              Basic Total
            </Text>
          </View>
          <View
            style={{
              width: "15%",
              paddingVertical: 6,
              paddingHorizontal: 8,
              alignItems: "flex-end",
            }}
          >
            <Text style={{ fontSize: 9, fontWeight: "bold", color: "#0F172A" }}>
              {formatCurrency(totals?.subtotal || 0)}
            </Text>
          </View>
        </View>

        {/* Discount - Hide for BUDGETARY and COMMERCIAL_SUMMARY */}
        {totals?.discount > 0 &&
          proposalType !== "BUDGETARY" &&
          proposalType !== "COMMERCIAL_SUMMARY" && (
            <View
              style={{
                flexDirection: "row",
                borderBottomWidth: 1,
                borderBottomColor: "#E2E8F0",
              }}
            >
              <View
                style={{
                  flex: 1,
                  paddingVertical: 6,
                  paddingHorizontal: 8,
                  alignItems: "flex-end",
                }}
              >
                <Text
                  style={{ fontSize: 9, fontWeight: "bold", color: "#2563EB" }}
                >
                  Discount(-)
                </Text>
              </View>
              <View
                style={{
                  width: "15%",
                  paddingVertical: 6,
                  paddingHorizontal: 8,
                  alignItems: "flex-end",
                }}
              >
                <Text
                  style={{ fontSize: 9, fontWeight: "bold", color: "#2563EB" }}
                >
                  {formatCurrency(totals?.discount || 0)}
                </Text>
              </View>
            </View>
          )}

        {/* Final Total - Hide for BUDGETARY and COMMERCIAL_SUMMARY */}
        {proposalType !== "BUDGETARY" &&
          proposalType !== "COMMERCIAL_SUMMARY" && (
            <View style={{ flexDirection: "row", backgroundColor: "#F8FAFC" }}>
              <View
                style={{
                  flex: 1,
                  paddingVertical: 8,
                  paddingHorizontal: 8,
                  alignItems: "flex-end",
                }}
              >
                <Text
                  style={{ fontSize: 10, fontWeight: "bold", color: "#059669" }}
                >
                  Final Total
                </Text>
              </View>
              <View
                style={{
                  width: "15%",
                  paddingVertical: 8,
                  paddingHorizontal: 8,
                  alignItems: "flex-end",
                }}
              >
                <Text
                  style={{ fontSize: 10, fontWeight: "bold", color: "#059669" }}
                >
                  {formatCurrency(totals?.grandTotal || 0)}
                </Text>
              </View>
            </View>
          )}
      </View>

      {/* Price Basis Note */}
      <View style={{ marginTop: 8, paddingHorizontal: 4 }}>
        <Text style={{ fontSize: 9, color: "#1E3A8A", fontWeight: "bold" }}>
          Price Basis: Above price is basic, exclusive of GST@18% Extra
        </Text>
      </View>
    </View>
  );
}

function TableBlock({ columns, data, highlightLastRow = false }) {
  return (
    <View style={styles.tableWrap} wrap>
      {/* HEADER */}
      <View style={styles.tableHeader} fixed>
        {columns.map((col, i) => {
          const isLastCol = i === columns.length - 1;
          return (
            <View
              key={col.key}
              style={{
                width: col.width,
                paddingVertical: 6,
                paddingHorizontal: 4,
                justifyContent: "center",
                alignItems:
                  col.align === "right"
                    ? "flex-end"
                    : col.align === "center"
                      ? "center"
                      : "flex-start",
              }}
            >
              <Text
                style={{
                  fontSize: 8.5,
                  fontWeight: "bold",
                  color: "#FFFFFF",
                  textAlign: col.align || "left",
                }}
              >
                {col.title}
              </Text>
            </View>
          );
        })}
      </View>

      {/* ROWS */}
      {data.map((row, rowIndex) => {
        const isLast = rowIndex === data.length - 1;
        const isHeaderRow = row.isHeader;
        const isHighlighted = (highlightLastRow && isLast) || isHeaderRow;
        const isMainRow = rowIndex === 0;

        return (
          <View
            key={rowIndex}
            wrap={false}
            style={[
              isLast ? styles.tableRowLast : styles.tableRow,
              isHeaderRow && {
                backgroundColor: "#F1F5F9",
                borderTopWidth: 1,
                borderBottomWidth: 1,
                borderColor: "#1E3A8A",
              },
            ]}
          >
            {columns.map((col, colIndex) => {
              const isLastCol = colIndex === columns.length - 1;

              const textColor = isHighlighted ? "#2563EB" : "#4B5563";
              const fontWeight = isHighlighted ? "bold" : "normal";

              return (
                <View
                  key={col.key}
                  style={{
                    width: col.width,
                    borderRightWidth: isLastCol ? 0 : 1,
                    borderRightColor: "#E5EAF2",
                    paddingVertical: 6,
                    paddingHorizontal: 2,

                    // ✅ VERTICAL ALIGNMENT
                    justifyContent: col.verticalAlign || "flex-start",
                    alignItems:
                      col.align === "right"
                        ? "flex-end"
                        : col.align === "center"
                          ? "center"
                          : "flex-start",
                    borderBottomWidth: row[`${col.key}NoBorder`] ? 0 : 0, // We'll handle this via row styles if needed
                  }}
                >
                  {typeof row[col.key] === "string" &&
                  row[col.key].includes(",") &&
                  (col.key === "history" || col.key === "reason") ? (
                    row[col.key]
                      .split(",")
                      .map((p) => p.trim())
                      .filter(Boolean)
                      .map((part, i, arr) => (
                        <View
                          key={i}
                          style={{
                            flexDirection: "row",
                            marginBottom: i < arr.length - 1 ? 2 : 0,
                            alignItems: "flex-start",
                            width: "100%",
                          }}
                        >
                          <View
                            style={{
                              width: 3,
                              height: 3,
                              backgroundColor: "#3B82F6",
                              borderRadius: 1,
                              marginTop: 4,
                              marginRight: 4,
                            }}
                          />
                          <Text
                            style={{
                              fontSize: 8.2,
                              color: textColor,
                              fontWeight,
                              lineHeight: 1.3,
                              width: "94%",
                            }}
                          >
                            {cleanPdfText(part)}
                          </Text>
                        </View>
                      ))
                  ) : (
                    <Text
                      style={{
                        fontSize: 8.2,
                        color: textColor,
                        fontWeight,
                        textAlign: col.align || "left",
                        lineHeight: 1.3,
                      }}
                    >
                      {typeof row[col.key] === "string"
                        ? cleanPdfText(row[col.key])
                        : row[col.key] != null
                          ? row[col.key]
                          : "-"}
                    </Text>
                  )}
                </View>
              );
            })}
          </View>
        );
      })}
    </View>
  );
}

function BulletList({ items }) {
  return (
    <View>
      {items.map((item, index) => (
        <View key={`${item}-${index}`} style={styles.bulletLine}>
          <Text style={styles.bulletMark}>•</Text>
          <Text style={styles.bulletText}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

function StepFlow({ steps }) {
  const leftColors = [
    "#2563EB",
    "#6366F1",
    "#0EA5E9",
    "#8B5CF6",
    "#2563EB",
    "#6366F1",
    "#0EA5E9",
    "#8B5CF6",
  ];

  return (
    <View style={{ gap: 6 }}>
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        const accentColor = leftColors[index % leftColors.length];

        return (
          <View
            key={`${step.title}-${index}`}
            style={{ flexDirection: "row", alignItems: "stretch" }}
          >
            {/* Left: number column with connecting line */}
            <View style={{ width: 32, alignItems: "center" }}>
              <View
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 11,
                  backgroundColor: accentColor,
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 2,
                  borderColor: "#DBEAFE",
                }}
              >
                <Text
                  style={{ color: "#FFFFFF", fontSize: 8, fontWeight: "bold" }}
                >
                  {index + 1}
                </Text>
              </View>
              {!isLast && (
                <View
                  style={{
                    width: 2,
                    flex: 1,
                    backgroundColor: "#DBEAFE",
                    marginTop: 3,
                    borderRadius: 1,
                    minHeight: 10,
                  }}
                />
              )}
            </View>

            {/* Right: content card */}
            <View
              style={{
                flex: 1,
                marginLeft: 8,
                marginBottom: isLast ? 0 : 6,
                borderLeftWidth: 3,
                borderLeftColor: accentColor,
                backgroundColor: "#F8FAFC",
                borderRadius: 4,
                borderWidth: 1,
                borderColor: "#E2E8F0",
                paddingVertical: 7,
                paddingHorizontal: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 8.5,
                  fontWeight: "bold",
                  color: "#0F172A",
                  marginBottom: 2,
                }}
              >
                {step.title}
              </Text>
              <Text
                style={{
                  fontSize: 8,
                  color: "#4B5563",
                  lineHeight: 1.4,
                }}
              >
                {step.description}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const formatCurrency = (value) => {
  if (value === "-" || value == null) return "-";

  const cleaned = String(value)
    .normalize("NFKC")

    // 🔥 remove Rs / ₹ / INR
    .replace(/(Rs\.?|₹|INR)/gi, "")

    // existing cleanup
    .replace(/[\u00B9\u00B2\u00B3\u2070-\u2079]/g, "")
    .replace(/[\u200B-\u200D\uFEFF\u00AD]/g, "")
    .replace(/[^\d.,]/g, "")
    .replace(/(Rs\.?|₹|INR)/gi, "")
    .replace(/(Rs\.?|₹|INR)/gi, "")
    .replace(/,/g, "");

  const num = Number(cleaned);
  return Number.isFinite(num) && num > 0
    ? `${num.toLocaleString("en-IN")}`
    : "-";
};

// const cleanPdfText = (value) => {
//   if (value == null) return "-";

//   return (
//     String(value)
//       // 🔥 remove ALL superscripts/subscripts explicitly BEFORE anything else
//       // Covers \u00B2, \u00B3, \u00B9 and the entire 2070-208F block
//       .replace(/[\u00B2\u00B3\u00B9\u2070-\u208F\u2090-\u209C\u207F]/g, "")

//       .normalize("NFKC")

//       // 🔥 remove invisible / zero-width chars
//       .replace(/[\u200B-\u200D\uFEFF\u00AD]/g, "")

//       // 🔥 remove leading junk like symbols, extra spaces, etc.
//       // but keep alphanumeric at the start
//       .replace(/^[^a-zA-Z0-9]+/, "")

//       .trim()
//   );
// };

const cleanPdfText = (value) => {
  if (value == null) return "-";

  return (
    String(value)
      .normalize("NFKC")

      // 🔥 remove ALL superscripts explicitly
      .replace(/[\u00B9\u00B2\u00B3\u2070-\u2079]/g, "")

      // 🔥 remove invisible / zero-width chars
      .replace(/[\u200B-\u200D\uFEFF\u00AD]/g, "")

      .trim()
  );
};

const cleanNumber = (value) => {
  if (value === "-" || value == null) return 0;

  const cleaned = String(value)
    .normalize("NFKC")
    .replace(/\u00B9/g, "")
    .replace(/[\u200B-\u200D\uFEFF\u00AD]/g, "")
    .replace(/[\u00B2\u00B3\u2070-\u2079\u2032\u2033\u00B0\u00BA]/g, "")
    .replace(/,/g, "")
    .replace(/[^\d.-]/g, "")
    .replace(/^\./, "");

  const num = Number(cleaned);
  return Number.isFinite(num) ? num : 0;
};

function NumberedTermsTable({ title, rows }) {
  return (
    <View style={styles.tableWrap}>
      <View style={[styles.tableHeader, { backgroundColor: "#3B82F6" }]}>
        <Text
          style={[
            styles.tableCellHeader,
            { width: "100%", textAlign: "center" },
          ]}
        >
          {title}
        </Text>
      </View>

      {rows.map((row, index) => {
        const isLast = index === rows.length - 1;

        return (
          <View
            key={row.no}
            style={{
              flexDirection: "row",
              borderBottomWidth: isLast ? 0 : 1,
              borderBottomColor: "#E5E7EB",
            }}
          >
            <View
              style={{
                width: "7%",
                paddingVertical: 5,
                paddingHorizontal: 5,
                borderRightWidth: 1,
                borderRightColor: "#E5E7EB",

                // ✅ ADD THIS
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 8.5,
                  fontWeight: "bold",
                  color: "#111827",
                  textAlign: "center",
                }}
              >
                {row.no}
              </Text>
            </View>

            <View
              style={{ width: "93%", paddingVertical: 5, paddingHorizontal: 5 }}
            >
              {row.heading ? (
                <Text
                  style={{
                    fontSize: 8.2,
                    fontWeight: "bold",
                    color: "#111827",
                    marginBottom: row.lines && row.lines.length ? 2 : 0,
                  }}
                >
                  {row.heading}
                </Text>
              ) : null}

              {(row.lines || []).map((line, i) => (
                <Text
                  key={i}
                  style={{
                    fontSize: 8,
                    color: "#374151",
                    lineHeight: 1.35,
                    marginBottom: 2,
                  }}
                >
                  {line}
                </Text>
              ))}
            </View>
          </View>
        );
      })}
    </View>
  );
}

export function ProposalPDF({
  quotation,
  totals,
  proposalType = "COMMERCIAL",
  title = "Proposal",
}) {
  const HSN_SAC = "90318000"; // ✅
  const categories = " Automated Assembly and Test Equipment";
  const metadata = {
    ref: quotation?.quotationNo || "MISPL/COMM/F2425.1150",
    rev:
      quotation?.version != null
        ? `Rev ${String(quotation.version).padStart(2, "0")}`
        : "Rev 01",
    date: quotation?.issueDate
      ? new Date(quotation.issueDate).toLocaleDateString("en-IN", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : new Date().toLocaleDateString("en-IN", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
  };

  const company = proposalData.company;
  const pricing = proposalData.pricing;
  const paymentTerms = (quotation?.paymentTerms || []).filter(t => t && t.trim() !== "");
  const deliveryTerms = (quotation?.deliveryTerms || []).filter(t => t && t.trim() !== "");
  const importantNotes = (quotation?.importantNotes || []).filter(t => t && t.trim() !== "");
  // 🔥 DYNAMIC KAM LOGIC
  const kam = quotation?.account?.keyAccountManager;
  const kamName = kam?.name || "";
  const kamEmail = kam?.email || "";
  const kamPhone = kam?.mobile || ""; // Use actual mobile or empty if not set

  const bhavya =
    company.contacts.find((c) => c.name === "Bhavya K S") ||
    company.contacts[1];

  const dynamicContacts = kamName
    ? [{ name: kamName, email: kamEmail, phone: kamPhone }, bhavya]
    : company.contacts;

  const summaryItemDescriptions = ["P & F", "I & C, Training"];
  const regularItems = (quotation?.items || [])
    .filter((item) => !summaryItemDescriptions.includes(item.description))
    .sort((a, b) => {
      const catA = a.category || "";
      const catB = b.category || "";
      if (catA === "Test Platform" && catB !== "Test Platform") return -1;
      if (catB === "Test Platform" && catA !== "Test Platform") return 1;

      const catCompare = catA.localeCompare(catB);
      if (catCompare !== 0) return catCompare;

      // 🔥 DRIVER LOGIC: push SE1000001 to the bottom of the category
      const driverSku = "SE1000001";
      if (a.sku === driverSku && b.sku !== driverSku) return 1;
      if (b.sku === driverSku && a.sku !== driverSku) return -1;

      return 0;
    });
  const summaryItems = (quotation?.items || [])
    .filter((item) => summaryItemDescriptions.includes(item.description))
    .sort((a, b) => {
      // P & F should come before I & C, Training
      if (a.description === "P & F") return -1;
      if (b.description === "P & F") return 1;
      return 0;
    });

  let regularItemsTotal = 0;
  let regularItemsSubtotal = 0;
  let totalDiscountAmount = 0;
  const pricingData = [];

  // 1. Group items by category first to prevent repetition
  const groupedItemsMap = regularItems.reduce((acc, item) => {
    const cat = cleanPdfText(item.category || "Others");
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  Object.entries(groupedItemsMap).forEach(([categoryName, items], groupIdx) => {
    const group = {
      sl: groupIdx + 1,
      category: categoryName,
      subRows: [],
    };

    items.forEach((item) => {
      // const itemSubtotal =
      //   cleanNumber(item.quantity || 1) * cleanNumber(item.price || 0);
      // const discountVal = cleanNumber(item.discount || 0);
      // const discountAmt = (itemSubtotal * discountVal) / 100;
      // const itemTotal = itemSubtotal - discountAmt;

      // regularItemsSubtotal += itemSubtotal;
      // regularItemsTotal += itemTotal;
      // totalDiscountAmount += discountAmt;

      const itemSubtotal =
        cleanNumber(item.quantity || 1) * cleanNumber(item.price || 0);

      const discountVal = cleanNumber(item.discount || 0);
      const discountAmt = (itemSubtotal * discountVal) / 100;
      const itemTotal = itemSubtotal - discountAmt;

      // ✅ ADD PARENT
      regularItemsSubtotal += itemSubtotal;
      regularItemsTotal += itemTotal;
      totalDiscountAmount += discountAmt;

      // ✅ ADD SUB ITEMS ALSO
      (item.subItems || []).forEach((sub) => {
        const subSubtotal =
          cleanNumber(sub.quantity || sub.qty || 1) *
          cleanNumber(sub.price || 0);

        const subDiscount =
          (subSubtotal * cleanNumber(sub.discount || 0)) / 100;

        const subTotal = subSubtotal - subDiscount;

        regularItemsSubtotal += subSubtotal;
        regularItemsTotal += subTotal;
        totalDiscountAmount += subDiscount;
      });

      const isTestPlatform = item.category?.toLowerCase() === "test platform";

      // Parent Row
      group.subRows.push({
        sku: cleanPdfText(item.sku || "-"),
        hsn: HSN_SAC,
        description: cleanPdfText(item.description || item.name || "-"),
        mfgPartNo: cleanPdfText(item.mfgPartNo || "-"),
        make: cleanPdfText(item.make || "-"),
        uom: cleanPdfText(item.uom || "-"),
        qty: cleanNumber(item.quantity || 0),
        unitPrice: item.price != null ? formatCurrency(item.price) : "-",
        totalPrice: formatCurrency(
          cleanNumber(item.quantity || 0) * cleanNumber(item.price || 0),
        ),
        discount: item.discount != null ? `${item.discount}%` : "-",
        total: formatCurrency(itemTotal),
        isBold: true,
      });

      // Sub Item Rows - Only show if NOT a summary type
      if (
        proposalType !== "BUDGETARY" &&
        proposalType !== "COMMERCIAL_SUMMARY"
      ) {
        (item.subItems || [])
          .filter((s) => (s.sku || "").trim().toUpperCase() !== "SE1000001")
          .forEach((sub) => {
            const isTestPlatform =
              item.category?.toLowerCase() === "test platform";
            const subTotal =
              cleanNumber(sub.quantity || sub.qty || 1) *
              cleanNumber(sub.price || 0) *
              (1 - cleanNumber(sub.discount || 0) / 100);

            // Row 1: SKU + Name
            // group.subRows.push({
            //   sku: cleanPdfText(sub.sku || "-"),
            //   hsn: "",
            //   description: `    ${cleanPdfText(sub.name || "-")}`,
            //   mfgPartNo: isTestPlatform
            //     ? ""
            //     : cleanPdfText(sub.mfgPartNo || "-"),
            //   make: isTestPlatform ? "" : cleanPdfText(sub.make || "-"),
            //   uom: isTestPlatform ? "" : cleanPdfText(sub.uom || "-"),
            //   qty: cleanNumber(sub.quantity || sub.qty || 0),
            //   unitPrice: sub.price != null ? formatCurrency(sub.price) : "-",
            //   totalPrice: formatCurrency(
            //     cleanNumber(sub.quantity || sub.qty || 0) *
            //       cleanNumber(sub.price || 0),
            //   ),
            //   discount: sub.discount != null ? `${sub.discount}%` : "-",
            //   total: formatCurrency(subTotal),
            // });

            group.subRows.push({
              // sku: cleanPdfText(sub.sku || "-"),
              sku: sub.sku ? cleanPdfText(sub.sku) : "",

              hsn: "",

              description: `    ${cleanPdfText(sub.name || "-")}`,

              mfgPartNo: isTestPlatform
                ? ""
                : cleanPdfText(sub.mfgPartNo || "-"),

              make: isTestPlatform ? "" : cleanPdfText(sub.make || "-"),

              uom: isTestPlatform ? "" : cleanPdfText(sub.uom || "-"),

              qty: isTestPlatform
                ? ""
                : cleanNumber(sub.quantity || sub.qty || 0),

              unitPrice: isTestPlatform
                ? ""
                : sub.price != null
                  ? formatCurrency(sub.price)
                  : "-",

              totalPrice: isTestPlatform
                ? ""
                : formatCurrency(
                    cleanNumber(sub.quantity || sub.qty || 0) *
                      cleanNumber(sub.price || 0),
                  ),

              discount: isTestPlatform
                ? ""
                : sub.discount != null
                  ? `${sub.discount}%`
                  : "-",

              total: isTestPlatform ? "" : formatCurrency(subTotal),
            });

            // Row 2: Description (if exists)
            // if (sub.description && sub.description.trim()) {
            //   group.subRows.push({
            //     sku: "",
            //     hsn: "",
            //     description: `      ${cleanPdfText(sub.description)}`,
            //     mfgPartNo: "",
            //     make: "",
            //     uom: "",
            //     qty: "",
            //     unitPrice: "",
            //     totalPrice: "",
            //     discount: "",
            //     total: "",
            //   });
            // }
            // Row 2: Description (ONLY for Test Platform)
            if (isTestPlatform && sub.description && sub.description.trim()) {
              group.subRows.push({
                sku: "",
                hsn: "",
                description: `      ${cleanPdfText(sub.description)}`,
                mfgPartNo: "",
                make: "",
                uom: "",
                qty: "",
                unitPrice: "",
                totalPrice: "",
                discount: "",
                total: "",
              });
            }
          });
      }
    });

    pricingData.push(group);
  });

  

  // TOTAL QUOTATION VALUE ROW
  pricingData.push({
    isHeader: true,
    sl: "",
    category: "",
    sku: "",
    hsn: "",
    description: "TOTAL QUOTATION VALUE",
    make: "",
    uom: "",
    qty: "",
    unitPrice: "",
    totalPrice: "",
    discount: "",
    total: formatCurrency(regularItemsTotal),
  });

  // Add summary items at the end
  summaryItems.forEach((item) => {
    const itemSubtotal =
      cleanNumber(item.quantity || 1) * cleanNumber(item.price || 0);
    const discountAmt = (itemSubtotal * cleanNumber(item.discount || 0)) / 100;
    const itemTotal = itemSubtotal - discountAmt;

    totalDiscountAmount += discountAmt;

    const isPF = item.description === "P & F";
    const isIC = item.description === "I & C, Training";
    const itemHsn = isPF ? "998540" : isIC ? "998732" : "";

    pricingData.push({
      isHeader: false,
      sl: "",
      category: "",
      subRows: [
        {
          sku: "",
          hsn: itemHsn,
          description: cleanPdfText(item.description),
          make: isIC ? cleanPdfText(item.make || "-") : "",
          uom: isIC ? cleanPdfText(item.uom || "-") : "",
          qty: isIC ? cleanNumber(item.quantity || 1) : "",
          unitPrice: isIC ? formatCurrency(item.price) : "",
          totalPrice: isIC
            ? formatCurrency(
                cleanNumber(item.quantity || 1) * cleanNumber(item.price || 0),
              )
            : "",
          discount: isIC ? `${item.discount || 0}%` : "",
          total: formatCurrency(itemTotal),
          isBold: true,
        },
      ],
    });
  });

  // GRAND TOTAL ROW
  const grandTotalGroup = {
    isHeader: true,
    sl: "",
    category: "",
    sku: "",
    hsn: "",
    description: "GRAND TOTAL",
    make: "",
    uom: "",
    qty: "",
    unitPrice: "",
    totalPrice: "",
    discount: "",
    total: formatCurrency(totals?.grandTotal || 0),
  };
  const warranty = proposalData.warranty;
  const softwareSupport = proposalData.softwareSupport;
  const revisionHistory = (quotation?.revisionHistory || []).map(
    (rev, idx) => ({
      sl: (idx + 1).toString(),
      revNo:
        rev.quotationNo ||
        `Rev ${rev.version?.toString().padStart(2, "0") || "01"}`,
      date: rev.createdAt
        ? new Date(rev.createdAt).toLocaleDateString("en-IN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "-",
      // 🔥 If it's the first revision (Rev 1), always show "Creation"
      history: rev.version === 1 ? "Creation" : rev.revisionReason || "History",
    }),
  );

  // Fallback to static if empty
  if (revisionHistory.length === 0) {
    revisionHistory.push({
      sl: "1",
      revNo: quotation?.quotationNo || "Rev 01",
      date: new Date(quotation?.createdAt || Date.now()).toLocaleDateString(
        "en-IN",
        {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        },
      ),
      history: "Creation",
    });
  }

  const contact = quotation?.deal?.contact || quotation?.account?.contacts?.[0];
  const docOwnerApproval = (quotation?.approvals || []).find(
    (a) => a.action === "SUBMITTED" || a.action === "RESUBMITTED",
  );
  const approvedByApproval = (quotation?.approvals || []).find(
    (a) => a.action === "APPROVED",
  );

  const docOwner = docOwnerApproval?.actedBy?.name || "-";
  // kamName is already defined above
  const approvedBy = approvedByApproval?.actedBy?.name || "-";

  const fullAddress = [
    quotation?.account?.billingStreet,
    quotation?.account?.billingCity,
    quotation?.account?.billingState,
    quotation?.account?.billingPincode,
    quotation?.account?.billingCountry,
  ]
    .filter(Boolean)
    .join(", ");

  const customerItems = [
    {
      label: "Customer",
      value: quotation?.account?.accountName
        ? `M/s. ${quotation.account.accountName}`
        : "-",
    },

    {
      label: "Address",
      value: fullAddress || "-",
    },

    {
      label: "Contact",
      value: contact
        ? `${contact.salutation ? contact.salutation + " " : ""}${contact.firstName || ""} ${contact.lastName || ""}`.trim()
        : "-",
    },

    {
      label: "Phone No.",
      value: quotation?.account?.phone || contact?.phone || "-",
    },

    {
      label: "Email",
      value: contact?.email || "-",
    },
  ];

  const projectItems = [
    { label: "Project", value: quotation?.deal?.dealName || "-" },
    { label: "Ref Documents", value: quotation?.refDocuments || "-" },
    { label: "Tech Prop Ref", value: quotation?.techPropRef || "-" },
    { label: "Doc Owner", value: docOwner },
    { label: "Approved By", value: approvedBy },
  ];
  const pricingColumns = [
    {
      key: "sku",
      title: "SKU",
      width: "10%",
      align: "center",
      verticalAlign: "center",
    },
    {
      key: "hsn",
      title: "HSN/SAC",
      width: "10%",
      align: "center",
      verticalAlign: "center",
    },
    {
      key: "description",
      title: "Item Description",
      width: "28%",
      align: "left",
    },
    {
      key: "mfgPartNo",
      title: "Mfg PN",
      width: "15%",
      align: "center",
      verticalAlign: "center",
    },
    {
      key: "qty",
      title: "Qty",
      width: "4%",
      align: "center",
      verticalAlign: "center",
    },
    {
      key: "unitPrice",
      title: "Unit Price",
      width: "9%",
      align: "right",
      verticalAlign: "center",
    },
    {
      key: "totalPrice",
      title: "Total Price",
      width: "9%",
      align: "right",
      verticalAlign: "center",
    },
    {
      key: "discount",
      title: "Discount",
      width: "6%",
      align: "right",
      verticalAlign: "center",
    },
    {
      key: "total",
      title: "Final Price",
      width: "10%",
      align: "right",
      verticalAlign: "center",
    },
  ];

  const deliveryColumns = [
    { key: "sl", title: "SL#", width: "10%", align: "center" },
    { key: "desc", title: "Delivery Timeline Details", width: "90%" },
  ];

  const subtotal = totals?.subtotal ?? 0;
  const grandTotal = totals?.grandTotal ?? 0;

  return (
    <Document title={title}>
      <Page size="A4" style={styles.page}>
        <PdfHeader
          refNo={metadata.ref}
          revNo={metadata.rev}
          date={metadata.date}
        />

        <View
          style={{
            alignItems: "center",
            marginBottom: 14,
            paddingVertical: 12,
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderColor: "#DBEAFE",
            backgroundColor: "#F0F7FF",
          }}
        >
          <View style={{ alignItems: "center", width: "100%" }}>
            <Text
              style={{
                fontSize: 17,
                fontWeight: "bold",
                color: "#0F172A",
                letterSpacing: 2,
                textTransform: "uppercase",
                textAlign: "center",
              }}
            >
              COMMERCIAL PROPOSAL
            </Text>
            {proposalType === "BUDGETARY" && (
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "bold",
                  color: "#0F172A",
                  marginTop: 2,
                  textAlign: "center",
                }}
              >
                (Budgetary Proposal)
              </Text>
            )}
          </View>
        </View>

        {/* ── Proposal Submitted To ── */}
        <View
          style={{
            borderWidth: 1,
            borderColor: "#DBEAFE",
            borderRadius: 6,
            overflow: "hidden",
            marginBottom: 10,
          }}
        >
          <View
            style={{
              backgroundColor: "#3B82F6",
              paddingVertical: 7,
              paddingHorizontal: 10,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: 3,
                height: 13,
                backgroundColor: "#93C5FD",
                borderRadius: 2,
                marginRight: 8,
              }}
            />
            <Text
              style={{
                fontSize: 9,
                fontWeight: "bold",
                color: "#FFFFFF",
                letterSpacing: 0.4,
              }}
            >
              Proposal Submitted to:
            </Text>
          </View>
          {customerItems.map((item, index) => (
            <View
              key={index}
              style={{
                flexDirection: "row",
                backgroundColor: index % 2 === 0 ? "#F8FAFC" : "#FFFFFF",
                borderBottomWidth: index < customerItems.length - 1 ? 1 : 0,
                borderBottomColor: "#EFF6FF",
                paddingVertical: 6,
                paddingHorizontal: 10,
                alignItems: "flex-start",
              }}
            >
              <Text
                style={{
                  width: "28%",
                  fontSize: 8.5,
                  fontWeight: "bold",
                  color: "#2563EB",
                }}
              >
                {item.label}
              </Text>
              <Text style={{ width: "2%", fontSize: 8.5, color: "#94A3B8" }}>
                :
              </Text>
              <Text
                style={{
                  width: "70%",
                  fontSize: 8.5,
                  color: "#374151",
                  lineHeight: 1.4,
                }}
              >
                {typeof item.value === "string" ? item.value : ""}
              </Text>
            </View>
          ))}
        </View>

        {/* ── Project Details ── */}
        <View
          style={{
            borderWidth: 1,
            borderColor: "#DBEAFE",
            borderRadius: 6,
            overflow: "hidden",
            marginBottom: 10,
          }}
        >
          <View
            style={{
              backgroundColor: "#3B82F6",
              paddingVertical: 7,
              paddingHorizontal: 10,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: 3,
                height: 13,
                backgroundColor: "#93C5FD",
                borderRadius: 2,
                marginRight: 8,
              }}
            />
            <Text
              style={{
                fontSize: 9,
                fontWeight: "bold",
                color: "#FFFFFF",
                letterSpacing: 0.4,
              }}
            >
              Project Details:
            </Text>
          </View>
          {projectItems.map((item, index) => {
            return (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  backgroundColor: index % 2 === 0 ? "#F8FAFC" : "#FFFFFF",
                  borderBottomWidth: index < projectItems.length - 1 ? 1 : 0,
                  borderBottomColor: "#EFF6FF",
                  paddingVertical: 6,
                  paddingHorizontal: 10,
                  alignItems: "flex-start",
                }}
              >
                <Text
                  style={{
                    width: "28%",
                    fontSize: 8.5,
                    fontWeight: "bold",
                    color: "#2563EB",
                    marginTop: 1,
                  }}
                >
                  {item.label}
                </Text>
                <Text
                  style={{
                    width: "2%",
                    fontSize: 8.5,
                    color: "#94A3B8",
                    marginTop: 1,
                  }}
                >
                  :
                </Text>
                <View style={{ width: "70%" }}>
                  {item.value &&
                  typeof item.value === "string" &&
                  item.value.includes(",") &&
                  (item.label?.toLowerCase().includes("ref documents") ||
                    item.label?.toLowerCase().includes("tech prop ref")) ? (
                    item.value
                      .split(",")
                      .map((p) => p.trim())
                      .filter(Boolean)
                      .map((part, i, arr) => (
                        <View
                          key={i}
                          style={{
                            flexDirection: "row",
                            marginBottom: i < arr.length - 1 ? 2 : 0,
                            alignItems: "flex-start",
                          }}
                        >
                        <View
                          style={{
                            width: 3.5,
                            height: 3.5,
                            backgroundColor: "#3B82F6",
                            borderRadius: 1,
                            marginTop: 3.5,
                            marginRight: 6,
                          }}
                        />
                        <Text
                          style={{
                            fontSize: 8.5,
                            color: "#374151",
                            lineHeight: 1.4,
                            flex: 1,
                          }}
                        >
                          {part.trim()}
                        </Text>
                      </View>
                    ))
                  ) : (
                    <Text
                      style={{
                        fontSize: 8.5,
                        color:
                          item.label === "Doc Owner" ||
                          item.label === "Approved By"
                            ? "#2563EB"
                            : "#374151",
                        lineHeight: 1.4,
                        fontWeight:
                          item.label === "Doc Owner" ||
                          item.label === "Approved By"
                            ? "bold"
                            : "normal",
                      }}
                    >
                      {item.value}
                    </Text>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        {/* ── Budgetary Disclaimer ── */}
        {proposalType === "BUDGETARY" && (
          <View
            style={{
              marginTop: 10,
              marginBottom: 10,
              padding: 10,
              backgroundColor: "#FFFBEB",
              borderWidth: 1,
              borderColor: "#FCD34D",
              borderRadius: 6,
            }}
          >
            <Text
              style={{
                fontSize: 8.5,
                color: "#92400E",
                fontWeight: "bold",
                lineHeight: 1.5,
              }}
            >
              *COMMERCIAL PROPOSAL (Budgetary): This proposal is for the
              reference ballpark price only and technical detail requirement to
              be studied further to send firm proposal. This proposal cannot be
              considered for ordering.
            </Text>
          </View>
        )}

        <View style={{ marginTop: "auto" }}>
          {/* Top blue divider bar */}
          <View
            style={{
              height: 2,
              backgroundcolor: "#3B82F6",
              borderRadius: 1,
              marginBottom: 10,
            }}
          />

          {/* Company info centered */}
          <View style={{ alignItems: "center", marginBottom: 10 }}>
            <Text
              style={{
                fontSize: 9.5,
                fontWeight: "bold",
                color: "#0F172A",
                letterSpacing: 0.5,
                marginBottom: 3,
              }}
            >
              {company.name}
            </Text>
            <Text
              style={{
                fontSize: 7.8,
                color: "#64748B",
                textAlign: "center",
                lineHeight: 1.4,
                marginBottom: 3,
              }}
            >
              {company.address}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={{ fontSize: 8, color: "#2563EB", fontWeight: "bold" }}
              >
                {company.website}
              </Text>
              <Text
                style={{ fontSize: 8, color: "#94A3B8", marginHorizontal: 4 }}
              >
                |
              </Text>
              <Text
                style={{ fontSize: 8, color: "#2563EB", fontWeight: "bold" }}
              >
                M: {company.phone}
              </Text>
            </View>
          </View>

          {/* Contact cards */}
          <View
            style={{
              marginTop: 14,

              borderTopWidth: 1,
              borderTopColor: "#DCE7F7",

              paddingTop: 14,
            }}
          >
            {/* COMPANY DETAILS */}

            {/* CONTACT CARDS */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                gap: 10,
              }}
            >
              {dynamicContacts.map((contact, index) => (
                <View
                  key={index}
                  style={{
                    width: "48.5%",

                    backgroundColor: "#F8FAFC",

                    borderWidth: 1,
                    borderColor: "#DCE7F7",

                    borderRadius: 8,

                    paddingVertical: 11,
                    paddingHorizontal: 12,

                    borderLeftWidth: 4,
                    borderLeftColor: "#2563EB",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 9,
                      fontWeight: "bold",
                      color: "#1D4ED8",
                      marginBottom: 5,
                    }}
                  >
                    {contact.name}
                  </Text>

                  <Text
                    style={{
                      fontSize: 7.5,
                      color: "#475569",
                      marginBottom: 3,
                      lineHeight: 1.4,
                    }}
                  >
                    {contact.email}
                  </Text>

                  <Text
                    style={{
                      fontSize: 7.5,
                      color: "#475569",
                    }}
                  >
                    {contact.phone}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <PdfFooter />
      </Page>

      <Page size="A4" style={styles.page}>
        <PdfHeader
          refNo={metadata.ref}
          revNo={metadata.rev}
          date={metadata.date}
        />
        <Text
          style={{
            fontSize: 15,
            fontWeight: "bold",
            color: "#111827",
            marginBottom: 10,
          }}
        >
          Revision History
        </Text>

        <TableBlock
          columns={[
            { key: "sl", title: "SL#", width: "10%", align: "center" },
            { key: "revNo", title: "Revision No.", width: "30%" },
            { key: "date", title: "Revision Date", width: "30%" },
            { key: "history", title: "History", width: "30%" },
          ]}
          data={revisionHistory}
        />

        <PdfFooter />
      </Page>

      <Page size="A4" style={styles.page}>
        <PdfHeader
          refNo={metadata.ref}
          revNo={metadata.rev}
          date={metadata.date}
        />

        {/* ================= TITLE ================= */}
        <View
          style={{
            alignItems: "center",
            marginBottom: 16,
            paddingVertical: 12,
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderColor: "#DBEAFE",
            backgroundColor: "#F0F7FF",
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: "bold",
              color: "#0F172A",
              letterSpacing: 1,
            }}
          >
            Confidentiality & General Conditions
          </Text>

          <View
            style={{
              width: 50,
              height: 2.5,
              backgroundColor: "#3B82F6",
              borderRadius: 2,
              marginTop: 6,
            }}
          />
        </View>

        {/* ================= BLOCK 1 ================= */}
        <View
          style={{
            marginBottom: 10,
            borderLeftWidth: 4,
            borderLeftColor: "#2563EB",
            backgroundColor: "#F8FAFC",
            borderRadius: 6,
            paddingVertical: 10,
            paddingHorizontal: 12,
          }}
        >
          <Text
            style={{
              fontSize: 8.7,
              lineHeight: 1.6,
              color: "#374151",
              textAlign: "justify",
            }}
          >
            This techno commercial proposal (the "Proposal") is submitted with
            the intent of executing a definitive and legally binding agreement
            (the "Agreement") following an award of business to Micrologic
            Integrated Systems (P) Limited (Micrologic).
            {"\n\n"}
            The Proposal itself is a legally binding offer to contract and in
            the event of an award to Micrologic, it shall execute an Agreement
            that will be the complete agreement between the parties. However,
            where the parties do not execute any such Agreement, then the terms
            and conditions mentioned in this Proposal shall govern any purchase
            order(s) issued by the Customer in reference to the specific
            project.
          </Text>
        </View>

        {/* ================= BLOCK 2 ================= */}
        <View
          style={{
            marginBottom: 10,
            borderLeftWidth: 4,
            borderLeftColor: "#0EA5E9",
            backgroundColor: "#F8FAFC",
            borderRadius: 6,
            paddingVertical: 10,
            paddingHorizontal: 12,
          }}
        >
          <Text
            style={{
              fontSize: 8.7,
              lineHeight: 1.6,
              color: "#374151",
              textAlign: "justify",
            }}
          >
            This Proposal constitutes confidential and proprietary information
            of Micrologic and requires that Customer treat the information
            contained in this Proposal as confidential. Customer may use the
            information contained in this Proposal solely for the purposes of
            evaluating this Proposal and executing the Agreement with
            Micrologic. This Proposal and all supporting documentation,
            drawings, images, and concepts provided to Customer in connection
            with this Proposal shall remain the property of Micrologic and must
            be returned immediately upon request.
            {"\n\n"}
            This Proposal is based upon the set of requirements provided by
            Customer to Micrologic, along with certain reasonable assumptions.
            If Customer alters the requirements or if any assumption stated
            herein is inaccurate, then this Proposal, including pricing, may
            change. Implementation of any services detailed in this Proposal is
            subject to applicable legal and regulatory norms in force at the
            time of execution.
          </Text>
        </View>

        {/* ================= IMPORTANT NOTICE ================= */}
        <View
          style={{
            marginTop: 12,
            borderRadius: 6,
            borderWidth: 1,
            borderColor: "#FCD34D",
            backgroundColor: "#FFFBEB",
            overflow: "hidden",
          }}
        >
          <View style={{ height: 4, backgroundColor: "#F59E0B" }} />

          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              paddingVertical: 10,
              paddingHorizontal: 12,
            }}
          >
            {/* ICON */}
            <View
              style={{
                width: 18,
                height: 18,
                backgroundColor: "#F59E0B",
                borderRadius: 9,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 8,
                marginTop: 1,
              }}
            >
              <Text
                style={{ fontSize: 9, fontWeight: "bold", color: "#FFFFFF" }}
              >
                !
              </Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 8.2,
                  fontWeight: "bold",
                  color: "#92400E",
                  marginBottom: 3,
                }}
              >
                IMPORTANT NOTICE
              </Text>

              <Text
                style={{
                  fontSize: 8.5,
                  lineHeight: 1.55,
                  color: "#78350F",
                  textAlign: "justify",
                }}
              >
                These are customized equipment. This proposal is indicative of
                the concept and may undergo changes during detailed design. Any
                such changes will be handled during the Design Approval Process
                (DAP) and will be subject to customer approval.
              </Text>
            </View>
          </View>
        </View>

        <PdfFooter />
      </Page>

      <Page size="A4" style={styles.page}>
        <PdfHeader
          refNo={metadata.ref}
          revNo={metadata.rev}
          date={metadata.date}
        />
        <Text
          style={{
            fontSize: 15,
            fontWeight: "bold",
            color: "#111827",
            marginBottom: 8,
          }}
        >
          PRICE:
        </Text>

        <View style={styles.categoryBox}>
          <Text style={styles.categoryText}>Category: {categories || "-"}</Text>
        </View>

        <Text style={styles.centeredIntro}>
          Design, Development, Manufacture, Test &amp; Validate, Supply &amp;
          Commissioning of:
        </Text>
        <Text
          style={{
            fontSize: 10,
            fontWeight: "bold",
            color: "#1D4ED8",
            marginBottom: 12,
            marginTop: -4,
          }}
        >
          {quotation?.deal?.dealName || proposalData.project.name}
        </Text>

        {proposalType === "BUDGETARY" ||
        proposalType === "COMMERCIAL_SUMMARY" ? (
          <BudgetaryPricingTable
            columns={[
              { key: "sl", title: "SL#", width: "5%", align: "center" },
              {
                key: "hsn",
                title: "HSN/SAC Code",
                width: "13%",
                align: "center",
              },
              { key: "gst", title: "GST*", width: "12%", align: "center" },
              {
                key: "description",
                title: "Description",
                width: "40%",
                align: "left",
              },
              {
                key: "unitPrice",
                title: "Unit Price (INR)*",
                width: "12%",
                align: "right",
              },
              { key: "qty", title: "QTY", width: "5%", align: "center" },
              {
                key: "totalPrice",
                title: "Total Price (INR)*",
                width: "13%",
                align: "right",
              },
            ]}
            data={[
              // 1. Consolidated Project Row (Subtotal without discount)
              {
                sl: 1,
                hsn: HSN_SAC,
                gst: "18% GST",
                description: cleanPdfText(
                  quotation?.deal?.dealName ||
                    proposalData.project.name ||
                    "Project",
                ),
                unitPrice: formatCurrency(regularItemsSubtotal),
                qty: 1,
                totalPrice: formatCurrency(regularItemsSubtotal),
                isBold: true,
              },
              // 2. Summary Items (P & F, I & C)
              ...summaryItems.map((item, idx) => {
                const isPF = item.description === "P & F";
                const isIC = item.description === "I & C, Training";
                const itemHsn = isPF ? "998540" : isIC ? "998732" : "";

                const itemTotalValue =
                  cleanNumber(item.quantity || 1) * cleanNumber(item.price || 0);

                return {
                  sl: idx + 2, // 2, 3...
                  hsn: itemHsn,
                  gst: "18% GST",
                  description: cleanPdfText(item.description),
                  unitPrice: "", // Merged in UI
                  qty: "",       // Merged in UI
                  totalPrice: formatCurrency(itemTotalValue),
                  isBold: true,
                  isSummaryItem: true, // 🔥 Add this for merging
                };
              }),
            ]}
            totals={{
              subtotal:
                regularItemsSubtotal +
                summaryItems.reduce(
                  (acc, item) =>
                    acc +
                    cleanNumber(item.quantity || 1) *
                      cleanNumber(item.price || 0),
                  0,
                ),
              discount: totalDiscountAmount,
              grandTotal:
                regularItemsSubtotal +
                summaryItems.reduce(
                  (acc, item) =>
                    acc +
                    cleanNumber(item.quantity || 1) *
                      cleanNumber(item.price || 0),
                  0,
                ) -
                totalDiscountAmount,
            }}
            proposalType={proposalType}
          />
        ) : (
          <>
            <PricingTable 
              columns={pricingColumns} 
              data={[...pricingData, grandTotalGroup]} 
            />
            <View style={{ marginTop: 8, paddingHorizontal: 4 }}>
              <Text
                style={{ fontSize: 9, color: "#1E3A8A", fontWeight: "bold" }}
              >
                Price Basis: Above price is basic, exclusive of GST@18% Extra
              </Text>
            </View>
          </>
        )}



        {paymentTerms.length > 0 && (
          <SectionCard title="Payment Terms" soft break>
            <View>
              {paymentTerms.map((term, idx) => (
                <View key={idx} style={styles.bulletLine}>
                  <Text style={styles.bulletMark}>•</Text>
                  <Text style={styles.bulletText}>{cleanPdfText(term)}</Text>
                </View>
              ))}
              <Text
                style={{ fontSize: 8.3, fontWeight: "bold", color: "#4B5563" }}
              >
                Note: All payments should be made via NEFT/RTGS to the
                above-mentioned bank account.
              </Text>
            </View>
          </SectionCard>
        )}

        {deliveryTerms.length > 0 && (
          <SectionCard title="Price Basis & Delivery" soft>
            <View style={{ marginBottom: 8 }}>
              <Text
                style={{
                  fontSize: 8.5,
                  fontWeight: "bold",
                  color: "#374151",
                }}
              >
                Ex-Works Micrologic, Freight, Insurance Extra
              </Text>
            </View>

            <TableBlock
              columns={[
                {
                  key: "sl",
                  title: "SL#",
                  width: "12%",
                  align: "center",
                },
                {
                  key: "desc",
                  title: "Delivery Timeline Details",
                  width: "88%",
                },
              ]}
              data={deliveryTerms.map((term, idx) => ({
                sl: idx + 1,
                desc: cleanPdfText(term),
              }))}
            />
          </SectionCard>
        )}

        {importantNotes.length > 0 && (
          <SectionCard title="Important Notes" soft>
            <View>
              {importantNotes.map((term, idx) => (
                <View key={idx} style={styles.bulletLine}>
                  <Text style={styles.bulletMark}>{idx + 1}.</Text>
                  <Text style={styles.bulletText}>{cleanPdfText(term)}</Text>
                </View>
              ))}
            </View>
          </SectionCard>
        )}
        <PdfFooter />
      </Page>

      <Page size="A4" style={styles.page}>
        <PdfHeader
          refNo={metadata.ref}
          revNo={metadata.rev}
          date={metadata.date}
        />

        <SectionCard title="MICROLOGIC GENERAL WARRANTY TERMS" soft>
          <BulletList items={warranty} />
          <View
            style={{
              backgroundColor: "#EFF6FF",
              paddingVertical: 8,
              paddingHorizontal: 10,
              borderRadius: 5,
              marginTop: 10,
              alignItems: "center",
              borderWidth: 1,
              borderColor: "#BFDBFE",
            }}
          >
            <Text
              style={{ fontSize: 8.7, fontWeight: "bold", color: "#1E40AF" }}
            >
              Subject to Bangalore Jurisdiction only
            </Text>
          </View>
        </SectionCard>

        <SectionCard title="Software Support Terms" soft>
          <BulletList items={softwareSupport} />
        </SectionCard>

        <PdfFooter />
      </Page>

      <Page size="A4" style={styles.page}>
        <PdfHeader
          refNo={metadata.ref}
          revNo={metadata.rev}
          date={metadata.date}
        />

        <Text
          style={{
            fontSize: 15,
            fontWeight: "bold",
            color: "#111827",
            marginBottom: 4,
          }}
        >
          Engagement Model
        </Text>
        <Text style={styles.centeredIntro}>
          Our engagement model is designed to ensure transparency, efficiency,
          and successful project delivery.
        </Text>

        <View style={{ marginTop: 8 }}>
          <View style={styles.twoColGrid}>
            {models.map((model, index) => (
              <View key={index} style={styles.modelCard}>
                <Text style={styles.modelTitle}>{model.title}</Text>

                <Text style={styles.modelDesc}>{model.desc}</Text>
              </View>
            ))}
          </View>
        </View>

        <SectionCard title="Key Benefits" soft>
          <BulletList items={benefits} />
        </SectionCard>

        <PdfFooter />
      </Page>

      <Page size="A4" style={styles.page}>
        <PdfHeader
          refNo={metadata.ref}
          revNo={metadata.rev}
          date={metadata.date}
        />

        <View
          style={{
            alignItems: "center",
            marginBottom: 14,
            paddingVertical: 10,
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderColor: "#DBEAFE",
            backgroundColor: "#F0F7FF",
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: "bold",
              color: "#0F172A",
              letterSpacing: 1,
            }}
          >
            Project Execution Process Flow
          </Text>
          <View
            style={{
              width: 40,
              height: 2,
              backgroundColor: "#2563EB",
              borderRadius: 2,
              marginTop: 5,
            }}
          />
          <Text
            style={{
              fontSize: 7.8,
              color: "#64748B",
              marginTop: 5,
              letterSpacing: 0.3,
            }}
          >
            Standard operating procedure for the successful delivery of the
            proposed solution
          </Text>
        </View>

        <StepFlow steps={processSteps} />

        <PdfFooter />
      </Page>

      <Page size="A4" style={styles.page}>
        <PdfHeader
          refNo={metadata.ref}
          revNo={metadata.rev}
          date={metadata.date}
        />

        <NumberedTermsTable
          title="COMMERCIAL TERMS"
          rows={commercialTermsRows}
        />

        <PdfFooter />
      </Page>

      <Page size="A4" style={styles.page}>
        <PdfHeader
          refNo={metadata.ref}
          revNo={metadata.rev}
          date={metadata.date}
        />

        <NumberedTermsTable
          title="COMMERCIAL TERMS"
          rows={[delayedDeliveryRow]}
        />

        {/* ORDER CANCELLATION */}
        <View style={styles.cancellationCard}>
          <View style={styles.cancellationHeader}>
            <Text style={styles.cancellationHeaderText}>
              Order Cancellation
            </Text>
          </View>

          <View style={styles.cancellationBody}>
            {orderCancellationNotes.map((line, index) => (
              <Text key={index} style={styles.cancellationPara}>
                {line}
              </Text>
            ))}

            {cancellationItems.map((item) => (
              <View key={item.no} style={styles.cancellationListRow}>
                <Text style={styles.cancellationListNo}>{item.no}.</Text>

                <Text style={styles.cancellationListText}>{item.text}</Text>
              </View>
            ))}

            <Text
              style={{
                fontSize: 8,
                color: "#64748B",
                marginTop: 2,
                lineHeight: 1.5,
              }}
            >
              The dates of the activity will be shared in the timelines released
              by the project team.
            </Text>
          </View>
        </View>

        {/* NOTE */}
        <View style={styles.noteCard}>
          <Text style={styles.noteTitle}>Note:</Text>

          {noteItems.map((line, index) => (
            <View key={index} style={styles.noteRow}>
              <Text style={styles.noteNo}>{index + 1}.</Text>

              <Text style={styles.noteText}>{line}</Text>
            </View>
          ))}
        </View>

        <PdfFooter />
      </Page>

      <Page size="A4" style={styles.page}>
        <PdfHeader
          refNo={metadata.ref}
          revNo={metadata.rev}
          date={metadata.date}
        />

        <NumberedTermsTable
          title="ENGAGEMENT MODEL & DEFINITIONS"
          rows={engagementRows}
        />

        <PdfFooter />
      </Page>

      <Page size="A4" style={styles.page} wrap={false}>
        <PdfHeader
          refNo={metadata.ref}
          revNo={metadata.rev}
          date={metadata.date}
        />

        <View style={styles.tableWrap}>
          {/* HEADER */}
          <View
            style={[
              styles.tableHeader,
              { backgroundColor: "#3B82F6" }, // deeper premium blue
            ]}
          >
            <Text
              style={[
                styles.tableCellHeader,
                {
                  width: "15%",
                  textAlign: "center",
                  color: "transparent", // 🔥 removes "#" visually
                },
              ]}
            >
              .
            </Text>

            <Text
              style={[
                styles.tableCellHeader,
                { width: "35%", letterSpacing: 0.3 },
              ]}
            >
              Description
            </Text>

            <Text
              style={[
                styles.tableCellHeader,
                { width: "50%", letterSpacing: 0.3 },
              ]}
            >
              Details
            </Text>
          </View>

          {bankTableRows.map((row, index) => {
            const isSection = row.no === "1" || row.no === "3";

            return (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  borderBottomWidth: 1,
                  borderBottomColor: "#E2E8F0",
                  backgroundColor: isSection ? "#EEF2FF" : "#FFFFFF",
                }}
              >
                <Text
                  style={[
                    styles.tableCell,
                    {
                      width: "15%",
                      textAlign: "center",
                      fontWeight: "bold",
                      color: "#1E3A8A",
                      fontSize: 8.5,
                    },
                  ]}
                >
                  {row.no}
                </Text>

                <Text
                  style={[
                    styles.tableCell,
                    {
                      width: "35%",
                      fontWeight: isSection ? "bold" : "medium",
                      color: isSection ? "#1E3A8A" : "#334155",
                    },
                  ]}
                >
                  {row.label}
                </Text>

                <Text
                  style={[
                    styles.tableCell,
                    {
                      width: "50%",
                      color: isSection ? "#1E3A8A" : "#0F172A",
                      fontWeight: isSection ? "bold" : "medium",
                      lineHeight: 1.5,
                    },
                  ]}
                >
                  {row.value}
                </Text>
              </View>
            );
          })}
        </View>

        <View style={styles.endDocWrap}>
          <Text style={styles.endDocLine}>
            ***************** END OF DOCUMENT *****************
          </Text>
        </View>

        <PdfFooter />
      </Page>
    </Document>
  );
}

export default ProposalPDF;
