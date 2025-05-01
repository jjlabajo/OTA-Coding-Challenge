'use client'; 

import React, { useState } from 'react';
import JobPostingForm, { JobPosting } from './JobPostingForm'; 
import Button from '@/ui/components/Button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useAuth } from "@/contexts/AuthContext";

type JobFormData = Omit<JobPosting, 'id' | 'created_at' | 'updated_at' | 'user'>;

const CreateJobPostPage: React.FC = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter()
  const { token } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleCreateJob = async (data: JobFormData) => {
    setIsLoading(true);
    setSubmitStatus(null);

    console.log('Submitting job data:', data);

    try {
      const response = await fetch(apiUrl + '/job-posts', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data), 
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to parse error response' }));
        console.error('Submission failed:', response.status, errorData);
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Submission successful:', result);

      setSubmitStatus({ type: 'success', message: 'Job posting created successfully!' });
      setTimeout(() => {
        router.push("/")
      }, 2000);


    } catch (error) {
      console.error('Error submitting job posting:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      setSubmitStatus({ type: 'error', message: `Failed to create job posting: ${errorMessage}` });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      
      <Link href="/">
        <Button className='flex items-center'>
            <ArrowLeft className="mr-2 h-4 w-4" /> Your Job Posts
        </Button>
      </Link>
      <h1 className="text-2xl font-bold mb-6 text-center text-white">Create New Job Posting</h1>

      {submitStatus && (
        <div
          className={`mb-4 p-3 rounded-md text-sm w-[50vw] mx-auto ${
            submitStatus.type === 'success'
              ? 'bg-lime-100 text-green-800 border border-lime-200'
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}
          role="alert"
        >
          {submitStatus.message}
        </div>
      )}

      <JobPostingForm
        onSubmit={handleCreateJob}
        isLoading={isLoading}
      />
    </div>
  );
};

export default CreateJobPostPage;
