import { createContext, useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import {
  COLLECTIONS_ID_PROFILES,
  DEV_db_id,
  account,
  databases,
} from "../appwriteConfig";
import { ID } from "appwrite";
import Loading from "../components/Loading/Loading";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const signUpUser = async (userInfo) => {
    try {
      const res = await account.create(
        ID.unique(),
        userInfo.name,
        userInfo.email,
        userInfo.password
      );
      const accountDetails = await account.get();

      setUser(accountDetails);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  const loginUser = async (userInfo) => {
    try {
      const res = await account.createEmailSession(
        userInfo.email,
        userInfo.password
      );
      const accountDetails = await account.get();

      setUser(accountDetails);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  const logoutUser = async () => {
    try {
      await account.deleteSession("current");
      setUser(null);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getUserOnLoad();
  }, []);

  const getUserOnLoad = async () => {
    try {
      const accountDetails = await account.get();

      const profile = await databases.getDocument(
        DEV_db_id,
        COLLECTIONS_ID_PROFILES,
        accountDetails?.$id
      );

      accountDetails["profile"] = profile;

      setUser(accountDetails);
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  const contextDate = {
    user,
    loginUser,
    logoutUser,
    signUpUser,
  };

  return (
    <AuthContext.Provider value={contextDate}>
      {loading ? <Loading /> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;
