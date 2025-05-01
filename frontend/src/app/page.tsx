"use client";

import JobPostsPage from "./job-posts/JobPostsPage";
import UserJobPostsPage from "./user-job-posts/UserJobPostsPage";
import ModeratorJobPostsPage from "./moderator-job-posts/ModeratorJobPostsPage";

import { useAuth } from "@/contexts/AuthContext";

export default function JobsPage() {
  const { user } = useAuth();

  return (
    <>
        { user ? (user.user_type == 'moderator'? <ModeratorJobPostsPage /> : <UserJobPostsPage /> ) : <JobPostsPage /> }
    </>
  );
}