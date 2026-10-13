import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ClerkProvider } from '@clerk/react';
import { publishableKeyFromHost } from '@clerk/react/internal';
import { shadcn } from '@clerk/themes';
import Home from '@/pages/Home';
import Join from '@/pages/Join';
import ProfileDetail from '@/pages/ProfileDetail';
import Connections from '@/pages/Connections';
import Moderation from '@/pages/Moderation';
import NotFound from '@/pages/NotFound';
import { SignInPage, SignUpPage } from '@/pages/AuthPages';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();
const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');

function Router() {
  return (
    // Keep a shared shell (sidebar, navbar) outside the boundary so it
    // survives a page crash.
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/profiles/:id" component={ProfileDetail} />
        <Route path="/join" component={Join} />
        <Route path="/connections" component={Connections} />
        <Route path="/moderation" component={Moderation} />
        <Route path="/sign-in/*?" component={SignInPage} />
        <Route path="/sign-up/*?" component={SignUpPage} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <ClerkProvider
      publishableKey={publishableKeyFromHost(
        window.location.hostname,
        import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
      )}
      proxyUrl={import.meta.env.VITE_CLERK_PROXY_URL}
      appearance={{
        theme: shadcn,
        cssLayerName: 'clerk',
        options: {
          logoPlacement: 'inside',
          logoLinkUrl: basePath || '/',
          logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
        },
        variables: {
          colorPrimary: '#800020',
          colorForeground: '#33262a',
          colorMutedForeground: '#75696c',
          colorDanger: '#a33445',
          colorBackground: '#fffdf8',
          colorInput: '#fffdf8',
          colorInputForeground: '#33262a',
          colorNeutral: '#e4d7d9',
          fontFamily: '"DM Sans", sans-serif',
          borderRadius: '0.75rem',
        },
        elements: {
          rootBox: 'w-full flex justify-center',
          cardBox: 'bg-[#fffdf8] rounded-2xl w-[440px] max-w-full overflow-hidden',
          card: '!shadow-none !border-0 !bg-transparent !rounded-none',
          footer: '!shadow-none !border-0 !bg-transparent !rounded-none',
          headerTitle: 'text-[#33262a]',
          headerSubtitle: 'text-[#75696c]',
          socialButtonsBlockButtonText: 'text-[#33262a]',
          formFieldLabel: 'text-[#33262a]',
          footerActionLink: 'text-[#800020]',
          footerActionText: 'text-[#75696c]',
          dividerText: 'text-[#75696c]',
          identityPreviewEditButton: 'text-[#800020]',
          formFieldSuccessText: 'text-[#436b51]',
          alertText: 'text-[#a33445]',
          logoBox: 'text-[#800020]',
          logoImage: 'object-contain',
          socialButtonsBlockButton: 'border-[#e4d7d9]',
          formButtonPrimary: 'bg-[#800020] hover:bg-[#650019]',
          formFieldInput: 'border-[#e4d7d9] text-[#33262a]',
          footerAction: 'text-[#75696c]',
          dividerLine: 'bg-[#e4d7d9]',
          alert: 'border-[#eed2d7] bg-[#fff6f7]',
          otpCodeFieldInput: 'border-[#e4d7d9] text-[#33262a]',
          formFieldRow: 'text-[#33262a]',
          main: 'text-[#33262a]',
        },
      }}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
    >
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={basePath}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

export default App;
