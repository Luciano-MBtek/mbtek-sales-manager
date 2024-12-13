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
    USERDASHBOARD: "/dashboard/",
    FORMS: "/forms/",
    ADMINDASHBOARD: "/admin-dashboard/",
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
  schematic_team: [
    ROUTES.PROTECTED.CONTACTS,
    ROUTES.PROTECTED.FORMS,
    ROUTES.PROTECTED.SCHEMATICUP,
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

  if ((allowedRoutes as readonly string[]).includes(path)) {
    return true;
  }

  for (const route of allowedRoutes) {
    if (route.endsWith("/") && path.startsWith(route)) {
      // Existe una ruta base que podría permitir el acceso a esta subruta.
      // Pero debemos asegurarnos que esta subruta no es una ruta especial
      // que debería estar listada explícitamente y no lo está.

      // Por ejemplo, si la subruta es /forms/schematic-upload y no está en la lista,
      // entonces no está permitido.
      if (
        path === ROUTES.PROTECTED.SCHEMATICUP &&
        !(allowedRoutes as readonly string[]).includes(
          ROUTES.PROTECTED.SCHEMATICUP
        )
      ) {
        return false;
      }

      // De lo contrario, si es una subruta no listada específicamente,
      // pero hay una ruta base que la incluye, permitimos el acceso.
      return true;
    }
  }

  // Si no coincide con rutas exactas ni con base routes, no hay acceso.
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
      return NextResponse.redirect(new URL(ROUTES.PUBLIC.HOME, req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
