import Image from 'next/image';

interface PostImageProps {
  src: string;
  alt: string;
}

export function PostImage({ src, alt }: PostImageProps) {
  return (
    <div className="relative aspect-square w-full">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 640px) 100vw, 640px"
        className="object-cover"
      />
    </div>
  );
}
