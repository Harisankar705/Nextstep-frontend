
import { Home, PlaySquare, Store, Users, Menu, MessageCircle, Bell, Search } from 'lucide-react'
import { Logo } from '../components/Logo'

export default function Navbar() {
    return (
        <div className="w-full border-b border-gray-700 bg-black">
            <div className="flex h-16 items-center px-4 gap-4">
                <div className="flex items-center gap-4 flex-1">
                    <a href="/" className="text-purple-500">
                        <Logo width={160} height={80} />


                    </a>
                    <div className="relative flex items-center">
                        <Search className="absolute left-2 h-4 w-4 text-gray-400" />
                        <input
                            type="search"
                            placeholder="Search on nextstep"
                            className="w-[240px] pl-8 pr-3 py-2 bg-gray-900 border border-gray-800 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                </div>

                <nav className="flex items-center gap-6 max-w-4xl flex-1 justify-center">
                    <button className="h-16 px-4 hover:bg-gray-900 text-purple-500">
                        <Home className="h-6 w-6" />
                    </button>
                    <button className="h-16 px-4 hover:bg-gray-900 text-gray-400">
                        <PlaySquare className="h-6 w-6" />
                    </button>
                    <button className="h-16 px-4 hover:bg-gray-900 text-gray-400">
                        <Store className="h-6 w-6" />
                    </button>
                    <button className="h-16 px-4 hover:bg-gray-900 text-gray-400">
                        <Users className="h-6 w-6" />
                    </button>
                </nav>

                <div className="flex items-center gap-4 flex-1 justify-end">
                    <button className="p-2 rounded-full hover:bg-gray-900 text-gray-400">
                        <Menu className="h-5 w-5" />
                    </button>
                    <button className="p-2 rounded-full hover:bg-gray-900 text-gray-400">
                        <MessageCircle className="h-5 w-5" />
                    </button>
                    <button className="p-2 rounded-full hover:bg-gray-900 text-gray-400">
                        <Bell className="h-5 w-5" />
                    </button>
                    <div className="h-9 w-9 rounded-full bg-gray-600 flex items-center justify-center text-white text-sm font-medium">
                        PF
                    </div>
                </div>
            </div>
        </div>
    )
}

