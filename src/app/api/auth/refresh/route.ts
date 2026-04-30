import { verifyRefreshToken, createAccessToken, createRefreshToken } from "@/utils/auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  let refreshToken = request.headers.get("Authorization")?.split(" ")[1];

  if (!refreshToken) {
    const cookieStore = await cookies();
    refreshToken = cookieStore.get("refresh_token")?.value;
  }

  if (!refreshToken) {
    return NextResponse.json({ error: "No refresh token provided" }, { status: 401 });
  }

  const payload = verifyRefreshToken(refreshToken);

  if (!payload) {
    return NextResponse.json({ error: "Invalid refresh token" }, { status: 401 });
  }

  const userId = typeof payload.userId === "string" ? payload.userId : String(payload.userId);

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const newAccessToken = createAccessToken({ userId: user.id });
  const newRefreshToken = createRefreshToken({ userId: user.id });

  return NextResponse.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
}
