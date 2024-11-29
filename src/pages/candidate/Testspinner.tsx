import React,{useState} from 'react'
import Spinner from '../../utils/Spinner';
const TestSpinner = () => {
    const [loading, setLoading] = useState(true);
  
    return (
      <button
        onClick={() => setLoading(!loading)}
        className="w-full py-2 bg-[#8257e6] rounded-md hover:bg-[#82576e]/90 text-white font-semibold"
      >
        {loading ? <Spinner loading={true} /> : "Click to Load"}
      </button>
    );
  };

export default TestSpinner
