import axios from "axios";

const url = "http://localhost:8080/";
const registerUser = ({ body }) => {
  return axios({
    method: "POST",
    url: url + "registerUser",
    data: body,
  });
};
const checkToken = ({ body, tokenType }) => {
  return axios({
    method: "POST",
    url: url + "checkToken/" + tokenType,
    data: body,
  });
};
const approveUser = ({ userId }) => {
  return axios({
    method: "PUT",
    url: url + "approveUser/" + userId,
    data: {},
  });
};
const verifyUser = ({ body }) => {
  return axios({
    method: "PUT",
    url: url + "verifyUser",
    data: body,
  });
};
const generateToken = ({ tokenType, body }) => {
  return axios({
    method: "POST",
    url: url + "generateToken/" + tokenType,
    data: body,
  });
};
const loginUser = ({ body }) => {
  return axios({
    method: "POST",
    url: url + "loginUser",
    data: body,
  });
};
const updatePassword = ({ body }) => {
  return axios({
    method: "PUT",
    url: url + "updatePassword",
    data: body,
  });
};
const forgetPassword = ({ body }) => {
  return axios({
    method: "PUT",
    url: url + "forgetPassword",
    data: body,
  });
};
const getReservationSlots = ({ userId }) => {
  return axios({
    method: "GET",
    url: url + "getReservationSlots/" + userId,
  });
};
const isSlotReservedByUser = ({ userId, slotFk }) => {
  return axios({
    method: "GET",
    url: url + "isSlotReservedByUser/" + userId + "/" + slotFk,
  });
};
const getGeneralStatistics = () => {
  return axios({
    method: "GET",
    url: url + "getGeneralStatistics",
  });
};
const deleteReservationSlotByReservationId = ({ reservationId, userFk }) => {
  return axios({
    method: "DELETE",
    url: url + "deleteReservationSlotByReservationId/" + reservationId + "/" + userFk,
  });
};
const deleteReservationSlotBySlot = ({ userFk, slotFk }) => {
  return axios({
    method: "DELETE",
    url: url + "deleteReservationSlotBySlot/" + slotFk + "/" + userFk,
  });
};
const addReservationSlot = ({ body }) => {
  return axios({
    method: "POST",
    url: url + "addReservationSlot",
    data: body,
  });
};

const getUserFeedbacks = ({
  userId,
  pageNumber,
  recordsByPage,
  searchText,
}) => {
  return axios({
    method: "GET",
    url:
      url +
      "getUserFeedbacks/" +
      userId +
      "/" +
      pageNumber +
      "/" +
      recordsByPage +
      "/" +
      (searchText === "" || searchText === null ? "null" : searchText),
  });
};
const getAllFeedbacks = ({ pageNumber, recordsByPage, searchText }) => {
  return axios({
    method: "GET",
    url:
      url +
      "getUserFeedbacks/" +
      pageNumber +
      "/" +
      recordsByPage +
      "/" +
      (searchText === "" || searchText === null ? "null" : searchText),
  });
};
const deleteFavorite = ({ favoriteId }) => {
  return axios({
    method: "DELETE",
    url: url + "deleteFavorite/" + favoriteId,
  });
};
const deleteFeedback = ({ feedbackId }) => {
  return axios({
    method: "DELETE",
    url: url + "deleteFeedback/" + feedbackId,
  });
};
const addFeedback = ({ body }) => {
  return axios({
    method: "POST",
    url: url + "addFeedback",
    data: body,
  });
};
const addFavorite = ({ body }) => {
  return axios({
    method: "POST",
    url: url + "addFavorite",
    data: body,
  });
};
const getFavorites = ({ pageNumber, recordsByPage, searchText }) => {
  return axios({
    method: "GET",
    url:
      url +
      "getFavorites/" +
      pageNumber +
      "/" +
      recordsByPage +
      "/" +
      (searchText === "" || searchText === null ? "null" : searchText),
  });
};
const deleteCommunityPost = ({ postId }) => {
  return axios({
    method: "DELETE",
    url: url + "deleteCommunityPost/" + postId,
  });
};
const updateCommunityPost = ({ body }) => {
  return axios({
    method: "PUT",
    url: url + "updateCommunityPost",
    data: body,
  });
};
const addCommunityPost = ({ body }) => {
  return axios({
    method: "POST",
    url: url + "addCommunityPost",
    data: body,
  });
};
const updateAppointment = ({ body }) => {
  return axios({
    method: "PUT",
    url: url + "updateAppointment",
    data: body,
  });
};
const registerAppointment = ({ body }) => {
  return axios({
    method: "POST",
    url: url + "registerAppointment",
    data: body,
  });
};
const getCommunityPosts = ({ pageNumber, recordsByPage, searchText }) => {
  return axios({
    method: "GET",
    url:
      url +
      "getCommunityPosts/" +
      pageNumber +
      "/" +
      recordsByPage +
      "/" +
      (searchText === "" || searchText === null ? "null" : searchText),
  });
};
const addCommunityPostComment = ({ body }) => {
  return axios({
    method: "POST",
    url: url + "addCommunityPostComment",
    data: body,
  });
};
const getCommunityPostComment = ({ postId, pageNumber, recordsByPage }) => {
  return axios({
    method: "GET",
    url:
      url +
      "getCommunityPostComment/" +
      postId +
      "/" +
      pageNumber +
      "/" +
      recordsByPage,
  });
};
const updateCommunityPostComment = ({ body }) => {
  return axios({
    method: "PUT",
    url: url + "updateCommunityPostComment",
    data: body,
  });
};
const deleteCommunityPostComment = ({ commentId }) => {
  return axios({
    method: "DELETE",
    url: url + "deleteCommunityPostComment/" + commentId,
  });
};
const deleteSubscription = ({ userEmail }) => {
  return axios({
    method: "DELETE",
    url: url + "deleteSubscription/" + userEmail,
  });
};
const subscribe = ({ body }) => {
  return axios({
    method: "POST",
    url: url + "subscribe",
    data: body,
  });
};
const updateUser = ({ body }) => {
  return axios({
    method: "PUT",
    url: url + "updateUser",
    data: body,
  });
};
const getSpecialities = () => {
  return axios({
    method: "GET",
    url: url + "getSpecialities",
  });
};
const getMessages = () => {
  return axios({
    method: "GET",
    url: url + "getMessages",
  });
};
const postponeAppointment = ({ body }) => {
  return axios({
    method: "POST",
    url: url + "postponeAppointment",
    data: body,
  });
};
const contactUs = ({ body }) => {
  return axios({
    method: "POST",
    url: url + "contactUs",
    data: body,
  });
};
const updateNotification = ({ body }) => {
  return axios({
    method: "PUT",
    url: url + "updateNotification",
    data: body,
  });
};
const deleteAllNotifications = ({ userId }) => {
  return axios({
    method: "DELETE",
    url: url + "updateNotification/" + userId,
  });
};
const deleteNotifications = ({ body }) => {
  return axios({
    method: "DELETE",
    url: url + "updateNotification",
    data: body,
  });
};
const getNotifications = ({ userId, pageNumber, recordsByPage }) => {
  return axios({
    method: "GET",
    url:
      url +
      "getNotifications/" +
      pageNumber +
      "/" +
      recordsByPage +
      "/" +
      userId,
  });
};
const getBlogs = ({ pageNumber, recordsByPage }) => {
  return axios({
    method: "GET",
    url: url + "getBlogs/" + pageNumber + "/" + recordsByPage,
  });
};
const addBlog = ({ body }) => {
  return axios({
    method: "POST",
    url: url + "addBlog",
    data: body,
  });
};
const updateProfilePicture = ({ body }) => {
  return axios({
    method: "POST",
    url: url + "updateProfilePicture",
    data: body,
  });
};
const deleteBlogs = ({ body }) => {
  return axios({
    method: "DELETE",
    url: url + "deleteBlogs",
    data: body,
  });
};

const updateBlog = ({ body }) => {
  return axios({
    method: "PUT",
    url: url + "updateBlog",
    data: body,
  });
};
const addSurveyQuestionsAnswers = ({ surveyId, body }) => {
  return axios({
    method: "POST",
    url: url + "addSurveyQuestionsAnswers/" + surveyId,
    data: body,
  });
};
const getSurvey = ({ surveyId }) => {
  return axios({
    method: "GET",
    url: url + "getSurvey/" + surveyId,
  });
};
const addSurvey = ({ body }) => {
  return axios({
    method: "POST",
    url: url + "addSurvey/",
    data: body,
  });
};
const addSurveyAnswers = ({ body }) => {
  return axios({
    method: "POST",
    url: url + "addSurveyAnswers",
    data: body,
  });
};
const getSurveyQuestionsAnswers = ({ surveyId }) => {
  return axios({
    method: "GET",
    url: url + "getSurveyQuestionsAnswers/" + surveyId,
  });
};
const addDate = ({ body }) => {
  return axios({
    method: "POST",
    url: url + "test",
    data: body,
  });
};
const updateUserLanguage = ({ body }) => {
  return axios({
    method: "PUT",
    url: url + "updateUserLanguage",
    data: body,
  });
};
const getDate = () => {
  return axios({
    method: "GET",
    url: url + "getTest",
  });
};
const getHealthProfessionals = ({
  userFk,
  pageNumber,
  recordsByPage,
  searchText,
}) => {
  return axios({
    method: "GET",
    url:
      url +
      "getHealthProfessionals/" +
      userFk +
      "/" +
      pageNumber +
      "/" +
      recordsByPage +
      "/" +
      searchText,
  });
};
const getUserStatistics = ({ userFk }) => {
  return axios({
    method: "GET",
    url: url + "getUserStatistics/" + userFk,
  });
};
const getUserAppointmentsStatistics = ({ userFk, fromDate, toDate }) => {
  return axios({
    method: "GET",
    url:
      url +
      "getUserAppointmentsStatistics/" +
      userFk +
      "/" +
      fromDate +
      "/" +
      toDate,
  });
};
const getMedicalInformation = ({ userFk }) => {
  return axios({
    method: "GET",
    url: url + "getMedicalInformation/" + userFk,
  });
};
const getUser = ({ userFk }) => {
  return axios({
    method: "GET",
    url: url + "getUser/" + userFk,
  });
};
const getTranslations = ({ lng }) => {
  return axios({
    method: "GET",
    url: url + "getTranslations/" + lng,
  });
};
const setMedicalInformation = ({ body }) => {
  return axios({
    method: "PUT",
    url: url + "setMedicalInformation",
    data: body,
  });
};

export const userController = {
  updateUserLanguage,
  getTranslations,
  getUser,
  updateProfilePicture,
  deleteReservationSlotBySlot,
  isSlotReservedByUser,
  setMedicalInformation,
  getMedicalInformation,
  getUserAppointmentsStatistics,
  getUserStatistics,
  getHealthProfessionals,
  getDate,
  addDate,
  getSpecialities,
  getGeneralStatistics,
  registerUser,
  checkToken,
  approveUser,
  verifyUser,
  generateToken,
  loginUser,
  updatePassword,
  forgetPassword,
  getReservationSlots,
  deleteReservationSlotByReservationId,
  addReservationSlot,
  getUserFeedbacks,
  getAllFeedbacks,
  deleteFavorite,
  deleteFeedback,
  addFeedback,
  addFavorite,
  getFavorites,
  deleteCommunityPost,
  updateCommunityPost,
  addCommunityPost,
  updateAppointment,
  registerAppointment,
  getCommunityPosts,
  addCommunityPostComment,
  getCommunityPostComment,
  updateCommunityPostComment,
  deleteCommunityPostComment,
  deleteSubscription,
  subscribe,
  updateUser,
  postponeAppointment,
  contactUs,
  updateNotification,
  deleteAllNotifications,
  deleteNotifications,
  getNotifications,
  getBlogs,
  addBlog,
  deleteBlogs,
  updateBlog,
  addSurveyQuestionsAnswers,
  getSurvey,
  addSurvey,
  addSurveyAnswers,
  getSurveyQuestionsAnswers,
  getMessages
};
