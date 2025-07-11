import { apiInstance } from "@shared/api";
import type { User } from "../model/types";

// Mock user data for development
const MOCK_USERS: User[] = [
  {
    id: "1",
    phone: "79001234567",
    name: "Test User",
    avatar: "https://i.pravatar.cc/150?img=1",
    isOrganizer: false,
  },
];

export const userApi = {
  // Check if phone exists
  checkPhone: async (phone: string): Promise<{ exists: boolean }> => {
    // For development, use mock data
    if (process.env.NODE_ENV === "production") {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      const exists = MOCK_USERS.some((user) => user.phone === phone);
      return { exists };
    }

    // Real API call
    const response = await apiInstance.post("/auth/check-phone", { phone });
    return response.data;
  },

  // Login with phone and password
  login: async (
    phone: string,
    password: string
  ): Promise<{ user: User; token: string }> => {
    // For development, use mock data
    if (process.env.NODE_ENV === "production") {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      const user = MOCK_USERS.find((user) => user.phone === phone);
      if (!user) {
        throw new Error("Invalid credentials");
      }

      // In a real app, we would validate the password here
      // For mock purposes, we'll accept any password for existing users

      return {
        user,
        token: "mock-jwt-token",
      };
    }

    // Real API call
    const response = await apiInstance.post("/auth/login", { phone, password });
    return response.data;
  },

  // Register with phone and password
  register: async (
    phone: string,
    password: string
  ): Promise<{ user: User; token: string }> => {
    // For development, use mock data
    if (process.env.NODE_ENV === "production") {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      const existingUser = MOCK_USERS.find((user) => user.phone === phone);
      if (existingUser) {
        throw new Error("User already exists");
      }

      // Create new user
      const newUser: User = {
        id: String(MOCK_USERS.length + 1),
        phone,
        isOrganizer: false,
      };

      // In a real app, we would store the user in a database
      MOCK_USERS.push(newUser);

      return {
        user: newUser,
        token: "mock-jwt-token",
      };
    }

    // Real API call
    const response = await apiInstance.post("/auth/register", {
      phone,
      password,
    });
    return response.data;
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    // For development, use mock data
    if (process.env.NODE_ENV === "production") {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // In a real app, we would use the token to identify the user
      return MOCK_USERS[0];
    }

    // Real API call
    const response = await apiInstance.get("/user/me");
    return response.data;
  },
};
