'use client';
import { IndexInfo } from '@/types/interfaces';

/**
 * Props interface for IndexHeader component.
 * @property index - Object containing information about the index
 */
interface IndexHeaderProps {
  index: IndexInfo;
}

/**
 * The IndexHeader component displays the index name and short name in a styled header.
 * It is used to provide a clear and visually appealing title for index-related pages.
 *
 * @param {IndexInfo} index - The index object containing index details.
 * @returns {JSX.Element} A styled header element displaying the index name and short name.
 */
export default function IndexHeader({ index }: IndexHeaderProps) {
  return (
    <h1 className="text-4xl font-bold mb-6 text-center bg-gradient-to-r from-[#61DAFB] via-[#1fc0f1] to-[#03a3d7] text-transparent bg-clip-text">
      {index.indexname} ({index.shortname})
    </h1>
  );
}
