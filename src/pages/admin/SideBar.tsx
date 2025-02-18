import { Building2, LogOut, Menu, ReceiptPoundSterling, Users } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Logo } from "../../components/Logo";
import { useDispatch } from "react-redux";
import { clearAdmin } from "../../redux/adminSlice";
import { persistor } from "../../redux/store";
import { useEffect, useState } from "react";

const SideBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    dispatch(clearAdmin());
    persistor.purge();
    navigate('/admin');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (target && !target.closest('.sidebar')) {
        setIsOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <>
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className={`
        sidebar
        fixed top-0 left-0 z-50
        w-64 h-screen 
        bg-slate-900 
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 md:static
        flex flex-col
      `}>
        <div className="p-6 border-b border-slate-800">
          <Logo width={200} height={53} className="mx-auto" />
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <Link 
            to="/candidates" 
            className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-all group"
          >
            <Users className="h-5 w-5 text-slate-400 group-hover:text-emerald-500 transition-colors" />
            <span>Candidates</span>
          </Link>
          <Link 
            to="/employers" 
            className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-all group"
          >
            <Building2 className="h-5 w-5 text-slate-400 group-hover:text-emerald-500 transition-colors" />
            <span>Employers</span>
          </Link>
          <Link 
            to="/reports" 
            className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-all group"
          >
            <ReceiptPoundSterling className="h-5 w-5 text-slate-400 group-hover:text-emerald-500 transition-colors" />
            <span>Reported Posts</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-lg transition-all group"
          >
            <LogOut className="h-5 w-5 group-hover:text-rose-500 transition-colors" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default SideBar;