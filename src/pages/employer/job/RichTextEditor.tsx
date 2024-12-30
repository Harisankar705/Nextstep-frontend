import { AddProps } from '../../../types/Employer'
import { Bold, Italic, Link } from 'lucide-react'

export const RichTextEditor = ({value,onChange,label,placeholder}:AddProps) => {
  return (
    <div className='space-y-2'>
      <label className='block text-sm font-medium'>{label}</label>
      <div className='border border-gray-800 rounded-lg'>
        <div className='flex items-center gap-1 p-2 border-b border-gray-800'>
          <button className='p-1 hover:bg-gray-800 rounded'>
            <Bold className='w-4 h-4'/>
          </button>
          <button className='p-1 hover:bg-gray-800 rounded'>
            <Italic className='w-4 h-4'/>
          </button>
          <button className='p-1 hover:bg-gray-800 rounded'>
            <Link className='w-4 h-4'/>
          </button>

        </div>
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
