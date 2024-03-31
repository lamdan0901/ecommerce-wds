import { NextRequest, NextResponse } from "next/server";
import { isValidPassword } from "./lib/utils";

export async function middleware(req: NextRequest) {
  if (!(await isAuthenticated(req)))
    return new NextResponse("Unauthorized", {
      status: 401,
      headers: { "WWW-Authenticate": "Basic" },
    });
}

async function isAuthenticated(req: NextRequest) {
  const authHeader =
    req.headers.get("Authorization") || req.headers.get("authorization");
  if (!authHeader) return false;

  // Normally, the format of basic auth is 'Basic username:password'
  const [username, password] = Buffer.from(authHeader.split(" ")[1], "base64")
    .toString()
    .split(":");

  // await isValidPassword("admin", process.env.HASHED_ADMIN_PASSWORD as string);
  // return false;

  // This check is for testing purpose
  return (
    username === process.env.ADMIN_USERNAME &&
    (await isValidPassword(
      password,
      process.env.HASHED_ADMIN_PASSWORD as string
    ))
  );
}

export const config = { matcher: "/admin/:path*" };
