
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { AlertCircle, CheckCircle, Eye, X, XCircle } from "lucide-react"
import { changeReportStatus, fetchReports } from "../../services/adminService"
import Post from "../candidate/Post"
import { IReport } from "../../types/Candidate"
import SideBar from "./SideBar"
import SearchBar from "./SearchBar"

export const ReportedPosts = () => {
  const [reports, setReports] = useState<IReport[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedPost, setSelectedPost] = useState<IReport | null>(null)
  const [itemsPerPage] = useState(5)
  const [isPostModalOpen, setIsPostModalOpen] = useState(false)

  useEffect(() => {
    const fetchPostReports = async () => {
      try {
        const response = await fetchReports()
        setReports(response)
      } catch (error) {
        toast.error("Failed to load reports!")
        console.error("Error occurred during reportedposts", error)
      }
    }
    fetchPostReports()
  }, [])

  const handleStatusChange = async (reportId: string | undefined, newStatus: "resolved" | "rejected") => {
    try {
      if (!reportId) {
        toast.error("Report ID is required!")
        return
      }
      await changeReportStatus(reportId, newStatus)
      setReports(reports.map((report) => (report._id === reportId ? { ...report, status: newStatus } : report)))
      toast.success(`Report ${newStatus} successfully`)
    } catch (error) {
      toast.error("Failed to change status!")
    }
  }

  const handleViewPost = (postId: string | undefined) => {
    console.log('POSTID',postId)
    if (postId) {
      const report = reports.find(report => report.post._id === postId);
      if (report) {
        setSelectedPost(report)
        setIsPostModalOpen(true)
      }
    
  }
}

  const getStatusBadgeClass = (status: string) => {
    const statusClasses = {
      pending: "bg-yellow-100 text-yellow-800",
      resolved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    }
    return statusClasses[status as keyof typeof statusClasses] || "bg-gray-100 text-gray-800"
  }

  const getStatusIcon = (status: string) => {
    const icons = {
      pending: <AlertCircle className="w-3 h-3" />,
      resolved: <CheckCircle className="w-3 h-3" />,
      rejected: <XCircle className="w-3 h-3" />,
    }
    return icons[status as keyof typeof icons]
  }

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = reports.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(reports.length / itemsPerPage)

  const handleDeletePost = async(postId: string) => {
    try {
      await new Promise((resolve=>setTimeout(resolve,2000)))
      setReports(reports.filter((report) => report.post._id !== postId))
    setIsPostModalOpen(false)
    setSelectedPost(null)
    } catch (error) {
      console.error("Failed to delete post!")
    }
    
    
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <SideBar/>
      <div className="flex-1 overflow-hidden flex flex-col">
      <SearchBar />
      <h1 className="text-2xl font-bold text-gray-800 mb-6 ml-10">Report Management</h1>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="overflow-x-auto ml-5">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 ml-10">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600">REPORT ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600">POST</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600">REPORTER</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600">REASON</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600">STATUS</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
              {currentItems.map((report) => (
                  <tr key={report._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px -6 py-4 text-sm text-gray-600 font-mono">{report._id}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-700">{report.post?._id ?? "Post removed"}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{report.reporter ? report.reporter.firstName : "Unknown"}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 capitalize">{report.reason}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(report.status)}`}
                      >
                        {getStatusIcon(report.status)}
                        {report.status}
                      </span>
                    
            </td>
            <td className="px-6 py-4">
                <div className="flex gap-2">
                    <button
                        onClick={() => handleViewPost(report.post ? report.post._id : undefined)} 
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                    >
                        <Eye className="w-3.5 h-3.5" />
                        View Post
                    </button>
                    {report.status === 'pending' && (
                        <>
                          <button
  disabled={report.status !== "pending"}
  onClick={() => handleStatusChange(report._id, "resolved")}
  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
    ${report.status === "pending" ? "bg-green-50 text-green-700 hover:bg-green-100" : "bg-gray-200 text-gray-500 cursor-not-allowed"}`}
>
  <CheckCircle className="w-3.5 h-3.5" />
  Resolve
</button>

                            <button
                                onClick={() => handleStatusChange(report._id, 'rejected')}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
                            >
                                <XCircle className="w-3.5 h-3.5" />
                                Reject
                            </button>
                        </>
                    )}
                </div>
            </td>
        </tr>
    ))}
</tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="text-sm text-gray-600">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, reports.length)} of {reports.length} entries
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-white border border-gray-200 text-gray-600 
                                    hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <div className="text-sm font-medium text-gray-600">
                Page {currentPage} of {totalPages}
              </div>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-white border border-gray-200 text-gray-600 
                                    hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {isPostModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">Reported Post</h2>
                <button
                  onClick={() => setIsPostModalOpen(false)}
                  className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-2">
                <span className="text-sm text-gray-600">Reason for report: </span>
                <span className="text-sm text-gray-800 capitalize">{selectedPost?.reason}</span>
              </div>
            </div>
            <div className="p-4">
              {selectedPost && (
                <Post
                  post={selectedPost.post}
                  profilePicture={selectedPost.reporter.profilePicture}
                  userName={selectedPost.reporter.firstName}
                  isAdmin={true}
                  onDelete={handleDeletePost}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

