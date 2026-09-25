import { useEffect, useState, type ImgHTMLAttributes } from "react";
import { fallbackImage, resolveImageSource } from "@/lib/images";

type SafeImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src?: string | null;
  fallbackSrc?: string;
};

export function SafeImage({
  src,
  fallbackSrc = fallbackImage,
  alt = "",
  className,
  ...props
}: SafeImageProps) {
  const resolvedFallback = resolveImageSource(fallbackSrc, fallbackImage);
  const resolvedSource = resolveImageSource(src, resolvedFallback);
  const [currentSource, setCurrentSource] = useState(resolvedSource);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setCurrentSource(resolvedSource);
    setFailed(false);
  }, [resolvedSource]);

  if (failed) {
    return (
      <span
        role="img"
        aria-label={alt}
        className={`block h-full w-full bg-gray-100 ${className || ""}`}
      />
    );
  }

  return (
    <img
      {...props}
      src={currentSource}
      alt={alt}
      className={className}
      onError={() => {
        if (currentSource !== resolvedFallback) {
          setCurrentSource(resolvedFallback);
        } else {
          setFailed(true);
        }
      }}
    />
  );
}
