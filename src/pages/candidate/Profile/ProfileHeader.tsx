import { Edit } from "lucide-react"
import { getImageURL } from "../../../utils/ImageUtils"
import { ProfileHeaderProps } from "../../../types/Candidate"

export const ProfileHeader:React.FC<ProfileHeaderProps>=({user,isOwnProfile,onEditProfile}) => {
    const {firstName,secondName,profilePicture,friends}=user
    const profilePictureURl=getImageURL(profilePicture,'profile-pictures')
  return (
    <>
    <div className="relative h-[350px]">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900 to-black opacity-90">
            <div className="absolute inset-0 bg-cover bg-center mix-blend-overlay"></div>
        </div>
    </div>
    <div className="bg-black text-white pt-20 px-8">
        <div className="max-w-6xl mx-auto">
            <div className="relative inline-block h-48 w-48 rounded-full overflow-hidden border-4 border-black bg-gray-900 -mt-48 l-auto">
                <img src={profilePictureURl} alt='profile' className="h-full w-full object-cover"/>
            </div>
                  <div className="flex justify-between items-start">

                      <div className="text-center">
                          <h1 className="text-3xl font-bold">
                              {firstName} {secondName}
                          </h1>
                          <p className="text-purple-400 mt-1">
                              {friends ? `${friends.length} friends` : 'No friends'}
                          </p>
                      </div>
                      {isOwnProfile &&(
                          <div className="flex justify-center mt-4">
                              <button onClick={onEditProfile} className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md transition duration-300">
                                  <Edit className="mr-2 h-4 w-4" />
                              </button>
                          </div>
                      )}
                      
                  </div>
        </div>
    </div>
    </>
  )
}
