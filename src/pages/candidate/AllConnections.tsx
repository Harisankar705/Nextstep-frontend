import { useEffect, useState } from "react"
import { Connection } from "../../types/Employer"
import Spinner from "../../utils/Spinner"
import { getConnections } from "../../services/commonService"

export const AllConnections = () => {
    const [connections,setConnections]=useState<Connection[]>([])
    const [loading,setLoading]=useState(false)
    useEffect(()=>{
        const fetchConnection=async()=>{
            setLoading(true)
            try {
                const response=await getConnections()
                setConnections(response.data.data)  
            } catch (error) {
                console.error("Error fetching connections",error)
            }
            finally{
                setLoading(false)
            }
            
        }
        fetchConnection()
        
    },[])
    if(loading)
    {
        return (<Spinner loading={true}/>)
    }
    if(connections.length===0)
    {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="text-center">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No connections yet!</h3>
                    <p className="text-gray-600">Start connecting with people!</p>
                </div>
            </div>
        )
    }
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="border-b border-pink-200 pb-5 mb-8">
            <h2 className="text-3xl font-bold text-gray-900">My connections</h2>
            <p className="mt-2 text-sm text-gray-600">
                Manage your network and stay connected!
            </p>
        </div>
        <div className="space-y-6">
            {connections.map((connection)=>{
                const user=connection.followingId
                return (
                    <div key={connection._id}
                    className="bg-white rounded-xl shadow-sm p-6 transition-all duration-300 hover:shadow-md border  border-pink-100 hover:border-pink-300">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div className="flex items-center space-x-4">
                                <div className="relative">
                                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-pink-200">
                                        {user.role==='employer'? (
                                        
                                            <img src={user.logo}
                                        alt={user.companyName}
                                    className="w-full h-full object-cover"/>
                                                                                ):(
                                                                                    <img src={user.profilePicture}
                                                                                    alt={`${user.firstName}'s profile`}
                                                                                    className="w-full h-full object-cover"/>

                                                                                ) }
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center">
                                        <span className="text-xs font-medium">
                                            {user.role==='employer'?"E":"U"}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-600">
                                        {user.role==='employer'?user.companyName:`${user.firstName} ${user.secondName}`}
                                    </h3>
                                    <p className="text-sm text-gray-600">{user.email}</p>
                                    <p className="text-xs text-pink-600 mt-1">
                                        {user.role==='employer'?"Employer":"Professional"}
                                    </p>
                                </div>
                            </div>
                            <div className="flex space-x-3">
                                <button onClick={()=>window.location.href=`/profile/${user._id}`}
                                className="px-6 py-2.5 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition-colors duration-300">
                                    View Profile
                                </button>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    </div>
  )
}
