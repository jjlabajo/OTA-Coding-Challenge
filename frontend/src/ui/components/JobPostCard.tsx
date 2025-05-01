import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { JobPostCard } from '@/lib/interfaces';
import { ExternalLink } from 'lucide-react';

const ResourceCard: React.FC<JobPostCard> = ({
  url, // Use the actual imageUrl prop for the main image
  title,
  authorName,
  authorCompany,
  externalUrl = '',
  status = '',
}) => {
  const router = useRouter();

  // Get the first letter, handle empty names, and convert to uppercase
  const firstLetter = authorName ? authorName.charAt(0).toUpperCase() : '?';
  const isExternal = externalUrl != '';

  const handleRedirect = () => {
    if (isExternal) {
      window.open(externalUrl + url, '_blank');
    } else {
      router.push(url);
    }
  };

  const renderStatusBadge = () => {
    if (status) {
      let bgColor = 'bg-gray-300';
      if (status === 'pending') {
        bgColor = 'bg-yellow-200 text-yellow-800';
      } else if (status === 'approved') {
        bgColor = 'bg-green-200 text-green-800';
      } else if (status === 'spam') {
        bgColor = 'bg-red-200 text-red-800';
      }

      return (
        <span className={`${bgColor} text-xs font-semibold mr-2 px-2.5 py-0.5 rounded`}>
          {status.toUpperCase()}
        </span>
      );
    }
    return null;
  };

  return (
    <div
      onClick={handleRedirect}
      className="cursor-pointer bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col"
    >
      <div className="relative w-full h-48 bg-gray-200">
        <Image
          // Using a placeholder for the main image as per original code
          src="https://placehold.co/600x400/000000/212427/png?text=."
          alt={title}
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold mb-2 text-gray-800">{title}</h3>
        {/* Footer Section */}
        <div className="mt-auto pt-4 border-t border-gray-200 flex items-center justify-between">
          {/* Left side: Author Info */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-lime-300 flex items-center justify-center font-thin text-sm">
              {firstLetter}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">{authorName}</p>
              <p className="text-xs text-gray-500">{authorCompany}</p>
            </div>
          </div>
          {/* Right side: View Job Button */}
          <div className="flex items-center">
            {renderStatusBadge()}
            {isExternal && <ExternalLink className="ml-2 h-4 w-4" />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;