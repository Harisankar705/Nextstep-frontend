import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useElements, useStripe } from "@stripe/react-stripe-js";
import { Check, CreditCard } from 'lucide-react';
import toast from "react-hot-toast";
import { stripePayment } from "../../services/commonService";
import { getSubscription } from "../../services/adminService";
import Spinner from "../../utils/Spinner";
interface Plan {
  _id: string;
  name: string;
  price: number;
  validity: string;
  features: string[];
  isPopular?: boolean;
  status?: string;
}
export const Payment = () => {
  const location = useLocation();
  const stripe = useStripe();
  const elements = useElements();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const state = location.state as {
      redirectReason?: string;
      jobId?: string;
    };
    if (state?.redirectReason === "job_application_limit") {
      toast.error("You've reached the application limit. Upgrade to continue.");
    }
  }, [location]);
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setIsLoading(true);
        const response = await getSubscription();
        console.log(response)
        
        let activePlans = [];
        if (response && Array.isArray(response)) {
          
          activePlans = response.filter((plan: Plan) => plan.status === 'active');
        } else if (response && Array.isArray(response.data)) {
          
          activePlans = response.data.filter((plan: Plan) => plan.status === 'active');
        }
        console.log("Fetched plans:", activePlans);
        setPlans(activePlans);
      } catch (error) {
        toast.error("Failed to load subscription plans!");
        console.error("Failed to load subscription plans!", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlans();
  }, []);
  useEffect(() => {
    if (plans.length > 0) {
      setSelectedPlan(plans[0]);
    }
  }, [plans]);
  const handlePremiumUpgrade = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements || !selectedPlan) {
      return;
    }
    try {
      setIsLoading(true);
      const response = await stripePayment(selectedPlan.price,selectedPlan._id);
      console.log('setselectedplan',setSelectedPlan)
      const url = response.url || response; 
      window.location.href = url;
    } catch (error) {
      toast.error("Payment Failed");
      console.error("Payment error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  if (isLoading) {
    return (<Spinner loading={true} />);
  }
  if (plans.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No Subscription Plans Available</h2>
          <p className="text-gray-400">Please check back later or contact support.</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Choose Your Premium Plan</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Unlock unlimited job applications and premium features with our subscription plans
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan._id}
              onClick={() => setSelectedPlan(plan)}
              className={`rounded-2xl p-8 cursor-pointer transition-all duration-200 ${
                selectedPlan && selectedPlan._id === plan._id
                  ? 'bg-purple-600 transform scale-105'
                  : 'bg-gray-800 hover:bg-gray-700'
              } relative`}
            >
              {plan.isPopular && (
                <span className="absolute top-0 right-0 bg-purple-800 text-white px-3 py-1 rounded-tr-2xl rounded-bl-2xl text-sm font-medium">
                  Popular
                </span>
              )}
              <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
              <div className="flex items-baseline mb-2">
                <span className="text-5xl font-extrabold">₹{plan.price.toFixed(2)}</span>
              </div>
              <p className="text-gray-400 mb-8">{plan.validity} validity</p>
              <ul className="space-y-4 mb-8">
                {Array.isArray(plan.features) ? (
                  plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="h-5 w-5 text-green-400 mr-3" />
                      <span>{feature}</span>
                    </li>
                  ))
                ) : (
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-400 mr-3" />
                    <span>Subscription benefits</span>
                  </li>
                )}
              </ul>
              <button
                onClick={(e) => {
                  e.stopPropagation(); 
                  handlePremiumUpgrade(e);
                }}
                disabled={isLoading}
                className={`w-full py-3 px-6 rounded-lg flex items-center justify-center space-x-2 
                  ${selectedPlan && selectedPlan._id === plan._id
                    ? 'bg-white text-purple-600 hover:bg-gray-100'
                    : 'bg-purple-600 text-white hover:bg-purple-700'
                  } transition duration-200 disabled:opacity-50`}
              >
                <CreditCard className="h-5 w-5" />
                <span>
                  {isLoading ? "Processing..." : "Subscribe Now"}
                </span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Payment;