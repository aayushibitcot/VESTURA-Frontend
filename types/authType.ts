export type AuthState = {
    token: string | null;
    refresh_token: string;
    user: any;
}

export type LoginRes = {
    access_token: string
    user: any,
    refresh_token: string;
}

export interface SignupFormType {
    username: string
    email: string
    password: string
    firstName: string
    lastName: string
    avatar?: string
    phone?: string
}
  
export interface SignUpRespose {
    message: string
    success: boolean
}

export interface SignInInput {
    email: string
    password: string
}

export interface SignInResponse {
    accessToken: string
    refreshToken: string
    user: User
}

export interface User {
    id: string
    email: string
    firstName: string
    lastName: string
    avatar: string
}