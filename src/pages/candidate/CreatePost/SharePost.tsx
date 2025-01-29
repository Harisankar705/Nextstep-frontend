import { Copy, Facebook, Linkedin, Twitter, X } from "lucide-react"
import toast from "react-hot-toast"
import { SharePostProps } from "../../../types/Candidate"
type SharePlatForm='facebook'|'twitter'|'linkedin'
export const SharePost:React.FC<SharePostProps>=({isOpen,onClose,post}) => {
    const url=typeof window!=='undefined' ?window.location.href:''
    const shareLinks:Record<SharePlatForm,string>={
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(post.text)}`,
        linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent('Check out this post')}&summary=${encodeURIComponent(post.text)}`  
    }
    const handleShare=(platform:SharePlatForm)=>{
        window.open(shareLinks[platform],'_blank','width=600,height=400')
        onClose()
    }
    const copyToClipboard=async()=>{
        try {
            await navigator.clipboard.writeText(url)
            toast.success('Link copied to clipboard!')
        } catch (error) {
            toast.error("Failed to copy to clipboard!")
        }
    }
    if(!isOpen)return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="relative w-full max-w-md bg-gray-900 rounded-lg shadow-lg mx-4 px-4 py-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Share Post</h2>
                <button onClick={onClose}
                className="p-1 hover:bg-gray-800 rounded-full transition-colors">
                    <X className="w-5 h-5 text-gray-400"/>
                </button>
            </div>
            <div className="grid grid-cols-3 gap-4">
                <button onClick={()=>handleShare('facebook')}
                className="flex items-center justify-center gap-2 p-3 text-white  bg-blue-600 rounded-lg hover:bg-blue-700  transition-colors">
                    <Facebook className="w-5 h-5"/>
                    <span>Facebook</span>
                </button>
                <button onClick={()=>handleShare('twitter')}
                className="flex items-center justify-center gap-2 p-3 text-white  bg-sky-600 rounded-lg hover:bg-sky-600  transition-colors">
                    <Twitter className="w-5 h-5"/>
                    <span>Twitter</span>
                </button>
                <button onClick={()=>handleShare('linkedin')}
                className="flex items-center justify-center gap-2 p-3 text-white  bg-blue-700 rounded-lg hover:bg-blue-800  transition-colors">
                    <Linkedin className="w-5 h-5"/>
                    <span>LinkedIn</span>
                </button>
                <button onClick={copyToClipboard}
                className="w-full flex items-center justify-center gap-2 p-3 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                    <Copy className="w-5 h-5"/>
                </button>
            </div>
        </div>
    </div>
  )
}
