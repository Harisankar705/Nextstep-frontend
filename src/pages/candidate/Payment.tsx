import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {useElements, useStripe } from "@stripe/react-stripe-js";
import toast from "react-hot-toast";
import { stripePayment } from "../../services/commonService";
export const Payment = () => {
  const location = useLocation();
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [amount] = useState(5000); 
  useEffect(() => {
    const state = location.state as {
      redirectReason?: string;
      jobId?: string;
    };
    if (state?.redirectReason === "job_application_limit") {
    }
  }, [location]);
  const handlePremiumUpgrade = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    try {
      setIsLoading(true);
      const response = await stripePayment(amount); 
            const url=await response.url
            window.location.href=url
    } catch (error) {
      toast.error("Payment Failed");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="payment-page">
      <h1 className="text-2xl font-bold mb-4">Upgrade to Premium</h1>
      <p className="text-gray-600 mb-6">Unlimited job applications with our premium plans</p>
        <button onClick={handlePremiumUpgrade}
        disabled={isLoading}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50">
            {isLoading ? "Processing":`Pay${(amount/100).toFixed(2)}`}
        </button>
    </div>
  );
};
export default Payment;