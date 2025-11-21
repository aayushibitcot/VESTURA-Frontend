import { gql, DocumentNode } from '@apollo/client';

export const SIGN_IN_MUTATION: DocumentNode = gql`
 mutation SignIn($input: SignInInput!) {
  signIn(input: $input) {
    accessToken
    message
    refreshToken
    success
    token
    user {
      active_status
      avatar_path
      created_at
      email
      first_name
      id
      last_login_at
      last_name
      phone
      platform
      role
      updated_at
    }
  }
}
`;

export const SIGN_UP_MUTATION: DocumentNode = gql`
 mutation SignUp($input: SignUpInput!) {
  signUp(input: $input) {
    message
    success
  }
}
`;
export const FORGOT_PASSWORD_MUTATION : DocumentNode = gql`
mutation ForgetPassword($username: String!) {
  forgetPassword(username: $username) {
    message
    success
  }
}
`;
export const RESET_PASSWORD_MUTATION: DocumentNode = gql`
 mutation ResetPassword($code: String!, $newPassword: String!, $username: String!) {
  resetPassword(code: $code, newPassword: $newPassword, username: $username) {
    success
    message
  }
}
`;  

export const CHANGE_PASSWORD_MUTATION: DocumentNode = gql`
mutation ChangePassword($input: ChangePasswordInput!) {
  ChangePassword(input: $input) {
    message
    success
  }
}`


export const GET_PRESIGNED_URL_MUTATION: DocumentNode = gql`
mutation GetPresignedUrlForArray($input: PresignedUrlArrayInput!) {
  getPresignedUrlForArray(input: $input) {
    data {
      file_path
      signedUrl
      
    }
    message
    success
  }
}
`;


export const UPDATE_USER_MUTATION: DocumentNode = gql`
mutation UpdateUser($updateUserId: String!, $updateUserInput: UpdateUserInput!) {
  updateUser(id: $updateUserId, updateUserInput: $updateUserInput) {
    message
    success
    user {
      avatar_path
      first_name
      last_name
      phone

    }
  }
}`

