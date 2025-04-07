import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { fetchEmployees } from "../redux/slices/employeeSlice";
import { handleLogout, isTokenExpired } from "../utils/auth";

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { employees, loading, error } = useSelector((state) => state.employee);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  useEffect(() => {
    const token = localStorage.getItem("token");

    // Check if token exists and is valid
    if (!token || isTokenExpired(token)) {
      handleLogout();
      return;
    }

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    dispatch(fetchEmployees())
      .unwrap()
      .catch((err) => {
        if (err.includes("Unauthorized") || err.includes("jwt expired")) {
          handleLogout();
        }
      });
  }, [dispatch, navigate, user, isAuthenticated]);

  // useEffect(() => {
  //   dispatch(getPortfolioByEmployeeId(user._id))
  //     .unwrap()
  //     .catch((err) => {
  //       if (err.includes("not found")) {
  //         console.log("No portfolio found - ready to create new one");
  //       } else {
  //         console.error("Failed to fetch portfolio:", err);
  //       }
  //     });
  // }, [dispatch, user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
        Error: {error}
      </div>
    );
  }

  if (!employees || employees.length === 0) {
    return (
      <div className="p-4 text-center">
        <h1 className="text-2xl font-semibold mb-4">Employee Dashboard</h1>
        <p className="text-gray-600">No employees found.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Employee Dashboard</h1>
      <div className="max-w-4xl mx-auto">
        <div className="space-y-4">
          {employees.map((emp) => (
            <div
              key={emp._id}
              className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{emp.username}</h3>
                  <p className="text-sm text-gray-600">{emp.email}</p>
                  <p className="text-sm text-gray-500">
                    Status:{" "}
                    {emp.hasPortfolio ? (
                      <span className="text-green-600">Has Portfolio</span>
                    ) : (
                      <span className="text-yellow-600">No Portfolio</span>
                    )}
                  </p>
                </div>
                {user?.role === "manager" && (
                  <Link
                    to={`/portfolio/${emp._id}`}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    {emp.hasPortfolio ? "Edit Portfolio" : "Create Portfolio"}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
