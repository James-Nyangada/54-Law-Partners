import { ResourceList } from '@/components/ResourceList';

export const metadata = { title: 'Representative matters' };

export default function Page() {
  return <ResourceList resourceKey="matters" />;
}
