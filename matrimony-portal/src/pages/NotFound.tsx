import { ArrowLeft, Compass } from 'lucide-react';
import { Link } from 'wouter';

export default function NotFound() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-5">
      <div className="max-w-md text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#e4eadf] text-primary"><Compass size={23} /></span>
        <p className="mt-6 text-[10px] font-bold uppercase tracking-[.23em] text-[#a4784c]">A quiet detour</p>
        <h1 className="mt-2 font-display text-[44px] text-foreground">This page isn't here.</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">Let's take you back to the community introductions.</p>
        <Link href="/" className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-[12px] font-semibold text-primary-foreground"><ArrowLeft size={14} /> Return to discovery</Link>
      </div>
    </div>
  );
}
