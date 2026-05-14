
// src\features\quotations\pdf\data\proposalData.js
export const proposalData = {
  metadata: {
    ref: "MISPL/COMM/F2425.1150",
    rev: "01",
    date: "Wednesday, April 23, 2025",
  },
  customer: {
    name: "M/s Amara Raja Electronics Limited",
    address:
      "Diguvamagham(Post), Thavanampalle (Mandal), Chittoor District – 517129, Andhra Pradesh, India",
    contact: "Ms Dasini Divya Sree",
    phone: "+91 82476 74319",
    email: "dds@amararaja.com",
  },
  project: {
    name: "EOL for MDR Control Card",
    referenceDocs: [
      "MDR CONTROL CARD(HON-2018) +EIP CARD rev 00.docx",
      "MDR Control Card EOL.xlsx",
    ],
    techProposalRef: "MISPL/TECH / F2425.1150_01",
    documentOwner: "Chaithra S B",
    approvedBy: "Bhavya K S",
  },
  company: {
    name: "MICROLOGIC INTEGRATED SYSTEMS (P) LIMITED",
    address:
      'Plot #22-D1, "Micrologic Drive", KIADB Industrial Area, Phase I, Kumbalagodu, Bengaluru-560 074, India',
    website: "www.micrologicglobal.com",
    phone: "+91 96635 21132",
    contacts: [
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
    ],
  },
  revisionHistory: [
    {
      sl: "1",
      revNo: "F2425.1150 Rev 01",
      date: "Wednesday, April 23, 2025",
      history: "Creation",
    },
  ],
  pricing: {
    category: "Automated Assembly and Test Equipment",
    items: [
      {
        sl: "1",
        sku: "TC1000001",
        hsn: "90318000",
        gst: "18%",
        discount: "0%",
        description:
          "EOL for MDR Control Card Consisting of:\n• Tester Cell\n• Fan Less Embedded Industrial Computer\n• UPS\n• Control Hardware\n• Digital I/O Module\n• Level Converter\n• Handheld Scanner\n• Barcode Printer\n• Programmable Power Supply 0-32V, 6A DC\n• Fixed 24V, 2A DC\n• Digital Multimeter\n• Motor with Encoder\n• Test fixture with Auto Connector Engagement Mechanism\n• Test Roller Setup\n• Micrologic Test Suite – USB Dongle License",
        unitPrice: "26,68,000",
        qty: "1",
        total: "26,68,000",
      },
      {
        sl: "2",
        hsn: "998540",
        gst: "",
        description: "Packing, Forwarding, Freight and Transit Insurance",
        unitPrice: "",
        qty: "",
        total: "50,000",
      },
      {
        sl: "3",
        hsn: "998732",
        gst: "",
        description: "Installation & Commissioning",
        unitPrice: "",
        qty: "",
        total: "1,00,000",
      },
    ],
    notes: "Flashing not considered in above scope of supply.",
    priceBasis: "Above price is basic, exclusive of GST@18% Extra",
    delivery: [
      {
        sl: "1",
        desc: "10-12 Weeks from the date of receipt of Purchase Order and Advance",
      },
      {
        sl: "2",
        desc: "The Delivery Time depends on the customer dependent activities like receipt of Advance, In-time Design Approval (DAP) etc., which will be defined in the Timelines on a Weekly basis after Project Kickoff.",
      },
    ],
    generalNotes: [
      "Maintenance Spare Parts Not included in the above price, can be Quoted once the detailed Engineering is complete.",
      "Software Development: Application development Engagement model is considered for this proposal. For more details on this please refer to Engagement Model & Definitions in the following section of this proposal.",
    ],
  },
  warranty: [
    "The equipment manufactured by Micrologic is warranted for period of 12 months from the date of installation or 18 months from the date of invoice, whichever is earlier. Unless otherwise expressly specified in the contract/agreement.",
    "The warranty is applicable for manufacturing defects only. Micrologic will assess the situation and will decide to either replace the defective parts or repair, with in the warranty period",
    "The equipment as a whole is covered under warranty.",
    "Wherever third party parts are integrated like the camera, printer, robot, etc.. the original manufacturer's warranty terms will be transferred back-back to the customer",
    "Support activities such as software modification, configuration, part teaching in vision, robot etc...are not part of the warranty. Warranty is applicable only for the material content. For support activities, the terms for Technical Support will be applicable.",
    "Warranty ceases if the equipment is found altered, tampered or modified from its original Fit and Finish or Functionality.",
    "Warranty ceases if the equipment is found to have been used beyond its specified limits",
    "Warranty ceases if the equipment is found to have become defective due to wrong power supply or wrong inputs",
    "Warranty may cease if the serial number on the equipment is altered or damaged, as this is the unique identification of the asset.",
  ],
  softwareSupport: [
    "Support on software will not be charged for the first three months after installation. This involves minor modifications & other issues.",
    "Software support will be through remote access. No onsite visits are included in free of cost support. Onsite visits will be chargeable if necessary.",
    "Remote support will be limited to 10 instances during first 3 months, local infrastructure for the remote support like connectivity & presence of personnel at the site to be provided by Customer",
  ],
};
