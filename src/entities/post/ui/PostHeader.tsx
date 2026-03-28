import { Avatar } from '@/shared/ui';

interface PostHeaderProps {
  profileImage: string;
  username: string;
}

export function PostHeader({ profileImage, username }: PostHeaderProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <Avatar src={profileImage} alt={username} size="md" />
      <span className="text-sm font-semibold">{username}</span>
    </div>
  );
}
