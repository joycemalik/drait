import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const nextParam = searchParams.get("next") ?? "/today";
  // Only allow same-site relative redirects.
  const next = nextParam.startsWith("/") && !nextParam.startsWith("//") ? nextParam : "/today";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${next}`);
  }
  // Supabase reports a rejected signup (our college-email rule) as a database error.
  const reason = searchParams.get("error_description") ?? "";
  const notCollege = /database error|college/i.test(reason);
  return NextResponse.redirect(`${origin}/?signin=${notCollege ? "college-only" : "failed"}`);
}
