"use client";

import Hero from "@/ui/components/Hero";
import JobPostCardComponent from "@/ui/components/JobPostCard";
import { useEffect, useState } from "react";
import { JobPostCard, JobPosting } from "@/lib/interfaces";

import { useAuth } from "@/contexts/AuthContext";

export default function ModeratorJobPostsPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const { token } = useAuth();
  const [jobPosts, setJobPosts] = useState<JobPostCard[] | undefined>();

  useEffect(() => {
    const fetchInternalJobData = async () => {
      if (apiUrl && token) {
        try {
          const response = await fetch(`${apiUrl}/moderator/job-posts`, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
          });
          if (!response.ok) {
            console.error(`Failed to fetch job posts: ${response.status}`);
            return;
          }
          const internalJobsRaw: JobPosting[] = await response.json();

          const transformedInternalJobs: JobPostCard[] = internalJobsRaw.map(
            (job: JobPosting) => ({
              url: `/job-posts/${job.id}`,
              title: job.position,
              authorName: job.user.name,
              authorCompany: job.company,
              status: job.status
            })
          );

          setJobPosts(transformedInternalJobs);
        } catch (error) {
          console.error("Error fetching internal job data:", error);
        }
      }
    };

    fetchInternalJobData();
  }, [apiUrl, token]);

  return (
    <>
      <Hero title="Pending Job Posts" />
      <section className="px-12 py-12 md:py-16 bg-white w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {jobPosts &&
            jobPosts.map((jobPost, index) => (
              <JobPostCardComponent key={index} {...jobPost} />
            ))}
          { (jobPosts && jobPosts.length < 1) && <div className="text-gray-500"> No Pending Job posts..</div>}
        </div>
      </section>
    </>
  );
}