import React, { useState } from 'react';
import { Plus, Tag, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Placeholder } from '../../types/doc';

interface PlaceholderManagerProps {
	placeholders: Placeholder[];
	onPlaceholderAdded: (name: string) => void;
	onPlaceholderRemoved: (id: string) => void;
}

const PlaceholderManager: React.FC<PlaceholderManagerProps> = ({
	placeholders,
	onPlaceholderAdded,
	onPlaceholderRemoved
}) => {
	const [newPlaceholder, setNewPlaceholder] = useState('');
	const [error, setError] = useState<string | null>(null);

	const handleAddPlaceholder = () => {
		if (!newPlaceholder.trim()) {
			setError('Please enter a placeholder name');
			return;
		}

		// Check for duplicates
		if (placeholders.some((p) => p.name === newPlaceholder)) {
			setError('This placeholder already exists');
			return;
		}

		onPlaceholderAdded(newPlaceholder);
		setNewPlaceholder('');
		setError(null);
	};

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ delay: 0.1 }}
			className="bg-white rounded-lg shadow-apple p-4"
		>
			<h2 className="text-lg font-medium text-neutral-800 mb-4">Document Placeholders</h2>

			<div className="flex gap-2 mb-4">
				<div className="flex-1 relative">
					<Tag className="absolute left-3 top-2.5 h-5 w-5 text-neutral-400" />
					<input
						type="text"
						value={newPlaceholder}
						onChange={(e) => setNewPlaceholder(e.target.value)}
						className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
						placeholder="New placeholder name"
						onKeyDown={(e) => e.key === 'Enter' && handleAddPlaceholder()}
					/>
				</div>
				<button
					onClick={handleAddPlaceholder}
					className="bg-primary-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-600 transition-colors"
				>
					<Plus className="h-5 w-5" />
					Add
				</button>
			</div>

			{error && <div className="mb-4 text-sm text-error-500">{error}</div>}

			{placeholders.length === 0 ? (
				<div className="text-center py-6 text-neutral-500 bg-neutral-50 rounded-lg">
					No placeholders found in document.
					<p className="mt-2 text-sm">Add placeholders to mark where form data should be inserted.</p>
				</div>
			) : (
				<ul className="space-y-2 max-h-[300px] overflow-y-auto">
					{placeholders.map((placeholder) => (
						<motion.li
							key={placeholder.id}
							initial={{ opacity: 0, x: -10 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: 10 }}
							className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg border border-neutral-200"
						>
							<div className="flex items-center gap-2">
								<Tag className="h-4 w-4 text-primary-500" />
								<span className="font-medium">{`{{${placeholder.name}}}`}</span>
							</div>
							<button
								onClick={() => onPlaceholderRemoved(placeholder.id)}
								className="text-neutral-400 hover:text-error-500 transition-colors"
							>
								<X className="h-4 w-4" />
							</button>
						</motion.li>
					))}
				</ul>
			)}
		</motion.div>
	);
};

export default PlaceholderManager;
