export interface IEmployer  {
    email: string
    password: string
    role: "employer"
    logo: string,
    website: string,
    location: string,
    employees: string,
    industry: string,
    dateFounded: Date,
    description: string
    companyName: string
    isProfileComplete: boolean,
    status: "Active" | "Inactive"
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
    updateFormData:(data:any)=>void
    onNext:()=>void
}
export interface Benefit
{
    id:string
    icon:string,
    title:string,
    description:string
}
export interface JobInformationProps
{
    formData:any
    updateFormData:(data:any)=>void
    onNext:()=>void
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