import {
	ButtonActionType,
	ButtonElement,
	InputElement,
	InputType,
} from '../../types/form';
import { v4 as uuidv4 } from 'uuid';

// Create a base input element
export const createInputElement = (
	type: InputType,
	label?: string,
): InputElement => ({
	id: uuidv4(),
	type,
	label: label ?? `${type.charAt(0).toUpperCase() + type.slice(1)} Input`,
	key: `${label}`,
	placeholder: `Enter ${type}...`,
	order: 0,
	required: false,
	options:
		type === 'select' || type === 'radio'
			? [
					{ label: 'Option 1', value: 'option1' },
					{ label: 'Option 2', value: 'option2' },
				]
			: undefined,
});

// Create a base button element
export const createButtonElement = (
	actionType: ButtonActionType,
): ButtonElement => ({
	id: uuidv4(),
	type: 'button',
	label: actionType.charAt(0).toUpperCase() + actionType.slice(1),
	actionType,
	order: 0,
	variant: 'primary',
	size: 'md',
	apiConfig:
		actionType === 'api'
			? {
					url: 'https://api.example.com/data',
					method: 'GET',
					headers: { 'Content-Type': 'application/json' },
					responseMapping: {},
				}
			: undefined,
});
