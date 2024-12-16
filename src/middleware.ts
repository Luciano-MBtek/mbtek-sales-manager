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
  },
} as const;

const ACCESS_LEVELS = {
  owner: [
    ROUTES.PROTECTED.CONTACTS,
    ROUTES.PROTECTED.FORMS,
    ROUTES.PROTECTED.USERDASHBOARD,
    ROUTES.PROTECTED.ADMINDASHBOARD,
  ],
  admin: [
    ROUTES.PROTECTED.CONTACTS,
    ROUTES.PROTECTED.FORMS,
    ROUTES.PROTECTED.USERDASHBOARD,
    ROUTES.PROTECTED.ADMINDASHBOARD,
  ],
  manager: [
    ROUTES.PROTECTED.CONTACTS,
    ROUTES.PROTECTED.FORMS,
    ROUTES.PROTECTED.USERDASHBOARD,
  ],
  schematic_team: [ROUTES.PROTECTED.CONTACTS, ROUTES.PROTECTED.SCHEMATICUP],
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
  const token = await getToken({ req });

  // Handle authentication routes
  if (path.startsWith(ROUTES.PUBLIC.AUTH)) {
    if (token) {
      return NextResponse.redirect(new URL(ROUTES.PUBLIC.HOME, req.url));
    }
    return NextResponse.next();
  }

  // Allow public routes
  if (path === ROUTES.PUBLIC.HOME) {
    return NextResponse.next();
  }

  // Handle protected routes
  if (isProtectedRoute(path)) {
    if (!token?.email) {
      const callbackUrl = encodeURIComponent(req.url);
      return NextResponse.redirect(
        new URL(`${ROUTES.PUBLIC.AUTH}?callbackUrl=${callbackUrl}`, req.url)
      );
    }

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
