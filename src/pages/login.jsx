import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Container from "../components/container";
import { handleResponse, makeReq } from "../utils/db.helper";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { getLocalStorage, setLocalStorage } from "../utils/auth.helper";
import { useAuth } from "../provider/authProvider";

const Login = () => {
  const { userToken, setToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = userToken ?? getLocalStorage();
    if (token) navigate("/dashboard");
  }, []);

  const [formState, setFormState] = useState({
    phone: "",
    password: "",
  });
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resObj = await makeReq("auth/login-user", "POST", formState);

    const res = handleResponse(resObj, enqueueSnackbar);
    if (res) {
      const token = res?.token;
      setLocalStorage(token);
      setToken(token);
      enqueueSnackbar("Login successful", {
        variant: "success",
      });
      navigate("/");
      return;
    }

    return;
  };

  return (
    <Container mainClass="sm:flex w-full h-[80vh]">
      <div className="w-1/2 h-full hidden sm:grid sm:place-items-center">
        <div className="imgContainer overflow-hidden h-full rounded-2xl">
          <img
            src="https://images.unsplash.com/photo-1584985429926-08867327d3a6"
            alt="login"
            loading="lazy"
            className="h-full object-cover"
            title="Photo by Everyday basics - Unsplash"
          />
        </div>
      </div>
      <div className="formContainer w-1/2 h-full grid place-items-center">
        <form className="w-4/6" onSubmit={handleSubmit}>
          <h1 className="text-5xl font-medium">Login</h1>
          <div className="my-4">
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
              Phone Number
            </label>
            <div className="mt-1">
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                required
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={formState.phone}
                onChange={(e) =>
                  setFormState((prevState) => ({
                    ...prevState,
                    phone: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={formState.password}
                onChange={(e) =>
                  setFormState((prevState) => ({
                    ...prevState,
                    password: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          <div className="mb-4">
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-400 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 ease-in-out"
            >
              Login
            </button>
          </div>
          <p className="mt-4">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-red-700 hover:text-indigo-500 transition-all duration-300 ease-in-out font-medium"
            >
              sign-up
            </Link>
          </p>
        </form>
      </div>
    </Container>
  );
};

export default Login;
