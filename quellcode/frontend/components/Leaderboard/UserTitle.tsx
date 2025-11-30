"use client"

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

interface UserTitleProps {
  userId: number;
  isIndex?: boolean;
}

export default function UserTitle({ userId, isIndex = false }: UserTitleProps) {
  const [title, setTitle] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { status } = useSession();

  useEffect(() => {
    if (isIndex || status === 'loading') {
      setLoading(false);
      return;
    }

    if (status !== 'authenticated') {
      setLoading(false);
      return;
    }

    async function fetchTitle() {
      try {
        const response = await fetch(`/api/achievements/title?userID=${userId}`);
        if (response.ok) {
          const data = await response.json();
          console.log('Title data for user', userId, ':', data);
          // The API returns a SelectedTitleResponse object with 'titel' field
          setTitle(data.titel || null);
        } else {
          console.error('Failed to fetch title for user', userId, ':', response.status);
        }
      } catch (error) {
        console.error('Error fetching title for user', userId, ':', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTitle();
  }, [userId, isIndex, status]);

  if (isIndex || loading || !title) {
    return null;
  }

  return (
    <div className="text-[12px] text-gray-400 font-normal italic">
      {title}
    </div>
  );
}
