"use server";
import { ChangePasswordType, UpdateUserType } from "@/types/profile";
import { fetchGraphQLMutation } from "..";
import {
  CHANGE_PASSWORD_MUTATION,
  FORGOT_PASSWORD_MUTATION,
  GET_PRESIGNED_URL_MUTATION,
  RESET_PASSWORD_MUTATION,
  SIGN_IN_MUTATION,
  SIGN_UP_MUTATION,
  UPDATE_USER_MUTATION,
} from "./query";
import { SignInInput, SignInResponse, SignupFormType, SignUpRespose } from "@/lib/types";

export const signInAction = async ({
  variables,
}: {
  variables: { input: SignInInput };
}): Promise<SignInResponse> => {
  const res = await fetchGraphQLMutation<SignInResponse>(SIGN_IN_MUTATION, variables);
  return res as SignInResponse;
};

export const signUpAction = async (variables: { input: SignupFormType }): Promise<SignUpRespose> => {
  const res = await fetchGraphQLMutation<SignUpRespose>(SIGN_UP_MUTATION, variables);
  return res as SignUpRespose;
};

export const changePasswordAction = async (form: ChangePasswordType): Promise<any> => {
  const variables = {
    input: {...form}
  };
  const res: any = await fetchGraphQLMutation<any>(
    CHANGE_PASSWORD_MUTATION,
    variables
  );
  return res;
};

export const forgotPasswordAction = async ({
  variables,
}: {
  variables: { username: string };
}): Promise<any> => {
  const res: any = await fetchGraphQLMutation<any>(
    FORGOT_PASSWORD_MUTATION,
    variables
  );
  return res;
};

export const resetPasswordAction = async ({
  variables,
}: {
  variables: { code: string; newPassword: string; username: string };
}): Promise<any> => {
  const res: any = await fetchGraphQLMutation<any>(
    RESET_PASSWORD_MUTATION,
    variables
  );
  return res;
};

export const getPresignedUrlAction = async (selectedFile: File): Promise<any> => {
  const variables = {
    input: { extensions: [`.${selectedFile?.type}`] },
  }
  const res: any = await fetchGraphQLMutation<any>(
    GET_PRESIGNED_URL_MUTATION,
    variables
  );
  return res;
};

export const updateUserAction = async (form: UpdateUserType, selectedFilePath?: string): Promise<any> => {
  const { updateUserId, first_name, last_name, phone, role } = form;
  const updateUserInput: Record<string, any> = {
    first_name,
    last_name,
    role,
    phone,    
    ...(selectedFilePath && { file_path: selectedFilePath }), 
  };

  const variables = {
    updateUserId,
    updateUserInput,
  };
  const res: any = await fetchGraphQLMutation<any>(
    UPDATE_USER_MUTATION,
    variables
  );
  return res;
};
