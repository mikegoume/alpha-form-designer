import React from 'react';
import {
	InputElement,
	ButtonElement,
	InputType,
	ButtonActionType,
} from '../../types/form';
import { buttonTypes, inputTypes } from '../../pages/forms/constants';
import {
	createButtonElement,
	createInputElement,
} from '../../pages/forms/helpers';

interface ElementsPanelProps {
	onAddElement: (element: InputElement | ButtonElement) => void;
}

const ElementsPanel: React.FC<ElementsPanelProps> = ({ onAddElement }) => {
	// Handle adding an input element
	const handleAddInput = (type: InputType) => {
		onAddElement(createInputElement(type));
	};

	// Handle adding a button element
	const handleAddButton = (actionType: ButtonActionType) => {
		onAddElement(createButtonElement(actionType));
	};

	return (
		<div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
			<div className="p-4 border-b border-gray-200 bg-gray-50">
				<h2 className="font-medium text-gray-700">Form Elements</h2>
			</div>

			{/* Input Elements Section */}
			<div className="p-4 border-b border-gray-200">
				<h3 className="text-sm font-medium text-gray-500 mb-3">Input Fields</h3>
				<div className="grid grid-cols-2 gap-2">
					{inputTypes.map((input) => (
						<button
							key={input.type}
							onClick={() => handleAddInput(input.type)}
							className="flex items-center p-2 border border-gray-200 rounded bg-white hover:bg-gray-50 transition-colors text-left"
						>
							<span className="mr-2 text-gray-500">{input.icon}</span>
							<span className="text-sm">{input.label}</span>
						</button>
					))}
				</div>
			</div>

			{/* Button Elements Section */}
			<div className="p-4">
				<h3 className="text-sm font-medium text-gray-500 mb-3">Buttons</h3>
				<div className="grid grid-cols-2 gap-2">
					{buttonTypes.map((button) => (
						<button
							key={button.actionType}
							onClick={() => handleAddButton(button.actionType)}
							className="flex items-center p-2 border border-gray-200 rounded bg-white hover:bg-gray-50 transition-colors text-left"
						>
							<span className="mr-2 text-gray-500">{button.icon}</span>
							<span className="text-sm">{button.label}</span>
						</button>
					))}
				</div>
			</div>
		</div>
	);
};

export default ElementsPanel;
