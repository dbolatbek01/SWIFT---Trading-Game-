"use client"

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

interface SelectedAchievement {
  idUser: string;
  idAchievement: number;
  titel: string;
  reached: boolean;
}

interface UserAchievementsProps {
  userId: number;
  isIndex?: boolean;
  displayMode?: 'horizontal' | 'vertical';
  size?: 'small' | 'medium' | 'large';
}

export default function UserAchievements({ 
  userId, 
  isIndex = false, 
  displayMode = 'horizontal',
  size = 'medium'
}: UserAchievementsProps) {
  const [achievements, setAchievements] = useState<SelectedAchievement[]>([]);
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

    async function fetchAchievements() {
      try {
        const response = await fetch(`/api/achievements/selected?userID=${userId}`);
        if (response.ok) {
          const data = await response.json();
          console.log('Achievements data for user', userId, ':', data);
          
          // The API might return an object with selectedAchievements array or directly an array
          const achievementList = Array.isArray(data) ? data : (data.selectedAchievements || []);
          setAchievements(achievementList);
        } else {
          console.error('Failed to fetch achievements for user', userId, ':', response.status);
        }
      } catch (error) {
        console.error('Error fetching achievements for user', userId, ':', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAchievements();
  }, [userId, isIndex, status]);

  if (isIndex || loading) {
    return null;
  }

  const sizeClasses = {
    small: 'w-7 h-7',
    medium: 'w-12 h-12',
    large: 'w-14 h-14'
  };

  const containerClasses = displayMode === 'horizontal' 
    ? 'flex gap-1.5 items-center justify-center' 
    : 'flex flex-col gap-1.5 items-center';

  // Always show 3 slots (filled or placeholder)
  const maxSlots = 3;
  const slots = [];

  // Add actual achievements
  for (let i = 0; i < maxSlots; i++) {
    const achievement = achievements[i];
    
    if (achievement) {
      // Filled slot with badge
      slots.push(
        <div 
          key={achievement.idAchievement}
          className="relative group"
        >
          <Image
            src={`/badgets/${achievement.idAchievement}.png`}
            alt={achievement.titel || 'Achievement badge'}
            width={size === 'small' ? 28 : size === 'medium' ? 48 : 56}
            height={size === 'small' ? 28 : size === 'medium' ? 48 : 56}
            className={`${sizeClasses[size]} object-contain transition-transform hover:scale-110`}
          />
        </div>
      );
    } else {
      // Empty placeholder slot
      slots.push(
        <div 
          key={`placeholder-${i}`}
          className={`${sizeClasses[size]} rounded-full border-2 border-dashed border-gray-600/50 bg-transparent`}
          title="Empty badge slot"
        />
      );
    }
  }

  return (
    <div className={containerClasses}>
      {slots}
    </div>
  );
}
