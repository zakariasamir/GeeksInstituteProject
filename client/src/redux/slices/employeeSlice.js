import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

// Add request interceptor to include token
API.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      console.log("employee Slice", token)
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Async Thunks
// Update fetchEmployees thunk to include portfolio information
export const fetchEmployees = createAsyncThunk(
  "employee/fetchEmployees",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/employees");

      // Fetch portfolio status for each employee
      const employeesWithPortfolioStatus = await Promise.all(
        response.data.employees.map(async (employee) => {
          try {
            await API.get(`/portfolio/${employee._id}`);
            return { ...employee, hasPortfolio: true };
          } catch (error) {
            return { ...employee, hasPortfolio: false, error: error.message };
          }
        })
      );

      return { employees: employeesWithPortfolioStatus };
    } catch (error) {
      if (error.response?.status === 401) {
        return rejectWithValue("Unauthorized: Please login again");
      }
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch employees"
      );
    }
  }
);

export const getEmployeeById = createAsyncThunk(
  "employee/getEmployeeById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await API.get(`/employees/${id}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        return rejectWithValue("Unauthorized: Please login again");
      }
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch employee"
      );
    }
  }
);

export const createPortfolio = createAsyncThunk(
  "employee/createPortfolio",
  async ({ portfolioData }, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      // Handle arrays and objects properly
      Object.keys(portfolioData).forEach((key) => {
        if (key === "picture" && portfolioData[key] instanceof File) {
          formData.append("picture", portfolioData[key]);
        } else if (Array.isArray(portfolioData[key])) {
          // Convert arrays to JSON strings
          formData.append(key, JSON.stringify(portfolioData[key]));
        } else {
          formData.append(key, portfolioData[key]);
        }
      });

      const response = await API.post("/portfolio", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to create portfolio"
      );
    }
  }
);

// Update the getPortfolioByEmployeeId thunk
export const getPortfolioByEmployeeId = createAsyncThunk(
  "employee/getPortfolioByEmployeeId",
  async (employeeId, { rejectWithValue }) => {
    try {
      const response = await API.get(`/portfolio/${employeeId}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return rejectWithValue("Portfolio not found");
      }
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch portfolio"
      );
    }
  }
);

// Update the initial state to include hasPortfolio
const initialState = {
  employees: [],
  selectedEmployee: null,
  portfolio: null,
  loading: false,
  error: null,
  hasPortfolio: false,
};

const employeeSlice = createSlice({
  name: "employee",
  initialState,
  reducers: {
    clearEmployeeError: (state) => {
      state.error = null;
    },
    clearSelectedEmployee: (state) => {
      state.selectedEmployee = null;
      state.portfolio = null;
    },
    clearPortfolioState: (state) => {
      state.portfolio = null;
      state.hasPortfolio = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Employees
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload.employees;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Employee by ID
      .addCase(getEmployeeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEmployeeById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedEmployee = action.payload;
      })
      .addCase(getEmployeeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Portfolio
      .addCase(createPortfolio.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPortfolio.fulfilled, (state, action) => {
        state.loading = false;
        state.portfolio = action.payload;
        // Update hasPortfolio for the specific employee
        if (state.employees.length > 0) {
          state.employees = state.employees.map((emp) =>
            emp._id === action.payload.employee
              ? { ...emp, hasPortfolio: true }
              : emp
          );
        }
        if (state.selectedEmployee?._id === action.payload.employee) {
          state.hasPortfolio = true;
        }
        state.error = null;
      })
      .addCase(createPortfolio.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Portfolio by Employee ID
      .addCase(getPortfolioByEmployeeId.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.hasPortfolio = false;
      })
      .addCase(getPortfolioByEmployeeId.fulfilled, (state, action) => {
        state.loading = false;
        state.portfolio = action.payload;
        // Update hasPortfolio for the specific employee
        if (state.employees.length > 0) {
          state.employees = state.employees.map((emp) =>
            emp._id === action.payload.employee
              ? { ...emp, hasPortfolio: true }
              : emp
          );
        }
        if (state.selectedEmployee?._id === action.payload.employee) {
          state.hasPortfolio = true;
        }
      })
      .addCase(getPortfolioByEmployeeId.rejected, (state, action) => {
        state.loading = false;
        // Only set error if it's not a "not found" error
        if (!action.payload?.includes("not found")) {
          state.error = action.payload;
        }
        state.portfolio = null;
        // Update hasPortfolio for the specific employee if not found
        const employeeId = action.meta.arg;
        if (state.employees.length > 0) {
          state.employees = state.employees.map((emp) =>
            emp._id === employeeId ? { ...emp, hasPortfolio: false } : emp
          );
        }
        if (state.selectedEmployee?._id === employeeId) {
          state.hasPortfolio = false;
        }
      });
  },
});

// Export the new action
export const {
  clearEmployeeError,
  clearSelectedEmployee,
  clearPortfolioState,
} = employeeSlice.actions;

export default employeeSlice.reducer;
