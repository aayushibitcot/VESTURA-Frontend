'use server';
/* eslint-disable @typescript-eslint/no-explicit-any */

import {GraphQLClient} from 'graphql-request';
import {cookies} from 'next/headers';
import {config} from '@/utils/config';
import { DocumentNode } from '@apollo/client';
import { ErrorResponse, SingleErrorResponse } from '@/lib/types';

export const graphqlClient = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;
  const endpoint = config?.REST_API_URL ?? '';
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };

  // Only add Authorization header if token exists
  if (token) {
    headers.authorization = `Bearer ${token}`;
  }

  return new GraphQLClient(endpoint, {
    headers
  });
};


export const fetchGraphQLQuery = async <
  T,
  V extends Record<string, unknown> = Record<string, unknown>
>(
  query: DocumentNode,
  variables?: V
): Promise<T | SingleErrorResponse> => {
  try {
    const res = await (await graphqlClient()).request<T | ErrorResponse>(query, variables ?? ({} as V));
    // Type guard: check if it's an ErrorResponse
    if (isErrorResponse(res)) {
      throw res.errors[0];
    }
    return res;
  } catch (error: any) {
    const err = error?.response?.errors?.[0] ?? error;
    return err as SingleErrorResponse;
  }
};

export const fetchGraphQLMutation = async <
  T,
  V extends Record<string, unknown> = Record<string, unknown>
>(
  mutation: DocumentNode,
  variables?: V
): Promise<T | SingleErrorResponse> => {
  try {
    const client = await graphqlClient();
    const res = await client.request<T | ErrorResponse>(mutation, variables ?? ({} as V));
    if (isErrorResponse(res)) {
      throw res.errors[0];
    }
    return res;
  } catch (error: any) {
    const message = error?.response?.errors?.[0]?.message ?? error?.message ?? 'Unknown error';
    return message as any;
  }
};

function isErrorResponse(obj: unknown): obj is ErrorResponse {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "errors" in obj &&
    Array.isArray((obj as any).errors)
  );
}