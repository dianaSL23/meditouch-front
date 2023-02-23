const data = {
  userInfo: null,
  businessAccountInfo: null,
};
const reducer = (state = data, action) => {
  switch (action.type) {
    case "SET_USER_INFO":
      return {
        ...state,
        userInfo: action.userInfo,
      };
    case "SET_BUSINESS_ACCOUNT_INFO":
      return {
        ...state,
        businessAccountInfo: action.businessAccountInfo,
      };
    default:
      return state;
  }
};
export default reducer;
