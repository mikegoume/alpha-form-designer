import React from 'react';
import { motion } from 'framer-motion';
import { FileEdit, Save } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface DocumentEditorProps {
	content: string;
	setContent: (content: string) => void;
	onSave: (content: string) => void;
}

const DocumentEditor: React.FC<DocumentEditorProps> = ({
	content,
	setContent,
	onSave,
}) => {
	const handleSave = () => {
		onSave(content);
	};

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="bg-white rounded-lg shadow-apple overflow-hidden flex flex-col h-full"
		>
			<div className="border-b border-neutral-200 p-4 flex justify-between items-center">
				<div className="flex items-center gap-2">
					<FileEdit className="h-5 w-5 text-primary-500" />
					<h2 className="font-medium text-neutral-800">Document Editor</h2>
				</div>

				<button
					onClick={handleSave}
					className="bg-primary-500 text-white px-3 py-1.5 text-sm rounded flex items-center gap-1.5 hover:bg-primary-600 transition-colors"
				>
					<Save className="h-4 w-4" />
					Save Changes
				</button>
			</div>

			<div className="flex-1 min-h-[500px]">
				<ReactQuill
					value={content}
					onChange={(value) => setContent(value || '')}
				/>
			</div>
		</motion.div>
	);
};

export default DocumentEditor;
