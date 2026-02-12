const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001/api";

export class ApiClient {
  private baseUrl = API_URL;
  private token: string | null = null;

  constructor() {
    // Load token from localStorage on init
    this.token = localStorage.getItem("authToken");
  }

  /**
   * Set the JWT token
   */
  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem("authToken", token);
    } else {
      localStorage.removeItem("authToken");
    }
  }

  /**
   * Get the current token
   */
  getToken(): string | null {
    return this.token;
  }

  /**
   * Make an authenticated request
   */
  private async request<T = any>(
    method: string,
    path: string,
    body?: any
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP ${response.status}`);
    }

    return data;
  }

  /**
   * GET request
   */
  get<T = any>(path: string): Promise<T> {
    return this.request<T>("GET", path);
  }

  /**
   * POST request
   */
  post<T = any>(path: string, body: any): Promise<T> {
    return this.request<T>("POST", path, body);
  }

  /**
   * Request a nonce for wallet authentication
   */
  async getNonce(address: string): Promise<{ message: string }> {
    return this.get(`/auth/nonce?address=${encodeURIComponent(address)}`);
  }

  /**
   * Verify a signed message and get JWT token
   */
  async verifySignature(
    address: string,
    signature: string,
    message: string
  ): Promise<{ token: string }> {
    return this.post("/auth/verify", { address, signature, message });
  }

  /**
   * Verify current token
   */
  async verifyToken(): Promise<{ address: string; valid: boolean }> {
    return this.get("/auth/verify-token");
  }
}

export const apiClient = new ApiClient();
