import { PostFeed } from '@/widgets/feed';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white px-4 py-3">
        <h1 className="text-center text-lg font-semibold">Instagram</h1>
      </header>
      <main className="mx-auto max-w-screen-sm">
        <PostFeed />
      </main>
    </div>
  );
}