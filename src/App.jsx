import { Routes, Route } from "react-router-dom";
import Feed from "./pages/Feed";

const App = () => {
  return (
    <div>
    <Routes>
      <Route path="/" element={<Feed />} />
    </Routes>
    </div>
  );
};

export default App;
