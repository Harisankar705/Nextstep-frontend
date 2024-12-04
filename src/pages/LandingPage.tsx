import React, { useState } from "react";
import Slider from "react-slick";
import { ArrowRight, Briefcase, Search, Users, ChevronRight, ChevronLeft } from "lucide-react";
import Image from "../../src/Images/new.png"; 
import SecondImage from '../../src/Images/employer.png'
import {useNavigate} from 'react-router-dom'


import { Logo } from "../components/Logo";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

interface ArrowProps{
  className?:string
  style?:React.CSSProperties,
  onClick?:React.MouseEventHandler<HTMLButtonElement>
}
const categories = [
  { icon: <Briefcase className="w-8 h-8 text-[#8257e7]" />, title: "Technology" },
  { icon: <Search className="w-8 h-8 text-[#8257e7]" />, title: "HealthCare" },
  { icon: <Users className="w-8 h-8 text-[#8257e7]" />, title: "Finance" },
  { icon: <ArrowRight className="w-8 h-8 text-[#8257e7]" />, title: "Research" },
];





function NextArrow(props:ArrowProps) {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute top-1/2 -translate-y-1/2 right-4 z-10 bg-[#8257e6]/70 rounded-full p-2 transition-colors"
    >
      <ChevronRight className="text-white" />
    </button>
  );
}

// Previous Arrow
function PrevArrow(props:ArrowProps) {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute top-1/2 -translate-y-1/2 left-4 z-10 bg-[#8257e6]/70 rounded-full p-2 transition-colors"
    >
      <ChevronLeft className="text-white" />
    </button>
  );
}

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({
  icon,
  title,
  description,
}) => {
  return (
    <div className="bg-[#2a2837] p-6 rounded-lg">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  );
};

// Landing Page Component
const LandingPage: React.FC = () => {
  console.log("IN landing page")
  const headerSlides:Array<{title:JSX.Element;description:string,buttonText:JSX.Element,backgroundClass:string,image:string}> = [
    {
      title: (
        <>
          Find Your Dream Job <span className="text-[#8257e7]">Today!</span>
        </>
      ),
      description: "Connect with top employers and take the next step in your career journey",
      buttonText:(
        <span className='bg-blue text-white-500' onClick={()=>handleCandidateLogin()}>Explore jobs</span>),
      backgroundClass: "bg-[#1a1625]",
      image:Image,
    },
    {
      title: (
        <>
          Hire <span className="text-[#8257e6]">Top Talent</span>
        </>
      ),
      description: "Find the most skilled professional to drive your company's success",
      buttonText:(
        <span className='bg-blue text-white py-2 px-2 rounded' onClick={()=>handleEmployerLogin()}>Explore Candidates</span>),
      backgroundClass: "bg-[#1e1c29]",
      
      image: SecondImage
    },
  ];
  const navigate=useNavigate()
  const [currentSlide, setCurrentSlide] = useState(0);
  const handleCandidateLogin=()=>{
    console.log('handlecandidate clicked')
    navigate('/login')
  }
  const handleEmployerLogin=()=>{
    navigate('/employerlogin')
  }
  
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    beforeChange: (current:number, next:number) => setCurrentSlide(next),
    appendDots: (dots:React.ReactNode) => (
      <div style={{ bottom: "20px", display: "flex", justifyContent: "center" }}>
        <ul className="flex space-x-2">{dots}</ul>
      </div>
    ),
    customPaging: (i:number) => (
      <button
        className={`w-3 h-3 rounded-full ${
          i === currentSlide ? "bg-[#8257e6]" : "bg-gray-500"
        } transition-colors`}
      />
    ),
  };

  return (
    <div className="relative w-full">
      <Slider {...settings}>
        {headerSlides.map((slide, index) => (
          <div key={index} className={`min-h-screen w-full ${slide.backgroundClass} text-white`}>
             <Logo width={200} height={53} className="mb-12" />
            <div className="container max-w-[1100px] mx-auto px-4 py-12 min-h-screen">
              <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
                
                <div className="space-y-10">
                  <h1
                    className="text-6xl font-bold tracking-tight lg:text-7xl">{slide.title}</h1>
                
                  <p className="text-3xl text-gray-300">{slide.description}</p>
                  <button className="px-10 py-5 bg-[#8257e6] rounded-lg hover:bg-[#8257e6]/90 text-white font-semibold text-lg transition-colors">
                    {slide.buttonText}
                  </button>
                </div>
                <div className="hidden lg:block">
                  <img src={slide.image} alt={`${slide.buttonText} illustration`} className="w-full max-w-2xl mx-auto" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>

      {/* Categories Section */}
      <section className="py-16 bg-[#1a1625]">
        <div className="container mx-auto px-4 max-w-[1200px]">
          <h2 className="text-white text-4xl font-bold text-center mb-12">Explore by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <div
                key={index}
                className="bg-[#2a2837] p-6 rounded-lg flex flex-col items-center text-center hover:scale-105 hover:bg-[#8257e6]/30 transition-transform"
              >
                <div className="mb-4">{category.icon}</div>
                <h3 className="text-xl font-semibold text-white">{category.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-[#1e1c29] py-16">
        <div className="container max-w-[1100px] mx-auto px-4">
          <h2 className="text-3xl text-white font-bold text-center mb-12">Why Choose Our Job Portal?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Search className="w-10 h-10 text-[#8257e7]" />}
              title="Smart Job Matching"
              description="Our AI-powered system matches you with the perfect job opportunities based on your skills and preferences."
            />
            <FeatureCard
              icon={<Briefcase className="w-10 h-10 text-[#8257e7]" />}
              title="Diverse Opportunities"
              description="Access a wide range of job listings from various industries and top companies around the world."
            />
            <FeatureCard
              icon={<Users className="w-10 h-10 text-[#8257e7]" />}
              title="Career Resources"
              description="Get access to resume-building tools, interview tips, and career advice to boost your job search."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#1e1c29] py-16">
        <div className="container max-w-[1100px] mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-white">Ready to Start Your Job Search?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of job seekers who have found success through our platform.
          </p>
          <button className="px-8 py-4 bg-[#8257e6] rounded-md hover:bg-[#8257e6]/90 text-white font-semibold text-lg transition-colors">
            Create Your Account Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1a1625] py-8">
        <div className="container max-w-[1100px] mx-auto px-4 text-center text-gray-400">
          <p>&copy; 2023 Nextstep. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
