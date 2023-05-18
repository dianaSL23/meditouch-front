import { useDispatch, useSelector } from "react-redux";

import {
  Row,
  Col,
  Card,
  Button,
  Descriptions,
  Avatar,
  Switch,
  
} from "antd";



import BgProfile from "../assets/images/patientBG.PNG";

import Main from "../components/layout/Main";
import avatar from "../assets/images/avatar.jpg";
import { UploadOutlined } from "@ant-design/icons";
import { businessAccountController } from "../controllers/businessAccountController";
import { useNavigate } from "react-router-dom";
import { userController } from "../controllers/userController";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
function UserProfile() {
  const dispatch = useDispatch();
  const [t, i18n] = useTranslation();
  const userData = useSelector((state) => state);
  const navigate = useNavigate();
  async function upload(file) {
    const pic = file.target.files[0];
    if (pic) {
      const reader = new FileReader();

      reader.onload = (event) => {
        let base64 = event.target.result;
        userController
          .updateProfilePicture({
            body: {
              userId: userData.userInfo.userId,
              profilePicture: base64,
            },
          })
          .then(() => {
            let userInfo = { ...userData.userInfo };
            userInfo.profilePicture = base64;
            dispatch({
              type: "SET_USER_INFO",
              userInfo: userInfo,
            });
          });
      };
      reader.readAsDataURL(pic);
    }
  }

  function deletepic() {
    userController
      .updateProfilePicture({
        body: {
          userId: userData.userInfo.userId,
          profilePicture: "",
        },
      })
      .then(() => {
        let userInfo = { ...userData.userInfo };
        userInfo.profilePicture = "";
        dispatch({
          type: "SET_USER_INFO",
          userInfo: userInfo,
        });
      });
  }

  function updateNotificationsSettings(key, value) {
    let tempNotificationSettings = { ...userData.notificationSettings };
    tempNotificationSettings[key] = value;
    dispatch({
      type: "SET_NOTIFCATION_SETTINGS",
      notificationSettings: tempNotificationSettings,
    });
    businessAccountController
      .updateNotificationsSettings({
        body: tempNotificationSettings,
        userFk: userData.userInfo.userId,
      })
      .then(() => {
        toast.success("done", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
        });
      });
  }

  return (
    <Main>
      <div
        className="profile-nav-bg"
        style={{
          backgroundImage: "url(" + BgProfile + ")",
          height: "500px",
          width: "100%",
          
        }}
      ></div>

      <Card
        className="card-profile-head"
        bodyStyle={{ display: "none" }}
        title={
          <Row justify="space-between" align="middle" gutter={[24, 0]}>
            <Col span={24} md={12} className="col-info ">
              <Avatar.Group>
                <Avatar
                  size={74}
                  shape="square"
                  src={
                    userData.userInfo
                      ? userData.userInfo.profilePicture !== "" &&
                        userData.userInfo.profilePicture !== -1
                        ? userData.userInfo.profilePicture
                        : avatar
                      : avatar
                  }
                />

                <div className="avatar-info">
                  <h4 className="font-semibold m-0">
                    {userData.userInfo?.firstName +
                      " " +
                      userData.userInfo?.lastName}
                  </h4>
                </div>
              </Avatar.Group>
            </Col>
            <Col
              span={24}
              md={12}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <div className="d-flex">
                <div
                  style={{
                    position: "relative",
                    width: "100px",
                    height: "40px",
                  }}
                >
                  <input
                    style={{
                      zIndex: 1,
                      position: "absolute",
                      left: 0,
                      top: 0,
                      opacity: 0,
                      width: "100px",
                      height: "100%",
                    }}
                    type="file"
                    accept="image/*"
                    onChange={(e) => upload(e)}
                  />
                  <Button
                    style={{ position: "absolute", left: 0, top: 0, zIndex: 0 }}
                    icon={<UploadOutlined />}
                    className="d-flex align-items-center "
                  >
                     {t("upload")}
                  </Button>
                </div>
                {userData.userInfo &&
                  userData.userInfo?.profilePicture !== "" &&
                  userData.userInfo.profilePicture !== -1 && (
                    <Button onClick={() => deletepic()}  className="ms-3 me-1">  {t("delete")}</Button>
                  )}
                {userData.userInfo &&
                  !userData.userInfo.businessAccountInfo && (
                    <Button
                      onClick={() => navigate("/patient-details")}
                      type="primary"
                      className="ms-2 d-flex align-items-center"
                      icon={<UploadOutlined />}
                    >
                       {t("edit_profile")}
                    </Button>
                  )}
              </div>
            </Col>
          </Row>
        }
      ></Card>

      <Row gutter={[24, 0]} justify="center">
        <Col xs={{ span: 24 }} lg={{ span: 12 }} md={{ span: 12 }} className="mb-24">
          <Card
            bordered={false}
            title={<h6 className="font-semibold m-0">{t("profile_info")}</h6>}
            className="header-solid h-full card-profile-information"
            extra={<Button type="link">{}</Button>}
            bodyStyle={{ paddingTop: 0 }}
          >
            <hr className="my-25" />
            <Descriptions title="">
              <Descriptions.Item label={t("full_name")}  span={3}>
                {userData.userInfo?.firstName +
                  " " +
                  userData.userInfo?.lastName}
              </Descriptions.Item>

              <Descriptions.Item label={t("email")} span={3}>
                {userData.userInfo?.userEmail}
              </Descriptions.Item>
              <Descriptions.Item label={t("height")}  span={3}>
                {userData.userMedicalInfo?.height + " cm"}
              </Descriptions.Item>
              <Descriptions.Item label={t("weight")}  span={3}>
                {userData.userMedicalInfo?.weight + " kg"}
              </Descriptions.Item>
              <Descriptions.Item label={t("vaccination")} span={3}>
                {userData.userMedicalInfo?.vaccinationDescription}
              </Descriptions.Item>
              <Descriptions.Item label={t("diseases")}  span={3}>
                {userData.userMedicalInfo?.diseasesDescription}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
        <Col xs={{ span: 24 }} lg={{ span: 12 }} md={{ span: 12 }} className="mb-24 ">
          <Card
            bordered={false}
            className="header-solid h-full"
            title={<h6 className="font-semibold m-0">{t("User_Notifications")}</h6>}
          >
            <ul className="list settings-list">
              <li>
                <h6 className="list-header text-sm text-muted m-0">
                {t("application")}
                </h6>
              </li>

              <li>
                <Switch
                  onChange={(e) =>
                    updateNotificationsSettings("onAddFeatureEmail", e)
                  }
                  checked={userData.notificationSettings.onAddFeatureEmail}
                />
                <span>{t("user_notification_4")}</span>
              </li>

              <li>
                <h6 className="list-header text-sm text-muted m-0">
                {t("reminders")}
                </h6>
              </li>
              <li>
                <Switch
                  onChange={(e) =>
                    updateNotificationsSettings("onAppointmentReminder", e)
                  }
                  checked={userData.notificationSettings.onAppointmentReminder}
                />
                <span>{t("user_notification_6")}</span>
              </li>
            </ul>
          </Card>
        </Col>
      </Row>
    </Main>
  );
}

export default UserProfile;
