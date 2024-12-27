import React from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  children: React.ReactElement | null;
}

const AuthGuard: React.FC<Props> = ({ children }) => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  React.useEffect(() => {
    if (!token) {
      navigate("/signin");
    }
  }, [navigate, token]);

  if (!token) return <>...loading</>;

  return children;
};

export default AuthGuard;
