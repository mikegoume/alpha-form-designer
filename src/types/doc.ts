export interface Placeholder {
	id: string;
	name: string;
	defaultValue?: string;
}

export interface FormField {
	id: string;
	type: 'text' | 'number' | 'select' | 'checkbox' | 'date';
	label: string;
	placeholder?: string;
	options?: string[];
	required?: boolean;
	defaultValue?: string | number | boolean;
}

export interface JsonFormData {
	title: string;
	fields: FormField[];
}

export interface DocumentData {
	id: string;
	file: File;
	content: string;
	fileName: string;
	placeholders: Placeholder[];
}
