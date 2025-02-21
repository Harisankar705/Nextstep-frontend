import { AddProps } from '../../../types/Employer'

export const RichTextEditor = ({value='',onChange,label,placeholder}:AddProps) => {
  return (
    <div className='space-y-2'>
      <label className='block text-sm font-medium'>{label}</label>
      <div className='border border-gray-800 rounded-lg'>
        
        <textarea value={value} onChange={(e)=>onChange(e.target.value)} maxLength={500}
        placeholder={placeholder}
        className='w-full h-32 p-3 bg-transparent resize-none focus:outline-none'/>
        <div className='flex justify-between items-center px-3 py-2 border-t  border-gray-800'>
          <span className='text-xs text-gray-500'>Maximum 500 characters!</span>
          <span className='text-xs text-gray-500'>{value.length}/500</span>
        </div>
      </div>
    </div>
  )
}
