// FIXME: This was breaking signup, don't need for now so I'll comment out for now

// import { withAuth } from "next-auth/middleware";

// // Define custom behavior for protected routes.
// // More here - https://next-auth.js.org/configuration/nextjs#secret

// export default withAuth({
//   pages: {
//     signIn: "/signin",
//   },
// });

// export const config = { matcher: ["/workout/new", "/api/:path*", "/dashboard"] };
export default () => undefined;