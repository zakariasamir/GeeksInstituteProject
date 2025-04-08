import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { handleLogout, isTokenExpired } from "../../utils/auth";
import Cookies from "js-cookie"

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

// Add request interceptor to include token

// Add request interceptor to check token before each request
API.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");

    if (token) {
      if (isTokenExpired(token)) {
        handleLogout();
        return Promise.reject("Token expired");
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle 401 errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      handleLogout();
    }
    return Promise.reject(error);
  }
);

// Async Thunks
export const fetchAllPortfolios = createAsyncThunk(
  "portfolio/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/portfolio");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch portfolios"
      );
    }
  }
);

export const fetchPortfolioById = createAsyncThunk(
  "portfolio/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await API.get(`/portfolio/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch portfolio"
      );
    }
  }
);

export const createPortfolio = createAsyncThunk(
  "portfolio/create",
  async ({ portfolioData }, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      Object.keys(portfolioData).forEach((key) => {
        if (
          key === "education" ||
          key === "experience" ||
          key === "projects" ||
          key === "skills"
        ) {
          formData.append(key, JSON.stringify(portfolioData[key]));
        } else if (key === "picture" && portfolioData[key]) {
          formData.append("picture", portfolioData[key]);
        } else {
          formData.append(key, portfolioData[key]);
        }
      });

      // formData.append("employee", employeeId);

      const response = await API.post("/portfolio", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        return rejectWithValue("Unauthorized: Please login again");
      }
      return rejectWithValue(
        error.response?.data?.error || "Failed to create portfolio"
      );
    }
  }
);

export const updatePortfolio = createAsyncThunk(
  "portfolio/update",
  async ({ portfolioId, portfolioData }, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      Object.keys(portfolioData).forEach((key) => {
        if (
          key === "education" ||
          key === "experience" ||
          key === "projects" ||
          key === "skills"
        ) {
          formData.append(key, JSON.stringify(portfolioData[key]));
        } else if (key === "picture" && portfolioData[key]) {
          formData.append("picture", portfolioData[key]);
        } else {
          formData.append(key, portfolioData[key]);
        }
      });

      const response = await API.put(`/portfolio/${portfolioId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to update portfolio"
      );
    }
  }
);

export const deletePortfolio = createAsyncThunk(
  "portfolio/delete",
  async (portfolioId, { rejectWithValue }) => {
    try {
      await API.delete(`/portfolio/${portfolioId}`);
      return portfolioId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to delete portfolio"
      );
    }
  }
);

const initialState = {
  portfolios: [],
  currentPortfolio: null,
  loading: false,
  error: null,
  success: false,
};

const portfolioSlice = createSlice({
  name: "portfolio",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetSuccess: (state) => {
      state.success = false;
    },
    clearCurrentPortfolio: (state) => {
      state.currentPortfolio = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Portfolios
      .addCase(fetchAllPortfolios.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllPortfolios.fulfilled, (state, action) => {
        state.loading = false;
        state.portfolios = action.payload;
      })
      .addCase(fetchAllPortfolios.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Portfolio By ID
      .addCase(fetchPortfolioById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPortfolioById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPortfolio = action.payload;
      })
      .addCase(fetchPortfolioById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Portfolio
      .addCase(createPortfolio.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createPortfolio.fulfilled, (state, action) => {
        state.loading = false;
        state.portfolios.push(action.payload);
        state.currentPortfolio = action.payload;
        state.success = true;
      })
      .addCase(createPortfolio.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // Update Portfolio
      .addCase(updatePortfolio.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updatePortfolio.fulfilled, (state, action) => {
        state.loading = false;
        state.portfolios = state.portfolios.map((portfolio) =>
          portfolio._id === action.payload._id ? action.payload : portfolio
        );
        state.currentPortfolio = action.payload;
        state.success = true;
      })
      .addCase(updatePortfolio.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // Delete Portfolio
      .addCase(deletePortfolio.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deletePortfolio.fulfilled, (state, action) => {
        state.loading = false;
        state.portfolios = state.portfolios.filter(
          (portfolio) => portfolio._id !== action.payload
        );
        state.currentPortfolio = null;
        state.success = true;
      })
      .addCase(deletePortfolio.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { clearError, resetSuccess, clearCurrentPortfolio } =
  portfolioSlice.actions;
export default portfolioSlice.reducer;
