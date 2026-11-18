import Link from 'next/link';

export const metadata = { title: 'Not found' };

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 p-6 text-center">
      <h1 className="text-[26px]">That page does not exist</h1>
      <Link href="/">Back to the dashboard</Link>
    </div>
  );
}
