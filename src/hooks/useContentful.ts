import { useEffect, useState } from 'react';
import { createClient } from 'contentful';
import type { EntrySkeletonType } from 'contentful';

const client = createClient({
  accessToken: import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN!,
  space: import.meta.env.VITE_CONTENTFUL_SPACE_ID!,
});

interface UseContentfulResult<TFields> {
  data: TFields[];
  loading: boolean;
  error: Error | null;
}

/**
 * Hook para traer entries de Contentful con tipado seguro
 * @param contentType - El ID del content type en Contentful¿
 * @param shouldReverse - Si se debe invertir el orden de los entries (por defecto true)
 */
export function useContentful<T extends EntrySkeletonType>(
  contentType: string,
  shouldReverse: boolean = true,
): UseContentfulResult<T['fields']> {
  const [data, setData] = useState<T['fields'][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const entries = await client.getEntries<T>({
          content_type: contentType,
        });

        let allFields = entries?.items?.map((item) => item.fields) ?? [];
        if (shouldReverse) {
          allFields = allFields.reverse();
        }
        setData(allFields);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [contentType, shouldReverse]);

  return { data, error, loading };
}
