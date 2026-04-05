const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

interface ApiError {
  message: string;
  status: number;
}

export async function api<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  });

  if (!response.ok) {
    const error: ApiError = {
      message: "Erro ao conectar com o servidor",
      status: response.status,
    };

    try {
      const body = await response.json();
      error.message = body.message || body.error || error.message;
    } catch {
    }

    throw error;
  }

  return response.json();
}
