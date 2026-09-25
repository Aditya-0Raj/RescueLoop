import { Routes, Route } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import ProtectedRoute from '../components/common/ProtectedRoute';
import DonorDashboard from '../pages/donor/DonorDashboard';
import NewDonation from '../pages/donor/NewDonation';
import MyDonations from '../pages/donor/MyDonations';
import DonationDetails from '../pages/donor/DonationDetails';
import RecipientDashboard from '../pages/recipient/RecipientDashboard';
import IncomingDonations from '../pages/recipient/IncomingDonations';
import AcceptedDonations from '../pages/recipient/AcceptedDonations';
import CapacityManagement from '../pages/recipient/CapacityManagement';
import DriverDashboard from '../pages/driver/DriverDashboard';
import AvailableJobs from '../pages/driver/AvailableJobs';
import MyJobs from '../pages/driver/MyJobs';
import DriverHistory from '../pages/driver/DriverHistory';
import OperationsDashboard from '../pages/operations/OperationsDashboard';
import LiveRescues from '../pages/operations/LiveRescues';
import RescueDetails from '../pages/operations/RescueDetails';
import FailoverDemo from '../pages/operations/FailoverDemo';
import TrackingPage from '../pages/tracking/TrackingPage';
import ImpactDashboard from '../pages/impact/ImpactDashboard';
import NotFound from '../pages/NotFound';

const route = (roles, element) => <ProtectedRoute roles={roles}>{element}</ProtectedRoute>;

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/donor" element={route(['donor'], <DonorDashboard />)} />
      <Route path="/donor/new" element={route(['donor'], <NewDonation />)} />
      <Route path="/donor/donations" element={route(['donor'], <MyDonations />)} />
      <Route path="/donor/donations/:id" element={route(['donor'], <DonationDetails />)} />
      <Route path="/recipient" element={route(['recipient'], <RecipientDashboard />)} />
      <Route path="/recipient/incoming" element={route(['recipient'], <IncomingDonations />)} />
      <Route path="/recipient/accepted" element={route(['recipient'], <AcceptedDonations />)} />
      <Route path="/recipient/capacity" element={route(['recipient'], <CapacityManagement />)} />
      <Route path="/driver" element={route(['driver'], <DriverDashboard />)} />
      <Route path="/driver/jobs" element={route(['driver'], <AvailableJobs />)} />
      <Route path="/driver/my-jobs" element={route(['driver'], <MyJobs />)} />
      <Route path="/driver/history" element={route(['driver'], <DriverHistory />)} />
      <Route path="/operations" element={route(['operations'], <OperationsDashboard />)} />
      <Route path="/operations/live" element={route(['operations'], <LiveRescues />)} />
      <Route path="/operations/rescue/:id" element={route(['operations'], <RescueDetails />)} />
      <Route path="/operations/failover" element={route(['operations'], <FailoverDemo />)} />
      <Route path="/tracking/:id" element={route(['donor', 'recipient', 'driver', 'operations'], <TrackingPage />)} />
      <Route path="/impact" element={route(['donor', 'recipient', 'driver', 'operations'], <ImpactDashboard />)} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
