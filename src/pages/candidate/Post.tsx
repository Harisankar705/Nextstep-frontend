    import { useSelector } from "react-redux"
    import { PostType } from "../../types/Candidate"
    import { MapPin, MessageSquare, Share, ThumbsUp } from "lucide-react"
    import { getPostImageURL, getProfilePictureURL } from "../../utils/ImageUtils"
    import { useEffect, useState } from "react"
    import { getRelativeTime } from "../../utils/relativeTime"

    const Post = ({post}:{post:PostType}) => {
        const [timeAgo,setTimeAgo]=useState(getRelativeTime(post.createdAt))
        useEffect(()=>{
            const isRecent=new Date().getTime()-new Date(post.createdAt).getTime()<360000
            if(isRecent)
            {
                const interval=setInterval(()=>{
                    setTimeAgo(getRelativeTime  (post.createdAt))
                },60000)
                return ()=>clearInterval(interval)
            }
        },[post.createdAt])

        const user=useSelector((state:any)=>state.user)
        const profilePictureURL=getProfilePictureURL(user.profilePicture)
        useEffect(()=>{
            const isRecent=new Date()
        })
    return (
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-4">
                <div className="h-10 w-10 rounded-full overflow-hidden">
                    <img
                        src={profilePictureURL}
                        alt="Post"
                        className="h-full w-full object-cover"
                    />
                </div>
                <div>
                    <p className="font-medium text-white">{`${user.firstName} ${user.secondName}`}</p>
                    <MapPin className="w-3 h-3 mr-1"/>
                    <span>{post.location}</span>

                    <p className="text-sm text-gray-400">{timeAgo}</p>
                </div>
            </div>
            <p className="text-white mb-4">{post.text}</p>
            {post.image && post.image.length > 0 && (
                <div className='grid grid-cols-2 gap-2 mb-4'>
                    {post.image.map((image: string, index: number) => (
                        <img key={index} src={getPostImageURL(image)} alt={`Post ${index}+1`}
                            className=' max-w-[90vw] max-h-[90vh] object-contain' />
                    ))}
                </div>
            )}
            {post.background && (
                <div className={`p-4 rounded-lg mb-4 ${post.background}`}>
                    <p className='text-white'>{post.text}</p>
                </div>
            )}
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
    )
    }

    export default Post