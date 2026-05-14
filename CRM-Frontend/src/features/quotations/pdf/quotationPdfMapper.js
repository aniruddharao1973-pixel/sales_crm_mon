import { safeText, lineAmount } from "./quotationPdfUtils";

const DEFAULT_REFS = {
  refNo: "MISPL/COMM /F2425.1150",
  revNo: "Rev 01",
  dateText: "Wednesday, April 23, 2025",
  docNo: "4001.0004",
  docVer: "1.1",
  docDate: "27-Oct-2020",
};

const DEFAULT_CONTACTS = [
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

const DEFAULT_REFERENCE_DOCS = [
  "MDR CONTROL CARD(HON-2018) +EIP CARD rev 00.docx",
  "MDR Control Card EOL.xlsx",
];

const DEFAULT_CONFIDENTIALITY = [
  "This techno commercial proposal (the “Proposal”) is submitted with the intent of executing a definitive and legally binding agreement (the “Agreement”) following an award of business to Micrologic Integrated Systems (P) Limited (Micrologic).",
  "The Proposal itself is a legally binding offer to contract and in the event of an award to Micrologic, it shall execute an Agreement that will be the complete agreement between the parties, however, where the parties do not execute any such Agreement, then the terms and conditions mentioned in this Proposal shall govern any purchase order(s) issued by the Customer in reference to the specific project.",
  "This Proposal constitutes confidential and proprietary information of Micrologic and requires that Customer treat the information contained in this Proposal as confidential. Customer may use the information contained in this Proposal solely for the purposes of evaluating this Proposal and executing the Agreement with Micrologic. This Proposal and all supporting documentation and drawings, Images and concepts provided to Customer in connection with this Proposal shall remain the property of Micrologic and must be returned immediately upon request.",
  "This Proposal is based upon the set of requirements provided by Customer to Micrologic, and certain reasonable assumptions taken by Micrologic. If Customer alters the requirements or if any assumption stated herein are false or inaccurate, then this Proposal, including pricing, may change. Implementation of any services detailed in this Proposal is subject to applicable legal and regulatory norms and requirements in force as on the date when services are to be implemented and such implementation may vary to cater to the requirements of such applicable legal and regulatory norms and requirements.",
  "These are customized equipment, this proposal is indicative of the concept there could be changes during the detailed design which will be dealt during Design Approval Process (DAP) & will be subjected to the customer approval.",
];

const DEFAULT_WARRANTY = [
  {
    code: "1",
    heading: "",
    body: "The equipment manufactured by Micrologic is warranted for period of 12 months from the date of installation or 18 months from the date of invoice, whichever is earlier. Unless otherwise expressly specified in the contract/agreement.",
  },
  {
    code: "2",
    heading: "",
    body: "The warranty is applicable for manufacturing defects only. Micrologic will assess the situation and will decide to either replace the defective parts or repair, with in the warranty period",
  },
  {
    code: "3",
    heading: "",
    body: "The equipment as a whole is covered under warranty.",
  },
  {
    code: "4",
    heading: "",
    body: "Wherever third party parts are integrated like the camera, printer, robot, etc.. the original manufacturer’s warranty terms will be transferred back-back to the customer",
  },
  {
    code: "5",
    heading: "",
    body: "Support activities such as software modification, configuration, part teaching in vision, robot etc...are not part of the warranty. Warranty is applicable only for the material content. For support activities, the terms for Technical Support will be applicable.",
  },
  {
    code: "6",
    heading: "",
    body: "Warranty ceases if the equipment is found altered, tampered or modified from its original Fit and Finish or Functionality.",
  },
  {
    code: "7",
    heading: "",
    body: "Warranty ceases if the equipment is found to have been used beyond its specified limits",
  },
  {
    code: "8",
    heading: "",
    body: "Warranty ceases if the equipment is found to have become defective due to wrong power supply or wrong inputs",
  },
  {
    code: "9",
    heading: "",
    body: "Warranty may cease if the serial number on the equipment is altered or damaged, as this is the unique identification of the asset.",
  },
];

const DEFAULT_SOFTWARE_SUPPORT = [
  {
    code: "1",
    heading: "",
    body: "Support on software will not be charged for the first three months after installation. This involves minor modifications & other issues.",
  },
  {
    code: "2",
    heading: "",
    body: "Software support will be through remote access. No onsite visits are included in free of cost support. Onsite visits will be chargeable if necessary.",
  },
  {
    code: "3",
    heading: "",
    body: "Remote support will be limited to 10 instances during first 3 months, local infrastructure for the remote support like remote connectivity & presence of personnel at the site to be provided by Customer",
  },
];

const DEFAULT_COMMERCIAL_TERMS = [
  {
    code: "1",
    heading: "PRICE BASIS",
    body: "Ex-Works Micrologic, Duties, Taxes, Freight, Insurance Extra",
  },
  {
    code: "2",
    heading: "DELIVERY",
    body: "As above from the date of receipt of the Purchase order & advance",
  },
  {
    code: "3",
    heading: "PAYMENT TERMS",
    body:
      "Stage 1: Advance (Down payment) 50% of the order value, along with the Purchase Order Payment to be released within 1 week from the date of Pro forma Invoice to keep up the Committed delivery time.\nStage 2: 40% of the order value + Taxes before dispatch on validation at Micrologic\nStage 3: 10% of the order value against Installation & Commissioning",
  },
  {
    code: "4",
    heading: "Goods and Service Tax",
    body: "GST as above\nOr as applicable at the time of delivery",
  },
  {
    code: "5",
    heading: "Warranty",
    body: "12 Months from the date of Invoice for Manufacturing Defects (Refer Micrologic General Warranty Terms below)",
  },
  {
    code: "6",
    heading: "Transit Insurance",
    body: "Tobuyers account",
  },
  {
    code: "7",
    heading: "Equipment Validation & Acceptance",
    body: "The equipment will be fully tested in house prior to FAT (Factory Acceptance Test) and SAT (Site Acceptance Test). Our in-house test procedures will be in line with the Requirement Specification (RS) signed off by the Customer in the beginning of the Project.",
  },
  {
    code: "8",
    heading: "Inspection",
    body: "Inspection and validation by the customer.\nWe suggest to Validate with at least 100 samples",
  },
  {
    code: "9",
    heading: "Validity",
    body: "This quote is valid for 2 months from date",
  },
  {
    code: "10",
    heading: "Placement of Purchase Order",
    body:
      "Please make the purchase order on:\nMicrologic Integrated Systems (P) Limited\n#22-D1, “Micrologic Drive” , KIADB Industrial Area, Phase1, Kumbalagodu (Bengaluru-Mysuru Highway), Bengaluru-560 074, India",
  },
  {
    code: "11",
    heading: "Force Majeure",
    body:
      "In the event either party is unable to perform its obligations under the terms of this Agreement because of acts of God, strikes, lockdown, curfews, effects due to Pandemic, equipment or transmission failure or damage reasonably beyond its control, or other causes reasonably beyond its control, such party shall not be liable for damages to the other for any damages resulting from such failure to perform or otherwise from such causes.",
  },
];

const DEFAULT_DELAYED_DELIVERY = [
  {
    code: "12",
    heading: "Delayed Delivery of the Project due to delays at customer’s end or force majeure",
    body:
      "In the event the customer does not take the delivery of the Project beyond 3 weeks of the readiness of the project at our factory or hold from the customer’s end for any other reason, the customer is liable to make the payment that is due as per the agreed terms with applicable taxes. Micrologic will intimate the readiness of the project with an internal test report.\nThe reasons for such delays could be due to customer’s changed timelines, Lockdown/Curfew due to pandemic or any reasons causing a delay for the customer to take the delivery.",
  },
  {
    code: "",
    heading: "Order Cancellation",
    body:
      "The deliverables proposed vide this proposal are completely customized and will be made specifically against your order. In order to deliver the project/product, there will be a set of stages which includes concept design, detailed design, software development, part manufacturing, integration, test & validation before it is ready for shipping. All these stages have cost content in effort & material.\nOrders once placed, and Micrologic accepts the order with an order acceptance, to meet the timelines, as a process the work begins internally.\nCancellation of an order will have impact on the costs incurred at different stages;\n1. Order cancellation within 7 days of OA, No charges\n2. Cancellation of the order before DAP Signoff, 25% of the order value will be payable\n3. Cancellation of the order after DAP Signoff, 50% of the order value will be payable\n4. Cancellation of the order once the manufacturing has started, 100% of the order value will be payable\nThe dates of the activity will be shared in the timelines released by the project team",
  },
  {
    code: "",
    heading: "Note",
    body:
      "For Fast track deliveries with delivery timelines lesser than 7 days are not cancellable. 100% of the order value is payable\nFor advances received, the cost as above will be forfieted at respective stages. The customer is deemed committed to pay the difference, where applicable\nFor delayed payments an interest @2.5% per month",
  },
];

const DEFAULT_ENGAGEMENT = [
  { code: "1.1", heading: "Software", body: "The software applications (Suite) are the product and property of Micrologic and are licensed to the user under the license agreement. All Intellectual Properties (IP) used are property of the respective owners.\nThe software suite cannot be reused without prior licensing from Micrologic.\nThis model of engagement will not allow sharing, part or full source codes/snippets." },
  { code: "1.2", heading: "Software Engagement Models", body: "" },
  { code: "1.3", heading: "Application Development", body: "In this engagement model, a software application (software suite) will be supplied. The application remains a property of Micrologic and will be licensed to the buyer." },
  { code: "1.4", heading: "Time and Effort", body: "In this engagement model, the software will be built for a given specification and the software will be the buyer’s property. Micrologic will charge on a Time and Effort basis, where-in the Man-hours spent on software development will be charged. The software can either be developed at Micrologic or at the buyer’s premises as necessary. The source code will be the property of the buyer." },
  { code: "1.5", heading: "Modifications & Additions", body: "A DAP process will be followed where in the design and the requirement is discussed and Vetted by the user. Modifications post DAP will call for a cost and time implication, to be borne by the buyer. Minor and reasonable modifications with respect to the requirement specifications can be made with mutual understanding from the seller and buyer.\nModifications or additions requiring material and additional time and effort might call for a change in delivery time and there might be cost implications." },
  { code: "1.6", heading: "Time lines", body: "Time lines quoted will be adhered by Micrologic. Where the buyer has to provide details like drawings, information, samples, if delayed from the buyer’s end, which would affect the project time lines, the affect of the delays will be borne by the buyer.\nIf the equipment is not taken by the buyer after readiness, within a reasonable time, the buyer shall have to pay the full balance amount and Micrologic is entitled to impose demurrage charges to the buyer for keeping the equipment at Micrologic." },
  { code: "1.7", heading: "Pre-Shipping Acceptance", body: "The buyer will validate the line/equipment before dispatch at his discretion and a ‘Dispatch Clearance’ is necessary for Micrologic to arrange dispatch." },
  { code: "1.8", heading: "Information and Samples", body: "Information and samples needed to complete the project will be provided by the buyer at no cost to Micrologic. All costs involved to ship the samples will be borne by the buyer." },
  { code: "1.9", heading: "Non-Disclosure", body: "Information and drawings submitted to the buyer for reviews and approvals remain property of Micrologic and cannot be shared or used for other purposes.\nAt the same time Micrologic will commit to protect all properties of the customer from misuse.\nWhere necessary a Non-Disclosure Agreement can be signed by both parties." },
];

const DEFAULT_PROCESS_FLOW = [
  "Start",
  "Enquiry",
  "Log the Enquiry",
  "Technical Concept & Estimation",
  "Techno Commercial Proposal",
  "Revised Proposal (if any Changes)",
  "Order Finalization",
  "Purchase Order (PO)",
  "Order Acceptance (OA)",
  "Project Internal Work Order (PWO)",
  "Project Kick off",
  "Project Delivery Specification (PDS)",
  "Project Delivery Plan (PDP)",
  "Weekly Time Lines",
  "Design Approval (DAP)",
  "DAP & DAP Sign off",
  "DAP Sign off",
  "Project Status Update",
  "FAT Sign off",
  "Customer Validation",
  "FGTN",
  "Dispatch Clearance",
  "Dispatch",
  "Installation & Commissioning Report",
  "Project Exit",
];

const DEFAULT_BANK_DETAILS = {
  accountDetails: [
    ["1.1", "Name of the Bank", "Kotak Mahindra Bank"],
    ["1.2", "Account Holder’s Name", "MICROLOGIC INTEGRATED SYSTEMS PRIVATE LIMITED"],
    ["1.3", "Name of the Branch", "Sadashivanagar Branch"],
    [
      "1.4",
      "Address of the Branch",
      "G-2, No. 19 Old No.86, Lower Palace Orchards Main Road, Sanky Road, Sadashivanagar, Bengaluru – 560003 Karnataka, India",
    ],
    ["1.5", "Telephone Number of the Branch", "1860 266 2666"],
    ["1.6", "IFSC code of the Branch", "KKBK0008060"],
    ["1.7", "SWIFT code of the Branch", "KKBKINBB"],
    ["1.8", "MICR Code", "560485064"],
    ["1.9", "Bank Account number", "7650258829 (As appearing on the Cheque book/pass book)"],
    ["1.10", "Account Type", "Overdraft Account"],
  ],
  paymentInstructions: [
    "In favor of Micrologic Integrated Systems Pvt. Ltd.",
    "Payable at Bangalore only",
  ],
  registrationNumbers: [
    ["3.1", "Company Identity Number (CIN)", "U72200KA2006PTC041282"],
    ["3.2", "Excise Registration Number", "AAECM8994LEM004"],
    ["3.3", "VAT Registration Number", "29840733064"],
    ["3.4", "CST Registration Number", "29840733064"],
    ["3.5", "PAN Number", "AAECM8994L"],
    ["3.6", "GST Number", "29AAECM8994L1ZG"],
    ["3.7", "HSN Code", "90318000"],
    ["3.8", "State", "Karnataka"],
  ],
};

function buildPricingRowsFromItems(items = []) {
  return items.map((item, index) => {
    const subItems = Array.isArray(item?.subItems) ? item.subItems : [];
    const descriptionLines = [];

    if (item?.description) descriptionLines.push(item.description);
    subItems.forEach((sub) => {
      const name = sub?.name || sub?.description || sub?.sku;
      if (name) descriptionLines.push(`➢ ${name}`);
    });

    return {
      slNo: String(index + 1),
      hsnSac: safeText(item?.hsnSac || item?.item?.hsnSac || item?.item?.hsnSacCode || "-"),
      gst: safeText(item?.gst || item?.taxRate || item?.item?.gst || "-"),
      descriptionTitle: safeText(item?.name || item?.description || item?.item?.name),
      descriptionLines,
      unitPrice: Number(item?.price ?? item?.unitPrice ?? item?.item?.basePrice ?? 0),
      qty: Number(item?.qty ?? item?.quantity ?? 1),
      finalTotal: lineAmount(item),
    };
  });
}

export function buildQuotationPdfData(quotation) {
  const pdfData = quotation?.pdfData || quotation?.pdfContent || {};
  const items = Array.isArray(quotation?.items) ? quotation.items : [];

  const cover = pdfData.cover || {};

  const kam = quotation?.account?.keyAccountManager;
  const kamName = kam?.name || "";
  const kamEmail = kam?.email || "";
  const kamPhone = kam?.phone || "";

  let dynamicContacts = [...DEFAULT_CONTACTS];
  if (kamName) {
    dynamicContacts[0] = {
      name: kamName,
      email: kamEmail || "info@micrologicglobal.com",
      phone: kamPhone || "-",
    };
  }

  return {
    cover: {
      refNo: cover.refNo || quotation?.quotationNo || quotation?.quotationNumber || DEFAULT_REFS.refNo,
      revNo: cover.revNo || DEFAULT_REFS.revNo,
      dateText: cover.dateText || quotation?.issueDate || quotation?.date || quotation?.createdAt || DEFAULT_REFS.dateText,
      customerName: cover.customerName || quotation?.account?.accountName || quotation?.accountName || "test",
      address: cover.address || quotation?.account?.address || "-",
      contactName: cover.contactName || quotation?.contact?.firstName || quotation?.contactName || "-",
      department: cover.department || quotation?.contact?.department || "-",
      phone: cover.phone || quotation?.contact?.phone || "-",
      email: cover.email || quotation?.contact?.email || "-",
      projectName: cover.projectName || quotation?.projectName || quotation?.dealName || quotation?.deal?.dealName || "test_data",
      referenceDocuments: cover.referenceDocuments || DEFAULT_REFERENCE_DOCS,
      technicalProposalRef: cover.technicalProposalRef || "-",
      documentOwner: cover.documentOwner || "-",
      verifiedApprovedBy: cover.verifiedApprovedBy || kamName || "-",
      micrologicContacts: cover.micrologicContacts?.length > 0 ? cover.micrologicContacts : dynamicContacts,
    },

    revisionHistory: pdfData.revisionHistory?.length
      ? pdfData.revisionHistory
      : [
          { slNo: "1", revisionNo: "-", revisionDate: "-", history: "-" },
        ],

    confidentiality: {
      paragraphs: pdfData.confidentiality?.paragraphs?.length
        ? pdfData.confidentiality.paragraphs
        : DEFAULT_CONFIDENTIALITY,
    },

    pricing: {
      category: pdfData.pricing?.category || "test_data",
      leadText: pdfData.pricing?.leadText || "",
      projectTitle: pdfData.pricing?.projectTitle || quotation?.projectName || quotation?.dealName || quotation?.deal?.dealName || "test_data",
      rows:
        pdfData.pricing?.rows?.length > 0
          ? pdfData.pricing.rows
          : items.length > 0
            ? buildPricingRowsFromItems(items)
            : [
                {
                  slNo: "1",
                  hsnSac: "-",
                  gst: "-",
                  descriptionTitle:
                    "Application Engineering, Testing, Validation, Documentation, Calibration, Test Case configuration, I&C, Customer Training",
                  descriptionLines: [
                    "Application Engineering, Testing, Validation, Documentation, Calibration, Test Case configuration, I&C, Customer Training",
                    "¢ Application Engineering",
                    "¢ Test & Validation",
                    "¢ I& C, Training",
                  ],
                  unitPrice: 65000,
                  qty: 1,
                  finalTotal: 65000,
                },
              ],
      notes:
        pdfData.pricing?.notes?.length > 0
          ? pdfData.pricing.notes
          : [
              "Flashing not considered in above scope of supply.",
              "Maintenance Spare Parts Not included in the above price, can be Quoted once the detailed Engineering is complete.",
              "Software Development: Application development Engagement model is considered for this proposal. For more details on this please refer to Engagement Model & Definitions in the following section of this proposal.",
            ],
      priceBasis:
        pdfData.pricing?.priceBasis ||
        "Above price is basic, exclusive of GST@18% Extra",
      delivery:
        pdfData.pricing?.delivery?.length > 0
          ? pdfData.pricing.delivery
          : [
              "10-12 Weeks from the date of receipt of Purchase Order and Advance",
              "The Delivery Time depends on the customer dependent activities like receipt of Advance, In-time Design Approval (DAP) etc., which will be defined in the Timelines on a Weekly basis after Project Kickoff.",
            ],
    },

    warranty: {
      title: pdfData.warranty?.title || "MICROLOGIC GENERAL WARRANTY TERMS",
      blocks: pdfData.warranty?.blocks?.length > 0 ? pdfData.warranty.blocks : DEFAULT_WARRANTY,
      note: pdfData.warranty?.note || "Subject to Bangalore Jurisdiction only",
    },

    softwareSupport: {
      title: pdfData.softwareSupport?.title || "Software Support Terms",
      blocks:
        pdfData.softwareSupport?.blocks?.length > 0
          ? pdfData.softwareSupport.blocks
          : DEFAULT_SOFTWARE_SUPPORT,
    },

    commercialTerms: {
      title: pdfData.commercialTerms?.title || "COMMERCIAL TERMS",
      blocks:
        pdfData.commercialTerms?.blocks?.length > 0
          ? pdfData.commercialTerms.blocks
          : DEFAULT_COMMERCIAL_TERMS,
    },

    delayedDelivery: {
      title:
        pdfData.delayedDelivery?.title ||
        "Delayed Delivery, Order Cancellation & Notes",
      blocks:
        pdfData.delayedDelivery?.blocks?.length > 0
          ? pdfData.delayedDelivery.blocks
          : DEFAULT_DELAYED_DELIVERY,
    },

    engagement: {
      title: pdfData.engagement?.title || "Engagement Model & Definitions",
      blocks:
        pdfData.engagement?.blocks?.length > 0
          ? pdfData.engagement.blocks
          : DEFAULT_ENGAGEMENT,
    },

    processFlow: {
      title: pdfData.processFlow?.title || "Project Process Flow",
      steps:
        pdfData.processFlow?.steps?.length > 0
          ? pdfData.processFlow.steps
          : DEFAULT_PROCESS_FLOW.map((label, index) => ({
              label,
              alt:
                [
                  1, 3, 4, 6, 8, 10, 12, 13, 15, 17, 18, 20, 22, 23,
                ].includes(index),
            })),
    },

    bankDetails: {
      title: pdfData.bankDetails?.title || "MICROLOGIC BANK DETAILS",
      accountDetails:
        pdfData.bankDetails?.accountDetails?.length > 0
          ? pdfData.bankDetails.accountDetails
          : DEFAULT_BANK_DETAILS.accountDetails.map(([code, label, value]) => ({
              code,
              label,
              value,
            })),
      paymentInstructions:
        pdfData.bankDetails?.paymentInstructions?.length > 0
          ? pdfData.bankDetails.paymentInstructions
          : DEFAULT_BANK_DETAILS.paymentInstructions,
      registrationNumbers:
        pdfData.bankDetails?.registrationNumbers?.length > 0
          ? pdfData.bankDetails.registrationNumbers
          : DEFAULT_BANK_DETAILS.registrationNumbers.map(([code, label, value]) => ({
              code,
              label,
              value,
            })),
    },
  };
}