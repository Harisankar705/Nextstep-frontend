import { Edit, GraduationCap, Home, MessageSquare, Share, ThumbsUp, Users } from 'lucide-react';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Spinner from '../../utils/Spinner';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const navigate = useNavigate()
    const user = useSelector((state: any) => state.user);
    const [isEditing,setIsEditing]=useState(false)
    const handleEditProfile=()=>{
        navigate('/edit-profile')
        setIsEditing(true)
    }

    if (!user) {
        return <Spinner loading={true} />;
    }

    const { firstName, secondName, profilePicture, email, location, skills, education, friends } = user;
    console.log('User object:', user);

    const profilePictureFileName = profilePicture.includes('\\')
        ? profilePicture.split('\\').pop()
        : profilePicture;
    const profilePictureURL = `http://localhost:4000/uploads/profile-pictures/${profilePictureFileName}?t=${new Date().getTime()}`;

    console.log('Profile Picture URL:', profilePictureURL);

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="relative h-[350px]">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-900 to-black opacity-90">
                    <div className="absolute inset-0 bg-[url('/placeholder.svg')] bg-cover bg-center mix-blend-overlay"></div>
                </div>
                <div className="flex flex-col items-center mb-4">
                    <div className="h-48 w-48 rounded-full border-4 border-black overflow-hidden -mt-20 mb-4 ml-10">

                    </div>
                </div>
            </div>


            {/* Profile Body */}
            <div className="bg-black text-white pt-20 px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="relative inline-block h-48 w-48 rounded-full overflow-hidden border-4 border-black bg-gray-900 -mt-48 l-auto">
                        <img
                            src={profilePictureURL}
                            alt="Profile"
                            className="h-full w-full object-cover"
                        />
                    </div>
                    {/* User Info */}
                    <div className="flex justify-between items-start">

                        <div className="text-center">
                            <h1 className="text-3xl font-bold">
                                {firstName} {secondName}
                            </h1>
                            <p className="text-purple-400 mt-1">
                                {friends ? `${friends.length} friends` : 'No friends'}
                            </p>
                        </div>
                        <div className="flex justify-center mt-4">
                            <button onClick={handleEditProfile} className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md transition duration-300">
                                <Edit className="mr-2 h-4 w-4" />
                                {isEditing ?"Close":"Edit Profile"}
                            </button>
                        </div>
                    </div>
                    {isEditing && (
                        <div className='mt-8 bg-gray-800 p-6 rounded-lg'>
                            <h2 className='text-2xl font-bold mb-4'>Edit Profile</h2>
                            </div>
                    )}

                    <div className="flex border-b border-gray-800 mt-8">
                        {['Posts', 'About', 'Friends', 'Photos', 'Videos'].map((item) => (
                            <button
                                key={item}
                                className={`px-4 py-4 text-sm font-medium ${item === 'Posts'
                                    ? 'text-purple-500 border-b-2 border-purple-500'
                                    : 'text-gray-400 hover:text-gray-300'
                                    }`}
                            >
                                {item}
                            </button>
                        ))}
                    </div>

                    {/* Profile Content */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 py-4">
                        {/* Sidebar */}
                        <div className="md:col-span-4 space-y-4">
                            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                                <h2 className="text-lg font-semibold text-white mb-3">Intro</h2>
                                <p className="text-center mb-4">About yourself</p>
                                <button className="w-full py-2 px-4 bg-gray-800 hover:bg-gray-700 rounded-md text-gray-300 mb-4 transition duration-300">
                                    Edit Bio
                                </button>
                                <div className="space-y-3 text-gray-300">
                                    <div className="flex items-center gap-2">
                                        <GraduationCap className="h-5 w-5 text-gray-400" />
                                        <span>
                                            {education
                                                ? education
                                                    .map(
                                                        (ed: { degree: string; institution: string }) =>
                                                            `${ed.degree} at ${ed.institution}`
                                                    )
                                                    .join(', ')
                                                : 'No education details'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Home className="h-5 w-5 text-gray-400" />
                                        <span>{location || 'No location'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Users className="h-5 w-5 text-gray-400" />
                                        <span>{friends ? `${friends.length} friends` : 'No friends'}</span>
                                    </div>
                                </div>
                                <button className="w-full py-2 px-3 bg-gray-800 hover:bg-gray-700 rounded-md text-gray-300 mt-4 transition duration-300">
                                    Edit details
                                </button>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="md:col-span-8 space-y-4">
                            {/* Post Input */}
                            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                                <div className="flex items-center space-x-3">
                                    <div className="h-10 w-10 rounded-full overflow-hidden">
                                        <img
                                            src={profilePictureURL}
                                            alt="Profile"
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="What's on your mind?"
                                        className="bg-gray-800 rounded-full px-4 py-2 text-white w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>
                            </div>

                            {/* Post Display */}
                            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="h-10 w-10 rounded-full overflow-hidden">
                                        <img
                                            src="/placeholder.svg"
                                            alt="Post"
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <p className="font-medium text-white">Username</p>
                                        <p className="text-sm text-gray-400">1 hour ago</p>
                                    </div>
                                </div>
                                <p className="text-white mb-4">This is a sample post content.</p>
                                <div className="border-t border-b border-gray-800 py-2 my-2">
                                    <div className="flex justify-between text-gray-400">
                                        <button className="flex items-center space-x-2 hover:text-purple-500 transition duration-300">
                                            <ThumbsUp className="w-5 h-5" />
                                            <span>Like</span>
                                        </button>
                                        <button className="flex items-center space-x-2 hover:text-purple-500 transition duration-300">
                                            <MessageSquare className="w-5 h-5" />
                                            <span>Comment</span>
                                        </button>
                                        <button className="flex items-center space-x-2 hover:text-purple-500 transition duration-300">
                                            <Share className="w-5 h-5" />
                                            <span>Share</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
