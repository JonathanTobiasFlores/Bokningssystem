import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function BookingPage() {
  return (
    <div className="relative min-h-screen px-6 pt-20">
      {/* Page title */}
      <h1 className="page-title [font-family:var(--font-roboto)] [font-size:var(--title-font-size)] [line-height:var(--title-line-height)] [letter-spacing:var(--title-letter-spacing)] [color:var(--title-color)] font-normal w-[345px] h-[40px] absolute left-6 top-[80px]">
        Välj en tid
      </h1>

      {/* Dropdown placeholder */}
      <div className="absolute left-6 top-[160px] w-[200px] h-12 bg-white rounded-md border flex items-center justify-center text-sm text-foreground/80">
        3 valda rum ▼
      </div>

      {/* Calendar grid placeholder */}
      <div className="absolute left-6 right-6 top-[260px] bottom-[130px] border rounded-lg bg-white/40 flex items-center justify-center text-muted">
        <span className="text-muted-foreground">[Calendar grid goes here]</span>
      </div>

      <Button
        asChild
        variant="cta"
        size="xl"
        className="absolute left-1/2 -translate-x-1/2 bottom-[53px]"
      >
        <Link href="/confirm">
          Nästa
        </Link>
      </Button>
    </div>
  );
} 