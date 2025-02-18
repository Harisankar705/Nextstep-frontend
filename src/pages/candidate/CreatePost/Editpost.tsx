import {
    MapPin,
    Smile,
    X,
} from "lucide-react";
import { sanitizeText, useRateLimit } from '../../../utils/SecurityMeasures'
import React, { useState } from "react";
import { LocationState, LocationSuggestion } from "../../../types/Candidate";
import Picker from '@emoji-mart/react'
import data from '@emoji-mart/data'
import Spinner from "../../../utils/Spinner";
import toast from "react-hot-toast";
import { updatePost } from "../../../services/authService";
import { LocationModal } from "./LocationModal";
import { getPostImageURL } from "../../../utils/ImageUtils";

const backGrounds = [
    "bg-white",
    "bg-gradient-to-r from-purple-500 to-pink-500",
    "bg-gradient-to-r from-yellow-500 to-orange-500",
    "bg-gradient-to-r from-red-500 to-pink-500",
    "bg-gradient-to-r from-gray-900 to-gray-600",
    "bg-gradient-to-r from-violet-500 to-purple-500",
    "bg-gradient-to-r from-orange-500 to-pink-500",
    "bg-gradient-to-r from-gray-500 to-pink-900",
    "bg-gradient-to-r from-blue-500 to-purple-900",
];

interface EditPostProps {
    post: {
        id: string;
        text: string;
        background?: string;
        location?: string;
        images?: string[]; 
    };
    isOpen: boolean;
    role:string
    onPostUpdate?:(updatedPost:any)=>void
    onClose: () => void;
}

export const EditPost: React.FC<EditPostProps> = ({ post, onClose, isOpen,role,onPostUpdate }) => {
    if (!isOpen) return null;

    const [postText, setPostText] = useState(post.text);
    const [selectedBackground, setSelectedBackground] = useState(post.background || "");
    const [searchLocation, setSearchLocation] = useState(post.location || "");
    const [locationResults, setLocationResults] = useState<LocationSuggestion[]>([]);
    const [showPicker, setShowPicker] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<string | null>(post.location || null);
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [locationState, setLocationState] = useState<LocationState>({
        isLoading: false,
        error: null,
        results: []
    });

    const checkRateLimit = useRateLimit();

    const handleUpdate = async () => {
        try {
            if (!checkRateLimit()) return;

            const sanitizedText = sanitizeText(postText);
            if (sanitizedText !== postText) {
                toast.error("Invalid characters detected in post text");
                return;
            }

            if (sanitizedText.length > 1000) {
                toast.error("Post text is too lengthy!");
                return;
            }

            if (!sanitizedText.trim()) {
                toast.error("Post text cannot be empty!");
                return;
            }

            setUpdating(true);
            const formData = new FormData();
            formData.append('postId', post.id);
            formData.append('text', sanitizedText);
            formData.append('role', role);
            formData.append('background', selectedBackground);

            if (selectedLocation) {
                formData.append('location', selectedLocation);
            }

            const response = await updatePost(post.id,formData);
            console.log(response)
            onClose();

            if (response.status === 200) {
                toast.success("Post updated successfully!");
                const updatedPost = {
                    _id: response.data._id,
                    text: response.data.text,
                    background: response.data.background,
                    location: response.data.location,
                    image: response.data.image,
                    createdAt: response.data.createdAt,
                    userId: response.data.userId,
                    comments: response.data.comments,
                    likes: response.data.likes
                };

                if (typeof onPostUpdate === 'function') {
                    onPostUpdate(updatedPost);
                }            }
        } catch (error) {
            toast.error("Error occurred while updating post");
            console.error("UPDATE ERROR", error);
        } finally {
            setUpdating(false);
        }
    };
    console.log("Role being sent:", role);


    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-gray-900 max-w-2xl p-6 rounded-lg shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Edit Post</h2>
                    <button
                        className="p-2 hover:bg-gray-100 rounded-full"
                        onClick={onClose}
                    >
                        <X className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                <div className={`mb-4 p-4 rounded-lg ${selectedBackground || "bg-white"}`}>
                    <textarea
                        placeholder="What's on your mind"
                        value={postText}
                        onChange={(e) => setPostText(e.target.value)}
                        className={`w-full min-h-[120px] bg-transparent resize-none outline-none ${selectedBackground ? "text-white" : "text-gray-800"
                            }`}
                    />

                    {/* Display existing images (read-only) */}
                    {post.images && post.images.length > 0 && (
                        <div className="grid grid-cols-2 gap-2 mb-4">
                            {post.images.map((imageUrl, index) => (
                                <div key={index} className="relative">
                                    <img
                                        src={getPostImageURL(imageUrl)}
                                        alt={`Image ${index + 1}`}
                                        className="w-full h-48 object-cover rounded-lg"
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Background Selection */}
                    <div className="mb-4 overflow-x-auto">
                        <div className="flex gap-2 pb-2">
                            {backGrounds.map((bg, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedBackground(bg)}
                                    className={`w-12 h-12 rounded-lg flex-shrink-0 ${bg} ${selectedBackground === bg ? "ring-2 ring-blue-500" : ""
                                        }`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="border rounded-lg p-3 mb-4">
                        <h4 className="text-sm font-medium text-gray-600 mb-2">
                            Edit options
                        </h4>
                        <div className="flex gap-2">
                            <button
                                className="p-2 hover:bg-gray-100 rounded-full"
                                onClick={() => setShowLocationModal(true)}
                            >
                                <MapPin className="w-6 h-6 text-red-500" />
                            </button>
                            <button
                                className="p-2 hover:bg-gray-100 rounded-full"
                                onClick={() => setShowPicker(!showPicker)}
                            >
                                <Smile className="w-6 h-6 text-yellow-500" />
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={handleUpdate}
                        disabled={!postText.trim() || updating}
                        className={`w-full py-2 rounded-lg font-medium ${postText.trim()
                                ? "bg-blue-500 text-white hover:bg-blue-600"
                                : "bg-gray-200 text-gray-500 cursor-not-allowed"
                            }`}
                    >
                        {updating ? <Spinner loading={true} /> : "Update Post"}
                    </button>
                </div>

                {/* Modals */}
                {showLocationModal && (
                    <LocationModal
                        isOpen={showLocationModal}
                        onClose={() => setShowLocationModal(false)}
                        locationState={locationState}
                        searchLocation={searchLocation}
                        onLocationSelect={(location) => {
                            setSelectedLocation(location);
                            setSearchLocation(location);
                            setLocationResults([]);
                            setShowLocationModal(false);
                        }}
                        onSearchChange={(e) => setSearchLocation(e.target.value)}
                        onRetry={() => {/* implement retry logic */ }}
                    />
                )}

                {showPicker && (
                    <div className="absolute z-50">
                        <Picker
                            data={data}
                            onEmojiSelect={(emoji: any) => {
                                setPostText(prev => prev + emoji.native);
                                setShowPicker(false);
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};