import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { PostType } from '../../types/Candidate';
import SideBar from './SideBar';
import { getUserPosts } from '../../services/authService';
import Post from '../candidate/Post';
import toast from 'react-hot-toast';
import { IEmployer } from '../../types/Employer';
import Spinner from '../../utils/Spinner';
const EmployerPosts: React.FC = () => {
    const [posts, setPosts] = useState<PostType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
      const employer=useSelector((state:{user:IEmployer})=>state.user)
    useEffect(() => {
        const fetchEmployerPosts = async () => {
            try {
                setIsLoading(true);
                const employerPosts = await getUserPosts();
                setPosts(employerPosts);
            } catch (error) {
                toast.error('Failed to fetch employer posts');
                return
            } finally {
                setIsLoading(false);
            }
        };
        fetchEmployerPosts();
    }, [employer._id]);
    return (
        <div className='flex flex-col lg:flex-row min-h-screen bg-[#0A0A0A] text-white'>
            <SideBar />
            <div className="flex-1 p-4 sm:p-6  lg:p-12 ">
                <div className="flex justify-between items-center mb-12">
                    <h1 className='text-2xl sm:text-3xl font-bold'>Company Posts</h1>
                </div>
                <div className='bg-[#1A1A1A] rounded-2xl overflow-hidden shadow-2xl'>
                    <div className="p-4 md:p-8">
                        <div className="space-y-6">
                            <h3 className="text-2xl font-semibold text-[#0DD3B4]">Recent Posts</h3>
                            {isLoading ? (
                               <Spinner loading={true}/>
                            ) : posts.length === 0 ? (
                                <div className="text-center text-gray-400 py-8">
                                    No posts yet. Start sharing your company updates!
                                </div>
                            ) : (
                                <div className="space-y-6 md:space-y-6">
                                    {posts.map(post => (
                                        <Post 
                                            key={post._id} 
                                            post={post} 
                                            profilePicture={employer.logo}
                                            userName={employer.companyName}
                                            role="employer"
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default EmployerPosts;