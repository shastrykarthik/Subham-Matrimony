import type { Profile } from '@workspace/api-client-react';
import { ArrowUpRight, BadgeCheck, MapPin, Sparkles } from 'lucide-react';
import { Link } from 'wouter';

export function ageFromDate(dateOfBirth: string) {
  const birth = new Date(dateOfBirth);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const month = now.getMonth() - birth.getMonth();
  if (month < 0 || (month === 0 && now.getDate() < birth.getDate())) age -= 1;
  return age;
}

export function ProfileCard({ profile, index = 0 }: { profile: Profile; index?: number }) {
  const initials = profile.fullName.split(' ').map((part) => part[0]).slice(0, 2).join('');
  const swatches = ['bg-[#d8c3a3] text-[#3d4a3d]', 'bg-[#cfb4a4] text-[#473a35]', 'bg-[#c7d0bd] text-[#34473e]', 'bg-[#decda7] text-[#4b4130]'];

  return (
    <article className={`group overflow-hidden rounded-[22px] border border-card-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_46px_-28px_rgba(28,65,54,.45)] reveal ${index % 3 === 1 ? 'reveal-delay-1' : index % 3 === 2 ? 'reveal-delay-2' : ''}`} data-testid={`card-profile-${profile.id}`}>
      <div className="relative flex h-[214px] items-end overflow-hidden px-6 pb-5">
        <div className={`absolute inset-0 ${swatches[index % swatches.length]}`} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_82%_22%,rgba(255,255,255,.68),transparent_35%),linear-gradient(148deg,transparent_25%,rgba(28,54,44,.18))]" />
        <div className="absolute -right-6 -top-10 h-48 w-48 rounded-full border border-white/35" />
        <div className="absolute -right-1 top-5 h-32 w-32 rounded-full border border-white/35" />
        <div className="absolute right-12 top-10 h-16 w-16 rounded-full bg-white/20" />
        <span className="relative z-10 flex h-[72px] w-[72px] items-center justify-center rounded-full border-[3px] border-white/85 bg-primary/90 font-display text-2xl text-accent shadow-lg">
          {initials}
        </span>
        <span className="absolute right-5 top-5 z-10 inline-flex items-center gap-1.5 rounded-full bg-[#f9f5ea]/90 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[.12em] text-primary">
          <BadgeCheck size={13} /> Community verified
        </span>
        <span className="relative z-10 ml-auto flex h-10 w-10 items-center justify-center rounded-full border border-white/50 bg-white/25 text-primary backdrop-blur-sm transition-all group-hover:bg-primary group-hover:text-primary-foreground">
          <ArrowUpRight size={17} />
        </span>
      </div>
      <div className="px-6 pb-6 pt-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-display text-[23px] leading-tight text-foreground">{profile.fullName}</h3>
            <p className="mt-1.5 text-[13px] text-muted-foreground">{ageFromDate(profile.dateOfBirth)} years <span className="mx-1.5 text-accent">/</span> {profile.educationQualification}</p>
          </div>
          <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-[#e9eee6] px-2.5 py-1 text-[10px] font-semibold text-primary">
            <Sparkles size={11} /> {profile.familyValues}
          </span>
        </div>
        <p className="mt-4 text-[13px] font-medium text-foreground/85">{profile.currentOccupation}</p>
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 border-t border-border/70 pt-4 text-[12px] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5"><MapPin size={13} /> {profile.currentCity}</span>
          <span>{profile.gothra} gothra</span>
        </div>
        <Link href={`/profiles/${profile.id}`} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full border border-primary/25 py-2.5 text-[12px] font-semibold text-primary transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground" data-testid={`link-profile-${profile.id}`}>
          View introduction <ArrowUpRight size={14} />
        </Link>
      </div>
    </article>
  );
}
