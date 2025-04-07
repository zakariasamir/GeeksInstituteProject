import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import MyPortfolio from "./pages/MyPortfolio";
import PortfolioPage from "./pages/PortfolioPage";
import PrivateRoute from "./router/PrivateRoute";
import RoleBasedRoute from "./router/RoleBasedRoute";
import Navbar from "./components/Navbar";
import AuthProvider from "./components/AuthProvider";

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <RoleBasedRoute allowedRoles={["manager"]}>
                      <Dashboard />
                    </RoleBasedRoute>
                  </PrivateRoute>
                }
              />
              <Route
                path="/my-portfolio"
                element={
                  <PrivateRoute>
                    <RoleBasedRoute allowedRoles={["employee"]}>
                      <MyPortfolio />
                    </RoleBasedRoute>
                  </PrivateRoute>
                }
              />
              <Route
                path="/portfolio/:employeeId"
                element={
                  <PrivateRoute>
                    <RoleBasedRoute allowedRoles={["manager"]}>
                      <PortfolioPage />
                    </RoleBasedRoute>
                  </PrivateRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}
