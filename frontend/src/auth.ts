import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { jwtDecode } from "jwt-decode";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 60 * 60,
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        login: { label: "Логин", type: "login" },
        password: { label: "Пароль", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.login || !credentials?.password) return null;

          const res = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            body: JSON.stringify({
              login: credentials.login,
              password: credentials.password,
            }),
            headers: {
              "Content-Type": "application/json"
            },
          });

          const data = await res.json();

          if (!res.ok || !data || !data.token) {
            throw new Error(data?.error || "Неверный логин или пароль");
          }

          const decoded: any = jwtDecode(data.token);
          const expiresAtMs = decoded.exp * 1000;

          return {
            id: data.user?.id || "1",
            login: data.user?.login,
            name: data.user?.name,
            accessToken: data.token,
            accessTokenExpires: expiresAtMs,
          };
        } catch (error) {
          throw new Error(error as string);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as any).accessToken;
        token.accessTokenExpires = (user as any).accessTokenExpires;
        token.id = user.id;
        token.name = user.name;
      }

      if (Date.now() > (token.accessTokenExpires as number)) {
        return null;
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        // @ts-ignore
        session.user = {
          id: token.id as string,
          name: token.name as string,
        };
        (session as any).accessToken = token.accessToken;
        (session as any).accessTokenExpires = token.accessTokenExpires;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
