import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <h1
        className="hero-title absolute left-6 top-[124px] w-[345px] h-[137px] [font-family:var(--font-hero)] [font-size:var(--hero-font-size)] [line-height:var(--hero-line-height)] [letter-spacing:var(--hero-letter-spacing)] [color:var(--hero-color)] font-normal"
      >
        Boka ett<br />rum
      </h1>

      <Button
        asChild
        variant="cta"
        size="xl"
        className="absolute left-1/2 -translate-x-1/2 bottom-[53px]"
      >
        <Link href="/booking" prefetch={false} scroll={false}>
          Boka
        </Link>
      </Button>
    </div>
  );
}
