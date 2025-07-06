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
    MY_CONTACTS: "my-contacts",
    USERDASHBOARD: "/dashboard",
    MEETINGS: "/my-meetings",
    CONTACTDEALS: "/deals/",
    ADMINDASHBOARD: "/admin-dashboard",
    DEALS: "/mydeals",
    SCHEMATICUP: "/deals/schematic-upload",
    PRODUCTS: "/products",
    RESOURCES: "/resources/",
    AI: "/agent-ai",
    ACTIVE_QUALIFICATIONS: "/active-qualifications",
    ENGAGEMENTS: "/engagements/",
  },
} as const;

const ACCESS_LEVELS = {
  owner: [
    ROUTES.PROTECTED.CONTACTS,
    ROUTES.PROTECTED.CONTACTDEALS,
    ROUTES.PROTECTED.USERDASHBOARD,
    ROUTES.PROTECTED.ADMINDASHBOARD,
    ROUTES.PROTECTED.MEETINGS,
    ROUTES.PROTECTED.PRODUCTS,
    ROUTES.PROTECTED.RESOURCES,
    ROUTES.PROTECTED.MY_CONTACTS,
    ROUTES.PROTECTED.DEALS,
    ROUTES.PROTECTED.AI,
    ROUTES.PROTECTED.ACTIVE_QUALIFICATIONS,
    ROUTES.PROTECTED.ENGAGEMENTS,
  ],
  admin: [
    ROUTES.PROTECTED.CONTACTS,
    ROUTES.PROTECTED.CONTACTDEALS,
    ROUTES.PROTECTED.USERDASHBOARD,
    ROUTES.PROTECTED.ADMINDASHBOARD,
    ROUTES.PROTECTED.MEETINGS,
    ROUTES.PROTECTED.PRODUCTS,
    ROUTES.PROTECTED.RESOURCES,
    ROUTES.PROTECTED.MY_CONTACTS,
    ROUTES.PROTECTED.DEALS,
    ROUTES.PROTECTED.AI,
  ],
  manager: [
    ROUTES.PROTECTED.CONTACTS,
    ROUTES.PROTECTED.CONTACTDEALS,
    ROUTES.PROTECTED.USERDASHBOARD,
    ROUTES.PROTECTED.MEETINGS,
    ROUTES.PROTECTED.PRODUCTS,
    ROUTES.PROTECTED.RESOURCES,
    ROUTES.PROTECTED.MY_CONTACTS,
    ROUTES.PROTECTED.DEALS,
    ROUTES.PROTECTED.AI,
  ],
  sales_agent: [
    ROUTES.PROTECTED.CONTACTS,
    ROUTES.PROTECTED.CONTACTDEALS,
    ROUTES.PROTECTED.USERDASHBOARD,
    ROUTES.PROTECTED.MEETINGS,
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
    ROUTES.PROTECTED.CONTACTDEALS,
    ROUTES.PROTECTED.PRODUCTS,
    ROUTES.PROTECTED.RESOURCES,
    ROUTES.PROTECTED.MY_CONTACTS,
    ROUTES.PROTECTED.MEETINGS,
    ROUTES.PROTECTED.DEALS,
    ROUTES.PROTECTED.AI,
    ROUTES.PROTECTED.ACTIVE_QUALIFICATIONS,
    ROUTES.PROTECTED.ENGAGEMENTS,
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

  // Verify exact access
  if (allowedRoutes.some((route) => route === path)) {
    return true;
  }

  // Verify access to base routes (end with "/")
  for (const route of allowedRoutes) {
    if (route.endsWith("/") && path.startsWith(route)) {
      return true;
    }
  }

  // If it does not match any allowed route
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
    if (!token?.email || token?.error) {
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
