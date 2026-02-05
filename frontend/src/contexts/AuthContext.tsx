import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '@/types';
import { getUsers, getCurrentUser, setCurrentUser, addUser } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (data: RegisterData) => Promise<boolean>;
}

interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
  healthStation?: string;
  phone?: string;
  licenseNumber?: string;
  chvIdNumber?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const savedUser = getCurrentUser();
    if (savedUser) {
      setUser(savedUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const users = getUsers();
    const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (foundUser) {
      if (!foundUser.isActive) {
        toast({
          title: "Account Inactive",
          description: "Your account has been deactivated. Please contact an administrator.",
          variant: "destructive",
        });
        return false;
      }

      setUser(foundUser);
      setCurrentUser(foundUser);
      toast({
        title: "Welcome back!",
        description: `Logged in as ${foundUser.fullName}`,
      });
      return true;
    }

    toast({
      title: "Login Failed",
      description: "Invalid email or password. Please try again.",
      variant: "destructive",
    });
    return false;
  };

  const logout = () => {
    setUser(null);
    setCurrentUser(null);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const users = getUsers();
    const existingUser = users.find(u => u.email.toLowerCase() === data.email.toLowerCase());

    if (existingUser) {
      toast({
        title: "Registration Failed",
        description: "An account with this email already exists.",
        variant: "destructive",
      });
      return false;
    }

    const newUser = addUser({
      email: data.email,
      fullName: data.fullName,
      role: data.role,
      healthStation: data.healthStation,
      phone: data.phone,
      licenseNumber: data.licenseNumber,
      chvIdNumber: data.chvIdNumber,
      isActive: true,
    });

    // Auto-login for non-admin registrations
    if (data.role !== 'admin') {
      setUser(newUser);
      setCurrentUser(newUser);
    }

    toast({
      title: "Registration Successful",
      description: data.role === 'admin' 
        ? `${data.fullName} has been registered as ${data.role.toUpperCase()}.`
        : `Welcome to Eldocare, ${data.fullName}!`,
    });
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
