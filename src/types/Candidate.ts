import { Socket } from "socket.io-client";
import { Benefit } from "./Employer";

export interface BaseUser
{
    id:string,
    email:string,
    status:"Active"|"Inactive",
    role:'user'|"employer",

}
interface Education 
{
    degree:string,
    institution:string,
    year:number;
    description?:string
}
interface InterviewSchedule {
    date: string;
    time: string;
    interviewer: string;
    platform: string;
    meetingLink?: string;
  }
export interface UserCandidate {
    id: string;
    firstName: string;
    secondName: string;
    email: string;
    phonenumber?: string;
    role: 'user' | 'employer';
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
    interviewSchedule?: InterviewSchedule;

  }
export interface Employer extends BaseUser
{
    companyName:string
    industry:string
    location:string,
    employees:string,
    website:string,
    dateFounded:Date,
    isVerified:string,
    documentType:string,
    documentNumber:string,
    document:string,
    description:string,
    logo:string
}
export interface LocationSuggestion{
    name:string,
    id:number,

}
export interface PostType
{
    _id:string,
    text:string,
    background?:string,
    image?:string[],
    createdAt:string,
    location:string,
    profilePicture:string,
    likes?:[],
    user?: {
        profilePicture: string;
        firstName: string;
        secondName: string;
    };
    company?: {
        logo: string;
        companyName: string;
    };
    comments?:Array<Comment>;
    isLiked?:boolean
    likedByUser?:boolean
    saved?:boolean,
    userId:string
}
export interface LocationState{
    isLoading:boolean,
    error:string|null,
    results:LocationSuggestion[]
}
export interface CreatePostProps{
    onClose:()=>void;
    isOpen:boolean;
    role:'user'|'employer'
}
export interface LocationModalProps{
    isOpen:boolean
    onClose:()=>void,
    locationState:LocationState
    searchLocation:string,
    onLocationSelect:(location:string)=>void;
    onSearchChange:(e:React.ChangeEvent<HTMLInputElement>)=>void
    onRetry:()=>void
}
export interface ImageUploadModalProps{
    isOpen:boolean,
    onClose:()=>void;
    onFileSelect:(e:React.ChangeEvent<HTMLInputElement>)=>void
}
export interface SearchResult
{
    _id:string,
    name:string,
    type:'user'|'job'|'company'
}
export interface SearchBarProps
{
    placeholder?:string,
    className?:string
    onResultSelect?:(result:SearchResult)=>void
}
export interface SearchResultsDropdown{
    results:SearchResult[]
    isSearching:boolean,
    onSelect?:(result:SearchResult)=>void
}
export interface SearchResultItemProps
{
    result:SearchResult,
    onSelect?:(result:SearchResult)=>void
}
export interface ProfileHeaderProps
{
    user: UserCandidate,
    isOwnProfile:boolean,
    onEditProfile?:()=>void
    userId?:string,
    

}
export interface ProfileTabsProps
{
    activeTab:string,
    onTabChange:(tab:string)=>void
}
export interface PostInputProps
{
    onClick:()=>void;
    profilePicture?:string
    companyLogo?:string
}
export interface Comment {
    _id: string,
    postId:string,
    comment: string,
    likes:string[],
    createdAt:Date,
    replies?:Comment[]
    userId: {
        profilePicture:string,
        firstName:string,
        secondName:string
    }
}
export interface Like{
    _id:string,
    postId:string,
    initialLikes:number,
    onLikeCountChange?:(newCount:number)=>void
}
export interface ConfirmDialogProps
{
    visible:boolean;
    onHide:()=>void;
    message:string,
    header:string,
    acceptLabel?:string,
    rejectLabel?:string,
    acceptClassName?:string,
    rejectClassName?:string,
    onAccept:()=>void,
    onReject:()=>void

}
export interface EmployerType {
    _id: string;
    companyName: string;
    logo?:string,
    email?:string,
    website?:string
  }
  
  export interface JobType {
    _id: string;
    isActive:boolean,
    description:string
    jobTitle: string;
    skills?:string[],
    niceToHave?:string
    responsibilities?:string,
    employmentTypes: string[];
    location: string;
    salaryRange: {
      min: number;
      max: number;
    };
    applicationDeadline?:string
    benefits:Benefit[]
    createdAt: string;
    employerId:EmployerType
    hasApplied:boolean
  }
  
  

export interface Message{
    _id?:string,
    senderId?:string
    content:string,
    receiverId:string|undefined
    sent?:boolean
    timestamp?:any 
    status?:string
    file?:any
}
type MessageStatus='sent'|'delivered'|'seen'
export interface MessageWithStatus extends Message
{
    status:MessageStatus,
    seenAt?:string,
    deliveredAt?:string
}
export interface SocketContextType
{
    socket:Socket|null
}

export interface ChatHistoryItem {
  _id: string; 
  firstName: string;
  lastMessage: string;
  timeStamp: string;
  companyName:string;
  logo:string
  profilePicture:string
}
export type Candidate=UserCandidate|Employer