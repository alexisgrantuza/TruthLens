// frontend/src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { authClient } from "../lib/auth-client";

interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
  walletAddress?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const session = authClient.useSession();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(session.isPending);

  useEffect(() => {
    setUser((session.data?.user as User) ?? null);
    setLoading(session.isPending);
  }, [session.data, session.isPending]);

  const signOut = async () => {
    try {
      await authClient.signOut();
      setUser(null);
      setLoading(false);
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  const refreshUser = async () => {
    setUser((session.data?.user as User) ?? null);
    setLoading(session.isPending);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
