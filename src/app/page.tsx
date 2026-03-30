import { PostFeed } from '@/widgets/feed';
import { FeedHeader } from '@/widgets/feed-header';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <FeedHeader />
      <main className="mx-auto max-w-screen-sm">
        <PostFeed />
      </main>
    </div>
  );
}