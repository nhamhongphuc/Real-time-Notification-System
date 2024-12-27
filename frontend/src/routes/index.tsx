import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import Protected from "./protected";
import { isAuthenticated } from "./helpers";
import Home from "../pages/home";
import Signin from "../pages/Auth/signin";
import Signup from "../pages/Auth/signup";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/">
        <Route element={<Protected />}>
          <Route index element={<Home />} />
        </Route>
        <Route
          path="signin"
          element={<Signin />}
          loader={async () => await isAuthenticated()}
        />
        <Route
          path="signup"
          element={<Signup />}
          loader={async () => await isAuthenticated()}
        />
        <Route path="*" element={<h1>Page not found</h1>} />
      </Route>
    </>
  )
);

const Index = () => {
  return (
    <>
      <RouterProvider router={router} />;
    </>
  );
};

export default Index;
