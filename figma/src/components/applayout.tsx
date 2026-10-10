import { Outlet } from 'react-router';
import Sidebar from './Sidebar';

export default function AppLayout() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0B0D16' }}>
      <Sidebar notifCount={3} />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh', overflowX: 'hidden' }}>
        <Outlet />
      </main>
    </div>
  );
}
