
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
}
export interface LocationSuggestion{
    name:string;
    id:number
}
export type Candidate=UserCandidate|Employer