export interface UserProfileResponse {
  success: boolean;
  message?: string;
  data?: {
    user?: any;
  };
}