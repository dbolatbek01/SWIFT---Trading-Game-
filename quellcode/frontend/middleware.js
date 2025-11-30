import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    if (req.nextauth.token === undefined) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    return NextResponse.next();
  },
  {
    pages: {
      signIn: '/login',
    },
  }
);

export const config = { 
  matcher: [
    "/home", 
    "/portfolio", 
    "/cash", 
    "/profile", 
    "/search", 
    "/stocks/:shortname/view", 
    "/stocks/:shortname/buy", 
    "/stocks/:shortname/sell"
  ]
};
