import { Route, Routes } from "react-router";

import FormBuilder from "./FormBuilder";
import Forms from "./Forms";

const FormsRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Forms />} />
      <Route path="/:formId" element={<FormBuilder />} />
    </Routes>
  );
};

export default FormsRouter;
