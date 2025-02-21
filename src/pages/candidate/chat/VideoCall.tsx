import { Mic, MicOff, PhoneOff, Video, VideoOff } from "lucide-react";
import React, { useEffect, useRef } from "react";
import { VideoCallUIProps } from "../../../types/Employer";
import toast from "react-hot-toast";
export const VideoCallUI: React.FC<VideoCallUIProps> = React.memo(({
    localStream, 
    remoteStream, 
    isVideoEnabled, 
    isMuted,
    toggleMute, 
    toggleVideo, 
    endVideoCall,
    callDuration
}) => {
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    // Format duration
    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };
    useEffect(() => {
        if (localVideoRef.current && localStream) {
            try {
                localVideoRef.current.srcObject = localStream;
                localVideoRef.current.autoplay = true;
                localVideoRef.current.playsInline = true;
                const playPromise = localVideoRef.current.play();
                if (playPromise !== undefined) {
                    playPromise.catch(() => {});
                }
            } catch (error) {
                toast.error('Error setting local video stream:');
                return
            }
        }
    }, [localStream]);
    useEffect(() => {
        if (remoteVideoRef.current && remoteStream) {
            try {
                remoteVideoRef.current.srcObject = remoteStream;
                remoteVideoRef.current.autoplay = true;
                remoteVideoRef.current.playsInline = true;
                const playPromise = remoteVideoRef.current.play();
                if (playPromise !== undefined) {
                    playPromise.catch(() => {});
                }
            } catch (error) {
                toast.error('Error setting remote video stream:');
                return
            }
        }
    }, [remoteStream]);
    return (
        <div className="fixed inset-0 z-50 bg-black">
            {remoteStream ? (
                <video 
                    ref={remoteVideoRef} 
                    autoPlay 
                    playsInline 
                    className="w-full h-full rounded-lg object-cover" 
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-white">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
                        Waiting for remote video
                    </div>
                </div>
            )}
            <div className="absolute bottom-24 right-4 w-48 h-36 rounded-lg overflow-hidden shadow-lg">
                {isVideoEnabled && localStream ? (
                    <video 
                        ref={localVideoRef} 
                        autoPlay 
                        playsInline 
                        className="w-48 h-36 rounded-lg object-cover" 
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-black">
                        <div className="p-3 rounded-full bg-gray-700">
                            <VideoOff className="w-6 h-6 text-white" />
                        </div>
                    </div>
                )}
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                <div className="flex items-center justify-between max-w-md mx-auto">
                    <div className="text-white text-lg">
                        {formatDuration(callDuration)}
                    </div>
                    <div className="flex items-center space-x-6">
                        <button
                            onClick={toggleMute}
                            className={`p-4 rounded-full ${
                                isMuted ? "bg-gray-500" : "bg-red-600"
                            } hover:opacity-90 transition-colors`}
                        >
                            {isMuted ? (
                                <Mic className="w-6 h-6" />
                            ) : (
                                <MicOff className="w-6 h-6" />
                            )}
                        </button>
                        <button
                            onClick={toggleVideo}
                            className={`p-4 rounded-full ${
                                !isVideoEnabled ? "bg-red-500" : "bg-gray-600"
                            } hover:opacity-90 transition-colors`}
                        >
                            {!isVideoEnabled ? (
                                <VideoOff className="w-6 h-6" />
                            ) : (
                                <Video className="w-6 h-6" />
                            )}
                        </button>
                        <button
                            onClick={endVideoCall}
                            className="p-4 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
                        >
                            <PhoneOff className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
});