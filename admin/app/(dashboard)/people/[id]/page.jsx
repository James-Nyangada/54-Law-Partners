import { ResourceForm } from '@/components/ResourceForm';

export const metadata = { title: 'Profile' };

export default function Page() {
  return <ResourceForm resourceKey="lawyers" />;
}
