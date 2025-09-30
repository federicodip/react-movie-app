import { Routes, Route } from "react-router-dom";
import Favorites from "./pages/Favorites";
import { MovieProvider } from "./context/MovieContext";
import "./css/App.css";

import Home from "./pages/Home";
import NavBar from "./components/NavBar";
import Details from "./pages/Details"; // ⟵ add

function App() {
  return (
    <MovieProvider>
      <NavBar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/movie/:id" element={<Details />} /> {/* ⟵ add */}
        </Routes>
      </main>
    </MovieProvider>
  );
}

export default App;
