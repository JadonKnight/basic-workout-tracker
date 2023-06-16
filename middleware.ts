import { withAuth } from "next-auth/middleware";

// Define custom behavior for protected routes.
// More here - https://next-auth.js.org/configuration/nextjs#secret

export default withAuth({
  pages: {
    signIn: "/signin",
  },
});

export const config = { matcher: ["/workout/new", "/api/:path*"] };
