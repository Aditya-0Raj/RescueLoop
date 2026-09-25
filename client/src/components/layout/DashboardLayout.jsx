import { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import PageContainer from './PageContainer';

export default function DashboardLayout({ role = 'operations', title, subtitle = '', children, live = false }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const roleName = role.charAt(0).toUpperCase() + role.slice(1);

  return (
    <div className="page-shell md:flex">
      <Sidebar role={role} mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="min-w-0 flex-1">
        <Topbar title={title} subtitle={subtitle} role={roleName} live={live} onMenu={() => setMobileOpen(true)} />
        <PageContainer className="dashboard-grid">{children}</PageContainer>
      </div>
    </div>
  );
}
