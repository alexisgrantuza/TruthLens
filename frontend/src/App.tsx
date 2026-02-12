import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import SignUp from "@/pages/SignUp";
import Gallary from "./pages/Gallary";
import ProtectedRoute from "./components/ProtectedRoutes";
import Dashboard from "./pages/TruthLens";
import Capture from "./pages/Capture";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/get-started" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/gallary"
          element={
            <ProtectedRoute>
              <Gallary />
            </ProtectedRoute>
          }
        />
        <Route
          path="/TruthLens"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/capture"
          element={
            <ProtectedRoute>
              <Capture />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}
