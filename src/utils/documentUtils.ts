import mammoth from 'mammoth';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';
import { Placeholder } from '../types/doc';

export const convertDocxToHtml = async (arrayBuffer: ArrayBuffer): Promise<string> => {
	const result = await mammoth.convertToHtml({ arrayBuffer });
	return result.value;
};

export const extractPlaceholders = (htmlContent: string): Placeholder[] => {
	const regex = /\{\{([^}]+)\}\}/g;
	const matches = htmlContent.matchAll(regex);
	const placeholders: Placeholder[] = [];
	const uniqueNames = new Set<string>();

	for (const match of matches) {
		const name = match[1].trim();

		if (!uniqueNames.has(name)) {
			uniqueNames.add(name);
			placeholders.push({
				id: `placeholder-${placeholders.length + 1}`,
				name,
				defaultValue: ''
			});
		}
	}

	return placeholders;
};

export const fillPlaceholders = (htmlContent: string, data: Record<string, string>): string => {
	let filledContent = htmlContent;

	Object.entries(data).forEach(([key, value]) => {
		const placeholder = `{{${key}}}`;
		const regex = new RegExp(placeholder, 'g');
		filledContent = filledContent.replace(regex, value);
	});

	return filledContent;
};

const convertHtmlToDocxParagraphs = (htmlContent: string): Paragraph[] => {
	const parser = new DOMParser();
	const doc = parser.parseFromString(htmlContent, 'text/html');
	const paragraphs: Paragraph[] = [];

	const createTextRuns = (node: Node): TextRun[] => {
		const runs: TextRun[] = [];

		node.childNodes.forEach((child) => {
			if (child.nodeType === Node.TEXT_NODE) {
				const text = child.textContent?.trim();

				if (text) runs.push(new TextRun(text));
			} else if (child.nodeType === Node.ELEMENT_NODE) {
				const el = child as HTMLElement;
				const text = el.textContent?.trim();

				if (!text) return;

				switch (el.tagName.toLowerCase()) {
					case 'strong':
						runs.push(new TextRun({ text, bold: true }));
						break;
					case 'em':
						runs.push(new TextRun({ text, italics: true }));
						break;
					default:
						runs.push(...createTextRuns(el));
				}
			}
		});

		return runs;
	};

	doc.body.childNodes.forEach((node) => {
		if (node.nodeType !== Node.ELEMENT_NODE) return;

		const el = node as HTMLElement;

		switch (el.tagName.toLowerCase()) {
			case 'p':
				paragraphs.push(new Paragraph({ children: createTextRuns(el) }));
				break;
			case 'h1':
				paragraphs.push(
					new Paragraph({
						heading: HeadingLevel.HEADING_1,
						children: createTextRuns(el)
					})
				);
				break;
			case 'h2':
				paragraphs.push(
					new Paragraph({
						heading: HeadingLevel.HEADING_2,
						children: createTextRuns(el)
					})
				);
				break;
			case 'ul':
			case 'ol':
				el.querySelectorAll('li').forEach((li) => {
					paragraphs.push(
						new Paragraph({
							text: li.textContent?.trim() || '',
							bullet: { level: 0 }
						})
					);
				});
				break;
			default:
				if (el.textContent?.trim()) {
					paragraphs.push(new Paragraph({ children: createTextRuns(el) }));
				}
		}
	});

	return paragraphs;
};

export const generateDocument = async (htmlContent: string, formData: Record<string, string>): Promise<Blob> => {
	const filledContent = fillPlaceholders(htmlContent, formData);
	const paragraphs = convertHtmlToDocxParagraphs(filledContent);

	const doc = new Document({
		sections: [
			{
				properties: {},
				children: paragraphs
			}
		]
	});

	return await Packer.toBlob(doc);
};

export const downloadDocument = (blob: Blob, fileName: string) => {
	saveAs(blob, fileName);
};
