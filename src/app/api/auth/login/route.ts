import prisma from "@/lib/prisma";
import { createAccessToken, createRefreshToken } from "@/utils/auth";
import { isValidEmail, isValidPassword } from "@/utils/validation";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  if (typeof email !== "string" || typeof password !== "string")
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });

  if (!isValidEmail(email) || !isValidPassword(password))
    return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user)
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword)
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  const accessToken = createAccessToken({ userId: user.id });
  const refreshToken = createRefreshToken({ userId: user.id });

  (await cookies()).set("refresh_token", refreshToken, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
  });

  return NextResponse.json({ accessToken });
}
