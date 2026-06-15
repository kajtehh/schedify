import { prisma } from "@/lib/prisma";
import { verifyAccessToken } from "@/utils/auth";
import { isValidFullName } from "@/utils/validation";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const decoded = verifyAccessToken(token);
  if (!decoded) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const { fullName } = await req.json();

  if (typeof fullName !== "string" || !isValidFullName(fullName)) {
    return NextResponse.json({ error: "Invalid name" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (user.fullName) {
    return NextResponse.json({ error: "Already completed" }, { status: 409 });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { fullName },
  });

  return NextResponse.json({
    success: true,
    //emailVerified: user.emailVerified,
  });
}
