import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPortfolioByEmployeeId } from "../redux/slices/employeeSlice";
import { handleLogout } from "../utils/auth";

export default function MyPortfolio() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { portfolio, loading, error } = useSelector((state) => state.employee);
  console.log("User from Redux:", user);
  console.log("Portfolio from Redux:", portfolio);
  useEffect(() => {
    console.log("Fetching portfolio for user:", user);
    if (user?._id) {
      dispatch(getPortfolioByEmployeeId(user._id))
        .unwrap()
        .catch((err) => {
          if (err.includes("Unauthorized")) {
            handleLogout();
          }
        });
    }
  }, [dispatch, user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error && !error.includes("not found")) {
    return (
      <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
        Error: {error}
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="text-center mt-10 p-6">
        <p className="text-xl text-gray-600 mb-4">No portfolio found.</p>
        <p className="text-gray-500">
          Please contact your manager to create your portfolio.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Portfolio</h1>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex items-center space-x-6 mb-6">
            {portfolio.portfolio.picture && (
              <img
                src={portfolio.portfolio.picture}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-100 shadow"
              />
            )}
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {portfolio.portfolio.name}
              </h2>
              <p className="text-indigo-600 font-medium">
                {portfolio.portfolio.position}
              </p>
            </div>
          </div>

          <div className="prose max-w-none mb-6">
            <h3 className="text-lg font-semibold text-gray-700">About Me</h3>
            <p className="text-gray-600">{portfolio.portfolio.bio}</p>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">
                Education
              </h3>
              <div className="space-y-2">
                {portfolio.portfolio.education.map((edu, idx) => (
                  <div key={idx} className="bg-gray-50 p-3 rounded">
                    <p className="font-medium text-gray-800">{edu.degree}</p>
                    <p className="text-gray-600">
                      {edu.school} • {edu.year}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">
                Experience
              </h3>
              <div className="space-y-2">
                {portfolio.portfolio.experience.map((exp, idx) => (
                  <div key={idx} className="bg-gray-50 p-3 rounded">
                    <p className="font-medium text-gray-800">{exp.role}</p>
                    <p className="text-gray-600">
                      {exp.company} • {exp.duration}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">
                Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {portfolio.portfolio.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
