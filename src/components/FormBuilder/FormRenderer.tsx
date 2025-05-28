/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { InputElement, ButtonElement } from '../../types/form';

interface FormRendererProps {
	element: InputElement | ButtonElement;
	value?: any;
	onChange?: (value: any) => void;
	onButtonClick?: () => void;
}

const FormRenderer: React.FC<FormRendererProps> = ({ element, value, onChange, onButtonClick }) => {
	// Render a button element
	if ('actionType' in element) {
		const { label, variant = 'primary', size = 'md' } = element;

		// Button style classes based on variant and size
		const variantClasses = {
			primary: 'bg-blue-500 hover:bg-blue-600 text-white',
			secondary: 'bg-purple-500 hover:bg-purple-600 text-white',
			outline: 'bg-white border-2 border-blue-500 text-blue-500 hover:bg-blue-50',
			ghost: 'bg-transparent text-blue-500 hover:bg-blue-50'
		};

		const sizeClasses = {
			sm: 'px-3 py-1 text-sm',
			md: 'px-4 py-2',
			lg: 'px-6 py-3 text-lg'
		};

		return (
			<button
				className={`rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 
          ${variantClasses[variant]} ${sizeClasses[size]}`}
				onClick={onButtonClick}
			>
				{label}
			</button>
		);
	}

	// Render input elements
	const { type, label, key, placeholder, required, options = [] } = element;

	// Common input classes
	const inputClasses =
		'w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500';

	// Label component
	const LabelComponent = () => (
		<label
			htmlFor={key}
			className="block text-sm font-medium text-gray-700 mb-1"
		>
			{label} {required && <span className="text-red-500">*</span>}
		</label>
	);

	switch (type) {
		case 'text':
		case 'email':
		case 'password':
		case 'number':
		case 'date':
			return (
				<div>
					<LabelComponent />
					<input
						type={type}
						id={key}
						name={key}
						placeholder={placeholder}
						value={value || ''}
						onChange={(e) => onChange && onChange(e.target.value)}
						required={required}
						className={inputClasses}
					/>
				</div>
			);

		case 'textarea':
			return (
				<div>
					<LabelComponent />
					<textarea
						id={key}
						name={key}
						placeholder={placeholder}
						value={value || ''}
						onChange={(e) => onChange && onChange(e.target.value)}
						required={required}
						rows={4}
						className={inputClasses}
					></textarea>
				</div>
			);

		case 'select':
			return (
				<div>
					<LabelComponent />
					<select
						id={key}
						name={key}
						value={value || ''}
						onChange={(e) => onChange && onChange(e.target.value)}
						required={required}
						className={inputClasses}
					>
						<option value="">{placeholder || 'Select an option'}</option>
						{options.map((option) => (
							<option
								key={option.value}
								value={option.value}
							>
								{option.label}
							</option>
						))}
					</select>
				</div>
			);

		case 'checkbox':
			return (
				<div className="flex items-center">
					<input
						type="checkbox"
						id={key}
						name={key}
						checked={!!value}
						onChange={(e) => onChange && onChange(e.target.checked)}
						required={required}
						className="h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300 rounded"
					/>
					<label
						htmlFor={key}
						className="ml-2 block text-sm text-gray-700"
					>
						{label}
					</label>
				</div>
			);

		case 'radio':
			return (
				<div>
					<div className="text-sm font-medium text-gray-700 mb-1">
						{label} {required && <span className="text-red-500">*</span>}
					</div>
					<div className="space-y-2">
						{options.map((option) => (
							<div
								key={option.value}
								className="flex items-center"
							>
								<input
									type="radio"
									id={`${key}_${option.value}`}
									name={key}
									value={option.value}
									checked={value === option.value}
									onChange={() => onChange && onChange(option.value)}
									required={required}
									className="h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300"
								/>
								<label
									htmlFor={`${key}_${option.value}`}
									className="ml-2 block text-sm text-gray-700"
								>
									{option.label}
								</label>
							</div>
						))}
					</div>
				</div>
			);

		default:
			return null;
	}
};

export default FormRenderer;
