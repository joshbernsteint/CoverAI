import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from "./pages/Home";
import EditProfile from "./pages/EditProfile";
import NoPage from "./pages/NoPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="*" element={<NoPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
