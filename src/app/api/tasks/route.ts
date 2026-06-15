import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@/utils/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.substring(7);
  const payload = verifyAccessToken(token);

  if (!payload) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const userId = payload.userId;

  try {
    const tasks = await prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ tasks });
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const { title, description } = await request.json();

  if (
    typeof title !== "string" ||
    (description && typeof description !== "string") ||
    !title
  ) {
    // TODO: ADD HERE REGEX FOR TITLE AND DESC
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const authHeader = request.headers.get("Authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.substring(7);
  const payload = verifyAccessToken(token);

  if (!payload) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const userId = payload.userId;

  try {
    const task = await prisma.task.create({
      data: {
        title,
        description,
        userId: userId,
        lastReset: new Date(),
      },
    });

    return NextResponse.json(task, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  const { id } = await request.json();

  if (typeof id !== "string" || !id) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const authHeader = request.headers.get("Authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.substring(7);
  const payload = verifyAccessToken(token);

  if (!payload) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const userId = payload.userId;

  try {
    await prisma.task.delete({
      where: { userId, id },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.substring(7);
  const payload = verifyAccessToken(token);

  if (!payload) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const userId = payload.userId;

  const { id, title, description, completed } = await request.json();

  if (typeof id !== "string" || !id) {
    return NextResponse.json(
      { error: "Invalid or missing task id" },
      { status: 400 },
    );
  }

  const updateData: {
    title?: string;
    description?: string;
    completed?: boolean;
  } = {};

  if (title !== undefined) {
    if (typeof title !== "string" || title.trim() === "") {
      return NextResponse.json({ error: "Invalid title" }, { status: 400 });
    }
    updateData.title = title;
  }

  if (description !== undefined) {
    if (typeof description !== "string") {
      return NextResponse.json(
        { error: "Invalid description" },
        { status: 400 },
      );
    }
    updateData.description = description;
  }

  if (completed !== undefined) {
    if (typeof completed !== "boolean") {
      return NextResponse.json(
        { error: "Invalid completed status" },
        { status: 400 },
      );
    }
    updateData.completed = completed;
  }

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json(
      { error: "No valid fields to update" },
      { status: 400 },
    );
  }

  try {
    const task = await prisma.task.updateMany({
      where: { id, userId },
      data: updateData,
    });

    if (task.count === 0) {
      return NextResponse.json(
        { error: "Task not found or unauthorized" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
