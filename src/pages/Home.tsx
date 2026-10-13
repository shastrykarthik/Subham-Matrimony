import { useMemo, useState } from 'react';
import { ArrowDown, ArrowUpRight, HeartHandshake, Search, ShieldCheck, SlidersHorizontal, UsersRound } from 'lucide-react';
import { useListProfiles, useGetProfileStats } from '@workspace/api-client-react';
import type { ListProfilesParams } from '@workspace/api-client-react';
import { Link } from 'wouter';
import { Shell } from '@/components/Shell';
import { ProfileCard } from '@/components/ProfileCard';
import { EmptyState, ErrorState, LoadingCards } from '@/components/QueryStates';

export default function Home() {
  const [gender, setGender] = useState('');
  const [city, setCity] = useState('');
  const [gothra, setGothra] = useState('');
  const [rashi, setRashi] = useState('');
  const [minAge, setMinAge] = useState(18);
  const [maxAge, setMaxAge] = useState(60);
  const [minIncome, setMinIncome] = useState(0);
  const [maxIncome, setMaxIncome] = useState(5000000);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const params = useMemo<ListProfilesParams>(() => ({
    ...(gender ? { gender: gender as ListProfilesParams['gender'] } : {}),
    ...(city.trim() ? { city: city.trim() } : {}),
    ...(gothra.trim() ? { gothra: gothra.trim() } : {}),
    ...(rashi.trim() ? { rashi: rashi.trim() } : {}),
    minAge,
    maxAge,
    minIncome,
    maxIncome,
  }), [gender, city, gothra, rashi, minAge, maxAge, minIncome, maxIncome]);
  const profilesQuery = useListProfiles(params);
  const statsQuery = useGetProfileStats();
  const profiles = profilesQuery.data ?? [];

  return (
    <Shell>
      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        <div className="absolute inset-0 opacity-25">
          <div className="absolute -right-24 -top-48 h-[620px] w-[620px] rounded-full border border-[#e0bd83]/40" />
          <div className="absolute -right-4 -top-28 h-[470px] w-[470px] rounded-full border border-[#e0bd83]/40" />
          <div className="absolute right-28 top-4 h-[250px] w-[250px] rounded-full border border-[#e0bd83]/50" />
          <div className="absolute right-[235px] top-[85px] h-24 w-24 rounded-full bg-[#d3ae79]/20" />
        </div>
        <div className="mx-auto grid max-w-[1320px] items-center gap-10 px-5 py-16 md:grid-cols-[1.05fr_.95fr] md:px-10 md:py-24">
          <div className="relative z-10 max-w-[650px] reveal">
            <p className="mb-6 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[.25em] text-[#dfc291]">
              <span className="h-px w-9 bg-[#dfc291]" /> Introductions rooted in belonging
            </p>
            <h1 className="font-display text-[46px] leading-[1.08] tracking-[-.035em] sm:text-6xl lg:text-[76px]">
              A meaningful match begins with <span className="italic text-[#dfc291]">understanding.</span>
            </h1>
            <p className="mt-6 max-w-[480px] text-[15px] leading-7 text-[#e5e6d9]/80">
              Meet people who share your values, traditions and hopes for what comes next. Every introduction is considered, every profile reviewed by our community.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link href="#discover" className="inline-flex items-center gap-3 rounded-full bg-[#d6b77f] px-6 py-3.5 text-[13px] font-bold text-primary transition-transform hover:-translate-y-0.5" data-testid="link-explore-matches">
                Explore introductions <ArrowDown size={15} />
              </Link>
              <Link href="/join" className="inline-flex items-center gap-2 px-3 py-3 text-[13px] font-semibold text-[#eee9db] transition-colors hover:text-[#dfc291]" data-testid="link-create-introduction">
                Create your introduction <ArrowUpRight size={15} />
              </Link>
            </div>
            <div className="mt-12 flex items-center gap-5 border-t border-white/15 pt-6">
              <div className="flex -space-x-2">
                {['A', 'M', 'R', 'S'].map((letter, index) => (
                  <span key={letter} className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary text-[10px] font-bold ${['bg-[#d7bda4]', 'bg-[#c6d0bd]', 'bg-[#d7c18f]', 'bg-[#caa99b]'][index]} text-primary`}>{letter}</span>
                ))}
              </div>
              <p className="text-[11px] leading-5 text-[#e5e6d9]/75">
                <strong className="font-semibold text-[#f0e4ca]">{statsQuery.data?.approved ?? '—'}+</strong> approved introductions<br />
                <span>grown through trusted community</span>
              </p>
            </div>
          </div>
          <div className="relative mx-auto hidden h-[440px] w-full max-w-[490px] md:block reveal reveal-delay-2">
            <div className="absolute left-2 top-8 h-[330px] w-[286px] -rotate-[5deg] rounded-[150px_150px_26px_26px] border border-[#d6b77f]/60 bg-[#d3c1a2]/20 p-3">
              <div className="h-full overflow-hidden rounded-[145px_145px_20px_20px] bg-[linear-gradient(150deg,#c5bea1_0%,#d4b99c_45%,#8c9a7f_100%)]">
                <div className="relative h-full">
                  <div className="absolute left-[39%] top-[22%] h-[155px] w-[150px] rounded-[52%_48%_40%_40%] bg-[#9a7157]" />
                  <div className="absolute left-[33%] top-[18%] h-[84px] w-[165px] rounded-[50%_50%_22%_22%] bg-[#2e4137]" />
                  <div className="absolute bottom-[-15%] left-[12%] h-[210px] w-[250px] rounded-t-[48%] bg-[#d6bd92]" />
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_25%_8%,rgba(255,255,255,.52),transparent_34%)]" />
                </div>
              </div>
            </div>
            <div className="absolute right-1 top-[84px] h-[298px] w-[238px] rotate-[6deg] rounded-[130px_130px_24px_24px] border border-[#d6b77f]/60 bg-[#d3c1a2]/20 p-3">
              <div className="h-full overflow-hidden rounded-[125px_125px_18px_18px] bg-[linear-gradient(150deg,#d8b995_0%,#bb9a7c_46%,#768878_100%)]">
                <div className="relative h-full">
                  <div className="absolute left-[31%] top-[22%] h-[139px] w-[145px] rounded-[52%_48%_40%_40%] bg-[#d5a27f]" />
                  <div className="absolute left-[26%] top-[18%] h-[79px] w-[160px] rounded-[50%_50%_28%_28%] bg-[#292f2a]" />
                  <div className="absolute bottom-[-18%] left-[6%] h-[190px] w-[250px] rounded-t-[48%] bg-[#c6755f]" />
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_25%_8%,rgba(255,255,255,.45),transparent_34%)]" />
                </div>
              </div>
            </div>
            <div className="absolute bottom-3 left-0 rounded-[16px] border border-white/15 bg-[#f5f0e3] px-5 py-4 text-primary shadow-xl">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e4eadf]"><HeartHandshake size={18} /></span>
                <div>
                  <p className="text-[11px] font-semibold">Built on shared values</p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">Introductions, never swipes</p>
                </div>
              </div>
            </div>
            <span className="absolute right-3 top-4 h-3 w-3 rounded-full bg-[#d6b77f]" />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d6b77f]/50 to-transparent" />
      </section>

      <section className="mx-auto max-w-[1320px] px-5 pb-16 pt-14 md:px-10 md:pt-20" id="discover">
        <div className="mb-9 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[.24em] text-[#a4784c]">Latest verified profiles</p>
            <h2 className="font-display text-4xl tracking-[-.025em] text-foreground sm:text-[48px]">Introductions to consider</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">A thoughtful selection of verified members. Start with the details that matter to you.</p>
          </div>
          <div className="flex gap-3">
            <div className="rounded-[15px] border border-border bg-card px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-[.14em] text-muted-foreground">Reviewed</p>
              <p className="mt-1 font-display text-[23px] text-primary">{statsQuery.data?.approved ?? '—'}</p>
            </div>
            <div className="rounded-[15px] border border-border bg-card px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-[.14em] text-muted-foreground">In review</p>
              <p className="mt-1 font-display text-[23px] text-primary">{statsQuery.data?.pending ?? '—'}</p>
            </div>
          </div>
        </div>

        <div className="mb-8 rounded-[20px] border border-border bg-[#eeece2] p-4 md:p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-[#e4c78f]"><SlidersHorizontal size={17} /></span>
              <div>
                <p className="text-[13px] font-semibold text-foreground">Find a familiar rhythm</p>
                <p className="text-[11px] text-muted-foreground">Refine the introductions you see</p>
              </div>
            </div>
            <button type="button" onClick={() => setFiltersOpen(!filtersOpen)} className="rounded-full border border-primary/25 bg-background px-4 py-2 text-[12px] font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground md:hidden" data-testid="button-toggle-filters">
              {filtersOpen ? 'Hide filters' : 'Open filters'}
            </button>
            <span className="hidden items-center gap-2 text-[11px] text-muted-foreground md:flex"><Search size={14} /> {profiles.length} introductions</span>
          </div>
          <div className={`${filtersOpen ? 'grid' : 'hidden'} mt-5 grid-cols-1 gap-4 border-t border-border/70 pt-4 sm:grid-cols-2 md:grid md:grid-cols-4`}>
            <label className="text-[10px] font-semibold uppercase tracking-[.12em] text-muted-foreground">
              Looking for
              <select value={gender} onChange={(event) => setGender(event.target.value)} className="mt-2 h-11 w-full rounded-xl border border-input bg-background px-3 text-[13px] font-medium normal-case tracking-normal text-foreground outline-none focus:border-primary" data-testid="select-gender">
                <option value="">All genders</option>
                <option value="Female">Women</option>
                <option value="Male">Men</option>
              </select>
            </label>
            <label className="text-[10px] font-semibold uppercase tracking-[.12em] text-muted-foreground">
              City
              <input value={city} onChange={(event) => setCity(event.target.value)} placeholder="Any city" className="mt-2 h-11 w-full rounded-xl border border-input bg-background px-3 text-[13px] font-medium normal-case tracking-normal text-foreground outline-none placeholder:text-muted-foreground/70 focus:border-primary" data-testid="input-city" />
            </label>
            <label className="text-[10px] font-semibold uppercase tracking-[.12em] text-muted-foreground">
              Gothra
              <input value={gothra} onChange={(event) => setGothra(event.target.value)} placeholder="Any gothra" className="mt-2 h-11 w-full rounded-xl border border-input bg-background px-3 text-[13px] font-medium normal-case tracking-normal text-foreground outline-none placeholder:text-muted-foreground/70 focus:border-primary" data-testid="input-gothra" />
            </label>
            <label className="text-[10px] font-semibold uppercase tracking-[.12em] text-muted-foreground">
              Rashi
              <input value={rashi} onChange={(event) => setRashi(event.target.value)} placeholder="Exact match" className="mt-2 h-11 w-full rounded-xl border border-input bg-background px-3 text-[13px] font-medium normal-case tracking-normal text-foreground outline-none placeholder:text-muted-foreground/70 focus:border-primary" data-testid="input-rashi" />
            </label>
            <label className="rounded-xl border border-input bg-background px-3 py-2.5 text-[10px] font-semibold uppercase tracking-[.12em] text-muted-foreground">
              Minimum age · {minAge}
              <input type="range" min="18" max={maxAge} value={minAge} onChange={(event) => setMinAge(Number(event.target.value))} className="mt-3 block w-full accent-primary" data-testid="range-min-age" />
              <span className="mt-1 flex justify-between text-[9px] font-medium normal-case tracking-normal"><span>18 years</span><span>{maxAge} years</span></span>
            </label>
            <label className="rounded-xl border border-input bg-background px-3 py-2.5 text-[10px] font-semibold uppercase tracking-[.12em] text-muted-foreground">
              Maximum age · {maxAge}
              <input type="range" min={minAge} max="70" value={maxAge} onChange={(event) => setMaxAge(Number(event.target.value))} className="mt-3 block w-full accent-primary" data-testid="range-max-age" />
              <span className="mt-1 flex justify-between text-[9px] font-medium normal-case tracking-normal"><span>{minAge} years</span><span>70 years</span></span>
            </label>
            <label className="rounded-xl border border-input bg-background px-3 py-2.5 text-[10px] font-semibold uppercase tracking-[.12em] text-muted-foreground">
              Minimum income · ₹{new Intl.NumberFormat('en-IN').format(minIncome)}
              <input type="range" min="0" max={maxIncome} step="100000" value={minIncome} onChange={(event) => setMinIncome(Number(event.target.value))} className="mt-3 block w-full accent-primary" data-testid="range-min-income" />
              <span className="mt-1 flex justify-between text-[9px] font-medium normal-case tracking-normal"><span>₹0</span><span>₹{new Intl.NumberFormat('en-IN').format(maxIncome)}</span></span>
            </label>
            <label className="rounded-xl border border-input bg-background px-3 py-2.5 text-[10px] font-semibold uppercase tracking-[.12em] text-muted-foreground">
              Maximum income · ₹{new Intl.NumberFormat('en-IN').format(maxIncome)}
              <input type="range" min={minIncome} max="5000000" step="100000" value={maxIncome} onChange={(event) => setMaxIncome(Number(event.target.value))} className="mt-3 block w-full accent-primary" data-testid="range-max-income" />
              <span className="mt-1 flex justify-between text-[9px] font-medium normal-case tracking-normal"><span>₹{new Intl.NumberFormat('en-IN').format(minIncome)}</span><span>₹50 lakh</span></span>
            </label>
          </div>
        </div>

        {profilesQuery.isLoading && <LoadingCards />}
        {profilesQuery.isError && <ErrorState message="Our introductions are taking a moment to arrive." onRetry={() => void profilesQuery.refetch()} />}
        {!profilesQuery.isLoading && !profilesQuery.isError && profiles.length === 0 && (
          <EmptyState title="No introductions in this view" description="Try widening your filters. New community-reviewed profiles are added as members are approved." />
        )}
        {!profilesQuery.isLoading && !profilesQuery.isError && profiles.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {profiles.map((profile, index) => <ProfileCard key={profile.id} profile={profile} index={index} />)}
          </div>
        )}
      </section>

      <section className="border-y border-border/60 bg-[#ebe9df]">
        <div className="mx-auto grid max-w-[1320px] gap-10 px-5 py-14 md:grid-cols-[.8fr_1.2fr] md:items-center md:px-10 md:py-20">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[.23em] text-[#a4784c]">How it works</p>
            <h2 className="mt-3 font-display text-[36px] leading-tight tracking-[-.025em] text-foreground">The care is in the details.</h2>
          </div>
          <div className="grid gap-7 sm:grid-cols-3">
            {[
              { number: '01', title: 'Share your story', text: 'Offer a considered picture of your values, family and life today.' },
              { number: '02', title: 'Community review', text: 'Each profile is checked before it becomes visible to members.' },
              { number: '03', title: 'Begin a conversation', text: 'Request an introduction when something feels like a fit.' },
            ].map((item) => (
              <div key={item.number} className="border-l border-[#c6b28f] pl-4">
                <p className="font-display text-[20px] italic text-[#a4784c]">{item.number}</p>
                <h3 className="mt-3 text-[13px] font-bold text-foreground">{item.title}</h3>
                <p className="mt-2 text-[12px] leading-5 text-muted-foreground">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="mx-auto flex max-w-[1320px] flex-col items-start gap-5 px-5 py-14 md:flex-row md:items-center md:justify-between md:px-10 md:py-16">
        <div className="flex items-start gap-4">
          <span className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#e4eadf] text-primary"><ShieldCheck size={20} /></span>
          <div>
            <h2 className="font-display text-[25px] text-foreground">Community trust starts with a review.</h2>
            <p className="mt-1 max-w-2xl text-[13px] leading-6 text-muted-foreground">Profiles are reviewed by community moderators before appearing in discovery. Your introduction starts with the context you choose to share.</p>
          </div>
        </div>
        <Link href="/join" className="shrink-0 rounded-full bg-primary px-6 py-3 text-[12px] font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5">Create a profile</Link>
      </section>
    </Shell>
  );
}
