import {
    Image,
    ImagePlus,
    MapPin,
    Smile,
    Users,
    X,
} from "lucide-react";
import { sanitizeText, scanFile, useRateLimit, validateImage} from '../../../utils/SecurityMeasures'
import React, { useEffect, useMemo, useState } from "react";
import { fetchLocationSuggestions } from "../../../utils/LanguageAndLocation";
import { CreatePostProps, LocationState, LocationSuggestion } from "../../../types/Candidate";
import Picker from '@emoji-mart/react'
import data from '@emoji-mart/data'


import Spinner from "../../../utils/Spinner";
import toast from "react-hot-toast";
import { debounce } from "lodash";
import { createPost } from "../../../services/authService";
import { LocationModal } from "./LocationModal";
import { ImageUploadModal } from "./ImageUploadModal";
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
export const CreatePost: React.FC<CreatePostProps> = ({ onClose, isOpen }) => {
    if(!isOpen)return null
    const [postText, setPostText] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [selectedBackground, setSelectedBackground] = useState("");
    const [searchLocation, setSearchLocation] = useState("");
    const [locationResults, setLocationResults] = useState<LocationSuggestion[]>(
        []

    );

    const [showPicker, setShowPickter] = useState(false)
    const [posting, setPosting] = useState(false);
    const [selectedEmoji, setSelectedEmoji] = useState('')
    const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [imageLoadingStates, setImageLoadingStates] = useState<{ [key: number]: boolean }>({})
    const [imageErrorStates, setImageErrorStates] = useState<{ [key: number]: boolean }>({})
    const [selectedImagePreview, setSelectedImagePreviews] = useState<string[]>([])
    const [locationState, setLocationState] = useState<LocationState>({
        isLoading: false,
        error: null,
        results: []
    })
   
    const checkRateLimit=useRateLimit()
    const handleFileInput = async(e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            const totalSize=filesArray.reduce((acc,file)=>acc+file.size,0)
            const MAX_TOTAL_SIZE=20*1024*1024
            if(totalSize>MAX_TOTAL_SIZE)
            {
                toast.error("Total file size exceed 20 MB Limit")
                return
            }
            const validFiles=filesArray.filter(file=>validateImage(file))
            if(validFiles.length!==filesArray.length)
            {
                return
            }
            if (selectedImages.length + filesArray.length > 5) {
                toast.error("YOu can upload a maximum of 5 images")
                return
            }
            try {
                await Promise.all(validFiles.map(file=>scanFile(file)))
            } catch (error) {
                toast.error("File security check failed")
                return
            }
            setSelectedImages((prev) => [...prev, ...validFiles]);

            const imageUrls = validFiles.map((file) => URL.createObjectURL(file));
            const newLoadingStates = validFiles.reduce((acc, _, index) => {
                const newIndex = selectedImages.length + index
                return { ...acc, [newIndex]: true }
            }, {})
            setImageLoadingStates(prev => ({
                ...prev,
                ...newLoadingStates
            }))
            const newErrorStates = filesArray.reduce((acc, _, index) => {
                const newIndex = selectedImages.length + index
                return { ...acc, [newIndex]: false }
            })
            setSelectedImagePreviews((prev) => [...prev, ...imageUrls])
            setShowModal(false);
        }
    };
    const handleEmojiSelect = (emoji: any) => {
        setSelectedEmoji((prev) => prev + emoji.native)
        setPostText((prev) => prev + emoji.native)
        setShowPickter(false)
    }
    const showUploadModal = () => {
        setShowModal(true);
    };
   
    const handleLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value.trim();
        setSearchLocation(query)
        debouncedSearchLocations(query)
    };
    const handleRetry = () => {
        debouncedSearchLocations(searchLocation)
    }

    const handlePost = async () => {
        try {
            if(!checkRateLimit())return
            const sanitizedText=sanitizeText(postText)
            if (sanitizedText !==postText)
            {
                toast.error("Invalid characters detected in post text")
                return
            }
            if (sanitizedText.length>1000)
            {
                toast.error("Post text is too lengthy!")
                return
            }

       
            if (!sanitizedText.trim()) {
            toast.error("Post text cannot be empty!")
            return
            }
        
        
        
            const formData = new FormData()
            setPosting(true)
            formData.append('text', sanitizedText)
            formData.append('background', selectedBackground)
            formData.append('role', 'user');

            if (selectedLocation) {
                formData.append('location', selectedLocation)
            }
            selectedImages.forEach((file) => {
                formData.append('postImage', file)
            })
            for (let pair of formData.entries()) {
                console.log(pair[0], pair[1]);
            }
            
                const response = await createPost(formData, 'user')
                console.log(response)
                if (response.status === 201) {

                    toast.success("Posted successfully!")
                    selectedImagePreview.forEach(url => URL.revokeObjectURL(url))
                    resetStates()
                    
                    onClose()
                }
            }
            catch (error) {
                toast.error("Error occured while posting")
                console.log("POSTING ERROR",error)
            }
            finally {
                setPosting(false)
            }

        }
        const resetStates=()=>{
            setPostText('')
            setSelectedImages([])
            setSelectedBackground('')
            setSearchLocation('')
            setLocationResults([])
            setShowPickter(false)
            setSelectedEmoji('')
            setShowLocationModal(false)
            setImageLoadingStates({})
            setImageErrorStates({})
            setSelectedImagePreviews([])
            setLocationState({
                isLoading: false,
                error: null,
                results: []
            })
        }

    

    
    const debouncedSearchLocations = useMemo(
        () =>
            debounce(async (query: string) => {
                if (!query.trim()) {
                    setLocationState(prev => ({ ...prev, results: [], error: null }))
                    return
                }
                setLocationState(prev => ({ ...prev, isLoading: true, error: null }))
                try {
                    const locations = await fetchLocationSuggestions(query);
                    const formattedLocations: LocationSuggestion[] = locations.map(
                        (location) => ({
                            name: location.name,
                            id: Number(location.id),
                        }));
                    setLocationState(prev => ({
                        ...prev,
                        results: formattedLocations,
                        isLoading: false,
                        error: null
                    }))
                } catch (error) {
                    setLocationState(prev => ({
                        ...prev,
                        results: [],
                        isLoading: false,
                        error: "Failed to fetch locations,Please try again!"
                    }))
                }

            }, 300),
        []
    );
    useEffect(()=>{
       
        return ()=>{
            selectedImagePreview.forEach(url=>URL.revokeObjectURL(url))
            debouncedSearchLocations.cancel()
        }
    },[debouncedSearchLocations,selectedImagePreview])

    
    
  



    const removeImage = (index: number) => {
        setSelectedImages((prev) => {
            const newFiles = prev.filter((_, i) => i !== index)
            return newFiles
        });
        setSelectedImagePreviews((prevPreviews) => {
            URL.revokeObjectURL(prevPreviews[index])
            const newPreview = prevPreviews.filter((_, i) => i !== index)
            return newPreview
        })
        setImageLoadingStates((prev) => {
            const newStates = { ...prev }
            delete newStates[index]
            return newStates
        })
        setImageErrorStates((prev) => {
            const newStates = { ...prev }
            delete newStates[index]
            return newStates
        })
    };


        return (
            <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
                <div className="bg-gray-900 max-w-2xl p-6 rounded-lg shadow-lg border border-gray-800 text-white">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-white">Create Post</h2>
                        <button
                            className="p-2 hover:bg-gray-800 rounded-full transition-colors"
                            onClick={onClose}
                        >
                            <X className="w-6 h-6 text-gray-400" />
                        </button>
                    </div>

                    <button className="flex items-center gap-1 px-3 py-1 bg-gray-800 rounded-full text-sm text-gray-300">
                        {selectedLocation && (
                            <span>
                                <MapPin className="inline-block w-4 h-4 mr-1 text-purple-500" />
                                {selectedLocation}
                            </span>
                        )}
                    </button>

                    <div className={`mb-4 p-4 rounded-lg ${selectedBackground || "bg-gray-800"}`}>
                        <textarea
                            placeholder="What's on your mind?"
                            value={postText}
                            onChange={(e) => setPostText(e.target.value)}
                            className={`w-full min-h-[120px] bg-transparent resize-none outline-none placeholder-gray-500 ${selectedBackground ? "text-white" : "text-gray-200"
                                }`}
                        />

                        {selectedImagePreview.length > 0 && (
                            <div className="grid grid-cols-2 gap-2 mb-4">
                                {selectedImagePreview.map((image, index) => (
                                    <div key={index} className="relative group">
                                        {imageLoadingStates[index] && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-gray-800 rounded-lg animate-pulse">
                                                <Spinner loading={true} />
                                            </div>
                                        )}
                                        {imageErrorStates[index] && (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800 rounded-lg">
                                                <ImagePlus className="w-8 h-8 text-gray-400 mb-2" />
                                                <p className="text-sm text-gray-400">Failed to load image!</p>
                                            </div>
                                        )}
                                        <img
                                            src={image}
                                            alt={`Preview ${index + 1}`}
                                            className="w-full h-48 object-cover rounded-lg"
                                            onLoad={() => {
                                                setImageLoadingStates(prev => ({
                                                    ...prev,
                                                    [index]: false
                                                }))
                                            }}
                                            onError={() => {
                                                setImageErrorStates(prev => ({
                                                    ...prev,
                                                    [index]: false
                                                }))
                                            }}
                                        />
                                        <button
                                            onClick={() => removeImage(index)}
                                            className="absolute top-2 right-2 p-1 bg-black bg-opacity-70 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="mb-4 overflow-x-auto">
                            <div className="flex gap-2 pb-2">
                                {backGrounds.map((bg, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedBackground(bg)}
                                        className={`w-12 h-12 rounded-lg flex-shrink-0 ${bg} ${selectedBackground === bg
                                                ? "ring-2 ring-purple-500"
                                                : ""
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="border border-gray-700 rounded-lg p-3 mb-4">
                            <h4 className="text-sm font-medium text-gray-400 mb-2">
                                Add to your post
                            </h4>
                            <div className="flex gap-2">
                                <button className="p-2 hover:bg-gray-800 rounded-full transition-colors" onClick={showUploadModal}>
                                    <Image className="w-6 h-6 text-purple-500" />
                                </button>
                                <button className="p-2 hover:bg-gray-800 rounded-full transition-colors">
                                    <Users className="w-6 h-6 text-purple-500" />
                                </button>
                                <button className="p-2 hover:bg-gray-800 rounded-full transition-colors" onClick={() => setShowPickter(!showPicker)}>
                                    <Smile className="w-6 h-6 text-purple-500" />
                                </button>
                                <button className="p-2 hover:bg-gray-800 rounded-full transition-colors" onClick={() => setShowLocationModal(true)}>
                                    <MapPin className="w-6 h-6 text-purple-500" />
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={handlePost}
                            disabled={!postText.trim() || posting}
                            className={`w-full py-2 rounded-lg font-medium transition-colors ${postText.trim()
                                    ? "bg-purple-600 text-white hover:bg-purple-700"
                                    : "bg-gray-800 text-gray-500 cursor-not-allowed"
                                }`}
                        >
                            {posting ? <Spinner loading={true} /> : "Post"}
                        </button>
                    </div>
                </div>

                {/* Modals */}
                {showModal && (
                    <ImageUploadModal
                        isOpen={showModal}
                        onClose={() => setShowModal(false)}
                        onFileSelect={handleFileInput}
                    />
                )}
                {showLocationModal && (
                    <LocationModal
                        isOpen={showLocationModal}
                        onClose={() => setShowLocationModal(false)}
                        locationState={locationState}
                        searchLocation={searchLocation}
                        onLocationSelect={(location) => {
                            setSelectedLocation(location)
                            setSearchLocation(location)
                            setLocationResults([])
                            setShowLocationModal(false)
                        }}
                        onSearchChange={handleLocationChange}
                        onRetry={handleRetry}
                    />
                )}
                {showPicker && (
                    <div className="absolute z-50">
                        <Picker
                            data={data}
                            onEmojiSelect={handleEmojiSelect}
                            theme="dark"
                        />
                    </div>
                )}
            </div>
        );
    };

