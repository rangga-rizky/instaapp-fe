import axios from "axios";
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from "./model";


const protectedApiClient = axios.create({
  headers: {
    'Content-Type': 'application/json',
    'accept': 'application/json',
  }
});

protectedApiClient.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export async function registerUser(request: RegisterRequest): Promise<RegisterResponse> {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_INSTAAPP_SERVICE_URL}/api/register`,
    request
  )
  return response.data.data;
}

export async function login(request: LoginRequest): Promise<LoginResponse> {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_INSTAAPP_SERVICE_URL}/api/login`,
    request
  )
  return response.data.data;
}
