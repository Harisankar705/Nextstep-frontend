import { InterviewScheduleData } from "../types/Employer";
import api from "../utils/api";
import { axiosError } from "../utils/AxiosError";
export const toggleFollow = async (followingId: string): Promise<any> => {
  try {
    const response = await api.post("/followaccount", { followingId });
    return response.data;
  } catch (error) {
    axiosError(error, "sendFollowRequest");
    throw error;
  }
};
export const unfollow = async (followingId: string): Promise<any> => {
  try {
    const response = await api.post("/unfollowaccount", { followingId });
    return response.data;
  } catch (error) {
    axiosError(error, "unfollow");
    throw error;
  }
};
export const rejectRequest = async (requestId: string): Promise<any> => {
  try {
    const response = await api.delete(`/rejectrequest/${requestId}`);
    console.log('rejectrequest',response)
    return response.data;
  } catch (error) {
    axiosError(error, "rejectRequest");
    throw error;
  }
};
export const followBack = async (connectionId: string): Promise<boolean> => {
  try {
    const response = await api.post("/followback", { connectionId });
    return response.data;
  } catch (error) {
    axiosError(error, "sendFollowRequest");
    throw error;
  }
};
export const getPendingRequests = async () => {
  try {
    const response = await api.get("/pendingrequests");
    return response;
  } catch (error) {
    axiosError(error, "getPendingrequests");
    throw error;
  }
};
export const getConnections = async () => {
  try {
    const response = await api.get("/connections");
    return response;
  } catch (error) {
    axiosError(error, "getConnections");
    throw error;
  }
};
export const checkFollowStatus = async (
  followingId: string
): Promise<boolean> => {
  try {
    const response = await api.get("/followstatus", {
      params: { followingId },
    });
    return response.data.isFollowing;
  } catch (error) {
    axiosError(error, "sendFollowRequest");
    throw error;
  }
};
export const likePost = async (postId: string) => {
  try {
    const response = await api.post("/likepost", { postId });
    return response;
  } catch (error) {
    axiosError(error, "likepost");
    throw error;
  }
};
export const commentPost = async (postId: string, comment: string) => {
  try {
    const response = await api.post("/commentpost", { postId, comment });
    return response;
  } catch (error) {
    axiosError(error, "commentpost");
    throw error;
  }
};
export const getComments = async (postId: string) => {
  try {
    const response = await api.get("/getComments", { params: { postId } });
    return response;
  } catch (error) {
    axiosError(error, "commentpost");
    throw error;
  }
};
export const forgotPassword = async (email: string,role:string) => {
  try {
    const response = await api.post("/forgot-password",{email,role}, { withCredentials: false });
    console.log("RESPONSE",response)
    return response
  } catch (error) {
    axiosError(error, "forgotPassword");
    throw error;
  }
};
export const resetPassword = async (token: string,password:string,role:string) => {
  try {
    const response = await api.post("/reset-password",{token,password,role});
    return response
  } catch (error) {
    axiosError(error, "resetPassword");
    throw error;
  }
};
export const stripePayment = async (amount: number,planId:string) => {
  try {
    const response = await api.post("/create-payment", { amount,planId });
    return response.data;
  } catch (error) {
    axiosError(error, "stripepayment");
    throw error;
  }
};
export const changeToPremium = async (userId: string,planId:string) => {
  try {
    const respnse = await api.put("/changetopremium", { userId,planId });
    return respnse;
  } catch (error) {
    axiosError(error, "changeToPremium");
    throw error;
  }
};
export const sharePost = async (postId: string) => {
  try {
    const response = await api.post("/sharepost", { postId });
    return response;
  } catch (error) {
    axiosError(error, "commentpost");
    throw error;
  }
};
export const interactionCount = async (postId: string) => {
  try {
    const response = await api.get("/getPostInteractions", {
      params: { postId },
    });
    const { likeCount, commentCount } = response.data.interactions;
    return { likeCount, commentCount };
  } catch (error) {
    axiosError(error, "interactioncount");
    throw error;
  }
};
export const savePost = async (postId: string) => {
  try {
    const response = await api.post("/savepost", { postId });
    return response.data;
  } catch (error) {
    axiosError(error, "savepost");
    throw error;
  }
};
export const deletePost = async (postId: string) => {
  try {
    const response = await api.delete("/deletepost", {
      data: { postId },
    });
    return response.data;
  } catch (error) {
    axiosError(error, "deletepost");
    throw error;
  }
};
export const getSavedPost = async () => {
  try {
    const response = await api.get("/getsavedposts");
    return response.data;
  } catch (error) {
    axiosError(error, "getsavedpost");
    throw error;
  }
};
export const createReport = async (reportData: {
  postId: string;
  reason: string;
  description?: string;
  role: string;
}): Promise<any> => {
  try {
    console.log("in createreport", reportData);
    const response = await api.post("/create-report", reportData);
    return response;
  } catch (error) {
    axiosError(error, "create report");
    throw error;
  }
};
export const checkSavedStatus = async (postId: string) => {
  try {
    const response = await api.get(`/saved-posts/check/${postId}`);
    return response.data.isSaved;
  } catch (error) {
    axiosError(error, "checkSavedstatus");
    throw error;
  }
};
export const fetchJobs = async () => {
  try {
    const response = await api.post("/fetch-jobs");
    return response;
  } catch (error) {
    axiosError(error, "fetchjobs");
    throw error;
  }
};
export const fetchAppliedJobs = async () => {
  try {
    const response = await api.get("/appliedjobs");
    return response.data
  } catch (error) {
    axiosError(error, "fetchAppliedJobs");
    throw error;
  }
};
export const scheduleInterview = async (
  scheduleData: InterviewScheduleData,
  userId: string,
  jobId: string
) => {
  try {
    const response = await api.post("/schedule-interview", {
      userId,
      jobId,
      ...scheduleData,
    });
    return response;
  } catch (error) {
    axiosError(error, "scheduleInterview");
    throw error;
  }
};
export const getURL = async (url: string) => {
  try {
    const response = await api.post("/fetchurl", { url });
    return response.data;
  } catch (error) {
    axiosError(error, "getURL");
    throw error;
  }
};
export const fetchUserMessages = async (id: string) => {
  try {
    console.log("FETCHUSERMESSAGES",id  )
    const response = await api.get(`/get-chat/${id}`);
    return response.data;
  } catch (error) {
    axiosError(error, "fetchMessages");
    throw error;
  }
};
export const getAllChats = async () => {
  try {
    const response = await api.get('/messages');
    console.log(response)
    return response
  } catch (error) {
    axiosError(error, "getAllChats");
    throw error;
  }
};
interface IMessage {
  senderId: string;
  receiverId: string;
  content: string;
  file: File | null;
}
export const sendMessage = async (messageData: IMessage) => {
  try {
    const response = await api.post(`/send-message/`, { messageData });
    return response.data;
  } catch (error) {
    axiosError(error, "fetchMessages");
    throw error;
  }
};
export const getNotifications = async () => {
  try {
    const response = await api.get("/notifications");
    return response.data;
  } catch (error) {
    axiosError(error, "getNotifications");
    throw error;
  }
};
export const getPostById = async (postId: string) => {
  try {
    const response = await api.get("/get-post-byid", { params: postId });
    return response.data;
  } catch (error) {
    axiosError(error, "getPostbyId");
    throw error;
  }
};
export const markNotificationAsRead = async (notificationId: string) => {
  try {
    const response = await api.post("/mark-as-read", { notificationId });
    return response;
  } catch (error) {
    axiosError(error, "markNotificationAsRead");
    throw error;
  }
};
