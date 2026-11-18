import { ResourceList } from '@/components/ResourceList';

export const metadata = { title: 'Careers' };

export default function Page() {
  return <ResourceList resourceKey="jobs" />;
}
