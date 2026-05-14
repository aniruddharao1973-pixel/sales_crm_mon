//  src/features/quotations/pdf/pages/TextSectionPage.jsx


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
  introCard: {
    border: `1 solid ${PDF_COLORS.border}`,
    backgroundColor: PDF_COLORS.white,
    padding: 10,
    marginBottom: 8,
  },
  introText: {
    fontSize: 8.5,
    marginBottom: 6,
    color: PDF_COLORS.text,
    textAlign: "justify",
  },
  blockTable: {
    border: `1 solid ${PDF_COLORS.border}`,
    backgroundColor: PDF_COLORS.white,
  },
  blockRow: {
    flexDirection: "row",
    borderBottom: `1 solid ${PDF_COLORS.borderSoft}`,
  },
  blockRowLast: {
    borderBottom: "0 solid #000000",
  },
  code: {
    width: "10%",
    paddingHorizontal: 6,
    paddingVertical: 5,
    fontSize: 8,
    fontWeight: "bold",
    borderRight: `1 solid ${PDF_COLORS.borderSoft}`,
    backgroundColor: "#FAFAFA",
  },
  contentWrap: {
    width: "90%",
    paddingHorizontal: 7,
    paddingVertical: 5,
  },
  heading: {
    fontSize: 8.6,
    fontWeight: "bold",
    color: PDF_COLORS.text,
    marginBottom: 3,
  },
  bodyText: {
    fontSize: 8.2,
    color: PDF_COLORS.text,
    marginBottom: 3,
    textAlign: "justify",
  },
  note: {
    marginTop: 8,
    fontSize: 8.2,
    fontWeight: "bold",
    color: PDF_COLORS.ink,
  },
});

export default function TextSectionPage({
  title,
  paragraphs = [],
  blocks = [],
  note = "",
}) {
  return (
    <PdfPageShell>
      <Text style={styles.title}>{title}</Text>

      {paragraphs.length > 0 && (
        <View style={styles.introCard}>
          {paragraphs.map((p, idx) => (
            <Text key={idx} style={styles.introText}>
              {p}
            </Text>
          ))}
        </View>
      )}

      {blocks.length > 0 && (
        <View style={styles.blockTable}>
          {blocks.map((block, index) => {
            const bodyLines = splitText(block.body);
            return (
              <View
                key={index}
                style={[
                  styles.blockRow,
                  index === blocks.length - 1 ? styles.blockRowLast : null,
                ]}
              >
                <Text style={styles.code}>{safeText(block.code)}</Text>
                <View style={styles.contentWrap}>
                  {block.heading ? (
                    <Text style={styles.heading}>{safeText(block.heading)}</Text>
                  ) : null}

                  {bodyLines.map((line, idx) => (
                    <Text key={idx} style={styles.bodyText}>
                      {line}
                    </Text>
                  ))}
                </View>
              </View>
            );
          })}
        </View>
      )}

      {note ? <Text style={styles.note}>{note}</Text> : null}
    </PdfPageShell>
  );
}