import { sendVerificationEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { createAccessToken, createRefreshToken } from "@/utils/auth";
import { isValidEmail, isValidPassword } from "@/utils/validation";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    !isValidEmail(email) ||
    !isValidPassword(password)
  ) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser)
    return NextResponse.json({ error: "User already exists" }, { status: 409 });

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, password: hashedPassword },
  });

  const emailVerificationToken = await prisma.emailVerificationToken.create({
    data: {
      token: crypto.randomUUID(),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 h
      userId: user.id,
    },
  });

  await sendVerificationEmail(user, emailVerificationToken.token);

  const accessToken = createAccessToken({ userId: user.id });
  const refreshToken = createRefreshToken({ userId: user.id });

  (await cookies()).set("refresh_token", refreshToken, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
  });

  return NextResponse.json({ accessToken }, { status: 201 });
}
