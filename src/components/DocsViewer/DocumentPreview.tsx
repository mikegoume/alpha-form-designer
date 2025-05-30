import React, { useContext, useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { Eye, Edit, DownloadIcon, FormInput } from 'lucide-react';
import { renderAsync } from 'docx-preview';
import { DocumentData } from '../../types/doc';
import TemplatesContext from '../../contexts/templatesContext';
import { useNavigate } from 'react-router';
import { TextField } from '@mui/material';

interface DocumentPreviewProps {
	document: DocumentData;
	onExport?: () => void;
	onEdit?: () => void;
	onEditDocumentName: (newName: string) => void;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({
	document,
	//   onExport,
	onEdit,
	onEditDocumentName,
}) => {
	const contextData = useContext(TemplatesContext);
	const onSaveTemplate = contextData?.onSaveTemplate;
	const uploadedDocument = contextData?.uploadedDocument;

	const isUploading = useMemo(() => !!uploadedDocument, [uploadedDocument]);

	const navigate = useNavigate();

	const contentRef = useRef<HTMLDivElement>(null);

	function handleSaveDcument() {
		onSaveTemplate({ ...document });

		navigate('/templates');
	}

	useEffect(() => {
		if (document.file && contentRef.current) {
			const arrayBuffer = document.file.arrayBuffer();
			renderAsync(arrayBuffer, contentRef.current);
		}
	}, [document.file]);

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ delay: 0.2 }}
			className="bg-white rounded-lg shadow-apple overflow-hidden flex flex-col h-full"
		>
			<div className="border-b border-neutral-200 p-4 flex justify-between items-center">
				<div>
					<div className="flex items-center gap-2">
						<Eye className="h-5 w-5 text-primary-500" />
						<h2 className="font-medium text-neutral-800">Document Preview</h2>
					</div>
					{isUploading && (
						<TextField
							onChange={(e) => onEditDocumentName(e.target.value)}
							value={document.metadata.fileName}
						/>
					)}
				</div>
				<div className="flex items-center gap-2">
					{isUploading ? (
						<button
							onClick={handleSaveDcument}
							className="bg-primary-500 text-white px-3 py-1.5 text-sm rounded flex items-center gap-1.5 hover:bg-primary-600 transition-colors"
						>
							<DownloadIcon className="h-4 w-4" />
							Save
						</button>
					) : (
						<>
							<button
								onClick={() => navigate('fill')}
								className="text-neutral-600 hover:text-primary-500 px-3 py-1.5 text-sm rounded flex items-center gap-1.5 transition-colors"
							>
								<FormInput className="h-4 w-4" />
								Fill
							</button>
							<button
								onClick={onEdit}
								className="text-neutral-600 hover:text-primary-500 px-3 py-1.5 text-sm rounded flex items-center gap-1.5 transition-colors"
							>
								<Edit className="h-4 w-4" />
								Edit
							</button>
							{/* <button
                onClick={onExport}
                className="bg-primary-500 text-white px-3 py-1.5 text-sm rounded flex items-center gap-1.5 hover:bg-primary-600 transition-colors"
              >
                <Download className="h-4 w-4" />
                Export
              </button> */}
						</>
					)}
				</div>
			</div>
			<div
				className="flex-1 overflow-auto p-6 bg-neutral-50"
				ref={contentRef}
			/>
		</motion.div>
	);
};

export default DocumentPreview;
