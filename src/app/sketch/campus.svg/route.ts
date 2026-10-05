import { heroSketchSVG } from "@/lib/hero-sketch";

let svg: string | null = null;

// The drawing never changes between deploys, so browsers and CDNs may keep it for a long time.
export function GET() {
  svg ??= heroSketchSVG();
  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}
