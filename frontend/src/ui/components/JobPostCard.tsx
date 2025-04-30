import React from 'react';
import Image from 'next/image';

import { JobPostCard } from '@/lib/interfaces'

const ResourceCard: React.FC<JobPostCard> = ({
  url, // Use the actual imageUrl prop for the main image
  title,
  authorName,
  authorCompany,
  externalUrl = ""
}) => {
  // Get the first letter, handle empty names, and convert to uppercase
  const firstLetter = authorName ? authorName.charAt(0).toUpperCase() : '?';

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col">
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
        <div className="mt-auto pt-4 border-t border-gray-200 flex items-center justify-between"> {/* Changed to justify-between */}
          {/* Left side: Author Info */}
          <div className="flex items-center space-x-3"> {/* Group author info */}
            <div className="w-8 h-8 rounded-full bg-lime-300 flex items-center justify-center font-thin text-sm">
              {firstLetter}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">{authorName}</p>
              <p className="text-xs text-gray-500">{authorCompany}</p>
            </div>
          </div>
          {/* Right side: View Job Button */}
          <a href={externalUrl + url} target='_blank' className="text-sm font-medium py-1 px-3 rounded transition-colors duration-200 cursor-pointer hover:underline">
            View Job
          </a>
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;