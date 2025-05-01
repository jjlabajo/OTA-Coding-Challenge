"use client";

import Hero from "@/ui/components/Hero";
import JobPostCardComponent from "@/ui/components/JobPostCard";
import { useEffect, useState } from "react";
import { JobPostCard, JobPosting } from "@/lib/interfaces";

import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import Button from "@/ui/components/Button";

export default function NotificationsPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const { token } = useAuth();
  const [jobPosts, setJobPosts] = useState<JobPostCard[] | undefined>();

  useEffect(() => {
    const fetchInternalJobData = async () => {
      if (apiUrl && token) {
        try {
          const response = await fetch(`${apiUrl}/moderator/notifications`, {
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
        <Hero title="Notifications" />
        <section className="px-12 py-12 md:py-16 bg-white w-full">
            <div className="flex justify-end mb-4">
            <Link href="/moderator-job-posts">
                <Button> Go Back to Pending Job Posts </Button>
            </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {jobPosts &&
                    jobPosts.filter(jobPost => jobPost.status == 'pending').map((jobPost, index) => (
                    <JobPostCardComponent key={index} {...jobPost} />
                    ))}
                {(jobPosts && jobPosts.filter(jobPost => jobPost.status == 'pending').length < 1) && <div className="text-gray-500"> You're all caught up. No more notifications.</div>}
            </div>
            <hr className="mt-7 mb-7 border-t border-gray-300" />
            <div className="max-w-7xl mx-auto">
                {(jobPosts && jobPosts.filter(jobPost => jobPost.status != 'pending').length > 0) && <div className="text-gray-400 mb-7"> First time job posts you've taken action of:</div>}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ">
                {jobPosts &&
                    jobPosts.filter(jobPost => jobPost.status != 'pending').map((jobPost, index) => (
                    <JobPostCardComponent key={index} {...jobPost} />
                    ))}
                </div>
            </div>
        </section>
    </>
  );
}