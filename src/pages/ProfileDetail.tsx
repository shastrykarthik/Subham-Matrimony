import { useState } from 'react';
import type { ReactNode } from 'react';
import { useParams, Link } from 'wouter';
import { useQueryClient } from '@tanstack/react-query';
import { useUser } from '@clerk/react';
import { ArrowLeft, BadgeCheck, BriefcaseBusiness, CalendarDays, Check, HeartHandshake, LoaderCircle, MapPin, MessageCircle, ShieldCheck, Sparkles } from 'lucide-react';
import { getListConnectionsQueryKey, useCreateConnection, useGetProfile, getGetProfileQueryKey, useListConnections } from '@workspace/api-client-react';
import { ageFromDate } from '@/components/ProfileCard';
import { ErrorState } from '@/components/QueryStates';
import { Shell } from '@/components/Shell';

export default function ProfileDetail() {
  const { isSignedIn } = useUser();
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const profileQuery = useGetProfile(id, { query: { enabled: !!id, queryKey: getGetProfileQueryKey(id) } });
  const connectionsQuery = useListConnections({
    query: { enabled: !!isSignedIn, queryKey: getListConnectionsQueryKey() },
  });
  const createConnection = useCreateConnection();
  const queryClient = useQueryClient();
  const [sent, setSent] = useState(false);
  const [requestError, setRequestError] = useState('');
  const profile = profileQuery.data;
  const existingRequest = connectionsQuery.data?.find(
    (connection) => connection.direction === 'sent' && connection.toProfileId === profile?.id,
  );
  const initials = profile?.fullName.split(' ').map((part) => part[0]).slice(0, 2).join('') ?? '';

  function requestIntroduction() {
    if (!profile) return;
    setRequestError('');
    createConnection.mutate({ data: { toProfileId: profile.id } }, {
      onSuccess: () => {
        setSent(true);
        void queryClient.invalidateQueries({ queryKey: getListConnectionsQueryKey() });
        void queryClient.invalidateQueries({ queryKey: getGetProfileQueryKey(id) });
      },
      onError: () => setRequestError('This introduction could not be sent. Please try again in a moment.'),
    });
  }

  return (
    <Shell>
      {profileQuery.isLoading && (
        <div className="mx-auto max-w-[1120px] px-5 py-12 md:px-10">
          <div className="h-8 w-36 animate-pulse rounded bg-secondary" />
          <div className="mt-8 h-[320px] animate-pulse rounded-[28px] bg-secondary" />
          <div className="mt-6 h-44 animate-pulse rounded-[24px] bg-secondary" />
        </div>
      )}
      {profileQuery.isError && <div className="px-5 py-16"><ErrorState message="This introduction is unavailable right now." onRetry={() => void profileQuery.refetch()} /></div>}
      {!profileQuery.isLoading && !profileQuery.isError && !profile && (
        <div className="mx-auto max-w-[1120px] px-5 py-16 text-center">
          <h1 className="font-display text-4xl">Introduction not found</h1>
          <Link href="/" className="mt-6 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">Return to discovery</Link>
        </div>
      )}
      {profile && (
        <div className="mx-auto max-w-[1120px] px-5 py-8 md:px-10 md:py-12">
          <Link href="/" className="inline-flex items-center gap-2 text-[12px] font-semibold text-muted-foreground transition-colors hover:text-primary" data-testid="link-back-discovery">
            <ArrowLeft size={15} /> Back to introductions
          </Link>
          <section className="relative mt-6 overflow-hidden rounded-[28px] bg-primary text-primary-foreground">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_84%_14%,rgba(220,190,133,.23),transparent_30%),linear-gradient(115deg,transparent_30%,rgba(255,255,255,.035))]" />
            <div className="absolute -right-20 -top-40 h-[470px] w-[470px] rounded-full border border-white/10" />
            <div className="relative grid gap-8 p-7 md:grid-cols-[1fr_auto] md:items-end md:p-12">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[.14em] text-[#e4c78f]">
                  <BadgeCheck size={14} /> Community verified
                </span>
                <div className="mt-7 flex items-center gap-5">
                  <span className="flex h-[84px] w-[84px] items-center justify-center rounded-full border border-[#ddc18d]/60 bg-[#d6b77f]/20 font-display text-3xl text-[#e4c78f]">{initials}</span>
                  <div>
                    <p className="font-display text-[40px] leading-tight sm:text-[52px]">{profile.fullName}</p>
                    <p className="mt-2 flex items-center gap-2 text-[13px] text-white/70"><MapPin size={14} /> {profile.currentCity}</p>
                  </div>
                </div>
                <div className="mt-7 flex flex-wrap gap-2">
                  {[`${ageFromDate(profile.dateOfBirth)} years`, profile.educationQualification, profile.familyValues].map((tag) => (
                    <span key={tag} className="rounded-full border border-white/15 bg-white/5 px-3.5 py-2 text-[11px] text-white/80">{tag}</span>
                  ))}
                </div>
              </div>
              <div className="min-w-[230px]">
                {requestError && <p role="alert" className="mb-3 rounded-xl bg-white/10 px-3 py-2 text-[11px] text-[#f2d5c9]">{requestError}</p>}
                {sent || existingRequest ? (
                  <div className="flex items-center justify-center gap-2 rounded-full bg-[#d6b77f] px-6 py-3.5 text-[12px] font-bold text-primary"><Check size={16} /> {existingRequest?.status === 'accepted' ? 'Connected' : existingRequest?.status === 'declined' ? 'Request declined' : 'Introduction requested'}</div>
                ) : !isSignedIn ? (
                  <Link href="/sign-in" className="flex w-full items-center justify-center gap-2 rounded-full bg-[#d6b77f] px-6 py-3.5 text-[12px] font-bold text-primary transition-all hover:-translate-y-0.5">
                    <HeartHandshake size={16} /> Sign in to request an introduction
                  </Link>
                ) : (
                  <button type="button" disabled={createConnection.isPending} onClick={requestIntroduction} className="flex w-full items-center justify-center gap-2 rounded-full bg-[#d6b77f] px-6 py-3.5 text-[12px] font-bold text-primary transition-all hover:-translate-y-0.5 disabled:opacity-55" data-testid="button-request-introduction">
                    {createConnection.isPending ? <LoaderCircle size={16} className="animate-spin" /> : <HeartHandshake size={16} />}
                    Request an introduction
                  </button>
                )}
                <p className="mt-3 text-center text-[10px] text-white/55">A considerate first step, no pressure.</p>
              </div>
            </div>
          </section>
          <div className="mt-7 grid gap-6 md:grid-cols-[1.12fr_.88fr]">
            <section className="rounded-[24px] border border-border bg-card p-6 sm:p-8">
              <p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#a4784c]">A little context</p>
              <h2 className="mt-2 font-display text-[29px] text-foreground">The foundations</h2>
              <div className="mt-6 grid gap-x-8 gap-y-6 sm:grid-cols-2">
                <Detail icon={<BriefcaseBusiness size={16} />} label="Occupation" value={profile.currentOccupation} />
                <Detail icon={<CalendarDays size={16} />} label="Age" value={`${ageFromDate(profile.dateOfBirth)} years`} />
                <Detail icon={<Sparkles size={16} />} label="Family values" value={profile.familyValues} />
                <Detail icon={<ShieldCheck size={16} />} label="Gothra" value={profile.gothra} />
                <Detail icon={<BriefcaseBusiness size={16} />} label="Education" value={profile.educationQualification} />
                <Detail icon={<BriefcaseBusiness size={16} />} label="Annual income" value={new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(profile.annualIncomeInr)} />
              </div>
            </section>
            <aside className="rounded-[24px] border border-border bg-[#eeece2] p-6 sm:p-8">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e1e8dd] text-primary"><MessageCircle size={18} /></span>
              <h2 className="mt-5 font-display text-[25px] leading-tight text-foreground">Tradition meets today</h2>
              <p className="mt-3 text-[13px] leading-6 text-muted-foreground">This profile brings together family context and the life {profile.fullName.split(' ')[0]} is building now. Use the introduction request to start a conversation with care.</p>
              <div className="mt-6 border-t border-border/80 pt-5">
                <p className="text-[10px] font-bold uppercase tracking-[.15em] text-muted-foreground">Astrological details</p>
                <p className="mt-2 text-[13px] font-semibold text-foreground">{profile.nakshatra || 'Not shared'} <span className="mx-2 text-accent">/</span> {profile.rashi || 'Not shared'}</p>
              </div>
            </aside>
          </div>
        </div>
      )}
    </Shell>
  );
}

function Detail({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <span className="mt-0.5 text-[#a4784c]">{icon}</span>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[.14em] text-muted-foreground">{label}</p>
        <p className="mt-1.5 text-[13px] font-semibold text-foreground">{value}</p>
      </div>
    </div>
  );
}
