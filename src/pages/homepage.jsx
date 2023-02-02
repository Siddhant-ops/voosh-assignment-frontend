import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Container from "../components/container";
import { useAuth } from "../provider/authProvider";
import { getLocalStorage } from "../utils/auth.helper";

const Homepage = () => {
  const { userToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = userToken ?? getLocalStorage();
    if (token) navigate("/dashboard");
  }, []);

  return (
    <Container mainClass="h-[80vh] w-full grid place-items-center">
      <div className="text-center w-2/4">
        <h1 className="text-4xl font-bold text-red-400">Hola Amigo</h1>
        <p className="text-xl font-semibold text-gray-500 mt-2">
          Please{" "}
          <Link to="login" className="text-red-500 hover:text-red-600">
            login
          </Link>{" "}
          or{" "}
          <Link to="signup" className="text-red-500 hover:text-red-600">
            sign up
          </Link>{" "}
          to continue using this app.
        </p>
      </div>
    </Container>
  );
};

export default Homepage;
