import React, { useEffect, useState } from 'react';
import { CheckCircle, Briefcase, Star, Trophy, Loader } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { changeToPremium } from '../../services/commonService';

export const PaymentSuccess = () => {
  const [showContent, setShowContent] = useState(false);
  const [showBenefits, setShowBenefits] = useState(false);
  const [showCheck, setShowCheck] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const upgradeUserToPremium = async () => {
      try {
        const searchParams = new URLSearchParams(location.search);
        const userId = searchParams.get('userId');
        
        if (!userId) {
          toast.error("User ID not found");
          navigate('/jobs');
          return;
        }

        const response = await changeToPremium(userId);
        if (response.status === 200) {
          
          setShowContent(true);
          setTimeout(() => setShowCheck(true), 500);
          setTimeout(() => setShowBenefits(true), 800);
          setTimeout(()=>{
            navigate('/jobs')
          },2000)
        }
      } catch (error) {
        toast.error('An error occurred during upgrade');
        navigate('/jobs');
      } finally {
        setIsUpgrading(false);
      }
    };

    upgradeUserToPremium();
  }, [location, navigate]);

  const benefits = [
    {
      icon: <Briefcase className="w-6 h-6" />,
      title: "Priority Job Access",
      description: "Get early access to premium job listings"
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Featured Profile",
      description: "Stand out to top employers"
    },
    {
      icon: <Trophy className="w-6 h-6" />,
      title: "Advanced Analytics",
      description: "Track your application performance"
    }
  ];

  if (isUpgrading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-white text-center">
          <Loader className="w-12 h-12 animate-spin mx-auto mb-4" />
          <p className="text-xl">Upgrading your account...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4">
      <div className={`max-w-2xl w-full bg-white rounded-2xl shadow-2xl transform transition-all duration-700 ease-out ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
        <div className="p-8">
          <div className="flex justify-center">
            <div className="rounded-full bg-teal-100 p-3 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <svg 
                  className="w-16 h-16 text-teal-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle 
                    cx="12" 
                    cy="12" 
                    r="10"
                    className="animate-[circle-draw_1s_ease-in-out_forwards]"
                    style={{
                      strokeDasharray: '64',
                      strokeDashoffset: '64',
                      animation: 'circle-draw 1s ease-in-out forwards'
                    }}
                  />
                  <path
                    d="M8 12l3 3 6-6"
                    className="animate-[check-draw_0.5s_ease-in-out_0.6s_forwards]"
                    style={{
                      strokeDasharray: '24',
                      strokeDashoffset: '24',
                      animation: 'check-draw 0.5s ease-in-out 0.6s forwards'
                    }}
                  />
                </svg>
              </div>
              <CheckCircle className="w-16 h-16 text-transparent" />
            </div>
          </div>

          <div className="text-center mt-6">
            <h1 className="text-3xl font-bold text-gray-900">Payment Successful!</h1>
            <p className="text-gray-600 mt-2">Welcome to Nextstep Premium</p>
          </div>

          <div className="my-8 border-t border-gray-200" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className={`transform transition-all duration-500 ease-out ${showBenefits ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="bg-teal-50 rounded-xl p-6 h-full border border-teal-100 hover:shadow-lg transition-shadow duration-300">
                  <div className="text-teal-600 mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600 text-sm">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-teal-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-teal-700 transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;