import { useEffect, useState } from 'react';
import type { ComponentProps } from 'react';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { apiClient } from '@services/api/client';

type Props = ComponentProps<typeof ImageWithBasePath>;

/** Photos already downloaded in this browser tab, so a card is not fetched twice. */
const urlCache = new Map<string, string>();
const inFlight = new Map<string, Promise<string>>();

function loadPhoto(fileId: string): Promise<string> {
  const cached = urlCache.get(fileId);
  if (cached) return Promise.resolve(cached);

  let pending = inFlight.get(fileId);
  if (!pending) {
    pending = apiClient
      .getBlob(`/files/${fileId}/content`)
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        urlCache.set(fileId, url);
        return url;
      })
      .finally(() => inFlight.delete(fileId));
    inFlight.set(fileId, pending);
  }
  return pending;
}

const FALLBACK = 'assets/img/students/student-01.jpg';

/**
 * Drop-in replacement for ImageWithBasePath.
 *  - src="file:123"  -> the uploaded photo with that file id (downloaded with the user's sign-in)
 *  - any other src   -> the normal static image
 * While a photo loads, or if it fails, the placeholder picture is shown.
 */
const AuthImage = ({ src, ...rest }: Props) => {
  const fileId = typeof src === 'string' && src.startsWith('file:') ? src.slice(5) : null;
  const [url, setUrl] = useState<string | null>(fileId ? (urlCache.get(fileId) ?? null) : null);

  useEffect(() => {
    if (!fileId) return undefined;
    let cancelled = false;
    loadPhoto(fileId)
      .then((value) => {
        if (!cancelled) setUrl(value);
      })
      .catch(() => {
        if (!cancelled) setUrl(null);
      });
    return () => {
      cancelled = true;
    };
  }, [fileId]);

  if (!fileId) return <ImageWithBasePath src={src} {...rest} />;
  if (!url) return <ImageWithBasePath src={FALLBACK} {...rest} />;

  const { alt, className } = rest as { alt?: string; className?: string };
  return <img src={url} alt={alt ?? ''} className={className} style={{ objectFit: 'cover' }} />;
};

export default AuthImage;