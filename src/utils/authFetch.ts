import { jwtDecode } from "jwt-decode";


function isTokenExpired(token: string): boolean {
  try {
    const decoded: any = jwtDecode(token);
    return decoded.exp * 1000 < Date.now();
  } catch (err) {
    return true;
  }
}

export async function refreshAccessToken(): Promise<string | null> {
  const refresh = localStorage.getItem("refreshToken");
  if (!refresh) return null;

  try {
    const res = await fetch("http://localhost:8000/api/token/refresh/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });

    if (!res.ok) return null;

    const data = await res.json();
    localStorage.setItem("token", data.access);
    return data.access;
  } catch (err) {
    console.error("Refresh failed:", err);
    return null;
  }
}

export async function authFetch(url: string, options: RequestInit = {}) {
  let token = localStorage.getItem("token");

  if (!token || isTokenExpired(token)) {
    token = await refreshAccessToken();
    if (!token) {
      localStorage.clear();
      window.location.href = "/login";
      return;
    }
  }

  const headers = {
    ...(options.headers || {}),
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    token = await refreshAccessToken();
    if (!token) {
      localStorage.clear();
      window.location.href = "/login";
      return;
    }

    const retryHeaders = {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    return await fetch(url, { ...options, headers: retryHeaders });
  }

  return response;
}
