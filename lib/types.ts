export interface GraphQLError {
  message: string
  path?: Array<string | number>
  extensions?: Record<string, unknown>
  [key: string]: unknown
}

export interface ErrorResponse {
  errors: GraphQLError[]
  data?: unknown
}

export type SingleErrorResponse = GraphQLError | string

