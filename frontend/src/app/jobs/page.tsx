"use client"

import Hero from "@/ui/components/Hero";
import JobPostCardComponent from "@/ui/components/JobPostCard";
import { useEffect, useState } from "react";
import { JobPostCard, JobPosting } from "@/lib/interfaces";
import { fetchJobPostings } from "@/lib/getExternalApiData"; // Adjust the import path as needed

export default function JobsPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [jobPosts, setJobPosts] = useState<JobPostCard[] | undefined>();

  useEffect(() => {
    const fetchAllJobData = async () => {
      if (apiUrl) {
        const internalApiPromise = fetch(`${apiUrl}/job-posts`).then(response => response.json()) as Promise<JobPosting[]>;
        const externalApiPromise = fetchJobPostings();

        try {
          const [internalJobsRaw, externalJobs] = await Promise.all([internalApiPromise, externalApiPromise]);

          const transformedInternalJobs: JobPostCard[] = internalJobsRaw.map((job: JobPosting) => ({
            url: `/jobs/${job.id}`,
            title: job.name,
            authorName: job.department,
            authorCompany: job.subcompany,
          }));

          const transformedExternalJobs: JobPostCard[] = externalJobs.map((job: JobPosting) => ({
            url: `/job/${job.external_id}`, // Use external_id as it's from the external source
            title: job.name,
            authorName: job.department || job.office, // Adjust based on available data
            authorCompany: job.subcompany || 'External', // Indicate it's an external job
            externalUrl: 'https://mrge-group-gmbh.jobs.personio.de'
          }));

          // Combine the job postings from both sources
          setJobPosts([...transformedInternalJobs, ...transformedExternalJobs]);

        } catch (error) {
          console.error("Error fetching job data:", error);
        }
      } else {
        console.error("API URL is undefined. Check your .env file.");
      }
    };

    fetchAllJobData();
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