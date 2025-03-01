import { useEffect, useState } from "react";
import { Employer } from "../../types/Candidate";
import { useParams } from "react-router-dom";
import { individualDetails, verifyEmployer } from "../../services/adminService";
import SideBar from "./SideBar";
import {
  Building2,
  Calendar,
  Globe,
  Mail,
  MapPin,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
} from "lucide-react";
import Spinner from "../../utils/Spinner";
import { toast } from "react-hot-toast";
import { FcBusiness } from "react-icons/fc";
import { jobFormData } from "../../types/Employer";
import { AdminJobs } from "./AdminJobs";
import { deleteJob } from "../../services/employerService";
import { ReusableConfirmDialog } from "../../utils/ConfirmDialog";
const Verification = () => {
  const [employer, setEmployer] = useState<Employer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [jobs, setJobs] = useState<jobFormData[] | null>(null);
  const [showJobs, setShowJobs] = useState(false);
  const { id } = useParams<{ id: string }>();
  const [dialogVisible, setDialogVisible] = useState(false);
  const [jobToDelete,setJobToDelete]=useState<string|null>(null)
  const handleDeleteJob = async (jobId: string) => {
       setJobToDelete(jobId)
       setDialogVisible(true)
    };
  const handleViewJob = () => {
    setShowJobs(true);
  };
  useEffect(() => {
    const fetchEmployerDetails = async () => {
      try {
        if (id) {
          const employerData = await individualDetails(id, "employer");
          console.log("employerData", employerData);
          setEmployer(employerData[0] || null);
          setJobs(employerData[0].jobs);
        }
      } catch (error) {
        setError("Failed to load employer details");
      } finally {
        setLoading(false);
      }
    };
    fetchEmployerDetails();
  }, [id]);
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="p-4 bg-red-50 text-red-600 rounded-lg shadow-sm">
          {error}
        </div>
      </div>
    );
  }
  const handleVerifyEmployer = async (status: "VERIFIED" | "DENIED") => {
    if (id) {
      setVerifying(true);
      try {
        const response = await verifyEmployer(id, status);
        if (response?.success === true) {
          toast.success(response.message);
          setEmployer((prevEmployer) => ({
            ...prevEmployer!,
            isVerified: status,
          }));
        }
      } catch (error) {
        toast.error("Error occurred during verifying employer");
        throw new Error("Error occurred during verifying employer");
      } finally {
        setVerifying(false);
      }
    }
  };
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "VERIFIED":
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case "DENIED":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };
  const confirmDeleteJob = async () => {
    try {
      if(jobToDelete)
      {
        console.log("IN DELETEJOB")
        const response = await deleteJob(jobToDelete);
        console.log("RESPONSE",response)
        if (response.status === 200) {
          toast.success("Job deleted successfully!");
          setJobs((prev) => prev?.filter((job) => job._id !== jobToDelete)||null);
        }
      }
    } catch (error) {
      toast.error("Error occurred while deleting job!");
      return;
    } finally {
      setDialogVisible(false);
    }
};
  const handleDialogReject = () => {
    setDialogVisible(false);
    setJobToDelete(null)
    toast.success("Deleteing job cancelled!");
  };
  return (
    <div className="flex min-h-screen bg-slate-50">
      <div className="w-64 h-screen fixed top-0 left-0 bg-white shadow-lg">
      <SideBar />
      </div>
     
      <div className="flex-1 p-8 ml-64">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6 flex items-start gap-8">
            <div className="w-32 h-32 bg-slate-50 rounded-lg overflow-hidden flex items-center justify-center border border-slate-200">
              {employer?.logo ? (
                <img
                  src={employer.logo}
                  alt={`${employer.companyName} logo`}
                  className="w-full h-full object-contain p-2"
                />
              ) : (
                <Building2 className="w-16 h-16 text-slate-400" />
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-slate-900">
                {employer?.companyName}
              </h1>
              <div className="mt-2 flex items-center gap-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700">
                  {employer?.industry}
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium
                                    ${
                                      employer?.isVerified === "VERIFIED"
                                        ? "bg-emerald-50 text-emerald-700"
                                        : employer?.isVerified === "DENIED"
                                        ? "bg-red-50 text-red-700"
                                        : "bg-yellow-50 text-yellow-700"
                                    }`}
                >
                  {getStatusIcon(employer?.isVerified || "PENDING")}
                  {employer?.isVerified === "VERIFIED"
                    ? "Verified"
                    : employer?.isVerified === "DENIED"
                    ? "Denied"
                    : "Pending Verification"}
                </span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">
              Company Information
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-slate-500">
                    Email
                  </div>
                  <div className="text-slate-900 mt-1">{employer?.email}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-slate-500">
                    Location
                  </div>
                  <div className="text-slate-900 mt-1">
                    {employer?.location}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FcBusiness className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-slate-500">
                    Jobs Posted
                  </div>
                  <button
                    onClick={handleViewJob}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                                                        bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View Jobs
                  </button>
                  {showJobs && (
                    <AdminJobs jobs={jobs} onDelete={handleDeleteJob} />
                  )}
                   <ReusableConfirmDialog
                              visible={dialogVisible}
                              onHide={() => setDialogVisible(false)}
                              message="Are you sure to delete the job?"
                              header="Delete confirmation!"
                              onAccept={confirmDeleteJob}
                              onReject={handleDialogReject}
                            />
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-slate-500">
                    Employee Count
                  </div>
                  <div className="text-slate-900 mt-1">
                    {employer?.employees}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-slate-500">
                    Date Founded
                  </div>
                  <div className="text-slate-900 mt-1">
                    {employer?.dateFounded
                      ? new Date(employer.dateFounded).toLocaleDateString()
                      : "N/A"}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3 md:col-span-2">
                <Globe className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-slate-500">
                    Website
                  </div>
                  <a
                    href={employer?.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 hover:underline mt-1 inline-block"
                  >
                    {employer?.website || "No website available"}
                  </a>
                </div>
              </div>
            </div>
          </div>
          {/* Company Description */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Company Description
            </h2>
            <p className="text-slate-600 leading-relaxed">
              {employer?.description || "No description available"}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">
              Verification Details
            </h2>
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <div>
                    <div className="text-sm font-medium text-slate-500">
                      Document Type
                    </div>
                    <div className="text-slate-900 mt-1">
                      {employer?.documentType}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div>
                    <div className="text-sm font-medium text-slate-500">
                      Document Number
                    </div>
                    <div className="text-slate-900 mt-1">
                      {employer?.documentNumber}
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-t pt-6">
                <div className="text-sm font-medium text-slate-500 mb-3">
                  Uploaded Documents
                </div>
                {employer?.document ? (
                  <a
                    href={employer.document}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors"
                  >
                    View Document
                  </a>
                ) : (
                  <div className="text-slate-500">No documents uploaded</div>
                )}
              </div>
              {employer?.isVerified === "PENDING" && (
                <div className="border-t pt-6">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-slate-500">
                      Verification Actions
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleVerifyEmployer("VERIFIED")}
                        disabled={verifying}
                        className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition-colors disabled:opacity-50"
                      >
                        {verifying ? <Spinner loading={true} /> : "Accept"}
                      </button>
                      <button
                        onClick={() => handleVerifyEmployer("DENIED")}
                        disabled={verifying}
                        className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50"
                      >
                        {verifying ? <Spinner loading={true} /> : "Deny"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Verification;
