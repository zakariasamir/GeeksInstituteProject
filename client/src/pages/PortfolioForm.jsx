import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  createPortfolio,
  updatePortfolio,
  deletePortfolio,
} from "../redux/slices/portfolioSlice";
import { FaPlus, FaTrash } from "react-icons/fa";

export default function PortfolioForm({ employeeId }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { portfolio, loading, error } = useSelector((state) => state.employee);
  const existingData = portfolio?.portfolio;
  // Initialize form with existing data if available
  const [formData, setFormData] = useState({
    employee: employeeId,
    name: existingData?.name || "",
    position: existingData?.position || "",
    bio: existingData?.bio || "",
    education: existingData?.education || [
      { school: "", degree: "", year: "" },
    ],
    experience: existingData?.experience || [
      { company: "", role: "", duration: "" },
    ],
    projects: existingData?.projects || [{ name: "", description: "" }],
    skills: existingData?.skills?.join(", ") || "",
    picture: existingData?.picture || null,
  });

  // Add state for image preview
  const [imagePreview, setImagePreview] = useState(
    existingData?.picture || null
  );

  // Update handleChange to include image preview
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "picture") {
      const file = files[0];
      setFormData({ ...formData, picture: file });
      // Create preview URL for the selected image
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleArrayChange = (index, field, subField, value) => {
    const newArray = [...formData[field]];
    newArray[index] = { ...newArray[index], [subField]: value };
    setFormData({ ...formData, [field]: newArray });
  };

  const handleAddItem = (field) => {
    const newItems = {
      education: { school: "", degree: "", year: "" },
      experience: { company: "", role: "", duration: "" },
      projects: { name: "", description: "" },
    };
    setFormData({
      ...formData,
      [field]: [...formData[field], newItems[field]],
    });
  };

  const handleRemoveItem = (field, index) => {
    setFormData({
      ...formData,
      [field]: formData[field].filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const portfolioData = {
      ...formData,
      skills: formData.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill !== ""),
      education: formData.education,
      experience: formData.experience,
      projects: formData.projects,
      employee: employeeId,
    };

    if (formData.picture instanceof File) {
      portfolioData.picture = formData.picture;
    }

    try {
      if (existingData?._id) {
        // Update existing portfolio
        await dispatch(
          updatePortfolio({
            portfolioId: existingData._id,
            portfolioData,
          })
        ).unwrap();
      } else {
        // Create new portfolio
        await dispatch(
          createPortfolio({
            employeeId,
            portfolioData,
          })
        ).unwrap();
      }
      navigate("/dashboard");
    } catch (err) {
      console.error("Failed to save portfolio:", err);
    }
  };

  // Add handleDelete function after your other handlers
  const handleDelete = async () => {
    if (!existingData?._id) return;

    if (
      window.confirm(
        "Are you sure you want to delete this portfolio? This action cannot be undone."
      )
    ) {
      try {
        await dispatch(deletePortfolio(existingData._id)).unwrap();
        navigate("/dashboard");
      } catch (err) {
        console.error("Failed to delete portfolio:", err);
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 p-8 bg-white rounded-xl shadow-lg max-w-4xl mx-auto"
    >
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-md">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">
          Basic Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="input-field focus:ring-indigo-500 focus:border-indigo-500 p-3"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Position
            </label>
            <input
              name="position"
              value={formData.position}
              onChange={handleChange}
              placeholder="Enter your position"
              className="input-field p-3 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Write a short bio about yourself"
              className="input-field min-h-[120px] focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
        </div>

        {/* Image Upload Section with Preview */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Profile Picture
          </label>
          <div className="flex items-center space-x-6">
            <div className="flex-shrink-0">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Profile preview"
                  className="h-32 w-32 object-cover rounded-lg shadow-md"
                />
              ) : (
                <div className="h-32 w-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                  <span className="text-gray-500 text-sm">No image</span>
                </div>
              )}
            </div>
            <div className="flex-1">
              <input
                type="file"
                name="picture"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
                id="picture-upload"
              />
              <label
                htmlFor="picture-upload"
                className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Choose new picture
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Education Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Education</h3>
          <button
            type="button"
            onClick={() => handleAddItem("education")}
            className="add-button"
          >
            <FaPlus /> Add Education
          </button>
        </div>
        {formData.education.map((edu, index) => (
          <div
            key={index}
            className="grid grid-cols-1 gap-4 p-4 border rounded-lg relative"
          >
            <button
              type="button"
              onClick={() => handleRemoveItem("education", index)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            >
              <FaTrash />
            </button>
            <input
              value={edu.school}
              onChange={(e) =>
                handleArrayChange(index, "education", "school", e.target.value)
              }
              placeholder="School"
              className="input-field p-2"
            />
            <input
              value={edu.degree}
              onChange={(e) =>
                handleArrayChange(index, "education", "degree", e.target.value)
              }
              placeholder="Degree"
              className="input-field p-2"
            />
            <input
              type="number"
              value={edu.year}
              onChange={(e) =>
                handleArrayChange(index, "education", "year", e.target.value)
              }
              placeholder="Year"
              className="input-field p-2"
            />
          </div>
        ))}
      </div>

      {/* Experience Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Experience</h3>
          <button
            type="button"
            onClick={() => handleAddItem("experience")}
            className="add-button"
          >
            <FaPlus /> Add Experience
          </button>
        </div>
        {formData.experience.map((exp, index) => (
          <div
            key={index}
            className="grid grid-cols-1 gap-4 p-4 border rounded-lg relative"
          >
            <button
              type="button"
              onClick={() => handleRemoveItem("experience", index)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            >
              <FaTrash />
            </button>
            <input
              value={exp.company}
              onChange={(e) =>
                handleArrayChange(
                  index,
                  "experience",
                  "company",
                  e.target.value
                )
              }
              placeholder="Company"
              className="input-field p-2"
            />
            <input
              value={exp.role}
              onChange={(e) =>
                handleArrayChange(index, "experience", "role", e.target.value)
              }
              placeholder="Role"
              className="input-field p-2"
            />
            <input
              value={exp.duration}
              onChange={(e) =>
                handleArrayChange(
                  index,
                  "experience",
                  "duration",
                  e.target.value
                )
              }
              placeholder="Duration"
              className="input-field p-2"
            />
          </div>
        ))}
      </div>

      {/* Projects Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Projects</h3>
          <button
            type="button"
            onClick={() => handleAddItem("projects")}
            className="add-button"
          >
            <FaPlus /> Add Project
          </button>
        </div>
        {formData.projects.map((project, index) => (
          <div
            key={index}
            className="grid grid-cols-1 gap-4 p-4 border rounded-lg relative"
          >
            <button
              type="button"
              onClick={() => handleRemoveItem("projects", index)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            >
              <FaTrash />
            </button>
            <input
              value={project.name}
              onChange={(e) =>
                handleArrayChange(index, "projects", "name", e.target.value)
              }
              placeholder="Project Name"
              className="input-field p-2"
            />
            <textarea
              value={project.description}
              onChange={(e) =>
                handleArrayChange(
                  index,
                  "projects",
                  "description",
                  e.target.value
                )
              }
              placeholder="Project Description"
              className="input-field min-h-[100px]"
            />
          </div>
        ))}
      </div>

      {/* Skills Section with improved UI */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">
          Skills
        </h3>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Skills (comma-separated)
          </label>
          <input
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="e.g., JavaScript, React, Node.js"
            className="input-field p-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <p className="text-sm text-gray-500">
            Enter your skills separated by commas
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Saving...
            </span>
          ) : existingData?._id ? (
            "Update Portfolio"
          ) : (
            "Create Portfolio"
          )}
        </button>
        {existingData?._id && (
          <button
            type="button"
            onClick={handleDelete}
            className="ml-4 py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
          >
            Delete Portfolio
          </button>
        )}
      </div>
    </form>
  );
}
