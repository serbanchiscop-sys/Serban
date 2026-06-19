/* App composition: the phone surface (status bar → active screen → bottom nav →
 * home indicator → overlays). Framed in a device bezel on web; full-screen on
 * a real device. */
import { useApp, isNative } from './state/store';
import { useAuth } from './state/auth';
import { PhoneFrame } from './components/PhoneFrame';
import { StatusBar, HomeIndicator } from './components/StatusBar';
import { BottomNav } from './components/BottomNav';
import { Timeline } from './screens/Timeline';
import { Moments } from './screens/Moments';
import { Search } from './screens/Search';
import { Shop } from './screens/Shop';
import { Family } from './screens/Family';
import { SignIn } from './screens/SignIn';
import { Overlays } from './overlays/Overlays';

function ActiveScreen() {
  const { state } = useApp();
  switch (state.tab) {
    case 'moments': return <Moments />;
    case 'search': return <Search />;
    case 'shop': return <Shop />;
    case 'family': return <Family />;
    default: return <Timeline />;
  }
}

/** The phone surface — identical on web (inside the bezel) and on device.
 * When an auth backend is configured and no one is signed in, the sign-in gate
 * replaces the tab UI. */
function AppShell({ framed }: { framed: boolean }) {
  const { state } = useApp();
  const auth = useAuth();
  const gated = auth.ready && auth.enabled && !auth.signedIn;
  return (
    <div style={{ position: 'relative', width: '100%', height: framed ? '100%' : '100vh',
      background: '#F4F6FA', borderRadius: framed ? 38 : 0, overflow: 'hidden',
      display: 'flex', flexDirection: 'column' }}>
      <StatusBar platform={state.platform} />
      {gated ? (
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}><SignIn /></div>
      ) : (
        <>
          <div className="scr" style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', position: 'relative' }}>
            <ActiveScreen />
          </div>
          <BottomNav />
        </>
      )}
      <HomeIndicator platform={state.platform} />
      {!gated && <Overlays />}
    </div>
  );
}

export default function App() {
  if (isNative()) return <AppShell framed={false} />;
  return (
    <PhoneFrame>
      <AppShell framed />
    </PhoneFrame>
  );
}
