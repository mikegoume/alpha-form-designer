import React, { useRef, useState } from 'react';
import { Upload, FileUp, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface DocumentUploaderProps {
	onFileSelect: (file: File) => void;
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({ onFileSelect }) => {
	const [isDragging, setIsDragging] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setIsDragging(true);
	};

	const handleDragLeave = () => {
		setIsDragging(false);
	};

	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setIsDragging(false);

		if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
			validateAndProcessFile(e.dataTransfer.files[0]);
		}
	};

	const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			validateAndProcessFile(e.target.files[0]);
		}
	};

	const validateAndProcessFile = (file: File) => {
		setError(null);

		// Check if file is a .docx file
		if (!file.name.endsWith('.docx')) {
			setError('Please upload a .docx file');
			return;
		}

		onFileSelect(file);
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
			className="w-full"
		>
			<div
				onClick={() => fileInputRef.current?.click()}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
				className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
					isDragging
						? 'border-primary-500 bg-primary-50'
						: 'border-neutral-300 hover:border-primary-400 hover:bg-neutral-50'
				}`}
			>
				<input
					type="file"
					ref={fileInputRef}
					onChange={handleFileInputChange}
					accept=".docx"
					className="hidden"
				/>

				<div className="flex flex-col items-center gap-3">
					<div className="bg-primary-100 p-3 rounded-full">
						<Upload className="h-8 w-8 text-primary-500" />
					</div>
					<div>
						<p className="text-lg font-medium text-neutral-800">Upload your DOCX document</p>
						<p className="text-neutral-500 mt-1">Drag and drop your file here, or click to select</p>
					</div>
					<button className="mt-4 bg-primary-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-600 transition-colors">
						<FileUp className="h-4 w-4" />
						Select File
					</button>
				</div>
			</div>

			{error && (
				<div className="mt-4 p-4 bg-error-500/10 border border-error-500/20 rounded-lg flex items-center gap-3 text-error-500">
					<AlertCircle className="h-5 w-5 flex-shrink-0" />
					<p>{error}</p>
				</div>
			)}
		</motion.div>
	);
};

export default DocumentUploader;
