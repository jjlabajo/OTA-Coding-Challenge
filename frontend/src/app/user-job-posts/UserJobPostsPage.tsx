"use client";

import Hero from "@/ui/components/Hero";
import JobPostCardComponent from "@/ui/components/JobPostCard";
import { useEffect, useState } from "react";
import { JobPostCard, JobPosting } from "@/lib/interfaces";
import Link from "next/link";
import { Plus } from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";

export default function UserJobPostsPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const { token } = useAuth();
  const [jobPosts, setJobPosts] = useState<JobPostCard[] | undefined>();

  useEffect(() => {
    const fetchInternalJobData = async () => {
      if (apiUrl && token) {
        try {
          const response = await fetch(`${apiUrl}/user/job-posts`, {
            headers: {
              Authorization: `Bearer ${token}`,
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
      <Hero title="Your Job Posts" />
      <section className="px-12 py-12 md:py-16 bg-white w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <Link
            href="/create-job-post"
            className="block"
          >
            <div className="h-full hover:opacity-100 opacity-70 hover:border-black  relative border-dashed border-2 border-gray-600 rounded-md shadow-md p-8 transition duration-300 flex flex-col items-center justify-center h-48">
              <Plus size={48} className="text-lime-400 mb-2" />
              <h2 className="text-lg font-semibold text-lime-400 text-center">
                Add New Job Post
              </h2>
              <p className="text-gray-500 text-center text-sm">
                Click here to create a new job listing.
              </p>
            </div>
          </Link>
          {jobPosts &&
            jobPosts.map((jobPost, index) => (
              <JobPostCardComponent key={index} {...jobPost} />
            ))}
        </div>
      </section>
    </>
  );
}