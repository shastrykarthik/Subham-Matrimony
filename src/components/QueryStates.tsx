import { AlertCircle, Compass, RefreshCw } from 'lucide-react';

export function LoadingCards() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {[0, 1, 2].map((item) => (
        <div key={item} className="overflow-hidden rounded-[22px] border border-border bg-card" aria-label="Loading profile">
          <div className="h-[214px] animate-pulse bg-secondary" />
          <div className="space-y-3 p-6">
            <div className="h-6 w-2/3 animate-pulse rounded bg-secondary" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-secondary" />
            <div className="h-4 w-full animate-pulse rounded bg-secondary" />
            <div className="h-10 w-full animate-pulse rounded-full bg-secondary" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ErrorState({ message = 'We could not load this just now.', onRetry }: { message?: string; onRetry: () => void }) {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center rounded-[24px] border border-[#e4c7bc] bg-[#fbf1ec] px-8 py-10 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f1ddd4] text-[#985849]"><AlertCircle size={21} /></span>
      <h3 className="mt-4 font-display text-2xl text-foreground">A small pause</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{message}</p>
      <button type="button" onClick={onRetry} className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground" data-testid="button-retry">
        <RefreshCw size={15} /> Try again
      </button>
    </div>
  );
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center rounded-[26px] border border-dashed border-border bg-[#f5f2e9] px-8 py-12 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#e5eade] text-primary"><Compass size={23} /></span>
      <h3 className="mt-5 font-display text-2xl text-foreground">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">{description}</p>
    </div>
  );
}
