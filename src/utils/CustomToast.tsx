import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Default toast styles
import './toast.css'; // Import custom toast.css file for animations

// CustomToast component
const CustomToast = () => {
  const customToastStyle: React.CSSProperties = {
    background: 'white', // White background
    color: 'black',      // Black text
    fontSize: '18px',
    padding: '12px 20px',
    borderRadius: '8px',
    boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.3)', // Optional: adds shadow to the toast
    minWidth: '250px',
    maxWidth: '450px',
  };

  // Trigger a custom toast
  const handleClick = () => {
    toast.success('Custom Toast Success!', {
      className: 'bounceInToast', // Apply bounceIn animation from toast.css
      style: customToastStyle,     // Apply the custom style defined above
    });
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
      >
        Show Toast
      </button>

      {/* ToastContainer is where the toasts will be displayed */}
      <ToastContainer
        position="top-center"  // Position of the toast
        autoClose={5000}       // Auto close after 5 seconds
        hideProgressBar       // Hide progress bar
        closeOnClick          // Close on click
        pauseOnHover          // Pause on hover
        draggable             // Make draggable
      />
    </>
  );
};

export default CustomToast;
