import { Task } from "@/types";
import { getBaseUrl } from "./env";

const baseUrl = getBaseUrl();

export async function getUserTasks(accessToken: string) {
  const res = await fetch(`${baseUrl}/api/tasks`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) return null;

  const data = await res.json();
  return data.tasks as Task[];
}

export async function createTask(
  accessToken: string,
  title: string,
  description?: string,
) {
  const response = await fetch(`${baseUrl}/api/tasks`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, description }),
  });

  const data = await response.json();

  if (!response.ok) throw new Error(data.error || "Something went wrong");

  return data as Task;
}

export async function deleteTask(accessToken: string, id: string) {
  const response = await fetch(`${baseUrl}/api/tasks`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Failed to delete task");
  }
}

export async function updateTask(
  accessToken: string,
  id: string,
  fields: { title?: string; description?: string; completed?: boolean },
) {
  const response = await fetch(`${baseUrl}/api/tasks`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, ...fields }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Failed to update task");
  }
}

// DODAJ SORTOWANIE UZYTKOWNIKOWI TEZ DO WYBORU
export const sortTasks = (tasks: Task[]) =>
  [...tasks].sort((a, b) => Number(b.completed) - Number(a.completed));
