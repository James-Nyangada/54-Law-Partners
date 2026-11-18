import { ResourceForm } from '@/components/ResourceForm';

export const metadata = { title: 'Article' };

export default function Page() {
  return <ResourceForm resourceKey="articles" />;
}
