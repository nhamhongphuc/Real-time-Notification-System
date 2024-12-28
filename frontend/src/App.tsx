import React from "react";
import { BrowserRouter } from "react-router-dom";

import ThemeRoutes from "./routes/theme-routes";

export default function App() {
  // return (<Routes />);
  return (
    <BrowserRouter>
      <ThemeRoutes />
    </BrowserRouter>
  );
}
