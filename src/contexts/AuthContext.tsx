// src/contexts/AuthContext.tsx
import React, { createContext, useContext, ReactNode } from "react";
import supabase from "@/utils/supabase";

interface AuthContextProps {
  login: (cedula: string, password: string) => Promise<void>;
  register: (
    cedula: string,
    nombre: string,
    direccion: string,
    telefono: string,
    correo: string,
    password: string
  ) => Promise<void>;
  logout: () => Promise<void>; // ← NUEVO
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // --- LOGIN ---
  const login = async (cedula: string, password: string) => {
    const emailSynthetic = `${cedula}@fakeemail.com`.toLowerCase();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: emailSynthetic,
      password,
    });
    if (error) throw error;

    console.log("Usuario logueado:", data.user?.id);
  };

  // --- REGISTER ---
  const register = async (
    cedula: string,
    nombre: string,
    direccion: string,
    telefono: string,
    correo: string,
    password: string
  ) => {
    const emailSynthetic = `${cedula}@fakeemail.com`.toLowerCase();

    // 1) Crear usuario en Auth
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: emailSynthetic,
      password,
    });
    if (signUpError) throw signUpError;

    // 2) Obtener UID
    let authUid = signUpData.user?.id || null;
    if (!authUid) {
      const { data: me } = await supabase.auth.getUser();
      authUid = me.user?.id ?? null;
    }
    if (!authUid) throw new Error("No se obtuvo auth_uid después de signUp");

    // 3) Insertar perfil
    const { error: insertError } = await supabase.from("clients").insert([
      {
        cedula,
        auth_uid: authUid,
        nombre,
        direccion,
        telefono,
        correo,
        es_juridico: false,
        nit: null,
      },
    ]);

    if (insertError) {
      console.error("Insert clients error:", insertError);
      throw insertError;
    }

    console.log("Usuario registrado:", authUid, "ced:", cedula);
  };

  // --- LOGOUT (NUEVO) ---
  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    // (Opcional) limpiar algún cache local tuyo
    // localStorage.removeItem("inbio_active_tab");
    // localStorage.removeItem("inbio_pesito_pos");

    console.log("Sesión cerrada");
  };

  return (
    <AuthContext.Provider value={{ login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};