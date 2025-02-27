import { useEffect, useState } from "react";
import { SubscriptionPlan } from "../../types/Employer";
import SideBar from "./SideBar";
import { createSubscription, getSubscriptionById, updateSubscription } from "../../services/adminService";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

export const SubscriptionForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [plan, setPlan] = useState<SubscriptionPlan>({
    name: "",
    price: 0,
    validity: "",
    features: [""],
    isPopular: false,
    targetRole: "user",
    status: "active",
    createdAt: new Date()
  });

  useEffect(() => {
    if (id) {
      const fetchPlan = async () => {
        setIsLoading(true);
        try {
          const response = await getSubscriptionById(id);
          if(Array.isArray(response) && response.length>0)
          {
            const matchingPlan=response.find(plan=>plan._id===id||plan.id===id)
            if(matchingPlan)
            {
              setPlan(matchingPlan)
            }
          }
          
        } catch (error) {
          console.error("Error fetching plan:", error);
          toast.error("Failed to fetch subscription plan!");
        } finally {
          setIsLoading(false);
        }
      };
      fetchPlan();
    }
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === "checkbox") {
      const { checked } = e.target as HTMLInputElement;
      setPlan({ ...plan, [name]: checked });
    } else if (name === "price") {
      setPlan({ ...plan, [name]: parseFloat(value) || 0 });
    } else {
      setPlan({ ...plan, [name]: value || "" });
    }
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...plan.features];
    newFeatures[index] = value || "";
    setPlan({ ...plan, features: newFeatures });
  };

  const addFeature = () => {
    setPlan({ ...plan, features: [...plan.features, ""] });
  };

  const removeFeature = (index: number) => {
    const newFeatures = [...plan.features];
    newFeatures.splice(index, 1);
    setPlan({ ...plan, features: newFeatures.length ? newFeatures : [""] });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (id) {
        await updateSubscription(id, plan);
        toast.success("Subscription updated successfully!");
      } else {
        const response = await createSubscription(plan);
        console.log(response);
        toast.success("Subscription created successfully!");
        navigate('/subscription');
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(id ? "Failed to update subscription!" : "Failed to create subscription!");
    }
  };

  return (
    <div className="max-w-8xl mx-auto pr-8 bg-[#F87060] rounded-xl flex gap-6">
      <SideBar />
      <div className="w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">{id ? "Edit subscription plan" : "Add subscription plan"}</h2>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-700">Loading plan data...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Plan Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={plan.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Basic Plan, Premium Plan"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                  <input
                    type="number"
                    name="price"
                    value={plan.price || 0}
                    onChange={handleInputChange}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Validity Period
                </label>
                <input
                  type="text"
                  name="validity"
                  value={plan.validity || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. 30 days, 1 year"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Role
                </label>
                <select
                  name="targetRole"
                  value={plan.targetRole || "user"}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  required
                >
                  <option value="user">User</option>
                  <option value="employer">Employer</option>
                </select>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Plan Features
                </label>
                <button
                  type="button"
                  onClick={addFeature}
                  className="inline-flex items-center p-1 border border-transparent rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-3">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={feature || ""}
                      onChange={(e) => handleFeatureChange(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. Unlimited access"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="p-2 text-red-500 hover:text-red-700 focus:outline-none"
                      disabled={plan.features.length === 1}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPopular"
                  name="isPopular"
                  checked={!!plan.isPopular}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="isPopular" className="ml-2 block text-sm text-gray-700">
                  Mark as Popular
                </label>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={plan.status || "active"}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  required
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-[#102547] text-white font-medium rounded-lg hover:bg-[#0d1d38] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                {id ? "Update Plan" : "Create Plan"}
              </button>
            </div>
          </form>
        )}
        
        {!isLoading && (
          <div className="mt-8 border-t pt-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Plan Preview</h3>
            <div className={`relative bg-white rounded-xl shadow-md border ${plan.isPopular ? 'border-blue-500' : 'border-gray-200'} p-6`}>
              {plan.isPopular && (
                <span className="absolute -top-3 right-4 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  Popular
                </span>
              )}
              <h3 className="text-xl font-bold text-gray-800">{plan.name || "Plan Name"}</h3>
              <div className="mt-2 flex items-baseline">
                <span className="text-3xl font-extrabold text-gray-900">₹{plan.price || 0}</span>
                <span className="ml-1 text-gray-500">/{plan.validity || "period"}</span>
              </div>
              <div className="mt-6 space-y-3">
                {plan.features.map((feature, index) => (
                  feature ? (
                    <div key={index} className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-600">{feature}</span>
                    </div>
                  ) : null
                ))}
              </div>
              <div className="mt-6">
                <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                  plan.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {plan.status === 'active' ? 'Active' : 'Inactive'}
                </span>
                <span className="ml-2 inline-block px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
                  For {plan.targetRole === 'user' ? 'Users' : 'Employers'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionForm;