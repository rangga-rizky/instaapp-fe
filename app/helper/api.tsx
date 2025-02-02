import axios from "axios";
import { LoginRequest, LoginResponse, Post, RegisterRequest, RegisterResponse, Reply, ReplyRequest } from "./model";


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
  return response.data;
}

export async function logout() {
  const response = await protectedApiClient.post(
    `${process.env.NEXT_PUBLIC_INSTAAPP_SERVICE_URL}/api/logout`
  )
  return response.data;
}

export async function getPost(id: number): Promise<Post> {
  const response = await protectedApiClient.get(
    `${process.env.NEXT_PUBLIC_INSTAAPP_SERVICE_URL}/api/posts/${id}`
  )
  return response.data.data;
}

export async function getPosts(): Promise<Post[]> {
  const response = await protectedApiClient.get(
    `${process.env.NEXT_PUBLIC_INSTAAPP_SERVICE_URL}/api/posts`
  )
  return response.data.data;
}

export async function createReply(request: ReplyRequest): Promise<Reply> {
  const response = await protectedApiClient.post(
    `${process.env.NEXT_PUBLIC_INSTAAPP_SERVICE_URL}/api/replies`,
    request
  )
  return response.data.data;
}

export async function createPost(imageFile: File, caption: string): Promise<Post> {
  const formData = new FormData();
  formData.append('image', imageFile);
  formData.append('caption', caption);

  const response = await protectedApiClient.post(
    `${process.env.NEXT_PUBLIC_INSTAAPP_SERVICE_URL}/api/posts`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data.data;
}