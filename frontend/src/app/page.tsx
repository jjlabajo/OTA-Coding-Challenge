"use client";

import JobPostsPage from "./job-posts/JobPostsPage";
import UserJobPostsPage from "./user-job-posts/UserJobPostsPage";

import { useAuth } from "@/contexts/AuthContext";

export default function JobsPage() {
  const { user } = useAuth();

  return (
    <>
        { user ? <UserJobPostsPage /> : <JobPostsPage /> }
    </>
  );
}