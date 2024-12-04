import React, { useState } from 'react'
interface InputFieldProps {
    label: string;
    type: string;
    value: string;
    onChange: (value: string) => void
    placeholder: string;
    validationFn: (value: string) => string | null

}
const InputField: React.FC<InputFieldProps> = ({
    label, type, value, onChange, placeholder, validationFn
}) => {
    const [status, setStatus] = useState<'valid' | 'invalid' | null>(null)
    const [error, setError] = useState<string | null>(null)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value
        onChange(inputValue)
        const validationError = validationFn(inputValue)
        setError(validationError)
        setStatus(validationError ? "invalid" : "valid")
    }
    const inputClass = () => {
        if (status === 'valid') return 'border-green-500'
        if (status === 'invalid') return 'border-red-500'
    }
    return (
        <div className= 'space-y-2' >
        <label htmlFor={ label } className = 'text-sm' > { label } </label>
            < input type = { type } id = { label } value = { value } placeholder = { placeholder } onChange = { handleChange } className = {`w-full px-3 py-2 bg-[#2a2837] rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-[#8257e6] border ${inputClass()}`
}/>
{ error && <p className='text-red-500 text-sm' > { error } </p> }
</div>
    )

}

export default InputField