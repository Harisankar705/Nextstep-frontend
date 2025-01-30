export const validateName = (name:string) => {
    if (!name.trim()) {
        return "Name is required"
    }
    if (!/^[a-zA-Z]+$/.test(name)) {
        return "Name should contain only alphabets"
    }
    return null
}
export const validateMail = (email:string) => {
    if (!email.trim()) {
        return "Mail is required!"
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return "Mail not valid!"
    }
    return null
}
export const validateOTP=(otp:string):string|null=>{
    if(/^\d{6}$/.test(otp))
    {
        return null
    }
    return 'otp must be 6 digits!'
}
export const validatePhoneNumber=(phonenumber:string)=>{
    if(!phonenumber.trim())
    {
        return "Phone number is required!"
    }
    if (!/^\d{10,15}$/.test(phonenumber)) {
        return "Phone number must be 10-15 digits long!"
    }
    return null
}
export const  validatePassword=(password:string):string|null=>{
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    if(!password.trim())
    {
        return 'Password is required!'
    }
    if(!passwordRegex.test(password))
    {
        return "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character";
    }
    return null
}
export const validateConfirmPassword=(password:string,confirmPassword:string):string|null=>{
    if(password!==confirmPassword )
    {
        return "Passwords don't match!"
    }
    return null
}