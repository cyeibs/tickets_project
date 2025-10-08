import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { userApi, type User } from "@entities/user";

interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
  checkPhone: (phone: string) => Promise<{ exists: boolean }>;
  login: (phone: string, password: string) => Promise<void>;
  register: (
    phone: string,
    password: string,
    names: { firstName: string; lastName: string; middleName?: string },
    avatarFile?: File | null
  ) => Promise<void>;
  logout: () => void;
}

interface LoginCredentials {
  phone: string;
  password: string;
}

export const useAuth = (): UseAuthReturn => {
  const [error, setError] = useState<Error | null>(null);

  // Get current user
  const {
    data: user,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) return null;

        return await userApi.getCurrentUser();
      } catch (error) {
        localStorage.removeItem("authToken");
        return null;
      }
    },
  });

  // Check if phone exists
  const checkPhoneMutation = useMutation({
    mutationFn: userApi.checkPhone,
    onError: (error: Error) => {
      setError(error);
    },
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: ({ phone, password }: LoginCredentials) =>
      userApi.login(phone, password),
    onSuccess: (data) => {
      localStorage.setItem("authToken", data.token);
      refetch();
    },
    onError: (error: Error) => {
      setError(error);
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async ({
      phone,
      password,
      names,
      avatarFile,
    }: LoginCredentials & {
      names: { firstName: string; lastName: string; middleName?: string };
      avatarFile?: File | null;
    }) => {
      const { token } = await userApi.register(phone, password, names);
      localStorage.setItem("authToken", token);

      if (avatarFile) {
        const { id } = await userApi.uploadAvatar(avatarFile);
        await userApi.updateMe({ avatarId: id });
      }
      return { token };
    },
    onSuccess: () => {
      refetch();
    },
    onError: (error: Error) => {
      setError(error);
    },
  });

  // Check if phone exists
  const checkPhone = async (phone: string): Promise<{ exists: boolean }> => {
    return await checkPhoneMutation.mutateAsync(phone);
  };

  // Login
  const login = async (phone: string, password: string): Promise<void> => {
    await loginMutation.mutateAsync({ phone, password });
  };

  // Register
  const register = async (
    phone: string,
    password: string,
    names: { firstName: string; lastName: string; middleName?: string },
    avatarFile?: File | null
  ): Promise<void> => {
    await registerMutation.mutateAsync({ phone, password, names, avatarFile });
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("authToken");
    refetch();
  };

  return {
    user: user || null,
    isAuthenticated: !!user,
    isLoading,
    error,
    checkPhone,
    login,
    register,
    logout,
  };
};
