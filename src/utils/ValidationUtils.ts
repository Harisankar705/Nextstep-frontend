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
    if(password.length<8)
    {
        return "Password must be 8 characters long"
    }
    if (!/[A-Z]/.test(password)) {
        return "Password must contain at least one uppercase letter";
      }
      if (!/[a-z]/.test(password)) {
        return "Password must contain at least one lowercase letter";
      }
      if (!/\d/.test(password)) {
        return "Password must contain at least one digit";
      }
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        return "Password must contain at least one special character";
      }
      return null
}
export const validateConfirmPassword=(password:string,confirmPassword:string):string|null=>{
    if(password!==confirmPassword)
    {
        return "Passwords don't match!"
    }
    return null
}