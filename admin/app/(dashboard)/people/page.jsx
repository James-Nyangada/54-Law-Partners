import { ResourceList } from '@/components/ResourceList';

export const metadata = { title: 'Our people' };

export default function Page() {
  return <ResourceList resourceKey="lawyers" />;
}
