import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

const Login = () => {
  const loginForm = useRef(null);
  const navigate = useNavigate();

  const { loginUser, user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const email = loginForm.current.email.value;
    const password = loginForm.current.password.value;
    loginUser({ email, password });
  };
  return (
    <div className="rounded-md border border-[rgba(49,49,50,1)] p-4">
      <form ref={loginForm} onSubmit={handleSubmit}>
        <div className="py-4">
          <label>Email: </label>
          <input
            className="w-full p-2 rounded-sm"
            required
            type="email"
            name="email"
            placeholder="Enter Your email..."
          />
        </div>

        <div className="py-4">
          <label>Password: </label>
          <input
            className="w-full p-2 rounded-sm"
            required
            type="password"
            name="password"
            placeholder="Enter Your password..."
          />
        </div>

        <div className="py-4">
          <input
            type="submit"
            value="Login"
            className="bg-white text-black py-2 px-4 text-sm border border-black rounded"
          />
        </div>
      </form>

      <p>
        Dont have an account? <Link to={"/register"}>Register here</Link>
      </p>
    </div>
  );
};

export default Login;
