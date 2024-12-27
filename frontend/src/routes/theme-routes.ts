import { useRoutes } from "react-router-dom";

import ProtectedRoutes from "./protected-routes";
import PublicRoutes from "./public-routes";

export default function ThemeRoutes() {
  return useRoutes([ProtectedRoutes, PublicRoutes]);
}
