import { Route, Routes } from 'react-router';
import TemplateManagement from '../templates/TemplateManagement';
import Templates from '../templates/Templates';

const TemplatesRouter = () => {
	return (
		<Routes>
			<Route
				path="/"
				element={<Templates />}
			/>
			<Route
				path=":id"
				element={<TemplateManagement />}
			/>
		</Routes>
	);
};

export default TemplatesRouter;
