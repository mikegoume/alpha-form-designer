import React from 'react';
import { NavLink } from 'react-router';
import { FileText, Layout as LayoutIcon, FileInput } from 'lucide-react';

interface LayoutProps {
	children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
	return (
		<div className="min-h-screen flex">
			{/* Sidebar */}
			<aside className="w-64 bg-white border-r border-neutral-200">
				<div className="p-4 border-b border-neutral-200">
					<div className="flex items-center gap-2">
						<FileText className="text-primary-500 h-6 w-6" />
						<h1 className="text-xl font-semibold text-neutral-800">DocForm</h1>
					</div>
				</div>

				<nav className="p-4 space-y-2">
					<NavLink
						to="/templates"
						className={({ isActive }) =>
							`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
								isActive ? 'bg-primary-50 text-primary-500' : 'text-neutral-600 hover:bg-neutral-50'
							}`
						}
					>
						<LayoutIcon className="h-5 w-5" />
						Templates
					</NavLink>

					<NavLink
						to="/forms"
						className={({ isActive }) =>
							`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
								isActive ? 'bg-primary-50 text-primary-500' : 'text-neutral-600 hover:bg-neutral-50'
							}`
						}
					>
						<FileInput className="h-5 w-5" />
						Forms
					</NavLink>
				</nav>
			</aside>

			{/* Main Content */}
			<main className="flex-1 bg-neutral-50">
				<div className="">{children}</div>
			</main>
		</div>
	);
};

export default Layout;
