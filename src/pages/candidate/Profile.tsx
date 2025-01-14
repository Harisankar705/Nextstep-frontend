import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Spinner from '../../utils/Spinner';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../utils/Navbar';
import { PostType, ProfileHeaderProps } from '../../types/Candidate';
import Post from './Post';
import { getUserPosts } from '../../services/authService';
import { ProfileHeader } from './Profile/ProfileHeader';
import { ProfileTabs } from './Profile/ProfileTabs';
import { ProfileIntro } from './Profile/ProfileIntro';
import { CreatePost } from './CreatePost/CreatePost';
import { PostInput } from './CreatePost/PostInput';

const Profile:React.FC<ProfileHeaderProps>=({ userId }) => {
    const navigate = useNavigate()
    const currentUser = useSelector((state: any) => state.user);
    const [activeTab, setActiveTab] = useState("Posts")
    const [posts, setPosts] = useState<PostType[]>([])
    const [loading, setLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const isOwnProfile = !userId || userId === currentUser?._id
    const displayedUser = isOwnProfile ? currentUser : null
    const [showCreatePost, setShowCreatePost] = useState(false)


    
    useEffect(() => {
        const fetchPosts = async () => {
            if(!displayedUser)return
            try {
                
                const response = await getUserPosts()
                
                setPosts(response)
            } catch (error) {
                console.error("Error fetching posts", error)

            }
            finally {
                setLoading(false)
            }
        }
        fetchPosts()
        

    }, [displayedUser])
    const handleEditProfile = () => {
        navigate('/edit-profile')
        setIsEditing(true)
    }

    if (!currentUser) {
        return <Spinner loading={true} />;
    }


    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />
            
            <ProfileHeader user={displayedUser} isOwnProfile={isOwnProfile} onEditProfile={handleEditProfile} />



            <div className="max-w-6xl mx-auto px-8">
                <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />





                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 py-4">
                    <div className="md:col-span-4 space-y-4">
                        <ProfileIntro user={displayedUser} isOwnProfile={isOwnProfile} />
                    </div>

                    <div className="md:col-span-8 space-y-4">
                        {isOwnProfile && (
                            <>
                                <PostInput onClick={() => setShowCreatePost(true)} profilePicture={displayedUser?.profilePicture} />
                                <CreatePost isOpen={showCreatePost} onClose={() => setShowCreatePost(false)} role='user' />
                            </>
                        )}

                        {loading ? (
                            <Spinner loading={true} />
                        ) : posts.length > 0 ? (
                            posts.map((post: PostType) => (
                                <Post key={post._id} post={post} />
                            ))
                        ) : (
                            <div className='text-center text-gray-400 py-8'>
                                No posts to display
                            </div>

                        )}


                    </div>






                </div>
            </div>
        </div>

    );
};

export default Profile;
