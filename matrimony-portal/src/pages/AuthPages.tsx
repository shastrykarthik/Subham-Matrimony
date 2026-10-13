import type { ReactNode } from 'react';
import { SignIn, SignUp } from '@clerk/react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';

const browserBase = import.meta.env.BASE_URL.replace(/\/$/, '');

export function SignInPage() {
  return (
    <AuthFrame eyebrow="Welcome back" title="Pick up where your story left off" description="Sign in to continue your introductions and conversations.">
      <SignIn
        routing="path"
        path={`${browserBase}/sign-in`}
        signUpUrl={`${browserBase}/sign-up`}
        fallbackRedirectUrl={`${browserBase}/connections`}
      />
    </AuthFrame>
  );
}

export function SignUpPage() {
  return (
    <AuthFrame eyebrow="Join the community" title="Begin with a thoughtful introduction" description="Create an account, then share the details that make your story yours.">
      <SignUp
        routing="path"
        path={`${browserBase}/sign-up`}
        signInUrl={`${browserBase}/sign-in`}
        fallbackRedirectUrl={`${browserBase}/join`}
      />
    </AuthFrame>
  );
}

function AuthFrame({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children: ReactNode }) {
  return (
    <div className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-[#e9e7dc] px-5 py-12">
      <div className="absolute -left-36 -top-36 h-[520px] w-[520px] rounded-full border border-[#c9b991]/50" />
      <div className="absolute -left-12 -top-12 h-[270px] w-[270px] rounded-full border border-[#c9b991]/40" />
      <div className="absolute -bottom-48 -right-40 h-[600px] w-[600px] rounded-full bg-[#dce3d6]/70" />
      <div className="relative z-10 w-full max-w-[1040px] overflow-hidden rounded-[30px] border border-border bg-card shadow-[0_30px_100px_-55px_rgba(28,65,54,.45)] md:grid md:grid-cols-[.9fr_1.1fr]">
        <aside className="relative hidden min-h-[680px] overflow-hidden bg-primary p-10 text-primary-foreground md:block">
          <div className="absolute -right-24 -top-20 h-80 w-80 rounded-full border border-[#d6b77f]/35" />
          <div className="absolute -right-1 top-5 h-52 w-52 rounded-full border border-[#d6b77f]/35" />
          <Link href="/" className="relative z-10 inline-flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d6b77f] font-display text-[22px] text-primary">S</span>
            <span className="font-display text-[20px]">Sutra</span>
          </Link>
          <div className="absolute bottom-12 left-10 right-10">
            <p className="text-[10px] font-bold uppercase tracking-[.23em] text-[#dfc291]">Belonging is a beginning</p>
            <p className="mt-4 max-w-sm font-display text-[36px] leading-[1.2]">A good introduction carries the warmth of being known.</p>
            <div className="mt-7 h-px w-14 bg-[#d6b77f]" />
            <p className="mt-4 text-[11px] leading-5 text-white/60">Culturally informed. Community reviewed. Always human.</p>
          </div>
          <div className="absolute bottom-0 right-0 h-48 w-48 rounded-tl-full border-l border-t border-[#d6b77f]/20" />
        </aside>
        <section className="px-6 py-8 sm:px-10 sm:py-10 md:px-12 md:py-12">
          <Link href="/" className="mb-8 inline-flex items-center gap-2 text-[11px] font-semibold text-muted-foreground transition-colors hover:text-primary md:hidden"><ArrowLeft size={14} /> Back to Sutra</Link>
          <p className="text-[10px] font-bold uppercase tracking-[.21em] text-[#a4784c]">{eyebrow}</p>
          <h1 className="mt-2 font-display text-[33px] leading-tight tracking-[-.02em] text-foreground">{title}</h1>
          <p className="mt-2 mb-7 text-[12px] leading-5 text-muted-foreground">{description}</p>
          {children}
          <p className="mt-7 border-t border-border/70 pt-5 text-center text-[10px] leading-5 text-muted-foreground">Your community introductions are private and handled with care.</p>
        </section>
      </div>
    </div>
  );
}
