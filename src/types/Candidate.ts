import { Socket } from "socket.io-client";
import { Benefit } from "./Employer";
export interface BaseUser {
  _id?:string,
  id: string;
  email: string;
  status: "Active" | "Inactive";
  role: "user" | "employer";
}
export interface Caller{
  senderId:string
  receiverId: string;
  offer: RTCSessionDescriptionInit;
}
export  interface FileData{
  url?:string
  preview?:string,
  name?:string,
  type?:string,
  size?:number
}
export interface ForgotPasswordProps{
    role:string
}

export  interface FilePreviewProps
{
  file:FileData,
  message?:Message
}
export interface AppliedJob{
    jobId:{
        _id:string
        jobTitle:string,
        companyName:string,
        employmentTypes:string[],
        salaryRange:{min:number,max:number},
        applicationDeadline:string
        employerId:{
          companyName:string,
          logo:string
        }
    },
   
    applicationStatus:string,
    appliedAt:string
}export interface InterviewScheduleProps {
  applicant: UserCandidate | null;
  onScheduleInterview: (scheduleData: InterviewScheduleData) => Promise<void>;
}
export type Reason='spam'|'inappropirate'|'offensive'|'misinformation'|'sexual content'|'other'

export interface IReport  {
  _id?:string
  post:PostType
  reporter: UserCandidate
  reporterModel:"User"|"Employer"   
  reason:Reason
  description?:string,
  createdAt:Date,
  status:string

}
export interface ReportProps{
    postId:string,
    onClose:()=>void
    role:string
}
export interface Applicant {
  _id: string;
  userId: {
    _id: string;
    firstName: string;
    secondName: string;
    profilePicture: string;
  };
  applicationStatus: string;
  appliedAt: Date;
}
export interface PerksAndBenefitsProps {
  formData: {
    benefits: Benefit[];
  };
  updateFormData: (data: { benefits: Benefit[] }) => void;
  onNext: () => void;
  onSubmit: () => void;
}
export interface InterviewScheduleData {
  date: string;
  time: string;
  interviewer: string;
  platform: string;
  meetingLink?: string;
}
export interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}
export interface VideoCallAnswerData {
  answer: RTCSessionDescriptionInit;
  senderId: string;
  receiverId: string;
}
export interface SideBarProps {
  chatHistory?: ChatHistoryItem[];
  onSelectedChat?: (chat: ChatHistoryItem) => void;
  role?: "user" | "employer";
  currentUserId?:string
}

export interface PostComponentProps {
  post: PostType;
  isOwnProfile?:boolean,
  onPostUpdate?:(updatedPost:any)=>void
  profilePicture?: string;
  userName?: string;
  onUnsave?: (postId: string) => void;
  role?: any;
  onDelete?:(postId:string)=>void,
  isAdmin?:boolean
}
export interface LogoProps {
  width?: number | string;
  height?: number | string;
  className?: string;
}
export interface ArrowProps {
  className?: string;
  style?: React.CSSProperties;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}
export interface Notification {
  _id: string;
  read: boolean;
  sender: {
    firstName?: string;
    secondName?: string;
    companyName?: string;
    logo?: string;
    profilePicture?: string;
  };
  senderModel: "User" | "Employer";
  link?: string;
  content: string;
}
export interface Requests {
  _id: string;
  followerId: UserCandidate;
  followingId: UserCandidate;
  status: string;
}
export interface CompanyFormProps {
  initialData?: {
    companyName: string;
    website: string;
    location: string;
    employees: string;
    industry: string;
    description: string;
    logo?: string ;
    dateFounded: Date;
    documentType: string;
    documentNumber: string;
    companyDocuments: {
      fileUrl: string;
    } | null;
  };
  onSubmit: (formData: FormData) => Promise<void>;
  buttonText?: string;
  isEdit?: boolean;
}
export interface SelectedFileType {
  file: File;
  preview: string;
  data: string;
  name: string;
  type: string;
}
interface InterviewSchedule {
  date: string;
  time: string;
  interviewer: string;
  platform: string;
  meetingLink?: string;
}
export interface UserCandidate {
  id?: string;
  _id:string
  firstName: string;
  secondName: string;
  email: string;
  phonenumber?: string;
  role: "user" | "employer";
  status: string;
  profilePicture?: string;
  gender?: string;
  dateOfBirth?: string;
  languages?: string[];
  location?: string;
  aboutMe?: string;
  experience?: string;
  skills?: string[];
  resume?: string;
  instagram?: string;
  twitter?: string;
  website?: string;
  education?: {
    degree: string;
    institution: string;
    year: string;
  }[];
  logo?:string
  companyName?:string,
  friends?:string
  interviewSchedule?: InterviewSchedule;
  isAuthenticated?:boolean
}
export interface SharePostProps {
  isOpen: boolean;
  onClose: () => void;
  post: PostType;
}
export interface Employer extends BaseUser {
  _id:string,
  companyName: string;
  industry: string;
  location: string;
  employees: string;
  role: "user" | "employer";
  website: string;
  dateFounded: Date;
  isVerified: string;
  documentType: string;
  documentNumber: string;
  document: string;
  description: string;
  companyDocuments: {
    fileUrl: string;
  } | null;
  logo?: string;
}
export interface LocationSuggestion {
  name: string;
  id: number;
  display_name?:string,
  place_id?:number
}
export interface User {
  _id: string;
  firstName: string;
  secondName: string;
  profilePicture: string;
}
  export interface PostType {
    _id: string;
    text: string;
    background?: string;
    image?: string[];
    createdAt: string;
    location: string
    profilePicture: string;
    likes?: [];
    user?: {
      profilePicture: string;
      firstName: string;
      secondName: string;
    };
    company?: {
      logo: string;
      companyName: string;
    };
    comments?: Array<Comment>;
    isLiked?: boolean;
    likedByUser?: boolean;
    saved?: boolean;
    userId: User;
    userType?: string;
  }
export interface LocationState {
  isLoading: boolean;
  error: string | null;
  results: LocationSuggestion[];
}
export interface CreatePostProps {
  onClose: () => void;
  isOpen: boolean;
  role: "user" | "employer";
  onPostCreated?:(newPost:PostType)=>void
}
export interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  locationState: LocationState;
  searchLocation: string;
  onLocationSelect: (location: string) => void;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRetry: () => void;
}
export interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
export interface SearchResult {
  _id: string;
  name: string;
  type: "user" | "job" | "company";
}
export interface SearchBarProps {
  placeholder?: string;
  className?: string;
  onResultSelect?: (result: SearchResult) => void;
}
export interface SearchResultsDropdown {
  results: SearchResult[];
  isSearching: boolean;
  onSelect?: (result: SearchResult) => void;
}
export interface SearchResultItemProps {
  result: SearchResult;
  onSelect?: (result: SearchResult) => void;
}
export interface ProfileHeaderProps {
  user: UserCandidate;
  isOwnProfile: boolean;
  onEditProfile?: () => void;
  userId?: string;
}
export interface SendOTPResponse {
  message: string;
  success: boolean;
}
export interface verifyOTPResponse {
  success: boolean;
  message: string;
}
export type role = "user" | "employer"|"admin"

export interface UserData {
  firstName: string;
  secondName: string;
  email: string;
  password: string;
  role: role;
  name: string;
}
export interface INotification {
  _id: string;
  read: boolean;
  senderInfo: {
    firstName?: string;
    secondName?: string;
    companyName?: string;
    logo?:string,
    profilePicture?:string

  };
  senderModel:"User"|"Employer",
  link:string,
  content: string;
}
// interface GoogleAuthResponse {
//   success: string;
//   token?: string;
//   message?: string;
// }
export interface ProfileTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}
export interface PostInputProps {
  onClick: () => void;
  profilePicture?: string;
  companyLogo?: string;
}
export interface Comment {
  _id: string;
  postId: string;
  comment: string;
  likes: string[];
  createdAt: Date;
  replies?: Comment[];
  commentor: {
    profilePicture: string;
    firstName: string;
    companyName?: string;
    secondName: string;
    logo?: string;
  };
}
export interface Like {
  _id: string;
  postId: string;
  initialLikes: number;
  onLikeCountChange?: (newCount: number) => void;
}
export interface ConfirmDialogProps {
  visible: boolean;
  onHide: () => void;
  message: string;
  header: string;
  acceptLabel?: string;
  rejectLabel?: string;
  acceptClassName?: string;
  rejectClassName?: string;
  onAccept: () => void;
  onReject: () => void;
}
export interface EmployerType {
  _id: string;
  companyName: string;
  logo?: string;
  email?: string;
  website?: string;
}
export interface JobType {
  _id?: string;
  isActive?: boolean;
  description: string;
  jobTitle: string;
  skills?: string[];
  niceToHave?: string;
  responsibilities?: string;
  employmentTypes: string[];
  location?: string;
  salaryRange: {
    min: number;
    max: number;
  };
  applicantsCount?:number,
  applicationDeadline?: string;
  benefits: Benefit[];
  createdAt?: Date;
  employerId?:EmployerType|undefined,
  hasApplied?: boolean;
}
export interface Message {
  _id?: string;
  senderId?: string;
  content: string;
  receiverId: string | undefined;
  sent?: boolean;
  timestamp?: any;
  status?: string;
  file?: any;
}
type MessageStatus = "sent" | "delivered" | "seen";
export interface MessageWithStatus extends Message {
  status: MessageStatus;
  seenAt?: string;
  deliveredAt?: string;
}
export interface SocketContextType {
  socket: Socket | null;
}
export interface ChatHistoryItem {
  _id: string;
  firstName?: string;
  lastMessage: string;
  timestamp: string;
  content:string,
  profilePicture?:string,
  sender:{
    _id:string,
    firstName:string,
    secondName:string,
    profilePicture?:string,
    companyName?:string
    logo?:string
  },
  receiver:{
    _id:string,
    firstName:string,
    secondName:string,
    profilePicture?:string
    companyName?:string
    logo?:string
  }
  
}
export interface User{
  id:string,
  firstName:string,
  lastName:string,
  email:string,
  role:'candidate'|'employer'|'admin'
  profilePicture:string;
  
}
export interface AuthState{
  user:UserCandidate|Employer|null,
  isAuthenticated:boolean
}
export interface RootState{
  user:AuthState,
  employer:AuthState,
  admin:AuthState
}
export type Candidate = UserCandidate | Employer;
export interface SearchResult
{
    _id:string,
    type:'user'|'job'|'company'
}