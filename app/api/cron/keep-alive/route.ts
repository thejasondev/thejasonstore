import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * Vercel Cron Job — Supabase Keep-Alive
 *
 * Supabase pauses free-tier projects after 7 days of inactivity.
 * This endpoint runs every 3 days via Vercel Cron to prevent that.
 */
// Schedule: "0 8 */3 * *" (every 3 days at 8:00 AM UTC)
export async function GET(request: Request) {
  // Verify the request comes from Vercel Cron
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = await createClient();

    // Lightweight query to keep the database active
    const { count, error } = await supabase
      .from("products")
      .select("id", { count: "exact", head: true });

    if (error) {
      console.error("[keep-alive] Supabase query failed:", error.message);
      return NextResponse.json(
        {
          status: "error",
          timestamp: new Date().toISOString(),
          error: error.message,
        },
        { status: 500 },
      );
    }

    console.log(
      `[keep-alive] OK — ${count} products, ${new Date().toISOString()}`,
    );

    return NextResponse.json({
      status: "alive",
      timestamp: new Date().toISOString(),
      productCount: count,
    });
  } catch (error) {
    console.error("[keep-alive] Unexpected error:", error);
    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
