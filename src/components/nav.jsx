import { useNavigate } from "react-router-dom";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../provider/authProvider";

const links = [
  { name: "sign-up", href: "/signup" },
  { name: "login", href: "/login" },
];

const Nav = () => {
  const { userToken, removeToken } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="mx-auto flex max-w-7xl items-center justify-between pb-8 capitalize tracking-wide text-lg font-semibold text-lg">
      <Link to={userToken ? "/dashboard" : "/"}>Order.it</Link>
      <div className="flex gap-4">
        {userToken === null ? (
          links.map((link, index) => (
            <NavLink
              to={link.href}
              key={index}
              style={({ isActive }) => {
                return {
                  textDecoration: isActive ? "underline" : "none",
                };
              }}
            >
              {link.name}
            </NavLink>
          ))
        ) : (
          <button
            onClick={() => removeToken(navigate)}
            className="px-4 py-2 bg-red-400 text-white rounded-md"
          >
            logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Nav;
