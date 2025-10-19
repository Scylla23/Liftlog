import { useState, useEffect } from 'react';

const mockUser = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  avatar: 'https://via.placeholder.com/150',
  joinDate: '2024-01-15',
};

export function useAuth() {
  const [user, setUser] = useState<typeof mockUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthState = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setUser(mockUser);
      setIsLoading(false);
    };

    checkAuthState();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    setUser(mockUser);
    setIsLoading(false);
  };

  const logout = async () => {
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    setUser(null);
    setIsLoading(false);
  };

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };
}
