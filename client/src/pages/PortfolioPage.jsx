import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  getEmployeeById,
  getPortfolioByEmployeeId,
} from "../redux/slices/employeeSlice";
import PortfolioForm from "./PortfolioForm";

export default function PortfolioPage() {
  const { employeeId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedEmployee, loading, error } = useSelector(
    (state) => state.employee
  );
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user || user.role !== "manager") {
      navigate("/login");
      return;
    }
    // console.log("PortfolioPage:", portfolio);
    // First get employee details
    dispatch(getEmployeeById(employeeId))
      .unwrap()
      .then(() => {
        // Then try to get their portfolio if it exists
        dispatch(getPortfolioByEmployeeId(employeeId))
          .unwrap()
          .catch((err) => {
            // If portfolio doesn't exist, that's okay - we'll create one
            if (err.includes("not found")) {
              console.log("No portfolio found - ready to create new one");
            }
          });
      })
      .catch((err) => {
        console.error("Failed to fetch employee:", err);
      });
  }, [dispatch, employeeId, navigate, user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Only show error if it's not a "portfolio not found" error
  if (error && !error.includes("not found")) {
    return (
      <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="text-indigo-600 hover:text-indigo-800"
        >
          ← Back to Dashboard
        </button>
      </div>

      {selectedEmployee && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            {/* <h1 className="text-2xl font-semibold">
              {portfolio ? "Edit Portfolio" : "Create New Portfolio"}
            </h1> */}
            <p className="text-gray-600">
              Employee: {selectedEmployee.username}
            </p>
          </div>

          <PortfolioForm
            employeeId={employeeId}
            // existingData={portfolio.portfolio}
          />
        </div>
      )}
    </div>
  );
}
