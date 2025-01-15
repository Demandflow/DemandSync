import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
    publicRoutes: ["/"],
    afterAuth(auth, req) {
        // Handle users who aren't authenticated
        if (!auth.userId && !auth.isPublicRoute) {
            return Response.redirect(new URL('/', req.url))
        }

        // If the user is signed in and tries to access the home page,
        // redirect them to the dashboard
        if (auth.userId && req.nextUrl.pathname === '/') {
            return Response.redirect(new URL('/dashboard', req.url))
        }
    }
});

export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}; 