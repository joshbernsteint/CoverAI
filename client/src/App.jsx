import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Test from "./pages/Test";
import Home from "./pages/Home";
import About from "./pages/About";
import CoverLetterEditor from "./pages/CoverLetterEditor";

function App() {
  return (
    <>
      <BrowserRouter>
        <h1 className="text-3xl font-bold underline purple"> goodbye </h1>
        hello
        <Routes>
          <Route path="/test" element={<Test />} />
          <Route path="/" element={<Home />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/coverlettereditor" element={<CoverLetterEditor />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
