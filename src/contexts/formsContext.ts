import { createContext } from 'react';
import { FormConfig } from '../types/form';

const FormsContext = createContext<{
	forms: FormConfig[];
	selectedFormId: string | null;
	onSaveForm: (form: FormConfig) => void;
	onSelectForm: (formId: string) => void;
}>({
	forms: [],
	selectedFormId: null,
	onSaveForm: () => {},
	onSelectForm: () => {},
});

export default FormsContext;
