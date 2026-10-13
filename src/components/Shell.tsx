import type { ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import { ArrowUpRight, CircleUserRound, Menu, ShieldCheck, UsersRound, X } from 'lucide-react';
import { useState } from 'react';
import { useClerk, useUser } from '@clerk/react';

export function Shell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const { isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const links = [
    { href: '/', label: 'Discover', icon: UsersRound },
    ...(isSignedIn ? [{ href: '/connections', label: 'Connections', icon: CircleUserRound }] : []),
    ...(isSignedIn ? [{ href: '/moderation', label: 'Community review', icon: ShieldCheck }] : []),
  ];

  return (
    <div className="min-h-[100dvh] bg-background">
      <header className="relative z-40 border-b border-border/70 bg-background/95">
        <div className="mx-auto flex max-w-[1320px] items-center justify-between px-5 py-4 md:px-10">
          <Link href="/" className="group flex items-center gap-3" data-testid="link-home">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-accent">
              <span className="font-display text-[22px] leading-none">S</span>
            </span>
            <span>
              <span className="block font-display text-[19px] font-semibold tracking-tight text-foreground">Sutra</span>
              <span className="block text-[9px] font-semibold uppercase tracking-[.22em] text-muted-foreground">A community introduction</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            {links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-[13px] font-medium transition-colors hover:text-primary ${location === item.href ? 'text-primary' : 'text-muted-foreground'}`}
                data-testid={`link-nav-${item.label.toLowerCase().replaceAll(' ', '-')}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="hidden items-center gap-3 md:flex">
            {isSignedIn ? (
              <>
                <span className="max-w-40 truncate text-[12px] text-muted-foreground">{user?.firstName ?? user?.primaryEmailAddress?.emailAddress}</span>
                <button
                  type="button"
                  onClick={() => void signOut({ redirectUrl: import.meta.env.BASE_URL })}
                  className="rounded-full px-4 py-2 text-[13px] font-semibold text-primary transition-colors hover:bg-secondary"
                  data-testid="button-sign-out"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link href="/sign-in" className="rounded-full px-4 py-2 text-[13px] font-semibold text-primary transition-colors hover:bg-secondary" data-testid="link-sign-in">
                Sign in
              </Link>
            )}
            {!isSignedIn && (
              <Link href="/sign-up" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-[13px] font-semibold text-primary-foreground shadow-sm transition-transform hover:-translate-y-0.5" data-testid="link-start-profile">
                Begin your profile <ArrowUpRight size={15} />
              </Link>
            )}
            {isSignedIn && (
              <Link href="/join" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-[13px] font-semibold text-primary-foreground shadow-sm transition-transform hover:-translate-y-0.5">
                Create your profile <ArrowUpRight size={15} />
              </Link>
            )}
          </div>
          <button
            type="button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-primary md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            data-testid="button-menu"
          >
            {menuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
        {menuOpen && (
          <div className="absolute left-0 right-0 top-full border-b border-border bg-background px-5 pb-5 pt-2 shadow-lg md:hidden">
            <div className="flex flex-col">
              {links.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} className="flex items-center gap-3 border-b border-border/70 py-3 text-sm font-medium text-foreground">
                  <item.icon size={17} /> {item.label}
                </Link>
              ))}
              {!isSignedIn ? (
                <>
                  <Link href="/sign-in" onClick={() => setMenuOpen(false)} className="mt-4 rounded-full border border-primary/25 px-4 py-3 text-center text-sm font-semibold text-primary">Sign in</Link>
                  <Link href="/sign-up" onClick={() => setMenuOpen(false)} className="mt-3 rounded-full bg-primary px-4 py-3 text-center text-sm font-semibold text-primary-foreground">Begin your profile</Link>
                </>
              ) : (
                <>
                  <Link href="/join" onClick={() => setMenuOpen(false)} className="mt-4 rounded-full bg-primary px-4 py-3 text-center text-sm font-semibold text-primary-foreground">Create your profile</Link>
                  <button type="button" onClick={() => void signOut({ redirectUrl: import.meta.env.BASE_URL })} className="mt-3 rounded-full border border-border px-4 py-3 text-sm font-semibold text-muted-foreground">Sign out</button>
                </>
              )}
            </div>
          </div>
        )}
      </header>
      <main>{children}</main>
      <footer className="border-t border-border/70 bg-[#e9e7dc]">
        <div className="mx-auto flex max-w-[1320px] flex-col gap-3 px-5 py-8 text-[12px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between md:px-10">
          <p>Thoughtful introductions, held by community.</p>
          <div className="flex items-center gap-5">
            <Link href="/join" className="transition-colors hover:text-primary">Create a profile</Link>
            <Link href="/connections" className="transition-colors hover:text-primary">Your connections</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
