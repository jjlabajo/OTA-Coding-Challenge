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
  const { token, isAuthenticated, user, logout } = useAuth();
  const [notificationCount, setNotificationCount] = useState<number>(0);
  const eventSourceRef = useRef<EventSource | null>(null);
  const pathname = usePathname();

  const isModerator = isAuthenticated && user?.user_type?.toUpperCase() === 'MODERATOR';

  useEffect(() => {
    if (!isModerator || !apiUrl) {
      return; // Don't connect if not a moderator or apiUrl is missing
    }

    const connectSSE = () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      const sseUrl = `${apiUrl}/moderator/notification-stream`;
      const es = new EventSource(sseUrl, { withCredentials: true });
      eventSourceRef.current = es;

      es.onopen = () => {
        // console.log("SSE Connection Opened"); // Optional logging
      };

      es.addEventListener('notification_count_update', (event) => {
        try {
          const data = JSON.parse(event.data);
          setNotificationCount(data.count);
        } catch (error) {
          console.error("Failed to parse SSE data:", error);
        }
      });

      es.onerror = (error) => {
        console.error("SSE Error:", error);
        es.close();
        // Optional: Implement a more robust retry mechanism if needed
        setTimeout(connectSSE, 10000); // Retry connection after 10 seconds
      };
    };

    connectSSE();

    return () => {
      if (eventSourceRef.current) {
        // console.log("Closing SSE Connection"); // Optional logging
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [isModerator, apiUrl]); // Reconnect if moderator status or apiUrl changes

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
            <div className="flex items-center gap-4">
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