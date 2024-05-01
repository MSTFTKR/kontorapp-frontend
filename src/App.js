import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./pages/homepage";
import Loginpage from "./pages/loginpage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Loginpage/>} />
        <Route path="/anasayfa" element={<Homepage/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
