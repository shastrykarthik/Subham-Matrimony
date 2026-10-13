import { useQueryClient } from '@tanstack/react-query';
import { BadgeCheck, Check, Clock3, MapPin, ShieldCheck } from 'lucide-react';
import { getGetProfileStatsQueryKey, getListPendingProfilesQueryKey, getListProfilesQueryKey, useApproveProfile, useListPendingProfiles } from '@workspace/api-client-react';
import { ageFromDate } from '@/components/ProfileCard';
import { EmptyState, ErrorState } from '@/components/QueryStates';
import { Shell } from '@/components/Shell';

export default function Moderation() {
  const pendingQuery = useListPendingProfiles();
  const approve = useApproveProfile();
  const queryClient = useQueryClient();
  const pending = pendingQuery.data ?? [];

  function approveProfile(id: number) {
    approve.mutate({ id, data: { isAdminApproved: true } }, {
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: getListPendingProfilesQueryKey() });
        void queryClient.invalidateQueries({ queryKey: getGetProfileStatsQueryKey() });
        void queryClient.invalidateQueries({ queryKey: getListProfilesQueryKey() });
      },
    });
  }

  return (
    <Shell>
      <div className="mx-auto max-w-[1120px] px-5 py-10 md:px-10 md:py-14">
        <div className="relative overflow-hidden rounded-[26px] bg-primary px-7 py-8 text-primary-foreground md:px-10 md:py-10">
          <div className="absolute -right-12 -top-28 h-72 w-72 rounded-full border border-white/10" />
          <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[.13em] text-[#e1c58f]"><ShieldCheck size={13} /> Community stewardship</span>
              <h1 className="mt-5 font-display text-[40px] tracking-[-.025em] sm:text-[48px]">Review with care.</h1>
              <p className="mt-3 max-w-xl text-[13px] leading-6 text-white/65">Every introduction starts with trust. Take a moment to review the member details before approving their profile for discovery.</p>
            </div>
            <div className="flex items-center gap-3 rounded-[15px] border border-white/15 bg-white/5 px-4 py-3">
              <Clock3 size={17} className="text-[#dfc291]" />
              <div><p className="text-[10px] uppercase tracking-[.12em] text-white/55">Awaiting review</p><p className="mt-0.5 font-display text-[24px]">{pendingQuery.isLoading ? '—' : pending.length}</p></div>
            </div>
          </div>
        </div>
        {pendingQuery.isLoading && (
          <div className="mt-7 space-y-4">
            {[0, 1].map((item) => <div key={item} className="h-40 animate-pulse rounded-[20px] border border-border bg-card" />)}
          </div>
        )}
        {pendingQuery.isError && (
          <div className="mt-8">
            <ErrorState message="Only community moderators can open this review queue. Sign in with a moderator account." onRetry={() => void pendingQuery.refetch()} />
            <p className="mt-4 text-center text-[11px] leading-5 text-muted-foreground">To grant moderator access, assign the Clerk account the public metadata role <code className="rounded bg-secondary px-1.5 py-0.5">admin</code> or add its user ID to <code className="rounded bg-secondary px-1.5 py-0.5">MATRIMONY_MODERATOR_USER_IDS</code> in the server environment.</p>
          </div>
        )}
        {!pendingQuery.isLoading && !pendingQuery.isError && pending.length === 0 && (
          <div className="mt-8"><EmptyState title="The queue is clear" description="There are no profiles waiting for a community review. New introductions will appear here when submitted." /></div>
        )}
        {!pendingQuery.isLoading && !pendingQuery.isError && pending.length > 0 && (
          <div className="mt-7 space-y-4">
            {pending.map((profile) => (
              <article key={profile.id} className="rounded-[22px] border border-border bg-card p-5 sm:p-7" data-testid={`card-pending-profile-${profile.id}`}>
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                  <span className="flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-full bg-[#d8c3a3] font-display text-xl text-primary">{profile.fullName.split(' ').map((part) => part[0]).slice(0, 2).join('')}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-display text-[25px] text-foreground">{profile.fullName}</h2>
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#f2ead8] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[.1em] text-[#8c6838]"><Clock3 size={11} /> Pending</span>
                    </div>
                    <p className="mt-1 text-[12px] text-muted-foreground">{ageFromDate(profile.dateOfBirth)} years <span className="mx-1.5 text-accent">/</span> {profile.gender} <span className="mx-1.5 text-accent">/</span> {profile.familyValues}</p>
                    <div className="mt-5 grid gap-x-6 gap-y-3 text-[12px] sm:grid-cols-2 lg:grid-cols-4">
                      <ReviewDetail label="Gothra" value={profile.gothra} />
                      <ReviewDetail label="Education" value={profile.educationQualification} />
                      <ReviewDetail label="Occupation" value={profile.currentOccupation} />
                      <span className="flex items-center gap-1.5 text-muted-foreground"><MapPin size={13} /> {profile.currentCity}</span>
                      <ReviewDetail label="Nakshatra / Rashi" value={`${profile.nakshatra || 'Not shared'} / ${profile.rashi || 'Not shared'}`} />
                      <ReviewDetail label="Submitted" value={new Date(profile.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} />
                    </div>
                  </div>
                  <button type="button" disabled={approve.isPending} onClick={() => approveProfile(profile.id)} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-[11px] font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 disabled:opacity-50" data-testid={`button-approve-${profile.id}`}>
                    <Check size={15} /> Approve profile
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
        <div className="mt-8 flex items-start gap-3 rounded-[17px] border border-[#d9ddcf] bg-[#edf0e8] px-5 py-4 text-[11px] leading-5 text-[#536558]">
          <BadgeCheck size={16} className="mt-0.5 shrink-0" />
          <p>Approving a profile makes it visible to the community. This action confirms that the member's introduction has been reviewed.</p>
        </div>
      </div>
    </Shell>
  );
}

function ReviewDetail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[9px] font-bold uppercase tracking-[.12em] text-muted-foreground">{label}</p>
      <p className="mt-1 font-medium text-foreground">{value}</p>
    </div>
  );
}
