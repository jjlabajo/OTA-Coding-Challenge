"use client"

import React, { useState, useEffect } from 'react';
import { JobPosting } from '@/lib/interfaces';
import { useParams, useRouter } from 'next/navigation';
import Button from '@/ui/components/Button';
import { MoveLeft, Trash2, CheckCircle, Flag } from 'lucide-react';
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
    const { user, token, setRerender } = useAuth();
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
                console.log(data)
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

    
    const handleAction = async (action: string) => {
        if (!id) {
            console.error('Job ID is missing.');
            return;
        }
        let method = 'DELETE'
        let path = `/job-posts/${id}`
        if(action == 'approve'){
            path = `/job-posts/${id}/approve`
            method = 'PATCH'
        }
        if(action == 'markAsSpam'){
            path = `/job-posts/${id}/markAsSpam`
            method = 'PATCH'
        }

        try {
            const response = await fetch(`${apiUrl}${path}`, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
            });

            if (response.ok) {
                console.log('Job post action successful: ' + action);
                setRerender(new Date().getTime())
                router.push(action == 'delete' ? '/' : '/notifications');
            } else {
                const errorData = await response.json();
                console.error('Failed:', errorData);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleDelete = async () => {
        await handleAction("delete")
    }


    const handleApprove = async ()=>{
        await handleAction("approve")
    }

    const handleMarkAsSpam = async ()=>{
        await handleAction("markAsSpam")
    }

    return (
        <div className="min-h-screen">
            <main className="container mx-auto py-8 px-6">
                <Button className="flex items-center" onClick={() => window.history.back()}>
                    <MoveLeft className="mr-2 w-4 h-4" /> Go Back
                </Button>
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
                            {user?.user_type === 'moderator' && (
                                <div className="inline-flex space-x-2">
                                    <button
                                        onClick={handleApprove}
                                        className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition ease-in-out duration-150 disabled:bg-gray-400 disabled:text-gray-700 disabled:cursor-not-allowed"
                                        disabled={job.status == 'approved'}
                                    >
                                        <CheckCircle className="h-4 w-4 mr-2" aria-hidden="true" />Approve
                                    </button>
                                    <button
                                        onClick={handleMarkAsSpam}
                                        className="inline-flex items-center px-3 py-1.5 bg-yellow-500 text-white text-sm font-medium rounded-md shadow-sm hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 transition ease-in-out duration-150 disabled:bg-gray-400 disabled:text-gray-700 disabled:cursor-not-allowed"
                                        disabled={job.status == 'spam'}
                                    >
                                        <Flag className="h-4 w-4 mr-2" aria-hidden="true" /> Mark as Spam
                                    </button>
                                </div>
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