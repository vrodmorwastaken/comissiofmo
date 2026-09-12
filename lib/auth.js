import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credencials",
      credentials: {
        username: { label: "Usuari", type: "text" },
        password: { label: "Contrasenya", type: "password" },
      },
      async authorize(credentials) {
        const username = credentials?.username?.trim();
        const password = credentials?.password || "";
        if (!username || !password) return null;

        // Primer mirem si és staff
        const staff = await prisma.staff.findUnique({ where: { username } });
        if (staff && bcrypt.compareSync(password, staff.passwordHash)) {
          return {
            id: staff.id,
            name: staff.nom || staff.username,
            username: staff.username,
            role: "staff",
          };
        }

        // Si no, mirem si és una penya
        const penya = await prisma.penya.findUnique({ where: { username } });
        if (penya && bcrypt.compareSync(password, penya.passwordHash)) {
          return {
            id: penya.id,
            name: penya.nombre,
            username: penya.username,
            role: "penya",
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.username = user.username;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
        session.user.username = token.username;
        session.user.id = token.id;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
