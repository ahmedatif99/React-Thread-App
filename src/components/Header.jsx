import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogOut } from "react-feather";

const Header = () => {
  const { user, logoutUser } = useAuth();

  return (
    <div className="flex items-center justify-between py-10 px-4">
      <Link to={"/"}>
        <strong className="text-4xl outline-none text-white">@</strong>
      </Link>
      {user && (
        <div className="flex items-center gap-5">
          <Link to={`/@${user?.profile?.username}`}>
            <img
              className="h-10 w-10 rounded-full object-cover"
              src={user?.profile?.profile_pic}
              alt="Profile"
            />
          </Link>
          <strong>Hello {user?.name}</strong>
        </div>
      )}
      {user ? (
        <button
          onClick={logoutUser}
          className="flex items-center gap-1 bg-white text-black py-2 px-4 border text-xs border-black rounded"
        >
          <LogOut size={16} />
          Logout
        </button>
      ) : (
        <div className="flex items-center justify-center gap-5">
          <Link
            to={"/login"}
            className="bg-white text-black py-2 px-4 border text-sm border-black rounded"
          >
            Login
          </Link>
        </div>
      )}
    </div>
  );
};

export default Header;
