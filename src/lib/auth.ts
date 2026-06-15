import { getBaseUrl } from "./env";

const baseUrl = getBaseUrl();

export async function loginOrRegister(
  url: "/api/auth/login" | "/api/auth/register",
  email: string,
  password: string,
): Promise<string | null> {
  const response = await fetch(`${baseUrl}/${url}`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Something went wrong");
  }

  return data.accessToken;
}

export async function completeRegistration(
  fullName: string,
  accessToken: string,
): Promise<string | null> {
  const res = await fetch(`${baseUrl}/api/auth/complete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ fullName }),
  });

  const data = await res.json();

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Something went wrong");
  }

  return data.accessToken || null;
}

export async function logout() {
  const response = await fetch(`${baseUrl}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  return response.ok;
}

export async function verifyEmail(token: string) {
  const response = await fetch(
    `${baseUrl}/api/auth/verify-email?token=${token}`,
  );

  return response.ok;
}

export async function resendVerificationEmail(accessToken: string) {
  try {
    const response = await fetch(`${baseUrl}/api/auth/verify-email`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.ok;
  } catch (err) {
    throw err;
  }
}
