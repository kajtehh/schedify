import { User } from "@/types";
import { getBaseUrl } from "./get-base-url";

const baseUrl = getBaseUrl();

export async function getUser(accessToken: string): Promise<User | null> {
  const response = await fetch(`${baseUrl}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  if (!response.ok) return null;

  const { user } = await response.json();

  return user;
}

export async function refreshSession(refreshToken?: string): Promise<string | null> {
  const headers: Record<string, string> = {};
  if (refreshToken) {
    headers.Authorization = `Bearer ${refreshToken}`;
  }

  const response = await fetch(`${baseUrl}/api/auth/refresh`, {
    method: "POST",
    headers,
    cache: "no-store",
    credentials: "include",
  });

  if (!response.ok) return null;

  const data = await response.json();

  return data.accessToken ?? null;
}


export async function getUserSession(
  refreshToken?: string
): Promise<{ user: User; accessToken: string } | null> {
  const accessToken = await refreshSession(refreshToken);

  if (!accessToken) return null;

  const user = await getUser(accessToken);

  if(!user) return null;

  return { user, accessToken };
}

// zrob zeby to wszystko zwracalo wiadomosci doprecyzowane jakies 
