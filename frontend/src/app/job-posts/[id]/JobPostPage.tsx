"use client"

import React, { useState, useEffect } from 'react';
import { JobPosting } from '@/lib/interfaces';
import { useParams, useRouter } from 'next/navigation';
import Button from '@/ui/components/Button';
import { MoveLeft, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from "@/contexts/AuthContext";

const mockJob: JobPosting = {
    id: 0,
    company: "",
    office: "",
    position: '',
    description: ``,
    employment_type: '',
    status: 'pending',
    user_id: 1,
    user: { name: '' },
    created_at: '2024-07-24T10:00:00Z',
    updated_at: '2024-07-24T12:30:00Z',
};

const JobPostPage: React.FC = () => {
    const [job, setJob] = useState(mockJob);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const { id } = useParams();
    const { user, token } = useAuth();
    const router = useRouter();

    useEffect(() => {
        console.log(apiUrl);
        const getJob = async () => {
            try {
                const response = await fetch(`${apiUrl}/job-posts/${id}`);
                if (!response.ok) {
                    console.error(`Failed to fetch job with id ${id}:`, response.status);
                    // Optionally handle error UI here, e.g., display a message to the user
                    return;
                }
                const data = await response.json();
                setJob(data);
            } catch (error) {
                console.error("An error occurred while fetching the job:", error);
                // Optionally handle error UI here
            }
        };
        if (id) {
            getJob();
        }
    }, [apiUrl, id]);

    const handleDelete = async () => {
        if (!id) {
            console.error('Job ID is missing.');
            return;
        }

        try {
            const response = await fetch(`${apiUrl}/job-posts/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
            });

            if (response.ok) {
                console.log('Job posting deleted successfully!');
                router.push('/');
            } else {
                const errorData = await response.json();
                console.error('Failed to delete job posting:', errorData);
            }
        } catch (error) {
            console.error('An error occurred while deleting the job posting:', error);
        }
    };

    return (
        <div className="min-h-screen">
            <main className="container mx-auto py-8 px-6">
                <Link href="/">
                    <Button className="flex items-center">
                        <MoveLeft className="mr-2 w-4 h-4" /> Job Board
                    </Button>
                </Link>
                <div className="bg-white shadow-lg rounded-lg p-8 mt-8">
                    <div className='flex items-center justify-between'>
                        <h1 className="text-3xl font-bold text-gray-900">{job.position}</h1>
                        <div>
                            {user?.id === job.user_id && (
                                <button
                                onClick={handleDelete}
                                className="inline-flex items-center px-3 py-1.5 bg-red-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition ease-in-out duration-150"
                                >
                                <Trash2 className="h-4 w-4 mr-2" aria-hidden="true" />
                                Delete
                                </button>
                            )}
                        </div>
                    </div>
                    <p className="text-gray-600 mb-4"> {job.employment_type} - {job.office} </p>
                    <div className="text-gray-700 leading-relaxed whitespace-pre-line mb-6" dangerouslySetInnerHTML={{ __html: job.description }} />
                </div>
            </main>
        </div>
    );
};

export default JobPostPage;