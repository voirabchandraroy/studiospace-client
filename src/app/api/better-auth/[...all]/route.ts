import { getAuth, isBetterAuthReady } from "@/lib/better-auth";

export const dynamic = "force-dynamic";

const toResponse = async (req: Request) => {
  if (!isBetterAuthReady) {
    return Response.json(
      { message: "Google sign-in is not configured yet. Add GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, BETTER_AUTH_SECRET and MONGODB_URI to .env.local." },
      { status: 500 }
    );
  }
  return getAuth().handler(req);
};

export async function GET(req: Request) {
  return toResponse(req);
}

export async function POST(req: Request) {
  return toResponse(req);
}
