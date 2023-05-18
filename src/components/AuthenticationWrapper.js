import { Spin } from "antd";
import { EncryptStorage } from "encrypt-storage";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { userController } from "../controllers/userController";

export default function AuthenticationWrapper({ children }) {
  const userData = useSelector((state) => state);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const encryptStorage1 = new EncryptStorage("secret-key", {
    prefix: "@instance1",
  });
  const [t, i18n] = useTranslation();

  useEffect(() => {
    let user = encryptStorage1.getItem("meditouch_user");
    if (user) {
      if (userData.userInfo === null) {
        let userInfo = user.userInfo;
        userController
          .getUser({ userFk: userInfo.userId })
          .then((response) => {
            userInfo.profilePicture = response.data.user.profilePicture;
            dispatch({
              type: "SET_USER_INFO",
              userInfo: userInfo,
            });
            userInfo.userLanguage = response.data.user.userLanguage;
            encryptStorage1.setItem("meditouch_user", {
              userInfo: userInfo,
              businessAccountInfo: user.businessAccountInfo,
            });
          })
          .then(() => {
            let userInfo = user.userInfo;

            if (userInfo.userRole === "PATIENT") {
              if (!userData.userMedicalInfo.loaded) {
                userController
                  .getMedicalInformation({ userFk: userInfo.userId })
                  .then((response) => {
                    let data = response.data.medical_information;
                    dispatch({
                      type: "SET_MEDICAL_INFO",
                      userMedicalInfo: { ...data, loaded: true },
                    });
                  })
                  .then(() => {
                    setLoading(false);
                    dispatch({
                      type: "SET_LOADING_APP",
                      loadingApp: false,
                    });
                  });
              } else {
                setLoading(false);
                dispatch({
                  type: "SET_LOADING_APP",
                  loadingApp: false,
                });
              }
            } else {
              if (userData.businessAccountInfo === null) {
                dispatch({
                  type: "SET_BUSINESS_ACCOUNT_INFO",
                  businessAccountInfo:
                    encryptStorage1.getItem("meditouch_user")
                      .businessAccountInfo,
                });
                setLoading(false);
                dispatch({
                  type: "SET_LOADING_APP",
                  loadingApp: false,
                });
              } else {
                setLoading(false);
                dispatch({
                  type: "SET_LOADING_APP",
                  loadingApp: false,
                });
              }
            }
          });
      } else {
        setLoading(false);
        dispatch({
          type: "SET_LOADING_APP",
          loadingApp: false,
        });
      }
    } else {
      setLoading(false);
      dispatch({
        type: "SET_LOADING_APP",
        loadingApp: false,
      });
      // navigate("/sign-in");
    }
  }, []);
  return loading ? (
    <Spin className="" tip="Loading...">
      {children}
    </Spin>
  ) : (
    children
  );
}
