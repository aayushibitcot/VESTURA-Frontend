export const config = {
    API_URL: process.env.NEXT_PUBLIC_GRAPHQL_API_URL,
    REST_API_URL: process.env.NEXT_PUBLIC_REST_API_URL || 'http://localhost:4000',
    STRIPE_SECRET_KEY: process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY ?? "",
    STRIPE_PUBLIC_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY ?? "",
};
