import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

// Define routes as constants
const CONTACTS = "/contacts";
const FORMS = "/forms";
const HOME = "/";

// Define access levels and their allowed routes
const accessRoutes: Record<string, string[]> = {
  owner: [CONTACTS, FORMS],
  admin: [CONTACTS, FORMS],
  manager: [CONTACTS],
};

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  console.log(`Middleware executing for path: ${path}`);

  if (path.startsWith("/api/auth/signin")) {
    const token = await getToken({ req });
    if (token) {
      console.log("Usuario ya autenticado, redirigiendo al home");
      return NextResponse.redirect(new URL(HOME, req.url));
    }
  }

  // Allow public access to the home page
  if (path === HOME) {
    console.log("Home page is public, allowing access");
    return NextResponse.next();
  }

  // Check if this is a protected route
  if (path.startsWith(CONTACTS) || path.startsWith(FORMS)) {
    const token = await getToken({ req });
    const userEmail = token?.email as string | undefined;
    const accessLevel = token?.accessLevel as string | undefined;

    if (!userEmail) {
      console.error("User email not found in token");
      // Redirect to sign-in page
      const callbackUrl = encodeURIComponent(req.url);
      return NextResponse.redirect(
        new URL(`/api/auth/signin?callbackUrl=${callbackUrl}`, req.url)
      );
    }

    if (!accessLevel) {
      console.error("Access level not found in token");
      // Redirect to home page
      return NextResponse.redirect(new URL(HOME, req.url));
    }

    // Check if the user has access to the route
    const allowedRoutes = accessRoutes[accessLevel] || [];
    if (!allowedRoutes.some((route) => path.startsWith(route))) {
      console.log(
        `User ${userEmail} with access level ${accessLevel} does not have access to ${path}, redirecting to home`
      );
      return NextResponse.redirect(new URL(HOME, req.url));
    }

    console.log(
      `User ${userEmail} with access level ${accessLevel} has access to ${path}, proceeding`
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/contacts/:path*", "/forms/:path*", "/", "/api/auth/signin"],
};
