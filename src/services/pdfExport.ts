import jsPDF from 'jspdf';

interface PDFExportOptions {
  title: string;
  subtitle?: string;
  category?: string;
  metadata?: { label: string; value: string }[];
  content: string; // Plain text or markdown
  filename?: string;
  footerNote?: string;
}

interface ChatPDFMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
  subject?: string;
  responseStyle?: string;
}

interface ChatPDFExportOptions {
  chatTitle: string;
  subject?: string;
  responseStyle?: string;
  messages: ChatPDFMessage[];
  filename?: string;
}

/**
 * Clean markdown symbols for high quality, legible plain document layout in jsPDF
 */
function cleanMarkdownText(text: string): string {
  if (!text) return '';
  return text
    // Replace markdown bold/italic
    .replace(/\*\*\*(.*?)\*\*\*/g, '$1')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    // Replace inline code
    .replace(/`([^`]+)`/g, '$1')
    // Remove HTML tags if present
    .replace(/<[^>]*>/g, '')
    .trim();
}

/**
 * Splits text into lines fitting within maxWidth in points/mm
 */
function wrapAndMeasureLines(doc: jsPDF, text: string, maxWidth: number): string[] {
  return doc.splitTextToSize(text, maxWidth);
}

/**
 * Exports a Study Note (or generated tool note) to a professional formatted multi-page PDF
 */
export async function exportNoteToPDF(options: PDFExportOptions): Promise<void> {
  const {
    title,
    subtitle = 'College Academic Study Material',
    category,
    metadata = [],
    content,
    filename,
    footerNote = 'Generated via College Study Assistant • For Offline Study & Exam Prep',
  } = options;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 44;
  const contentWidth = pageWidth - margin * 2;
  let cursorY = margin;

  const drawHeader = (pageNum: number) => {
    // Top banner bar
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, pageWidth, 6, 'F');

    // Header title small top
    if (pageNum > 1) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139); // slate-500
      doc.text('COLLEGE STUDY NOTES', margin, 24);

      doc.setFont('helvetica', 'normal');
      const truncatedTitle = title.length > 50 ? title.substring(0, 47) + '...' : title;
      doc.text(truncatedTitle, margin + 120, 24);

      doc.setDrawColor(226, 232, 240); // slate-200
      doc.line(margin, 30, pageWidth - margin, 30);
    }
  };

  const drawFooter = (pageNum: number, totalPages: number) => {
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, pageHeight - 34, pageWidth - margin, pageHeight - 34);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text(footerNote, margin, pageHeight - 20);

    const pageStr = `Page ${pageNum} of ${totalPages}`;
    const pageStrWidth = doc.getTextWidth(pageStr);
    doc.text(pageStr, pageWidth - margin - pageStrWidth, pageHeight - 20);
  };

  // --- Page 1 Header Section ---
  drawHeader(1);

  // Category Badge
  if (category) {
    doc.setFillColor(13, 148, 136); // teal-600
    doc.roundedRect(margin, cursorY, 110, 18, 3, 3, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text(category.toUpperCase(), margin + 8, cursorY + 12);
    cursorY += 28;
  } else {
    cursorY += 10;
  }

  // Note Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(15, 23, 42); // slate-900
  const titleLines = wrapAndMeasureLines(doc, title, contentWidth);
  doc.text(titleLines, margin, cursorY);
  cursorY += titleLines.length * 24 + 4;

  // Subtitle
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text(subtitle, margin, cursorY);
  cursorY += 16;

  // Metadata items (e.g. Created date, Subject, Tags)
  const metaItems = [
    { label: 'Date', value: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) },
    ...metadata,
  ];

  if (metaItems.length > 0) {
    doc.setFillColor(248, 250, 252); // slate-50
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.roundedRect(margin, cursorY, contentWidth, 26, 4, 4, 'FD');

    let metaX = margin + 12;
    metaItems.forEach((item) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);
      doc.text(`${item.label}:`, metaX, cursorY + 16);
      const labelW = doc.getTextWidth(`${item.label}:`);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(15, 23, 42);
      doc.text(` ${item.value}`, metaX + labelW, cursorY + 16);
      const valW = doc.getTextWidth(` ${item.value}`);

      metaX += labelW + valW + 20;
    });

    cursorY += 40;
  }

  // Horizontal divider
  doc.setDrawColor(203, 213, 225); // slate-300
  doc.setLineWidth(1);
  doc.line(margin, cursorY, pageWidth - margin, cursorY);
  cursorY += 20;

  // --- Parse & Render Content Blocks ---
  const rawLines = content.split('\n');
  const bottomThreshold = pageHeight - 50;

  const ensureSpace = (needed: number) => {
    if (cursorY + needed > bottomThreshold) {
      doc.addPage();
      cursorY = 46;
      drawHeader(doc.getNumberOfPages());
    }
  };

  let inCodeBlock = false;
  let codeBuffer: string[] = [];

  for (let i = 0; i < rawLines.length; i++) {
    const rawLine = rawLines[i];
    const trimmed = rawLine.trim();

    // Code blocks
    if (trimmed.startsWith('```')) {
      if (inCodeBlock) {
        // Render accumulated code
        const codeText = codeBuffer.join('\n');
        doc.setFont('courier', 'normal');
        doc.setFontSize(8.5);
        const codeLines = doc.splitTextToSize(codeText, contentWidth - 20);
        const blockHeight = codeLines.length * 12 + 16;

        ensureSpace(Math.min(blockHeight, 150));

        doc.setFillColor(30, 41, 59); // slate-800
        doc.roundedRect(margin, cursorY, contentWidth, blockHeight, 4, 4, 'F');

        doc.setTextColor(241, 245, 249); // slate-100
        doc.text(codeLines, margin + 10, cursorY + 14);

        cursorY += blockHeight + 12;
        codeBuffer = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
        codeBuffer = [];
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(rawLine);
      continue;
    }

    // Skip empty lines with small spacer
    if (!trimmed) {
      cursorY += 6;
      continue;
    }

    // Headings
    if (trimmed.startsWith('# ')) {
      ensureSpace(40);
      cursorY += 8;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(15, 23, 42); // slate-900

      const hText = cleanMarkdownText(trimmed.replace('# ', ''));
      const hLines = wrapAndMeasureLines(doc, hText, contentWidth);
      doc.text(hLines, margin, cursorY);
      cursorY += hLines.length * 16 + 4;

      // underline
      doc.setDrawColor(203, 213, 225);
      doc.setLineWidth(0.75);
      doc.line(margin, cursorY, pageWidth - margin, cursorY);
      cursorY += 10;
      continue;
    }

    if (trimmed.startsWith('## ')) {
      ensureSpace(34);
      cursorY += 8;

      // Accent color bar
      doc.setFillColor(13, 148, 136); // teal-600
      doc.roundedRect(margin, cursorY - 10, 3, 13, 1, 1, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);

      const hText = cleanMarkdownText(trimmed.replace('## ', ''));
      const hLines = wrapAndMeasureLines(doc, hText, contentWidth - 12);
      doc.text(hLines, margin + 10, cursorY);
      cursorY += hLines.length * 14 + 6;
      continue;
    }

    if (trimmed.startsWith('### ')) {
      ensureSpace(26);
      cursorY += 6;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(51, 65, 85); // slate-700

      const hText = cleanMarkdownText(trimmed.replace('### ', ''));
      const hLines = wrapAndMeasureLines(doc, hText, contentWidth);
      doc.text(hLines, margin, cursorY);
      cursorY += hLines.length * 13 + 4;
      continue;
    }

    // Blockquote
    if (trimmed.startsWith('> ')) {
      const bqText = cleanMarkdownText(trimmed.replace(/^>\s*/, ''));
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(9.5);
      const bqLines = wrapAndMeasureLines(doc, bqText, contentWidth - 24);
      const bqHeight = bqLines.length * 13 + 12;

      ensureSpace(bqHeight);

      doc.setFillColor(241, 245, 249);
      doc.rect(margin, cursorY, contentWidth, bqHeight, 'F');
      doc.setFillColor(13, 148, 136);
      doc.rect(margin, cursorY, 3, bqHeight, 'F');

      doc.setTextColor(71, 85, 105);
      doc.text(bqLines, margin + 12, cursorY + 12);
      cursorY += bqHeight + 8;
      continue;
    }

    // Unordered List Bullet
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      ensureSpace(16);
      const itemText = cleanMarkdownText(trimmed.replace(/^[-*]\s+/, ''));
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(30, 41, 59);

      // Bullet dot
      doc.setFillColor(13, 148, 136);
      doc.circle(margin + 5, cursorY - 3, 2, 'F');

      const itemLines = wrapAndMeasureLines(doc, itemText, contentWidth - 16);
      doc.text(itemLines, margin + 16, cursorY);
      cursorY += itemLines.length * 13 + 3;
      continue;
    }

    // Numbered list
    const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
    if (numMatch) {
      ensureSpace(16);
      const numLabel = `${numMatch[1]}.`;
      const itemText = cleanMarkdownText(numMatch[2]);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(13, 148, 136);
      doc.text(numLabel, margin + 2, cursorY);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(30, 41, 59);

      const numW = doc.getTextWidth(numLabel) + 6;
      const itemLines = wrapAndMeasureLines(doc, itemText, contentWidth - numW);
      doc.text(itemLines, margin + numW, cursorY);
      cursorY += itemLines.length * 13 + 3;
      continue;
    }

    // Regular paragraph
    ensureSpace(16);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(30, 41, 59);

    const cleanPara = cleanMarkdownText(trimmed);
    const paraLines = wrapAndMeasureLines(doc, cleanPara, contentWidth);
    doc.text(paraLines, margin, cursorY);
    cursorY += paraLines.length * 13 + 5;
  }

  // Add footers on all pages
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    drawFooter(p, totalPages);
  }

  // Save PDF
  const safeFilename = filename
    ? filename.endsWith('.pdf') ? filename : `${filename}.pdf`
    : `${title.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 30)}_Study_Notes.pdf`;

  doc.save(safeFilename);
}

/**
 * Exports a full Gemini chat conversation to a formatted PDF transcript
 */
export async function exportChatToPDF(options: ChatPDFExportOptions): Promise<void> {
  const {
    chatTitle,
    subject = 'General',
    responseStyle = 'Standard',
    messages,
    filename,
  } = options;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 44;
  const contentWidth = pageWidth - margin * 2;
  let cursorY = margin;

  const drawHeader = (pageNum: number) => {
    // Header gradient style top line
    doc.setFillColor(79, 70, 229); // indigo-600
    doc.rect(0, 0, pageWidth, 6, 'F');

    if (pageNum > 1) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(99, 102, 241); // indigo-500
      doc.text('GEMINI ACADEMIC TUTOR SESSION', margin, 24);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(148, 163, 184);
      const safeTitle = chatTitle.length > 50 ? chatTitle.substring(0, 47) + '...' : chatTitle;
      doc.text(safeTitle, margin + 170, 24);

      doc.setDrawColor(226, 232, 240);
      doc.line(margin, 30, pageWidth - margin, 30);
    }
  };

  const drawFooter = (pageNum: number, totalPages: number) => {
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, pageHeight - 34, pageWidth - margin, pageHeight - 34);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text('AI Academic Chat Transcript • For Offline College Revision', margin, pageHeight - 20);

    const pageStr = `Page ${pageNum} of ${totalPages}`;
    const pageStrWidth = doc.getTextWidth(pageStr);
    doc.text(pageStr, pageWidth - margin - pageStrWidth, pageHeight - 20);
  };

  // --- Page 1 Header ---
  drawHeader(1);

  // Subject Badge
  doc.setFillColor(238, 242, 255); // indigo-50
  doc.setDrawColor(199, 210, 254); // indigo-200
  doc.roundedRect(margin, cursorY, 130, 20, 4, 4, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(67, 56, 202); // indigo-700
  doc.text(`SUBJECT: ${subject.toUpperCase()}`, margin + 8, cursorY + 13);
  cursorY += 30;

  // Chat Main Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(15, 23, 42); // slate-900
  const titleLines = wrapAndMeasureLines(doc, chatTitle, contentWidth);
  doc.text(titleLines, margin, cursorY);
  cursorY += titleLines.length * 22 + 4;

  // Subtitle / Session Meta Info Box
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(
    `Export Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} • AI Model: Gemini 3.8 Flash • Response Style: ${responseStyle}`,
    margin,
    cursorY
  );
  cursorY += 20;

  // Divider
  doc.setDrawColor(203, 213, 225);
  doc.line(margin, cursorY, pageWidth - margin, cursorY);
  cursorY += 20;

  const bottomThreshold = pageHeight - 50;
  const ensureSpace = (needed: number) => {
    if (cursorY + needed > bottomThreshold) {
      doc.addPage();
      cursorY = 46;
      drawHeader(doc.getNumberOfPages());
    }
  };

  // Iterate over messages
  for (let m = 0; m < messages.length; m++) {
    const msg = messages[m];
    const isUser = msg.role === 'user';

    ensureSpace(45);

    if (isUser) {
      // User Question Card
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(79, 70, 229); // indigo-600
      doc.text('STUDENT QUESTION:', margin, cursorY);
      cursorY += 12;

      // Question body inside light box
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(15, 23, 42);

      const qClean = cleanMarkdownText(msg.content);
      const qLines = wrapAndMeasureLines(doc, qClean, contentWidth - 20);
      const cardHeight = qLines.length * 14 + 16;

      ensureSpace(cardHeight + 10);

      doc.setFillColor(248, 250, 252); // slate-50
      doc.setDrawColor(203, 213, 225); // slate-300
      doc.roundedRect(margin, cursorY, contentWidth, cardHeight, 4, 4, 'FD');

      // Left bar
      doc.setFillColor(79, 70, 229);
      doc.rect(margin, cursorY, 3, cardHeight, 'F');

      doc.text(qLines, margin + 12, cursorY + 14);
      cursorY += cardHeight + 16;
    } else {
      // Gemini Assistant Response
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(13, 148, 136); // teal-600
      doc.text('GEMINI ACADEMIC EXPLANATION:', margin, cursorY);
      cursorY += 14;

      // Render assistant message line by line
      const rawLines = msg.content.split('\n');
      let inCode = false;
      let codeBuf: string[] = [];

      for (let i = 0; i < rawLines.length; i++) {
        const rawLine = rawLines[i];
        const trimmed = rawLine.trim();

        if (trimmed.startsWith('```')) {
          if (inCode) {
            const codeText = codeBuf.join('\n');
            doc.setFont('courier', 'normal');
            doc.setFontSize(8);
            const codeLines = doc.splitTextToSize(codeText, contentWidth - 24);
            const boxH = codeLines.length * 11 + 14;

            ensureSpace(boxH + 10);

            doc.setFillColor(30, 41, 59);
            doc.roundedRect(margin, cursorY, contentWidth, boxH, 4, 4, 'F');
            doc.setTextColor(248, 250, 252);
            doc.text(codeLines, margin + 10, cursorY + 12);

            cursorY += boxH + 10;
            codeBuf = [];
            inCode = false;
          } else {
            inCode = true;
            codeBuf = [];
          }
          continue;
        }

        if (inCode) {
          codeBuf.push(rawLine);
          continue;
        }

        if (!trimmed) {
          cursorY += 4;
          continue;
        }

        // Subheadings
        if (trimmed.startsWith('# ') || trimmed.startsWith('## ') || trimmed.startsWith('### ')) {
          ensureSpace(24);
          cursorY += 6;
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(10.5);
          doc.setTextColor(15, 23, 42);

          const hClean = cleanMarkdownText(trimmed.replace(/^#+\s*/, ''));
          const hLines = wrapAndMeasureLines(doc, hClean, contentWidth);
          doc.text(hLines, margin, cursorY);
          cursorY += hLines.length * 13 + 4;
          continue;
        }

        // List item
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          ensureSpace(14);
          const bulletClean = cleanMarkdownText(trimmed.replace(/^[-*]\s+/, ''));
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9);
          doc.setTextColor(30, 41, 59);

          doc.setFillColor(79, 70, 229);
          doc.circle(margin + 5, cursorY - 3, 1.8, 'F');

          const bLines = wrapAndMeasureLines(doc, bulletClean, contentWidth - 16);
          doc.text(bLines, margin + 14, cursorY);
          cursorY += bLines.length * 12 + 3;
          continue;
        }

        // Numbered list
        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (numMatch) {
          ensureSpace(14);
          const numLabel = `${numMatch[1]}.`;
          const itemText = cleanMarkdownText(numMatch[2]);

          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8.5);
          doc.setTextColor(79, 70, 229);
          doc.text(numLabel, margin + 2, cursorY);

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9);
          doc.setTextColor(30, 41, 59);

          const numW = doc.getTextWidth(numLabel) + 6;
          const itemLines = wrapAndMeasureLines(doc, itemText, contentWidth - numW);
          doc.text(itemLines, margin + numW, cursorY);
          cursorY += itemLines.length * 12 + 3;
          continue;
        }

        // Standard text
        ensureSpace(14);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(30, 41, 59);

        const cleanLine = cleanMarkdownText(trimmed);
        const pLines = wrapAndMeasureLines(doc, cleanLine, contentWidth);
        doc.text(pLines, margin, cursorY);
        cursorY += pLines.length * 12 + 4;
      }

      // Spacing and subtle divider between conversation turns
      cursorY += 12;
      doc.setDrawColor(241, 245, 249);
      doc.line(margin, cursorY, pageWidth - margin, cursorY);
      cursorY += 14;
    }
  }

  // Draw footers on all pages
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    drawFooter(p, totalPages);
  }

  const safeFilename = filename
    ? filename.endsWith('.pdf') ? filename : `${filename}.pdf`
    : `${chatTitle.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 30)}_Chat_Transcript.pdf`;

  doc.save(safeFilename);
}

/**
 * Exports a single QA explanation pair to a quick formatted PDF sheet
 */
export async function exportAnswerToPDF(
  question: string,
  answer: string,
  subject: string = 'General',
  filename?: string
): Promise<void> {
  await exportNoteToPDF({
    title: question,
    subtitle: 'Model Answer & Explanation for College Exams',
    category: subject,
    metadata: [
      { label: 'Subject', value: subject },
      { label: 'Format', value: 'Gemini Exam Answer' },
    ],
    content: answer,
    filename: filename || `${question.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 30)}_Model_Answer.pdf`,
    footerNote: 'Generated via Gemini Academic Assistant • Offline Study Sheet',
  });
}
