import React from 'react';
import { Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import { Placeholder } from '../../types/doc';

interface PlaceholderManagerProps {
	placeholders: Placeholder[];
}

const PlaceholderManager: React.FC<PlaceholderManagerProps> = ({
	placeholders,
}) => {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ delay: 0.1 }}
			className="bg-white rounded-lg shadow-apple p-4"
		>
			<h2 className="text-lg font-medium text-neutral-800 mb-4">
				Document Placeholders
			</h2>

			{placeholders.length === 0 ? (
				<div className="text-center py-6 text-neutral-500 bg-neutral-50 rounded-lg">
					No placeholders found in document.
					<p className="mt-2 text-sm">
						Add placeholders to mark where form data should be inserted.
					</p>
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
						</motion.li>
					))}
				</ul>
			)}
		</motion.div>
	);
};

export default PlaceholderManager;
