import {
  Bookmark,
  Gift,
  Image,
  ImagePlus,
  MapPin,
  MoreHorizontal,
  Smartphone,
  Smile,
  Users,
  X,
} from "lucide-react";

import React, { useEffect, useRef, useState } from "react";
import Navbar from "../../utils/Navbar";
import { fetchLocationSuggestions } from "../../utils/LanguageAndLocation";
import { LocationSuggestion } from "../../types/Candidate";
import Picker from '@emoji-mart/react'
import data from '@emoji-mart/data'


import Spinner from "../../utils/Spinner";
import toast from "react-hot-toast";
import { debounce } from "lodash";
import { createPost } from "../../services/authService";
const Skelton = ({ className = "" }: { className?: string }) => (
  <div
    className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`}
  />
);
const LeftSideBar = ({
  icon: Icon,
  children,
}: {
  icon: any;
  children: React.ReactNode;
}) => (
  <a
    href="#"
    className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
  >
    <Icon className="h-6 w-6" />
    <span className="text-sm font-medium">{children}</span>
  </a>
);

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

const Home = () => {
  const [post, setPost] = useState(false);
  const [postText, setPostText] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [selectedBackground, setSelectedBackground] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [locationResults, setLocationResults] = useState<LocationSuggestion[]>(
    []

  );

  const [showPicker,setShowPickter]=useState(false)
  const [posting, setPosting] = useState(false);
  const [selectedEmoji,setSelectedEmoji]=useState('')
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);
  const [selectedImagePreview,setSelectedImagePreviews]=useState<string[]>([])
  const suggestedLocation = [
    { id: 1, name: "Muvattupuzha", fullAddress: "Muvattupuzha,Kerala,India" },
    { id: 2, name: "Banglore", fullAddress: "Banglore,Karnataka,India" },
    { id: 3, name: "Thodupuzha", fullAddress: "Thodupuzha,Kerala,India" },
  ];
  const handleEmojiSelect=(emoji:any)=>{
    setSelectedEmoji((prev)=>prev+emoji.native)
    setPostText((prev)=>prev+emoji.native)
    setShowPickter(false)
  }
  const showUploadModal = () => {
    setShowModal(true);
  };
  const hideUploadModal = () => {
    setShowModal(false);
  };
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const handleLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.trim();
    setSearchLocation(query);
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    if(!query)
    {
      setLocationResults([])
      return
    }
    debounceRef.current = setTimeout(async () => {
      if (query) {
        try {
          const locations = await fetchLocationSuggestions(query);
          const formattedLocations: LocationSuggestion[] = locations.map(
            (location) => ({
              name: location.name,
              id: Number(location.id),
            })
          );
          setLocationResults(formattedLocations);
        } catch (error) {
          toast.error("error occured during fetching location");
        }
      }
    }, 300);
  };

  const handlePost = async() => {
    if (postText.trim()) {
      const formData=new FormData()
      setPosting(true)
      formData.append('text',postText)
      formData.append('background',selectedBackground)
      formData.append('role', 'user'); 

      if(selectedLocation)
      {
        formData.append('location',selectedLocation)
      }
      selectedImages.forEach((file,index)=>{
        formData.append('postImage',file)
      })
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]); 
      }
        try {
          const response = await createPost(formData,'user')
          if(response.status===200)
          {
            
            toast.success("Posted successfully!")
            selectedImagePreview.forEach(url=>URL.revokeObjectURL(url))
            setPostText('')
            setSelectedImages([])
            setSelectedBackground('')
            setPost(false)
          }
        }
        catch (error) {
          toast.error("Error occured while posting")
        }
        finally
        {
          setPosting(false)
        }

      }
      
      
    }
  
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedImages((prev) => [...prev, ...filesArray]);

      const imageUrls = filesArray.map((file) => URL.createObjectURL(file));
      setSelectedImagePreviews((prev)=>[...prev,...imageUrls])
      setShowModal(false);
    }
  };
  const debouncedSearchLocations = debounce(async (query: string) => {
    if (!query.trim())return 
      try {
        const locations = await fetchLocationSuggestions(query);
        const formattedLocations: LocationSuggestion[] = locations.map(
          (location) => ({
            name: location.name,
            id: Number(location.id),
          })
        );
        setLocationResults(formattedLocations);
      } catch (error) {
        toast.error("Error occurred during fetching location");
      }
    
  }, 300);

  useEffect(() => {
      debouncedSearchLocations(searchLocation);
      return()=>{
        debouncedSearchLocations.cancel()
      
    }
  }, [searchLocation]);

  const removeImage = (index: number) => {
    setSelectedImages((prev) => {
      const newFiles=prev.filter((_,i)=>i!==index)
      return newFiles
    });
    setSelectedImagePreviews((prevPreviews)=>{
      URL.revokeObjectURL(prevPreviews[index])
      const newPreview=prevPreviews.filter((_,i)=>i!==index)
      return newPreview
    })
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex">
        <div className="w-[360px] fixed left-0  top-0 h-screen p-4 overflow-y-auto">
          <div className="space-y-2">
            <div className="items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full overflow-hidden"></div>
            </div>
            <LeftSideBar icon={Users}>Friends</LeftSideBar>
            <LeftSideBar icon={Bookmark}>Saved</LeftSideBar>
          </div>
        </div>

        <main className="flex-1 ml-[360px] mr-[360px] p-4">
          <div
            className="bg-white rounded-lg shadow p-4 mb-4"
            onClick={() => setPost(true)}
          >
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <Skelton className="w-full h-full" />
              </div>
              <div className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-gray-500">
                What's on your mind!
              </div>
            </div>
            <div className="flex justify-between mt-4 pt-4 border-t">
              <button className="flex items-center gap-2 text-gray-500 hover:bg-gray-100 px-2 py-2 rounded-lg">
                <Image className="h-6 w-6 text-green-500" />
                <span>Photo/video</span>
              </button>
            </div>
          </div>

          {post && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white max-w-2xl p-6 rounded-lg shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Create Post</h2>
                  <button
                    className="p-2 hover:bg-gray-100 rounded-full"
                    onClick={() => setPost(false)}
                  >
                    <X className="w-6 h-6 text-gray-500" />
                  </button>
                </div>

                <h3 className="font-semibold">{/* username */}</h3>
                <button className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm">
                  {/* <Users className="w-4 h-4" />
                  <span>Friends</span> */}
                  {selectedLocation  && (
                    <span>
                      <MapPin className="inline-block w-4 h-4 mr-1 text-red-500" />{selectedLocation}</span>   
                  )}
                                
                </button>

                <div
                  className={`mb-4 p-4 rounded-lg ${
                    selectedBackground || "bg-white"
                  }`}
                >
                  <textarea
                    placeholder="whats on your mind"
                    value={postText}
                    onChange={(e) => setPostText(e.target.value)}
                    className={`w-full min-h-[120px] bg-transparent resize-none outline-none placeholder-gray-500 ${
                      selectedBackground ? "text-white" : "text-gray-800"
                    }`}
                  />
                  {selectedImagePreview.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {selectedImagePreview.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                          <button
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 p-1 bg-black bg-opacity-50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
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
                          className={`w-12 h-12 rounded-lg flex-shrink-0 ${bg} ${
                            selectedBackground === bg
                              ? "ring-2 ring-blue-500"
                              : ""
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="border rounded-lg p-3 mb-4">
                    <h4 className="text-sm font-medium text-gray-600 mb-2">
                      Add to your post
                    </h4>
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-full">
                        <Image
                          className="w-6 h-6 text-green-500"
                          onClick={showUploadModal}
                        />
                      </button>
                      {showModal && (
                        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
                          <div className="bg-white rounded-lg w-full max-w-md p-4">
                            <div className="flex justify-between items-center mb-4">
                              <h3 className="text-lg font-sembold">
                                Add photos/videos
                              </h3>
                              <button
                                className="p-1 hover:bg-gray-100 rounded-full "
                                onClick={hideUploadModal}
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </div>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-4">
                              <div className="flex flex-col items-center gap-2 text-center">
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                  <ImagePlus className="w-6 h-6 text-gray-600" />
                                </div>
                                <p className="text-sm text-gray-600">
                                  Add Photos
                                </p>
                                <p className="text-sm text-gray-600">
                                  or drag and drop
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center gap-2">
                                <Smartphone className="w-5 h-5 text-gray-600" />
                                <span className="text-sm text-gray-600 ">
                                  Add Photos from your mobile phone
                                </span>
                              </div>
                              <label className="cursor-pointer">
                                <input
                                  type="file"
                                  accept="image/*"
                                  multiple
                                  className="hidden"
                                  onChange={handleFileInput}
                                />
                                <span className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                                  Add
                                </span>
                              </label>
                            </div>
                          </div>
                        </div>
                      )}
                      <button className="p-2 hover:bg-gray-100 rounded-full">
                        <Users className="w-6 h-6 text-blue-500" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-full" onClick={()=>setShowPickter(!showPicker)}>
                        <Smile className="w-6 h-6 text-yellow-500"  />
                        
                      </button>
                      {showPicker && (
                        <div className="absolute z-50">
                          <Picker data={data} onEmojiSelect={handleEmojiSelect}
 />
                        </div>
                       
                      )}
                      
                      <button className="p-2 hover:bg-gray-100 rounded-full">
                        <MapPin
                          className="w-6 h-6 text-red-500"
                          onClick={() => setShowLocationModal(true)}
                        />
                      </button>
                      {showLocationModal && (
                        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
                          <div className="bg-white rounded-lg w-full max-w-md p-4">
                            <div className="flex justify-between items-center mb-4">
                              <h3 className="text-lg font-semibold">
                                Search for location
                              </h3>
                              <button
                                onClick={() => setShowLocationModal(false)}
                                className="p-1 hover:bg-gray-100 rounded-full"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </div>
                            <div className="p-5 ">
                              <input
                                type="text"
                                placeholder="Enter your location"
                                className="w-full p-2 border rounded-lg mb-4"
                                value={searchLocation}
                                
                                onChange={handleLocationChange}
                          
                                
                              />
                              <div className="space-y-2 max-h-48 overflow-y-auto">
                                {isLoadingLocations ? (
                                  <Spinner loading={true} />
                                ) : (
                                  locationResults.map((location) => (
                                    <button
                                      key={location.id}
                                      onClick={() => {
                                        setSelectedLocation(location.name);
                                        setSearchLocation(location.name);
                                        setLocationResults([])
                                        setShowLocationModal(false)
                                      }}
                                      className="w-full text-left p-2 hover:bg-gray=100 rounded-lg"
                                    >
                                      <div className="font-medium">
                                        {location.name}
                                      </div>
                                    </button>
                                  ))
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                     
                    </div>
                  </div>
                  <button
                    onClick={handlePost}
                    disabled={!postText.trim()||posting}
                    className={`w-full py-2 rounded-lg font-medium ${
                      postText.trim()
                        ? "bg-blue-500 text-white hover:bg-blue-600"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {posting ? <Spinner loading={true} /> : "Post"}

                  </button>
                </div>
              </div>
            </div>
          )}

          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow p-4 mb-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <Skelton className="w-full h-full" />
                </div>
                <div className="flex-1">
                  <Skelton className="h-4 w-32 mb-2" />
                  <Skelton className="h-3 w-24" />
                </div>
                <button className="text-gray-500">
                  <MoreHorizontal className="h-6 w-6" />
                </button>
              </div>
              <Skelton className="w-full h-full" />
              <div className="flex gap-2">
                <Skelton className="h-8 w-20" />
                <Skelton className="h-8 w-20" />
                <Skelton className="h-8 w-20" />
              </div>
            </div>
          ))}
        </main>
      </div>
    </div>
  );
};

export default Home;
