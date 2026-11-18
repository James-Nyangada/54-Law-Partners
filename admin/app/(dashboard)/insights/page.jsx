import { ResourceList } from '@/components/ResourceList';

export const metadata = { title: 'Insights' };

export default function Page() {
  return <ResourceList resourceKey="articles" />;
}
