import Image from 'next/image';

type AvatarSize = 'sm' | 'md' | 'lg';

const sizeClasses: Record<AvatarSize, string> = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-14 h-14',
};

interface AvatarProps {
  src: string;
  alt: string;
  size?: AvatarSize;
}

export function Avatar({ src, alt, size = 'md' }: AvatarProps) {
  return (
    <div
      className={`relative flex-shrink-0 overflow-hidden rounded-full ${sizeClasses[size]}`}
    >
      <Image src={src} alt={alt} fill sizes="56px" className="object-cover" />
    </div>
  );
}
