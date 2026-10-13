import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useUser } from '@clerk/react';
import { useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, ArrowRight, Check, CheckCircle2, HeartHandshake, LoaderCircle } from 'lucide-react';
import { useCreateProfile, getGetProfileStatsQueryKey, getListPendingProfilesQueryKey, getListProfilesQueryKey } from '@workspace/api-client-react';
import type { ProfileInput } from '@workspace/api-client-react';
import { Link, useLocation } from 'wouter';
import { Shell } from '@/components/Shell';

const initialForm: ProfileInput = {
  fullName: '',
  gender: 'Female',
  dateOfBirth: '',
  email: '',
  phoneNumber: '',
  gothra: '',
  nakshatra: '',
  rashi: '',
  familyValues: 'Moderate',
  educationQualification: '',
  currentOccupation: '',
  annualIncomeInr: 0,
  currentCity: '',
};

const steps = ['About you', 'Traditions', 'Your life'];

export default function Join() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<ProfileInput>(initialForm);
  const [created, setCreated] = useState(false);
  const [error, setError] = useState('');
  const createProfile = useCreateProfile();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  useEffect(() => {
    const email = user?.primaryEmailAddress?.emailAddress;
    if (email && !form.email) {
      setForm((current) => ({ ...current, email }));
    }
  }, [form.email, user]);

  function update<K extends keyof ProfileInput>(key: K, value: ProfileInput[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function canContinue() {
    if (step === 0) {
      const adultCutoff = new Date();
      adultCutoff.setFullYear(adultCutoff.getFullYear() - 18);
      const birthDate = form.dateOfBirth ? new Date(`${form.dateOfBirth}T00:00:00`) : null;
      return Boolean(form.fullName.trim() && birthDate && birthDate <= adultCutoff && form.email.trim() && form.phoneNumber.trim());
    }
    if (step === 1) return Boolean(form.gothra.trim());
    return Boolean(
      form.educationQualification.trim() &&
      form.currentOccupation.trim() &&
      form.currentCity.trim() &&
      Number.isFinite(form.annualIncomeInr) &&
      form.annualIncomeInr >= 0,
    );
  }

  function submit() {
    setError('');
    createProfile.mutate({ data: form }, {
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: getGetProfileStatsQueryKey() });
        void queryClient.invalidateQueries({ queryKey: getListProfilesQueryKey() });
        void queryClient.invalidateQueries({ queryKey: getListPendingProfilesQueryKey() });
        setCreated(true);
      },
      onError: () => setError('We could not save your introduction just now. Please review your details and try once more.'),
    });
  }

  if (!isLoaded) {
    return (
      <Shell>
        <div className="mx-auto max-w-3xl px-5 py-20 text-center text-muted-foreground">Loading your account…</div>
      </Shell>
    );
  }

  if (!isSignedIn) {
    return (
      <Shell>
        <section className="mx-auto my-14 max-w-xl rounded-[26px] border border-border bg-card px-7 py-10 text-center shadow-sm sm:px-10">
          <HeartHandshake className="mx-auto text-primary" size={34} />
          <h1 className="mt-5 font-display text-3xl text-foreground">Start with your account</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">Sign up or sign in first. Your introduction will be linked to your account and stay private until a community moderator approves it.</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/sign-up" className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground">Create an account</Link>
            <Link href="/sign-in" className="rounded-full border border-border px-6 py-3 text-sm font-semibold text-primary">Sign in</Link>
          </div>
        </section>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="mx-auto grid max-w-[1200px] gap-8 px-5 py-9 md:grid-cols-[.68fr_1.32fr] md:px-10 md:py-14">
        <aside className="relative overflow-hidden rounded-[26px] bg-primary p-7 text-primary-foreground md:min-h-[610px] md:p-9">
          <div className="absolute -right-24 -top-20 h-72 w-72 rounded-full border border-[#d6b77f]/35" />
          <div className="absolute -right-9 top-8 h-44 w-44 rounded-full border border-[#d6b77f]/35" />
          <div className="relative z-10">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#d6b77f] text-primary"><HeartHandshake size={21} /></span>
            <p className="mt-9 text-[10px] font-bold uppercase tracking-[.24em] text-[#dec495]">A thoughtful first step</p>
            <h1 className="mt-3 max-w-sm font-display text-[39px] leading-[1.12] tracking-[-.025em]">Your story deserves a careful introduction.</h1>
            <p className="mt-5 max-w-sm text-[13px] leading-6 text-white/70">Tell us a little about yourself. Our community will review your profile before it appears in discovery.</p>
            <div className="mt-10 space-y-5">
              {steps.map((label, index) => (
                <div key={label} className={`flex items-center gap-3 text-[12px] ${index === step ? 'text-[#e5c98e]' : index < step ? 'text-white/80' : 'text-white/40'}`}>
                  <span className={`flex h-7 w-7 items-center justify-center rounded-full border ${index < step ? 'border-[#d6b77f] bg-[#d6b77f] text-primary' : index === step ? 'border-[#d6b77f] text-[#e5c98e]' : 'border-white/25'}`}>
                    {index < step ? <Check size={14} /> : `0${index + 1}`}
                  </span>
                  <span className="font-semibold">{label}</span>
                  {index === step && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#d6b77f]" />}
                </div>
              ))}
            </div>
          </div>
          <p className="absolute bottom-7 left-7 right-7 text-[10px] leading-5 text-white/45 md:bottom-9 md:left-9">Your details are shared only in accordance with the introduction you choose to make.</p>
        </aside>

        <section className="rounded-[26px] border border-border bg-card p-6 shadow-[0_16px_48px_-38px_rgba(30,59,49,.35)] sm:p-9 md:p-11">
          {created ? (
            <div className="flex min-h-[490px] flex-col items-center justify-center text-center">
              <span className="flex h-[66px] w-[66px] items-center justify-center rounded-full bg-[#e4eadf] text-primary"><CheckCircle2 size={30} /></span>
              <p className="mt-7 text-[10px] font-bold uppercase tracking-[.24em] text-[#a4784c]">Introduction received</p>
              <h2 className="mt-3 max-w-md font-display text-[38px] leading-tight text-foreground">Thank you for sharing your story.</h2>
              <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground">Your profile is now with our community reviewers. It will appear in discovery after approval.</p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link href="/" className="rounded-full bg-primary px-6 py-3 text-[12px] font-semibold text-primary-foreground">Return to discovery</Link>
                <Link href="/connections" className="rounded-full border border-border px-6 py-3 text-[12px] font-semibold text-primary">View connections</Link>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#a4784c]">Step {step + 1} of 3</p>
                  <h2 className="mt-2 font-display text-[32px] text-foreground">{steps[step]}</h2>
                </div>
                <span className="text-[11px] font-semibold text-muted-foreground">{Math.round(((step + 1) / steps.length) * 100)}%</span>
              </div>
              <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-secondary">
                <div className="h-full rounded-full bg-[#b18958] transition-all duration-300" style={{ width: `${((step + 1) / steps.length) * 100}%` }} />
              </div>
              {step === 0 && (
                <div className="mt-8 grid gap-5 sm:grid-cols-2">
                  <Field label="Full name" wide>
                    <input required value={form.fullName} onChange={(event) => update('fullName', event.target.value)} placeholder="As you would like to be introduced" className="form-control" data-testid="input-full-name" />
                  </Field>
                  <Field label="I am">
                    <select value={form.gender} onChange={(event) => update('gender', event.target.value as ProfileInput['gender'])} className="form-control" data-testid="select-profile-gender">
                      <option value="Female">A woman</option>
                      <option value="Male">A man</option>
                    </select>
                  </Field>
                  <Field label="Date of birth">
                    <input required type="date" max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().slice(0, 10)} value={form.dateOfBirth} onChange={(event) => update('dateOfBirth', event.target.value)} className="form-control" data-testid="input-date-of-birth" />
                  </Field>
                  <Field label="Email address">
                    <input required type="email" value={form.email} readOnly={!!user?.primaryEmailAddress?.emailAddress} onChange={(event) => update('email', event.target.value)} placeholder="you@example.com" className="form-control read-only:bg-secondary/50" data-testid="input-profile-email" />
                  </Field>
                  <Field label="Phone number">
                    <input required type="tel" value={form.phoneNumber} onChange={(event) => update('phoneNumber', event.target.value)} placeholder="+91" className="form-control" data-testid="input-phone-number" />
                  </Field>
                </div>
              )}
              {step === 1 && (
                <div className="mt-8 grid gap-5 sm:grid-cols-2">
                  <Field label="Gothra" wide>
                    <input required value={form.gothra} onChange={(event) => update('gothra', event.target.value)} placeholder="Your family lineage" className="form-control" data-testid="input-profile-gothra" />
                  </Field>
                  <Field label="Nakshatra">
                    <input value={form.nakshatra ?? ''} onChange={(event) => update('nakshatra', event.target.value)} placeholder="Optional" className="form-control" data-testid="input-nakshatra" />
                  </Field>
                  <Field label="Rashi">
                    <input value={form.rashi ?? ''} onChange={(event) => update('rashi', event.target.value)} placeholder="Optional" className="form-control" data-testid="input-rashi" />
                  </Field>
                  <Field label="Family values" wide>
                    <select value={form.familyValues} onChange={(event) => update('familyValues', event.target.value as ProfileInput['familyValues'])} className="form-control" data-testid="select-family-values">
                      <option value="Orthodox">Orthodox</option>
                      <option value="Moderate">Moderate</option>
                      <option value="Liberal">Liberal</option>
                    </select>
                  </Field>
                  <p className="sm:col-span-2 -mt-1 text-[11px] leading-5 text-muted-foreground">These details help families begin with a shared cultural context. Optional fields can be left blank.</p>
                </div>
              )}
              {step === 2 && (
                <div className="mt-8 grid gap-5 sm:grid-cols-2">
                  <Field label="Education">
                    <input required value={form.educationQualification} onChange={(event) => update('educationQualification', event.target.value)} placeholder="Degree or qualification" className="form-control" data-testid="input-education" />
                  </Field>
                  <Field label="Current occupation">
                    <input required value={form.currentOccupation} onChange={(event) => update('currentOccupation', event.target.value)} placeholder="Your work today" className="form-control" data-testid="input-occupation" />
                  </Field>
                  <Field label="Current city">
                    <input required value={form.currentCity} onChange={(event) => update('currentCity', event.target.value)} placeholder="City, country" className="form-control" data-testid="input-current-city" />
                  </Field>
                  <Field label="Annual income (INR)">
                    <input required type="number" min="0" value={form.annualIncomeInr} onChange={(event) => update('annualIncomeInr', Number(event.target.value || 0))} placeholder="Annual income in rupees" className="form-control" data-testid="input-annual-income" />
                  </Field>
                </div>
              )}
              {error && <p role="alert" className="mt-5 rounded-xl bg-[#fbefeb] px-4 py-3 text-[12px] leading-5 text-[#965648]">{error}</p>}
              <div className="mt-10 flex items-center justify-between border-t border-border/70 pt-6">
                <button type="button" disabled={step === 0 || createProfile.isPending} onClick={() => setStep((current) => Math.max(0, current - 1))} className="inline-flex items-center gap-2 rounded-full px-3 py-2.5 text-[12px] font-semibold text-muted-foreground transition-colors hover:text-primary disabled:opacity-40" data-testid="button-previous-step">
                  <ArrowLeft size={15} /> Previous
                </button>
                {step < steps.length - 1 ? (
                  <button type="button" disabled={!canContinue()} onClick={() => setStep((current) => current + 1)} className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-[12px] font-semibold text-primary-foreground transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40" data-testid="button-next-step">
                    Continue <ArrowRight size={15} />
                  </button>
                ) : (
                  <button type="button" disabled={!canContinue() || createProfile.isPending} onClick={submit} className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-[12px] font-semibold text-primary-foreground transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50" data-testid="button-submit-profile">
                    {createProfile.isPending ? <><LoaderCircle size={15} className="animate-spin" /> Sending</> : <>Send for review <ArrowRight size={15} /></>}
                  </button>
                )}
              </div>
              <p className="mt-5 text-center text-[10px] leading-5 text-muted-foreground">Already part of the community? <button type="button" onClick={() => setLocation('/sign-in')} className="font-semibold text-primary underline-offset-2 hover:underline">Sign in</button></p>
            </>
          )}
        </section>
      </div>
      <style>{`.form-control{margin-top:8px;height:44px;width:100%;border:1px solid hsl(var(--input));border-radius:12px;background:hsl(var(--background));padding:0 13px;font-size:13px;color:hsl(var(--foreground));outline:none;transition:border-color .18s,box-shadow .18s}.form-control:focus{border-color:hsl(var(--primary));box-shadow:0 0 0 3px hsl(var(--primary)/.08)}.form-control::placeholder{color:hsl(var(--muted-foreground)/.7)}`}</style>
    </Shell>
  );
}

function Field({ label, wide, children }: { label: string; wide?: boolean; children: ReactNode }) {
  return (
    <label className={`block text-[10px] font-bold uppercase tracking-[.12em] text-muted-foreground ${wide ? 'sm:col-span-2' : ''}`}>
      {label}
      {children}
    </label>
  );
}
