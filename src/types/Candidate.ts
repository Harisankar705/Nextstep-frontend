
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
export type Candidate=UserCandidate|Employer