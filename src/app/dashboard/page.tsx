import { BPTracker } from '@/components/dashboard/bp-tracker';
import { MedicationManager } from '@/components/dashboard/medication-manager';

export default function DashboardPage() {
  return (
    <div className="grid gap-6">
      <BPTracker />
      <MedicationManager />
    </div>
  );
}
