// // src/ai/promptBuilder.js
// // Detects casual greetings vs CRM questions and builds appropriate prompt

// const CASUAL_TRIGGERS = [
//   "hi",
//   "hello",
//   "hey",
//   "what's up",
//   "whats up",
//   "sup",
//   "good morning",
//   "good afternoon",
//   "good evening",
//   "how are you",
//   "how r u",
//   "yo",
//   "hiya",
//   "greetings",
//   "howdy",
// ];

// function isCasualGreeting(question) {
//   const q = question
//     .trim()
//     .toLowerCase()
//     .replace(/[^a-z\s]/g, "");
//   return CASUAL_TRIGGERS.some(
//     (t) => q === t || q.startsWith(t + " ") || q.endsWith(" " + t),
//   );
// }

// export function buildSalesPrompt(insights, question) {
//   console.log("📝 [PROMPT BUILDER] Building prompt for question:", question);

//   // ── Casual greeting → natural reply, no data ─────────────────────────────
//   if (isCasualGreeting(question)) {
//     console.log(
//       "📝 [PROMPT BUILDER] Detected casual greeting — conversational mode",
//     );
//     const prompt = `You are a helpful CRM sales assistant. Reply naturally and warmly in 1-2 sentences. Do NOT list data unless asked.

// User: ${question}
// Assistant:`;
//     console.log(
//       `📝 [PROMPT BUILDER] Prompt length: ${prompt.length} chars (casual mode)`,
//     );
//     return prompt;
//   }

//   // ── CRM question → include sales data ────────────────────────────────────
//   console.log(
//     "📝 [PROMPT BUILDER] Detected CRM question — including sales data",
//   );

//   const {
//     totalDeals = 0,
//     openDeals = 0,
//     wonDeals = 0,
//     lostDeals = 0,
//     totalRevenue = 0,
//     winRate = 0,
//     dealsByStage = {},
//     topPerformers = [],
//     atRiskDeals = [],
//     closingSoonDeals = [],
//   } = insights;

//   const stageLines = Object.entries(dealsByStage)
//     .map(([stage, count]) => `  ${stage}: ${count}`)
//     .join("\n");

//   const topPerfLines = topPerformers.length
//     ? topPerformers
//         .slice(0, 3)
//         .map(
//           (p, i) =>
//             `  ${i + 1}. ${p.name} — ₹${(p.revenue || 0).toLocaleString()} (${p.deals} deals)`,
//         )
//         .join("\n")
//     : "  No data yet";

//   const atRiskLines = atRiskDeals.length
//     ? atRiskDeals
//         .slice(0, 3)
//         .map(
//           (d) =>
//             `  - ${d.dealName}: ₹${(d.amount || 0).toLocaleString()} (${d.stage})`,
//         )
//         .join("\n")
//     : "  None";

//   const closingSoonLines = closingSoonDeals.length
//     ? closingSoonDeals
//         .slice(0, 3)
//         .map(
//           (d) =>
//             `  - ${d.dealName}: ₹${(d.amount || 0).toLocaleString()} closing ${d.closingDate}`,
//         )
//         .join("\n")
//     : "  None";

//   const prompt = `You are a sharp, helpful CRM sales assistant. Answer directly and concisely. Match your tone to the question — be conversational, not robotic. Use bullet points only if listing multiple items, otherwise answer in plain sentences.

// === CURRENT CRM DATA ===
// Deals: ${totalDeals} total | ${openDeals} open | ${wonDeals} won | ${lostDeals} lost
// Revenue: ₹${totalRevenue.toLocaleString()} | Win Rate: ${winRate}%

// Pipeline by stage:
// ${stageLines || "  No stage data"}

// Top Performers:
// ${topPerfLines}

// At-Risk Deals:
// ${atRiskLines}

// Closing Soon:
// ${closingSoonLines}
// ========================

// User question: ${question}
// Answer:`;

//   console.log(
//     `📝 [PROMPT BUILDER] Prompt length: ${prompt.length} chars (CRM mode)`,
//   );
//   return prompt;
// }

// export function buildAdvancedAnalyticsPrompt(snapshot, question) {
//   const {
//     totalDeals,
//     openDeals,
//     wonDeals,
//     winRate,
//     monthlyWonAmount,
//     monthlyWonCount,
//   } = snapshot;

//   return `You are a senior CRM analytics strategist.

// Provide executive-level insights.
// Be concise, sharp, and actionable.
// Do NOT add markdown headers.
// Do NOT combine bullets.
// Use EXACT structure below.

// === CRM ANALYTICS SNAPSHOT ===
// Total Deals: ${totalDeals}
// Open Deals: ${openDeals}
// Won Deals: ${wonDeals}
// Win Rate: ${winRate}%
// Monthly Won Revenue: ₹${monthlyWonAmount.toLocaleString()}
// Monthly Won Count: ${monthlyWonCount}
// ================================

// User question: ${question}

// Respond EXACTLY in this format:

// 1. KEY INSIGHT
// - Insight 1
// - Insight 2

// 2. RISK OBSERVATION
// - Risk 1
// - Risk 2

// 3. OPPORTUNITY SUGGESTION
// - Opportunity 1
// - Opportunity 2

// 4. STRATEGIC RECOMMENDATION
// - Recommendation 1
// - Recommendation 2`;
// }
// export function buildQuickAnalyticsPrompt(snapshot) {
//   const {
//     totalDeals,
//     openDeals,
//     wonDeals,
//     winRate,
//     monthlyWonAmount,
//   } = snapshot;

//   return `You are a CRM executive assistant.

// Provide a concise executive snapshot in EXACTLY 4 lines.

// Use this structure only.
// Do NOT use numbering.
// Do NOT use bullets.
// Do NOT add extra text.

// Pipeline Status: Brief 1 sentence about overall pipeline health based on:
// - Total Deals: ${totalDeals}
// - Open Deals: ${openDeals}
// - Won Deals: ${wonDeals}
// - Win Rate: ${winRate}%

// Main Risk: 1 sentence identifying the biggest risk.

// Immediate Action: 1 practical action.

// Strategic Recommendation: 1 strategic improvement suggestion.

// Monthly Revenue Context: ₹${monthlyWonAmount.toLocaleString()}`;
// }

// src/ai/promptBuilder.js
/* =========================================================
   CASUAL GREETING DETECTION
========================================================= */

const CASUAL_TRIGGERS = [
  "hi",
  "hello",
  "hey",
  "what's up",
  "whats up",
  "sup",
  "good morning",
  "good afternoon",
  "good evening",
  "how are you",
  "how r u",
  "yo",
  "hiya",
  "greetings",
  "howdy",
];

function isCasualGreeting(question) {
  const q = question
    .trim()
    .toLowerCase()
    .replace(/[^a-z\s]/g, "");

  return CASUAL_TRIGGERS.some(
    (t) => q === t || q.startsWith(t + " ") || q.endsWith(" " + t),
  );
}

/* =========================================================
   QUESTION CLASSIFIER (EXTRA LAYER BEFORE BRAIN 1)
========================================================= */

export function classifyQuestion(question) {
  const q = question.toLowerCase();

  // Email / campaign related
  if (
    q.includes("campaign") ||
    q.includes("newsletter") ||
    q.includes("promotion") ||
    q.includes("bulk email") ||
    q.includes("email template") ||
    q.includes("festival email")
  ) {
    return "email_campaign";
  }

  // Security sensitive
  if (
    q.includes("phone") ||
    q.includes("mobile") ||
    q.includes("contact list") ||
    q.includes("download") ||
    q.includes("export") ||
    q.includes("database")
  ) {
    return "security_sensitive";
  }

  // Analytics questions
  if (
    q.includes("revenue") ||
    q.includes("pipeline") ||
    q.includes("deals") ||
    q.includes("conversion") ||
    q.includes("win rate") ||
    q.includes("stage") ||
    q.includes("performance")
  ) {
    return "analytics_question";
  }

  if (isCasualGreeting(question)) {
    return "casual";
  }

  return "general_crm";
}

/* =========================================================
   SECURITY SYSTEM PROMPT
========================================================= */

export const SECURITY_SYSTEM_PROMPT = `
You are a professional CRM analytics assistant.

STRICT SECURITY RULES:
- Never reveal customer personal data.
- Never reveal emails, phone numbers, addresses.
- Never expose raw database records.
- Never list customers or contacts.
- Only discuss aggregated CRM analytics.

OUTPUT FORMAT RULES (VERY IMPORTANT):
- Never use **markdown**, **asterisks**, ***stars***, or code formatting.
- Never use **bold markers** like **text**.
- Do NOT use symbols like ###, **, or ---.
- Write clean professional text only.

Structure responses like this:

Pipeline Overview
- insight
- insight

Revenue Performance
- insight
- insight

Key Observations
- insight
- insight

Recommendations
- insight
- insight

Allowed topics:
- sales performance
- pipeline analytics
- deal stages
- revenue insights
- CRM strategy
- sales forecasting

If a user asks for restricted information,
politely refuse and explain that customer data is protected.
`;

/* =========================================================
   SALES PROMPT BUILDER
========================================================= */

export function buildSalesPrompt(insights, question) {
  console.log("📝 [PROMPT BUILDER] Building prompt for:", question);

  // ── Casual greeting
  if (isCasualGreeting(question)) {
    const prompt = `
User: ${question}
Assistant:`;

    return [
      {
        role: "system",
        content:
          "You are a friendly CRM assistant. Reply warmly in 1-2 sentences.",
      },
      {
        role: "user",
        content: prompt,
      },
    ];
  }

  console.log("📝 [PROMPT BUILDER] CRM analytics prompt");

  const {
    totalDeals = 0,
    openDeals = 0,
    wonDeals = 0,
    lostDeals = 0,
    totalRevenue = 0,
    winRate = 0,
    dealsByStage = {},
    topPerformers = [],
    atRiskDeals = [],
    closingSoonDeals = [],
  } = insights;

  const stageLines = Object.entries(dealsByStage)
    .map(([stage, count]) => `${stage}: ${count}`)
    .join("\n");

  const topPerfLines = topPerformers.length
    ? topPerformers
        .slice(0, 3)
        .map(
          (p, i) =>
            `${i + 1}. ${p.name} — ₹${(p.revenue || 0).toLocaleString()} (${p.deals} deals)`,
        )
        .join("\n")
    : "No data yet";

  const atRiskLines = atRiskDeals.length
    ? atRiskDeals
        .slice(0, 3)
        .map(
          (d) =>
            `${d.dealName}: ₹${(d.amount || 0).toLocaleString()} (${d.stage})`,
        )
        .join("\n")
    : "None";

  const closingSoonLines = closingSoonDeals.length
    ? closingSoonDeals
        .slice(0, 3)
        .map(
          (d) =>
            `${d.dealName}: ₹${(d.amount || 0).toLocaleString()} closing ${d.closingDate}`,
        )
        .join("\n")
    : "None";

  const prompt = `
=== CRM SALES SNAPSHOT ===

Deals:
Total: ${totalDeals}
Open: ${openDeals}
Won: ${wonDeals}
Lost: ${lostDeals}

Revenue: ₹${totalRevenue.toLocaleString()}
Win Rate: ${winRate}%

Pipeline by Stage:
${stageLines || "No stage data"}

Top Performers:
${topPerfLines}

At Risk Deals:
${atRiskLines}

Closing Soon:
${closingSoonLines}

==========================

User Question:
${question}

Provide a structured CRM analysis using these sections:

Pipeline Overview
Revenue Performance
Key Observations
Recommendations

Use bullet points.
Do not use markdown symbols.
`;

  return [
    {
      role: "system",
      content: SECURITY_SYSTEM_PROMPT,
    },
    {
      role: "user",
      content: prompt,
    },
  ];
}

/* =========================================================
   ADVANCED ANALYTICS PROMPT
========================================================= */

// export function buildAdvancedAnalyticsPrompt(snapshot, question) {
//   const {
//     totalDeals,
//     openDeals,
//     wonDeals,
//     winRate,
//     monthlyWonAmount,
//     monthlyWonCount,
//   } = snapshot;

//   const prompt = `
// === CRM ANALYTICS SNAPSHOT ===

// Total Deals: ${totalDeals}
// Open Deals: ${openDeals}
// Won Deals: ${wonDeals}

// Win Rate: ${winRate}%

// Monthly Won Revenue: ₹${monthlyWonAmount.toLocaleString()}
// Monthly Won Count: ${monthlyWonCount}

// ===============================

// User Question:
// ${question}

// Provide executive CRM insights.
// `;

//   return [
//     {
//       role: "system",
//       content:
//         SECURITY_SYSTEM_PROMPT +
//         "\nProvide executive-level analytics insights.",
//     },
//     {
//       role: "user",
//       content: prompt,
//     },
//   ];
// }

export function buildAdvancedAnalyticsPrompt(snapshot, question) {
  const {
    totalDeals,
    openDeals,
    wonDeals,
    winRate,
    monthlyWonAmount,
    monthlyWonCount,
  } = snapshot;

  // 🔥 RANDOMIZER (forces new phrasing every time)
  const variationSeed = Math.floor(Math.random() * 10000);

  const prompt = `
=== CRM ANALYTICS SNAPSHOT ===

Total Deals: ${totalDeals}
Open Deals: ${openDeals}
Won Deals: ${wonDeals}

Win Rate: ${winRate}%

Monthly Won Revenue: ₹${monthlyWonAmount.toLocaleString()}
Monthly Won Count: ${monthlyWonCount}

===============================

User Question:
${question}

VARIATION SEED: ${variationSeed}

IMPORTANT INSTRUCTIONS:

- Generate COMPLETELY NEW wording every time
- Do NOT repeat sentence structure from previous responses
- Rephrase insights differently even if data is same
- Use different vocabulary, tone, and explanation style
- Avoid template-like repetition

STRUCTURE:

Pipeline Status
- detailed explanation (3–4 lines)

Risk Analysis
- analytical reasoning (2–3 lines)

Strategic Recommendations
- actionable insights (3–4 points)

Write like a senior CRM strategist.
`;

  return [
    {
      role: "system",
      content:
        SECURITY_SYSTEM_PROMPT +
        "\nYou are a senior CRM strategist generating varied executive insights.",
    },
    {
      role: "user",
      content: prompt,
    },
  ];
}

/* =========================================================
   QUICK ANALYTICS PROMPT
========================================================= */

export function buildQuickAnalyticsPrompt(snapshot) {
  const { totalDeals, openDeals, wonDeals, winRate, monthlyWonAmount } =
    snapshot;

  const variationSeed = Math.floor(Math.random() * 10000);

  const prompt = `
CRM SNAPSHOT

Total Deals: ${totalDeals}
Open Deals: ${openDeals}
Won Deals: ${wonDeals}
Win Rate: ${winRate}%

Monthly Revenue: ₹${monthlyWonAmount.toLocaleString()}

VARIATION SEED: ${variationSeed}

INSTRUCTIONS:

- Generate a SHORT summary (max 4 sentences)
- Each time, use DIFFERENT wording
- Do NOT reuse phrasing from previous responses
- Keep it sharp and executive-level

FORMAT:

Pipeline Status:
Main Risk:
Immediate Action:
`;

  return [
    {
      role: "system",
      content:
        SECURITY_SYSTEM_PROMPT +
        "\nYou generate concise but varied executive summaries.",
    },
    {
      role: "user",
      content: prompt,
    },
  ];
}

/* =========================================================
   AI EMAIL TEMPLATE GENERATOR (WORLD CLASS VERSION)
========================================================= */

// export function buildEmailTemplatePrompt({
//   purpose,
//   tone,
//   category,
//   recipient,
//   length,
// }) {
//   const prompt = `
// You are an expert CRM email template generator.

// Your job is to generate reusable CRM email templates for sales teams.

// STRICT RULES:
// - Use ONLY the allowed placeholders
// - Never invent names, companies, or people
// - Never output explanations
// - Never output <think>
// - Never output markdown
// - Only return VALID JSON

// Allowed Placeholders:
// {{contact.firstName}}
// {{contact.lastName}}
// {{deal.dealName}}
// {{deal.amount}}
// {{account.accountName}}

// Reusable Components:
// {{header}}
// {{signature}}
// {{footer}}

// Email Details
// Purpose: ${purpose || "sales communication"}
// Tone: ${tone || "professional"}
// Category: ${category || "general"}
// Recipient: ${recipient || "client"}
// Length: ${length || "medium"}

// Return JSON ONLY in this format:

// {
//   "templateName": "string",
//   "subject": "string",
//   "body": "string"
// }

// Body must follow this structure:

// {{header}}

// Hi {{contact.firstName}},

// Email content here.

// {{signature}}
// {{footer}}
// `;

//   return [
//     {
//       role: "system",
//       content:
//         "You generate structured CRM email templates in JSON format only.",
//     },
//     {
//       role: "user",
//       content: prompt,
//     },
//   ];
// }

/* =========================================================
   AI EMAIL TEMPLATE GENERATOR (WORLD CLASS VERSION v3)
========================================================= */

export function buildEmailTemplatePrompt({
  purpose,
  tone,
  category,
  recipient,
  length,
}) {
  const PURPOSE_GUIDE = {
    "cold outreach":
      "Introduce your company, show relevance to the recipient, highlight value, and invite a short conversation.",
    "follow up":
      "Follow up politely after a previous interaction or unanswered message and encourage a response.",
    "proposal submission":
      "Share or reference a proposal and invite the recipient to review or discuss next steps.",
    "meeting request":
      "Request a short meeting or call and explain the purpose clearly.",
    negotiation:
      "Clarify terms, pricing, or scope while keeping the tone collaborative.",
    "deal closing":
      "Confirm final steps and move the opportunity toward completion.",
    "re-engagement":
      "Reconnect with a contact who has not responded recently and restart the conversation.",
    "thank you":
      "Express appreciation after a meeting, discussion, or successful collaboration.",

    promotion:
      "Announce a promotion, discount, or special offer. Emphasize value and encourage the reader to explore the offer.",

    "festival greeting":
      "Send warm wishes for a festival or celebration while strengthening the business relationship.",

    newsletter:
      "Share useful updates such as company news, product insights, or educational content in a concise format.",

    "product update":
      "Inform customers about new features, product improvements, or service enhancements.",

    engagement:
      "Encourage customers to stay engaged with helpful tips, insights, or resources related to the product or service.",

    notification:
      "Inform customers about important updates such as policy changes, service announcements, or security notices.",

    "event invitation":
      "Invite recipients to attend an event such as a webinar, product demo, conference, or workshop.",
  };

  const normalizedPurpose = (purpose || "").toLowerCase();

  const purposeGuide =
    PURPOSE_GUIDE[normalizedPurpose] ||
    `Write a clear, professional email strictly for this purpose: "${purpose}".

Do NOT assume sales outreach or proposals.
Stick exactly to the requested intent.

Keep structure simple and controlled to ensure valid JSON output.`;

  const prompt = `
You are an expert B2B CRM email template generator.

Your job is to generate reusable professional email templates for CRM systems used by sales teams.

Emails must be persuasive, natural, and reusable across multiple CRM records.

────────────────────────
CRITICAL RULES
────────────────────────

1. NEVER generate square bracket placeholders.

Forbidden examples:
[Your Name]
[Your Company]
[Product]
[key benefit]

2. ONLY use the allowed CRM placeholders listed below.

3. NEVER invent new placeholders.

4. If a sentence normally requires missing information, rewrite the sentence naturally.

Correct:
"Our team works with organizations to improve operational efficiency."

Incorrect:
"We specialize in ."

5. NEVER output:
- explanations
- markdown
- code blocks
- <think> tags

6. NEVER include:
- real names
- phone numbers
- emails
- URLs
- addresses

7. Output VALID JSON ONLY.

STRICT OUTPUT ENFORCEMENT:
- Response MUST start with { and end with }
- STOP immediately after closing }
- Do NOT include ANY text before or after JSON
- Do NOT include triple backticks or code blocks
- Do NOT include <think> or reasoning
- Do NOT include explanations
- Do NOT include comments
- Do NOT include trailing commas
- Ensure all strings are properly closed
- Ensure JSON is fully complete (no truncation)
- If you output anything other than JSON, your response will be rejected.

Your response will be parsed using JSON.parse().
If invalid JSON is returned, the system will fail.

FAILSAFE:
If you cannot strictly follow JSON format, return EXACTLY:

{"templateName":"","subject":"","subjectAlternatives":[],"body":""}

8. Bulk emails must remain general and reusable for multiple recipients.
Do not write content that assumes only one specific person.

9. Never request or expose real customer data from any database.
All personalization must use CRM placeholders only.

10. Do not request database queries or CRM records.
Emails must be generated using placeholders only.

────────────────────────
ALLOWED CRM PLACEHOLDERS
────────────────────────

{{contact.firstName}}
{{contact.lastName}}

{{deal.dealName}}
{{deal.amount}}

{{account.accountName}}
{{account.industry}}

{{user.name}}

────────────────────────
REUSABLE EMAIL COMPONENTS
────────────────────────

{{header}}
{{signature}}
{{footer}}

────────────────────────
EMAIL CONTEXT
────────────────────────

Purpose: ${purpose || "sales communication"}
Guidance: ${purposeGuide}

Tone: ${tone || "professional"}
Recipient: ${recipient || "client"}
Length: ${length || "medium"}
Category: ${category || "general"}

────────────────────────
EMAIL WRITING PRINCIPLES
────────────────────────

Avoid overly long paragraphs that may break JSON formatting.
Keep sentences controlled and clear.

Write like an experienced B2B sales professional.

The email should:

• feel personal but reusable  
• be concise and structured  
• clearly communicate value  
• invite a response  

Avoid generic filler phrases.

Use natural professional language.

────────────────────────
LENGTH CONTROL (STRICT)
────────────────────────

Length setting: ${length || "medium"}

Follow EXACTLY:

IF length = short:
- 2 to 4 sentences ONLY
- No long paragraphs
- Keep it concise and direct

IF length = medium:
- 4 to 7 sentences
- Balanced detail and readability

IF length = detailed:
- 8 to 12 sentences
- Add more context, explanation, and value points
- Can include 1–2 short paragraphs

STRICT:
- Do NOT exceed the sentence limit
- Do NOT ignore length setting

────────────────────────
PERSONALIZATION RULES
────────────────────────

If possible, reference:

Company:
{{account.accountName}}

Industry context:
{{account.industry}}

Opportunity:
{{deal.dealName}}

If these fields are not available, rewrite the sentence naturally.

Never leave blank spaces in sentences.

────────────────────────
PURPOSE STRUCTURE GUIDELINES
────────────────────────

Cold Outreach
• Personal opener
• Relevant context about the company
• Value proposition
• Friendly CTA

Follow Up
• Reference previous interaction
• Reminder of value
• Light nudge to respond

Proposal Submission
• Mention proposal
• Reinforce value
• Invite discussion

Meeting Request
• Explain reason for meeting
• Mention potential benefit
• Suggest a short call

Negotiation
• Clarify discussion
• Maintain collaborative tone
• Encourage alignment

Deal Closing
• Confirm next steps
• Reinforce partnership

Re-engagement
• Reconnect politely
• Reintroduce value

Thank You
• Express appreciation clearly
• Keep message SHORT and structured
• Avoid open-ended writing
• Avoid storytelling or explanations
• Do NOT generate reasoning text
• Focus only on email content

Promotion
• Highlight the offer or value
• Explain the benefit to the customer
• Encourage exploring the offer

Festival Greeting
• Send warm wishes
• Reinforce the business relationship
• Keep the message friendly and professional

Newsletter
• Share useful updates or insights
• Maintain an informative tone
• Encourage engagement with the content

Product Update
• Explain the improvement or new feature
• Focus on the value to customers

Engagement
• Provide helpful tips or resources
• Encourage continued interaction

Notification
• Clearly communicate the update or announcement
• Maintain a professional tone

Event Invitation
• Introduce the event
• Mention benefits of attending
• Invite the recipient to participate

────────────────────────
CALL TO ACTION STYLE
────────────────────────

Use a natural and low-pressure CTA such as:

"Would you be open to a brief conversation next week?"

or

"Let me know if you'd be open to discussing this further."

SUBJECT LINE GUIDELINES
- Keep subject under 10 words
- Avoid spam words like FREE, GUARANTEED, CLICK NOW
- Make the subject relevant and professional

────────────────────────
OUTPUT FORMAT
────────────────────────
Example:
{
  "templateName": "Meeting Request Template",
  "subject": "Quick meeting regarding {{deal.dealName}}",
  "subjectAlternatives": [
    "Short call to discuss next steps",
    "Meeting request for alignment",
    "Can we connect briefly?"
  ],
  "body": "{{header}}\n\nHi {{contact.firstName}},\n\nI wanted to connect regarding {{deal.dealName}}.\n\nWould you be open to a short discussion next week?\n\n{{signature}}\n{{footer}}"
}


IMPORTANT:
- Ensure JSON is COMPLETE
- Do not cut off mid-sentence
- Do not end with backslashes (\)

Return JSON ONLY:

{
  "templateName": "string",
  "subject": "string",
  "subjectAlternatives": [
    "string",
    "string",
    "string"
  ],
  "body": "string"
}

────────────────────────
BODY STRUCTURE (MANDATORY)
────────────────────────

{{header}}

Hi {{contact.firstName}},

Write the email based on:
- selected purpose
- selected tone
- selected length

Ensure sentence count strictly follows LENGTH CONTROL rules.

Ensure the email reads naturally and professionally.
Avoid incomplete sentences.

{{signature}}
{{footer}}
`;

  return [
    {
      role: "system",
      content: `
You are a STRICT JSON generator for CRM email templates.

CRITICAL:
- Output ONLY valid JSON
- Do NOT explain anything
- Do NOT think or reason
- Do NOT include analysis
- Do NOT include any text outside JSON
- Do NOT include <think>

FORMAT:
Response MUST start with { and end with }

If you break JSON format, the system will crash.

You must strictly follow all rules.
`,
    },
    {
      role: "user",
      content: prompt,
    },
  ];
}
