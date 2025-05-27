import { Route, Routes } from "react-router";
import Forms from "./Forms";
import FormBuilder from "./FormBuilder";

const FormsRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Forms />} />
      <Route path="/:formId" element={<FormBuilder />} />
    </Routes>
  );
};

export default FormsRouter;
