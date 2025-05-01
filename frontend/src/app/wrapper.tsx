"use client"

import { usePathname } from "next/navigation";
import { ReactNode } from "react";

import Link from 'next/link';
import Button from '@/ui/components/Button';
import Header from "@/ui/components/Header";
import { useAuth } from "@/contexts/AuthContext"; // Import the hook

interface WrapperProps {
  children: ReactNode;
}

const excludedPaths = ["/signup", "/login"];

const Wrapper = ({ children }: WrapperProps) => {
  const pathname = usePathname();
  const shouldShowHeader = !excludedPaths.includes(pathname);
  const { isAuthenticated, user, logout } = useAuth(); // Access context values

  return (
    <>
      {shouldShowHeader && (
        <Header>
          {isAuthenticated ? (
            <>
              <span>Welcome, {user?.name || 'User'}</span>
              <Button onClick={logout}>Log out</Button>
            </>
          ) : (
            <Link href="login">
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