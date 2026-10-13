import { markdownMiddleware } from "./src/lib/agent/markdownMiddleware";

export const config = {
  matcher: ["/api/:path*", "/((?!api/|_vercel/|assets/|.*\\.[A-Za-z0-9]+$).*)"],
};

export default function middleware(request: Request): Response | undefined {
  return markdownMiddleware(request);
}
