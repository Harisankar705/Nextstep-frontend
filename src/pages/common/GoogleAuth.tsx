import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { googleLogin } from "../../services/authService";
import { setUser } from "../../redux/userSlice";
import { setEmployer } from "../../redux/employerSlice";
import { useState } from "react";
import Spinner from "../../utils/Spinner";

interface GoogleAuthProps {
  authType: "login" | "signup";
  role: "user" | "employer";
}

export const GoogleAuth: React.FC<GoogleAuthProps> = ({ authType, role }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading,setLoading]=useState(false)
  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      setLoading(true)
      if (!credentialResponse.credential) {
        toast.error("Google authentication failed!");
        return;
      }

      const decoded = jwtDecode(credentialResponse.credential);
      console.log("Decoded Google User:", decoded);

      const response = await googleLogin(credentialResponse.credential, role);
      console.log("GOOGLE LOGIN RESPONSE:", response);

      if (response?.data.success) {
        toast.success(`${authType} successful!`);

        if (authType === "login") {
          if (role === "user") {
            dispatch(setUser(response.data.user));
            navigate("/home");
          } else if (role === "employer") {
            dispatch(setEmployer(response.data.user));

            if (response.data.user.isProfileComplete) {
              navigate("/employerhome");
            } else {
              navigate("/employerdetails");
            }
          }
        } else {
          if (role === "user") {
            navigate("/candidate-details");
          } else if (role === "employer") {
            navigate("/employerdetails");
          }
        }
      } else {
        console.log(response?.data.error);
        toast.error("Google authentication failed!");
      }
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("Google authentication failed!");
    }
    finally{
       setLoading(false)
    }
  };

  const googleLoginFailed = () => {
    toast.error("Google Sign-in failed!");
  };

 return (
  <div className="w-full flex justify-center items-center">
    {loading ? (
      <Spinner loading={true} />
    ) : (
      <GoogleLogin onSuccess={handleGoogleSuccess} onError={googleLoginFailed} />
    )}
  </div>
);
}
