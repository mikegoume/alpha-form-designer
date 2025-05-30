import { Route, Routes } from 'react-router';
import TemplateManagement from '../templates/TemplateManagement';
import Templates from '../templates/Templates';
import TemplateUploadScreen from './TemplateUploadScreen';
import TemplateFillForm from './TemplateFillForm';

const TemplatesRouter = () => {
	return (
		<Routes>
			<Route path="/" element={<Templates />} />
			<Route path="/upload" element={<TemplateUploadScreen />} />
			<Route path="/:id" element={<TemplateManagement />} />
			<Route path="/:id/fill" element={<TemplateFillForm />} />
		</Routes>
	);
};

export default TemplatesRouter;
