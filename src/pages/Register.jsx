import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const Register = () => {
  const signUpForm = useRef(null);
  const navigate = useNavigate();

  const { signUpUser, user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const name = signUpForm.current.name.value;
    const email = signUpForm.current.email.value;
    const password = signUpForm.current.password.value;
    signUpUser({ name, email, password });
  };
  return (
    <div className="rounded-md border border-[rgba(49,49,50,1)] p-4">
      <form ref={signUpForm} onSubmit={handleSubmit}>
        <div className="py-4">
          <label>Name: </label>
          <input
            className="w-full p-2 rounded-sm"
            required
            type="text"
            name="name"
            placeholder="Enter Your Name..."
          />
        </div>

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
            value="Sign Up"
            className="bg-white cursor-pointer text-black py-2 px-4 text-sm border border-black rounded"
          />
        </div>
      </form>

      <p>
        Already have an account? <Link to={"/login"}>Login</Link>
      </p>
    </div>
  );
};
export default Register;
