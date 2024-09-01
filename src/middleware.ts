import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

// Define routes as constants
const CONTACTS = "/contacts";
const METRICS = "/metrics";
const HOME = "/";

// Function to parse comma-separated emails
function parseEmails(emails: string | undefined): string[] {
  return emails ? emails.split(",").map((email) => email.trim()) : [];
}

// Parse admin and user emails from environment variables
const adminEmails = parseEmails(process.env.ADMIN_EMAILS);
const userEmails = parseEmails(process.env.USER_EMAILS);

// Create access control object
const accessControl: Record<string, string[]> = {};

adminEmails.forEach((email) => {
  accessControl[email] = [CONTACTS, METRICS];
});

userEmails.forEach((email) => {
  accessControl[email] = [CONTACTS];
});

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  console.log(`Middleware executing for path: ${path}`);

  // Allow public access to home page
  if (path === HOME) {
    console.log("Home page is public, allowing access");
    return NextResponse.next();
  }

  // Check if this is a protected route
  if (path.startsWith(CONTACTS) || path.startsWith(METRICS)) {
    const token = await getToken({ req });
    const userEmail = token?.email as string | undefined;

    if (!userEmail) {
      console.error("User email not found in token");
      // Store the original path in the URL to redirect after login
      const callbackUrl = encodeURIComponent(req.url);
      return NextResponse.redirect(
        new URL(`/api/auth/signin?callbackUrl=${callbackUrl}`, req.url)
      );
    }

    // Check if the user has access
    if (!accessControl[userEmail]?.some((route) => path.startsWith(route))) {
      console.log(
        `User ${userEmail} does not have access to ${path}, redirecting to home`
      );
      return NextResponse.redirect(new URL(HOME, req.url));
    }

    console.log(`User ${userEmail} has access to ${path}, proceeding`);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/contacts", "/metrics", "/"],
};
