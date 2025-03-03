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
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
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
          if (Array.isArray(response) && response.length > 0) {
            const matchingPlan = response.find((p) => p._id === id || p.id === id);
            if (matchingPlan) {
              setPlan(matchingPlan);
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

  const validateForm = () => {
    let newErrors: { [key: string]: string } = {};

    if (!plan.name.trim()) newErrors.name = "Plan name is required";
    if (plan.price <= 1) newErrors.price = "Price must be greater than 1";
    if (!plan.validity.trim()) newErrors.validity = "Validity period is required";
    if (!plan.features.some((feature) => feature.trim())) newErrors.features = "At least one valid feature is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === "checkbox") {
      setPlan({ ...plan, [name]: (e.target as HTMLInputElement).checked });
    } else if (name === "price") {
      setPlan({ ...plan, [name]: parseFloat(value) || 0 });
    } else {
      setPlan({ ...plan, [name]: value });
    }

    setErrors({ ...errors, [name]: "" });
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...plan.features];
    newFeatures[index] = value || "";
    setPlan({ ...plan, features: newFeatures });
    setErrors({ ...errors, features: "" });
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
    if (!validateForm()) return;

    try {
      if (id) {
        await updateSubscription(id, plan);
        toast.success("Subscription updated successfully!");
      } else {
        await createSubscription(plan);
        toast.success("Subscription created successfully!");
        navigate("/subscription");
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
        <h2 className="text-2xl font-bold text-gray-800 mb-6">{id ? "Edit Subscription Plan" : "Add Subscription Plan"}</h2>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-700">Loading plan data...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name</label>
              <input type="text" name="name" value={plan.name} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none" required />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
              <input type="number" name="price" value={plan.price} onChange={handleInputChange} min="1" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none" required />
              {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Validity Period</label>
              <input type="text" name="validity" value={plan.validity} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none" required />
              {errors.validity && <p className="text-red-500 text-sm">{errors.validity}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Features</label>
              {plan.features.map((feature, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input type="text" value={feature} onChange={(e) => handleFeatureChange(index, e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none" required />
                  <button type="button" onClick={() => removeFeature(index)} className="text-red-500">X</button>
                </div>
              ))}
              <button type="button" onClick={addFeature} className="text-blue-500">+ Add Feature</button>
              {errors.features && <p className="text-red-500 text-sm">{errors.features}</p>}
            </div>

            <div className="flex justify-end">
              <button type="submit" disabled={!validateForm()} className="px-6 py-2 bg-[#102547] text-white font-medium rounded-lg disabled:bg-gray-400"> 
                {id ? "Update Plan" : "Create Plan"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default SubscriptionForm;
