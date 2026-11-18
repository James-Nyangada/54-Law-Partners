import { RequireAdmin } from '@/lib/auth';
import { Settings } from '@/components/screens/Settings';

export const metadata = { title: 'Settings' };

export default function Page() {
  return (
    <RequireAdmin>
      <Settings />
    </RequireAdmin>
  );
}
