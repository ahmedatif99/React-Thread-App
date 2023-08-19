import { Routes, Route } from "react-router-dom";
import Feed from "./pages/Feed";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ThreadPage from "./pages/ThreadPage";
import MainLayout from "./components/MainLayout";
import EditProfile from "./pages/EditProfile";

const App = () => {
  return (
    <div>
      <MainLayout>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/:username" element={<Profile />} />
          <Route path="/edit/:username" element={<EditProfile />} />
          <Route path="/:username/post/:id" element={<ThreadPage />} />
          <Route path="/" element={<Feed />} />
        </Routes>
      </MainLayout>
    </div>
  );
};

export default App;
