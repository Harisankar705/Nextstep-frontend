import { Search } from "lucide-react"

const SearchBar = () => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className='flex-1 max-w-xl'>
            <div className='relative'>
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"/>
                <input type='text' placeholder="search" className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"/>
            </div>
        </div>
    </div>
  )
}

export default SearchBar