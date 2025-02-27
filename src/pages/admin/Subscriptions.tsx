import { useEffect, useState } from "react"
import { SubscriptionPlan } from "../../types/Employer"
import toast from "react-hot-toast"
import Spinner from "../../utils/Spinner"
import { AlertTriangle, CheckCircle, Edit, Eye, Tag, Trash2 } from "lucide-react"
import SideBar from "./SideBar"
import { getSubscription, updateSubscription } from "../../services/adminService"

export const Subscriptions = () => {
    const [plans, setPlans] = useState<SubscriptionPlan[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [filter, setFilter] = useState<'all'|'active'|'inactive'>('all')
    const [roleFilter, setRoleFilter] = useState<'all' | 'user' | 'employer'>('all');
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(5)
    
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    
    const filteredPlans = plans.filter(plan => {
        const statusMatch = filter === 'all' || plan.status === filter
        const roleMatch = roleFilter === 'all' || plan.targetRole === roleFilter
        return statusMatch && roleMatch
    })
    
    const currentPlans = filteredPlans.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(filteredPlans.length / itemsPerPage)
    
    useEffect(() => {
        const fetchPlans = async() => {
            try {
                setLoading(true)
                const response = await getSubscription()
                console.log('response', response)
                setPlans(response)
                setLoading(false)
            } catch (error) {
                toast.error("Failed to load subscription plans!")
                setLoading(false)
            }
        }
        fetchPlans()
    }, [])
    
    const handleToggleStatus = async(id: string) => {
        try {
            setPlans(prevPlans =>
                prevPlans.map(plan =>
                    plan._id === id
                        ? { ...plan, status: plan.status === 'active' ? 'inactive' : 'active' }
                        : plan
                )
            );
            const response = await updateSubscription(id, {toggleStatus: true})
            if(response && response.status == 201) {
                setPlans(prevPlans =>
                    prevPlans.map(plan =>
                        plan._id === id
                            ? { ...plan, status: plan.status === 'active' ? 'inactive' : 'active' }
                            : plan
                    )
                );
            }
            console.log(response)
        } catch (error) {
            toast.error("Failed to toggle status")
        }
    }
    
    if(loading) {
        return (<Spinner loading={true}/>)
    }
    
    return (
        <div className="flex h-screen bg-slate-50">
            <SideBar/>
            <div className="flex-1 overflow-auto">
                <div className="p-6">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Subscription Plans</h2>
                        
                        <div className="flex flex-col sm:flex-row gap-3 mb-6">
                            <div className="flex gap-2">
                                <select 
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value as 'all' | 'active' | 'inactive')}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
                                >
                                    <option value='all'>All Status</option>
                                    <option value='active'>Active Only</option>
                                    <option value='inactive'>Inactive only</option>
                                </select>
                                
                                <select 
                                    value={roleFilter}
                                    onChange={(e) => setRoleFilter(e.target.value as 'all' | 'user' | 'employer')}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
                                >
                                    <option value='all'>All Roles</option>
                                    <option value='user'>Users Only</option>
                                    <option value='employer'>Employers only</option>
                                </select>
                            </div>
                            
                            <a 
                                href='/add-subscription'
                                className="inline-flex items-center px-4 py-2 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth='2' viewBox="0 0 24 24" stroke="currentColor">
                                    <path d='M12 4v16m8-8H4'></path>
                                </svg>
                                Add New Plan
                            </a>
                        </div>
                        
                        {filteredPlans.length === 0 ? (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-blue-500 mb-4">
                                    <Tag className='w-8 h-8'/>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No subscription plans found!</h3>
                                <p className="text-gray-500 mb-6">
                                    {filter !== 'all' || roleFilter !== 'all'
                                        ? "Try changing your filters to see more results"
                                        : "Create your first subscription plan to get started"
                                    }
                                </p>
                                <a 
                                    href="/add-subscription"
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 transition-colors"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth='2' viewBox="0 0 24 24" stroke="currentColor">
                                        <path d='M12 4v16m8-8H4'></path>
                                    </svg>
                                    Create Plan
                                </a>
                            </div>
                        ) : (
                            <>
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="bg-gray-50 border-b border-gray-200">
                                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Plan</th>
                                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Target</th>
                                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Created</th>
                                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {currentPlans.map((plan) => (
                                                    <tr key={plan._id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <div>
                                                                    <div className="text-sm font-medium text-gray-900">{plan.name}</div>
                                                                    <div className="text-xs text-gray-500">{plan.validity}</div>
                                                                    {plan.isPopular && (
                                                                        <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                                                            Popular
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-900">${plan.price.toFixed(2)}</div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                                plan.targetRole === 'employer'
                                                                    ? 'bg-purple-100 text-purple-800'
                                                                    : 'bg-green-100 text-green-800'
                                                            }`}>
                                                                {plan.targetRole === 'employer' ? "Employer" : "User"}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            {plan.createdAt ? new Date(plan.createdAt).toDateString() : "Date not available"}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                                plan.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                            }`}>
                                                                {plan.status === 'active' ? (
                                                                    <CheckCircle className="w-3 h-3" />
                                                                ) : (
                                                                    <AlertTriangle className="w-3 h-3" />
                                                                )}
                                                                {plan.status === 'active' ? "Active" : "Inactive"}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                            <div className="flex items-center justify-end gap-2">
                                                                <button 
                                                                    onClick={() => handleToggleStatus(plan._id as string)}
                                                                    className={`p-1 rounded-md ${
                                                                        plan.status === 'active'
                                                                            ? 'text-red-600 hover:text-red-900 hover:bg-red-50'
                                                                            : 'text-green-600 hover:text-green-900 hover:bg-green-50'
                                                                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                                                                    title={plan.status === 'active' ? "Deactivate plan" : "Activate plan"}
                                                                >
                                                                    {plan.status === 'active' ? (
                                                                        <AlertTriangle className="w-5 h-5" />
                                                                    ) : (
                                                                        <CheckCircle className="w-5 h-5" />
                                                                    )}
                                                                </button>
                                                                <a 
                                                                    href={`/subscription/${plan._id}`}
                                                                    className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" 
                                                                    title="View plan details!"
                                                                >
                                                                    <Eye className='w-5 h-5' />
                                                                </a>
                                                                <a 
                                                                    href={`/edit-subscription/${plan._id}`}
                                                                    className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" 
                                                                    title="Edit plan!"
                                                                >
                                                                    <Edit className='w-5 h-5' />
                                                                </a>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    
                                    {filteredPlans.length > itemsPerPage && (
                                        <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200 bg-gray-50">
                                            <div className="text-sm text-gray-500">
                                                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredPlans.length)} of {filteredPlans.length} plans
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                                    disabled={currentPage === 1}
                                                    className="px-3 py-1.5 text-xs font-medium rounded-lg bg-white border border-slate-200 text-slate-600 
                                                        hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                >
                                                    Previous
                                                </button>
                                                <div className="text-sm font-medium text-slate-600">
                                                    Page {currentPage} of {totalPages}
                                                </div>
                                                <button
                                                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                                    disabled={currentPage === totalPages}
                                                    className="px-3 py-1.5 text-xs font-medium rounded-lg bg-white border border-slate-200 text-slate-600 
                                                        hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                >
                                                    Next
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="mt-4 text-sm text-gray-500">
                                    Showing {filteredPlans.length} plan{filteredPlans.length !== 1 ? 's' : ''} with the selected filters
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}