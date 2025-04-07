import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/slices/authSlice";
import { FaUser, FaSignOutAlt, FaUserTie, FaBriefcase } from "react-icons/fa";

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-indigo-600">
                GeeksInstitute
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {!user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <FaUser className="mr-2" />
                  Login
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <FaUserTie className="mr-2" />
                  Register
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                {user.role === "manager" && (
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 focus:outline-none focus:text-indigo-600"
                  >
                    <FaUserTie className="mr-2" />
                    Dashboard
                  </Link>
                )}
                {user.role === "employee" && (
                  <Link
                    to="/my-portfolio"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 focus:outline-none focus:text-indigo-600"
                  >
                    <FaBriefcase className="mr-2" />
                    My Portfolio
                  </Link>
                )}
                <div className="flex items-center space-x-3 border-l pl-4">
                  <span className="text-sm font-medium text-gray-700">
                    {user.username}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <FaSignOutAlt className="mr-2" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
