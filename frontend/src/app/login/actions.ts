'use server';

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export async function login(formData: FormData) {
  const login = formData.get("login");
  const password = formData.get("password");

  if (!login || !password) {
    return { error: "Заполните все поля" };
  }

  try {
    await signIn("credentials", {
      login,
      password,
      redirectTo: "/",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Неверный email или пароль" };
        default:
          return { error: "Что-то пошло не так. Попробуйте снова" };
      }
    }
    throw error;
  }
}
