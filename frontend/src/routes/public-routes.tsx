import { GuestGuard } from "../components/Guards";
import Signin from "../pages/Auth/signin";
import SignUp from "../pages/Auth/signup";

const PublicRoutes = {
  path: "/",
  children: [
    {
      path: "/",
      children: [
        {
          path: "signin",
          element: (
            <GuestGuard>
              <Signin />
            </GuestGuard>
          ),
        },
        {
          path: "signup",
          element: (
            <GuestGuard>
              <SignUp />
            </GuestGuard>
          ),
        },
      ],
    },
  ],
};

export default PublicRoutes;
