import SideBar from "./SideBar";
import SearchBar from "./SearchBar";

const Dashboard = () => {
  return (
    <div className="flex h-screen">
      <SideBar />
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b">
          <SearchBar />
        </div>
        <div className="bg-white rounded-lg flex-grow p-4">
          <p className="text-gray-600 text-center font-bold">Welcome Admin!</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
