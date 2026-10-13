import { useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useUser } from '@clerk/react';
import { ArrowUpRight, Check, Clock3, Inbox, LoaderCircle, MessageCircle, Send, X } from 'lucide-react';
import { getListConnectionsQueryKey, useListConnections, useRespondToConnection } from '@workspace/api-client-react';
import type { Connection } from '@workspace/api-client-react';
import { Link } from 'wouter';
import { ageFromDate } from '@/components/ProfileCard';
import { EmptyState, ErrorState } from '@/components/QueryStates';
import { Shell } from '@/components/Shell';

type Tab = 'received' | 'sent';

export default function Connections() {
  const [tab, setTab] = useState<Tab>('received');
  const { isSignedIn } = useUser();
  const connectionsQuery = useListConnections();
  const respond = useRespondToConnection();
  const queryClient = useQueryClient();
  const allConnections = connectionsQuery.data ?? [];
  const received = useMemo(() => allConnections.filter((item) => item.direction === 'received'), [allConnections]);
  const sent = useMemo(() => allConnections.filter((item) => item.direction === 'sent'), [allConnections]);
  const current = tab === 'received' ? received : sent;

  function respondTo(id: number, status: 'accepted' | 'declined') {
    respond.mutate({ id, data: { status } }, {
      onSuccess: () => void queryClient.invalidateQueries({ queryKey: getListConnectionsQueryKey() }),
    });
  }

  return (
    <Shell>
      <div className="mx-auto max-w-[1120px] px-5 py-10 md:px-10 md:py-14">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#a4784c]">The next conversation</p>
            <h1 className="mt-2 font-display text-[42px] leading-tight tracking-[-.03em] text-foreground">Your connections</h1>
            <p className="mt-3 max-w-lg text-[13px] leading-6 text-muted-foreground">A quiet place to keep track of introductions shared with you and those you have requested.</p>
          </div>
          <Link href="/" className="inline-flex items-center gap-2 self-start rounded-full border border-primary/25 px-4 py-2.5 text-[11px] font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground sm:self-auto">
            Discover members <ArrowUpRight size={14} />
          </Link>
        </div>
        <div className="mt-9 flex gap-1 border-b border-border">
          <button type="button" onClick={() => setTab('received')} className={`inline-flex items-center gap-2 border-b-2 px-4 py-3 text-[12px] font-semibold transition-colors ${tab === 'received' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'}`} data-testid="tab-received">
            <Inbox size={15} /> Received <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px]">{received.length}</span>
          </button>
          <button type="button" onClick={() => setTab('sent')} className={`inline-flex items-center gap-2 border-b-2 px-4 py-3 text-[12px] font-semibold transition-colors ${tab === 'sent' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'}`} data-testid="tab-sent">
            <Send size={14} /> Sent <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px]">{sent.length}</span>
          </button>
        </div>

        {connectionsQuery.isLoading && (
          <div className="mt-7 space-y-4">
            {[0, 1, 2].map((item) => <div key={item} className="h-[125px] animate-pulse rounded-[20px] border border-border bg-card" />)}
          </div>
        )}
        {connectionsQuery.isError && (
          <div className="mt-8">
            <ErrorState
              message={isSignedIn ? "Your connection list could not be loaded." : "Sign in to see the introduction requests you've sent and received."}
              onRetry={() => void connectionsQuery.refetch()}
            />
            {!isSignedIn && <div className="mt-4 text-center"><Link href="/sign-in" className="inline-flex rounded-full bg-primary px-5 py-2.5 text-[12px] font-semibold text-primary-foreground">Sign in</Link></div>}
          </div>
        )}
        {!connectionsQuery.isLoading && !connectionsQuery.isError && current.length === 0 && (
          <div className="mt-8">
            <EmptyState
              title={tab === 'received' ? 'Nothing waiting for you' : 'No introductions sent yet'}
              description={tab === 'received' ? 'When another member asks to connect, their introduction will appear here.' : 'When someone catches your eye, request an introduction from their profile.'}
            />
          </div>
        )}
        {!connectionsQuery.isLoading && !connectionsQuery.isError && current.length > 0 && (
          <div className="mt-7 space-y-3">
            {current.map((connection) => <ConnectionRow key={connection.id} connection={connection} incoming={tab === 'received'} isPending={respond.isPending} onRespond={respondTo} />)}
          </div>
        )}
      </div>
    </Shell>
  );
}

function ConnectionRow({ connection, incoming, isPending, onRespond }: { connection: Connection; incoming: boolean; isPending: boolean; onRespond: (id: number, status: 'accepted' | 'declined') => void }) {
  const profile = connection.profile;
  const initials = profile.fullName.split(' ').map((part) => part[0]).slice(0, 2).join('');
  const statusStyles: Record<string, string> = {
    pending: 'bg-[#f2ead8] text-[#8c6838]',
    accepted: 'bg-[#e1ebdf] text-[#365f4b]',
    declined: 'bg-[#f5e4df] text-[#985849]',
  };

  return (
    <article className="flex flex-col gap-5 rounded-[20px] border border-border bg-card p-5 sm:flex-row sm:items-center sm:p-6" data-testid={`card-connection-${connection.id}`}>
      <span className="flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-full bg-[#d8c3a3] font-display text-xl text-primary">{initials}</span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="font-display text-[23px] text-foreground">{profile.fullName}</h2>
          <span className={`rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[.1em] ${statusStyles[connection.status]}`}>{connection.status}</span>
        </div>
        <p className="mt-1 text-[12px] text-muted-foreground">{ageFromDate(profile.dateOfBirth)} years <span className="mx-1.5 text-accent">/</span> {profile.currentCity} <span className="mx-1.5 text-accent">/</span> {profile.currentOccupation}</p>
        <p className="mt-2 inline-flex items-center gap-1.5 text-[10px] text-muted-foreground"><Clock3 size={12} /> Requested {new Date(connection.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
      </div>
      <div className="flex flex-wrap gap-2 sm:justify-end">
        {incoming && connection.status === 'pending' && (
          <>
            <button type="button" disabled={isPending} onClick={() => onRespond(connection.id, 'declined')} className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2.5 text-[11px] font-semibold text-muted-foreground transition-colors hover:border-[#b66b5d] hover:text-[#985849] disabled:opacity-50" data-testid={`button-decline-${connection.id}`}>
              <X size={14} /> Decline
            </button>
            <button type="button" disabled={isPending} onClick={() => onRespond(connection.id, 'accepted')} className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2.5 text-[11px] font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 disabled:opacity-50" data-testid={`button-accept-${connection.id}`}>
              {isPending ? <LoaderCircle size={14} className="animate-spin" /> : <Check size={14} />} Accept
            </button>
          </>
        )}
        {connection.status === 'accepted' && <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e1ebdf] px-4 py-2.5 text-[11px] font-semibold text-[#365f4b]"><MessageCircle size={14} /> Connected</span>}
        <Link href={`/profiles/${profile.id}`} className="inline-flex items-center gap-1 rounded-full border border-primary/25 px-4 py-2.5 text-[11px] font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground" data-testid={`link-connection-profile-${connection.id}`}>
          View profile <ArrowUpRight size={13} />
        </Link>
      </div>
    </article>
  );
}
