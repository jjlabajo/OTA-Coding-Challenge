"use client"

import { usePathname } from "next/navigation";
import { ReactNode, useState, useEffect, useRef } from "react";
import { Bell } from 'lucide-react';
import Link from 'next/link';

import Button from '@/ui/components/Button';
import Header from "@/ui/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { JobPostCard, JobPosting } from "@/lib/interfaces";

interface WrapperProps {
  children: ReactNode;
}

const excludedPaths = ["/signup", "/login"];

const Wrapper = ({ children }: WrapperProps) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'; // Provide a default
  const { token, isAuthenticated, user, logout, rerender } = useAuth();
  const [notificationCount, setNotificationCount] = useState<number>(0);
  const pathname = usePathname();

  useEffect(() => {
    const fetchInternalJobData = async () => {
      if (apiUrl && token) {
        if(user.user_type != 'moderator'){
          return
        }
        try {
          const response = await fetch(`${apiUrl}/moderator/notification-count`, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
          });
          if (!response.ok) {
            console.error(`Failed to fetch job posts: ${response.status}`);
            return;
          }
          const data: { count: number } = await response.json();
          setNotificationCount(data.count)
        } catch (error) {
          console.error("Error fetching internal job data:", error);
        }
      }
    };

    fetchInternalJobData();
  }, [apiUrl, token, rerender]);

  const isModerator = isAuthenticated && user?.user_type?.toUpperCase() === 'MODERATOR';

  const shouldShowHeader = !excludedPaths.includes(pathname);

  const getBadgeColor = (userType: string | undefined) => {
    switch (userType?.toUpperCase()) {
      case 'MODERATOR':
        return 'bg-purple-500 text-white';
      case 'RECRUITER':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-300 text-gray-700';
    }
  };

  const badgeColorClass = getBadgeColor(user?.user_type);
  const notificationsHref = "/notifications";

  return (
    <>
      {shouldShowHeader && (
        <Header>
          {isAuthenticated ? (
            <div className="flex items-center gap-4 filter drop-shadow-md shadow-black/75 ">
              <span>
                {user?.user_type && (
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold mr-2 ${badgeColorClass}`}>
                    {user.user_type}
                  </span>
                )}
                Welcome, {user?.name || 'User'}
              </span>

              {isModerator && (
                <Link href={notificationsHref} className="relative">
                  <Bell className="h-6 w-6 cursor-pointer" />
                  {notificationCount > 0 && (
                    <span className="absolute top-0 right-0 transform translate-x-1/3 -translate-y-1/3 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                      {notificationCount}
                    </span>
                  )}
                </Link>
              )}

              <Button onClick={logout}>Log out</Button>
            </div>
          ) : (
            <Link href="/login">
              <Button>Log in</Button>
            </Link>
          )}
        </Header>
      )}
      {children}
    </>
  );
};

export default Wrapper;