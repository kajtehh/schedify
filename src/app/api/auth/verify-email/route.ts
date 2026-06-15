import { sendVerificationEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { verifyAccessToken } from "@/utils/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Token is required" }, { status: 400 });
  }

  const emailVerificationToken = await prisma.emailVerificationToken.findUnique(
    {
      where: {
        token,
      },
    },
  );

  if (!emailVerificationToken) {
    return NextResponse.json({ error: "Invalid token" }, { status: 400 });
  }

  if (emailVerificationToken.expiresAt < new Date()) {
    return NextResponse.json({ error: "Token expired" }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: emailVerificationToken.userId },
    data: {
      emailVerifiedAt: new Date(),
    },
  });

  await prisma.emailVerificationToken.delete({
    where: { id: emailVerificationToken.id },
  });

  return NextResponse.json({ message: "Email verified" }, { status: 200 });
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];
  const payload = verifyAccessToken(token);
  if (!payload)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (user.emailVerifiedAt) {
    return NextResponse.json(
      { error: "Email already verified" },
      { status: 400 },
    );
  }

  await prisma.emailVerificationToken.deleteMany({
    where: { userId: user.id },
  });

  const emailVerificationToken = await prisma.emailVerificationToken.create({
    data: {
      token: crypto.randomUUID(),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 h
      userId: user.id,
    },
  });

  try {
    await sendVerificationEmail(user, emailVerificationToken.token);

    return NextResponse.json(
      { message: "Verification email sent" },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { message: "Failed to send an email" },
      { status: 500 },
    );
  }
}
