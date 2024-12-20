
export interface BaseUser
{
    id:string,
    email:string,
    status:"Active"|"Inactive",
    role:'user'|"employer"
}
export interface UserCandidate extends BaseUser
{
    firstName:string,
    secondName:string,
    profilePicture:string
    
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
    location:string
}
export interface LocationState{
    isLoading:boolean,
    error:string|null,
    results:LocationSuggestion[]
}
export interface CreatePostProps{
    onClose:()=>void;
    isOpen:boolean
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
export type Candidate=UserCandidate|Employer