import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

const ROUTES = {
  PUBLIC: {
    HOME: "/",
    AUTH: "/api/auth/signin",
  },
  PROTECTED: {
    CONTACTS: "/contacts/",
    USERDASHBOARD: "/dashboard",
    FORMS: "/forms/",
    ADMINDASHBOARD: "/admin-dashboard",
    SCHEMATICUP: "/forms/schematic-upload",
    MY_CONTACTS: "my-contacts",
    DEALS: "/mydeals",
    PRODUCTS: "/products",
    RESOURCES: "/resources/",
    AI: "/agent-ai",
  },
} as const;

const ACCESS_LEVELS = {
  owner: [
    ROUTES.PROTECTED.CONTACTS,
    ROUTES.PROTECTED.FORMS,
    ROUTES.PROTECTED.USERDASHBOARD,
    ROUTES.PROTECTED.ADMINDASHBOARD,
    ROUTES.PROTECTED.PRODUCTS,
    ROUTES.PROTECTED.RESOURCES,
    ROUTES.PROTECTED.MY_CONTACTS,
    ROUTES.PROTECTED.DEALS,
    ROUTES.PROTECTED.AI,
  ],
  admin: [
    ROUTES.PROTECTED.CONTACTS,
    ROUTES.PROTECTED.FORMS,
    ROUTES.PROTECTED.USERDASHBOARD,
    ROUTES.PROTECTED.ADMINDASHBOARD,
    ROUTES.PROTECTED.PRODUCTS,
    ROUTES.PROTECTED.RESOURCES,
    ROUTES.PROTECTED.MY_CONTACTS,
    ROUTES.PROTECTED.DEALS,
    ROUTES.PROTECTED.AI,
  ],
  manager: [
    ROUTES.PROTECTED.CONTACTS,
    ROUTES.PROTECTED.FORMS,
    ROUTES.PROTECTED.USERDASHBOARD,
    ROUTES.PROTECTED.PRODUCTS,
    ROUTES.PROTECTED.RESOURCES,
    ROUTES.PROTECTED.MY_CONTACTS,
    ROUTES.PROTECTED.DEALS,
    ROUTES.PROTECTED.AI,
  ],
  schematic_team: [
    ROUTES.PROTECTED.CONTACTS,
    ROUTES.PROTECTED.SCHEMATICUP,
    ROUTES.PROTECTED.RESOURCES,
  ],
  lead_agent: [
    ROUTES.PROTECTED.CONTACTS,
    ROUTES.PROTECTED.FORMS,
    ROUTES.PROTECTED.PRODUCTS,
    ROUTES.PROTECTED.RESOURCES,
    ROUTES.PROTECTED.MY_CONTACTS,
    ROUTES.PROTECTED.DEALS,
    ROUTES.PROTECTED.AI,
  ],
} as const;

const isProtectedRoute = (path: string): boolean => {
  return Object.values(ROUTES.PROTECTED).some((route) =>
    path.startsWith(route)
  );
};

const hasRouteAccess = (accessLevel: string, path: string): boolean => {
  const allowedRoutes =
    ACCESS_LEVELS[accessLevel as keyof typeof ACCESS_LEVELS] || [];

  // Verificar acceso exacto
  if (allowedRoutes.some((route) => route === path)) {
    return true;
  }

  // Verificar acceso a rutas base (terminan con "/")
  for (const route of allowedRoutes) {
    if (route.endsWith("/") && path.startsWith(route)) {
      return true;
    }
  }

  // Si no coincide con ninguna ruta permitida
  return false;
};

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Skip middleware for auth API routes (except signin page)
  if (path.startsWith("/api/auth/") && !path.startsWith(ROUTES.PUBLIC.AUTH)) {
    return NextResponse.next();
  }

  const token = await getToken({ req });

  // Handle authentication routes
  if (path.startsWith(ROUTES.PUBLIC.AUTH)) {
    if (token) {
      return NextResponse.redirect(new URL(ROUTES.PUBLIC.HOME, req.url));
    }
    return NextResponse.next();
  }

  // Redirect to auth if no token (for all routes)
  if (!token?.email) {
    const callbackUrl = encodeURIComponent(req.url);
    return NextResponse.redirect(
      new URL(`${ROUTES.PUBLIC.AUTH}?callbackUrl=${callbackUrl}`, req.url)
    );
  }

  // For protected routes, check access level
  if (isProtectedRoute(path)) {
    if (!token.accessLevel) {
      return NextResponse.redirect(new URL(ROUTES.PUBLIC.HOME, req.url));
    }

    if (!hasRouteAccess(token.accessLevel as string, path)) {
      return NextResponse.redirect(
        new URL(`${ROUTES.PUBLIC.HOME}?access_denied=true`, req.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
