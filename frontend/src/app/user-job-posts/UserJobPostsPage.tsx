"use client"

import Hero from "@/ui/components/Hero";
import JobPostCardComponent from "@/ui/components/JobPostCard";
import { useEffect, useState } from "react";
import { JobPostCard, JobPosting } from "@/lib/interfaces";

export default function JobsPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [jobPosts, setJobPosts] = useState<JobPostCard[] | undefined>();

  useEffect(() => {
    const fetchInternalJobData = async () => {
      if (apiUrl) {
        try {
          const response = await fetch(`${apiUrl}/user-job-posts`);
          if (!response.ok) {
            console.error(`Failed to fetch job posts: ${response.status}`);
            return;
          }
          const internalJobsRaw: JobPosting[] = await response.json();

          const transformedInternalJobs: JobPostCard[] = internalJobsRaw.map((job: JobPosting) => ({
            url: `/job-posts/${job.id}`,
            title: job.position,
            authorName: job.user_name,
            authorCompany: job.company,
          }));

          setJobPosts(transformedInternalJobs);

        } catch (error) {
          console.error("Error fetching internal job data:", error);
        }
      } else {
        console.error("API URL is undefined. Check your .env file.");
      }
    };

    fetchInternalJobData();
  }, [apiUrl]);

  return (
    <>
      <Hero title="Job Board" />
      <section className="px-12 py-12 md:py-16 bg-white w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {jobPosts && jobPosts.map((jobPost, index) => (
            <JobPostCardComponent key={index} {...jobPost} />
          ))}
        </div>
      </section>
    </>
  );
}