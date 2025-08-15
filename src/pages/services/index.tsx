import { Route, Routes } from "react-router";

import Services from "./Services";

const ServicesRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Services />} />
    </Routes>
  );
};

export default ServicesRouter;
