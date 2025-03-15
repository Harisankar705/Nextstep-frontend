import { Employer, EmployerType, PostType, UserCandidate } from "./Candidate"

export interface IEmployer  {
    _id?:string
    email: string
    password: string
    role: "employer"
    logo?: string,
    website: string,
    location: string,
    employees: string,
    industry: string,
    dateFounded: Date,
    description: string
    companyName?: string
    isVerified?:string
    isAuthenticated?:boolean
    isProfileComplete: boolean,
    status: "Active" | "Inactive"
}
export interface JobStats {
    totalJobs: number;
    activeJobs: number;
    totalApplicants: number;
    recentApplications: number;
  }
  
  export interface JobsByType {
    name: string;
    value: number;
  }
  
  export interface ApplicationsOverTime {
    date: string;
    applications: number;
  }
export interface AdminJobProps {
  jobs: jobFormData[]|null;
  onDelete: (id: string) => void;
}
export interface Step{
    number:number,
    title:string
}
export interface StepIndicatorProps
{
    steps:Step[]
    currentStep:number
}
export interface PerksAndBenfitsProps
{
    formData:any,
    updateFormData:(data:Partial<jobFormData>)=>void
    onNext:()=>void
    onSubmit:()=>void

}
export type IconType = 'heart' | 'waves' | 'laptop'

export interface Benefit {
    id: string
    icon: IconType
    title: string
    description: string
}
export interface JobInformationProps
{
    formData:any
    updateFormData:(data:any)=>void
    onNext:()=>void,
    onSubmit:()=>void

}
export interface JobDescriptionProps
{
    formData:any
    updateFormData:(data:any)=>void
    onNext:()=>void
}
export interface AddProps{
    value:string,
    onChange:(value:string)=>void
    label:string,
    placeholder?:string
}
export interface jobFormData {
    _id?: string;
    employerId?:EmployerType|undefined,
    isActive?: boolean;
    location?: string;
    createdAt?: Date;
    updatedAt?: Date;
    jobTitle: string;
    employmentTypes: string[]; 
    salaryRange: { min: number; max: number };
    categories: string[]; 
    skills: string[]; 
    responsibilities: string;
    whoYouAre: string;
    niceToHave: string;
    benefits: Benefit[];
    industry:string[],
    description:string
    hasApplied?: boolean;
    [key: string]: any;
}
export interface Filters {
    jobTypes: string[];
    experienceLevels: string[];
  }
  
  export interface InterviewScheduleData {
    date: string;
    time: string;
    interviewer: string;
    platform: string;
    meetingLink?: string;
  }
  export interface VideoCallUIProps{
      localStream:MediaStream|null,
      remoteStream:MediaStream|null,
      isVideoEnabled:boolean,
      isMuted:boolean,
      toggleMute:()=>void,
      toggleVideo:()=>void,
      endVideoCall:()=>void,
      callDuration:number,
  }
  export interface SearchResults {
    users: UserCandidate[];
    employers: Employer[];
    posts: PostType[];
}
export interface SubscriptionPlan {
  _id?:string
  name: string;
  price: number;
  validity: string;
  features: string[];
  isPopular: boolean;
  createdAt:Date,
  targetRole: "user" | "employer";
  status: "active" | "inactive";
}
export interface Connection{
  _id:string,
  followerId:{
    _id:string,
    firstName?:string,
    secondName?:string
    profilePicture?:string
    role?:string,
    companyName?:string,
    logo?:string
    email?:string
  }
  followingId:{
    _id:string,
    firstName?:string,
    secondName?:string
    profilePicture?:string
    role?:string,
    companyName?:string,
    logo?:string,
    email?:string
  }
}