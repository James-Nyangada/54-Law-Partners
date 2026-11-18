import { RequireAdmin } from '@/lib/auth';
import { Users } from '@/components/screens/Users';

export const metadata = { title: 'Users' };

export default function Page() {
  return (
    <RequireAdmin>
      <Users />
    </RequireAdmin>
  );
}
