import React from 'react';
import { FileText, Settings } from 'lucide-react';

const Header: React.FC = () => {
	return (
		<header className="bg-white border-b border-neutral-200 shadow-sm py-4 px-6">
			<div className="container mx-auto flex justify-between items-center">
				<div className="flex items-center gap-2">
					<FileText className="text-primary-500 h-6 w-6" />
					<h1 className="text-xl font-semibold text-neutral-800">DocForm Builder</h1>
				</div>
				<div className="flex items-center gap-4">
					<button className="p-2 text-neutral-600 hover:text-primary-500 transition-colors">
						<Settings className="h-5 w-5" />
					</button>
				</div>
			</div>
		</header>
	);
};

export default Header;
