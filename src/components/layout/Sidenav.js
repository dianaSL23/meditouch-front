import { Menu } from "antd";
import { EncryptStorage } from "encrypt-storage";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import logo from "../../assets/images/healthcare.png";
import { useTranslation } from "react-i18next";

function Sidenav({ color }) {
  const { pathname } = useLocation();
  const page = pathname.replace("/", "");
  const encryptStorage1 = new EncryptStorage("secret-key", {
    prefix: "@instance1",
  });
  const [t, i18n] = useTranslation();
  const navigate = useNavigate();
  function handleLogout() {
    encryptStorage1.removeItem("meditouch_user");
    navigate("/");
  }
  const userData = useSelector((state) => state);
  const dashboard = [
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
      key={0}
    >
      <path
        d="M3 4C3 3.44772 3.44772 3 4 3H16C16.5523 3 17 3.44772 17 4V6C17 6.55228 16.5523 7 16 7H4C3.44772 7 3 6.55228 3 6V4Z"
        fill={color}
      ></path>
      <path
        d="M3 10C3 9.44771 3.44772 9 4 9H10C10.5523 9 11 9.44771 11 10V16C11 16.5523 10.5523 17 10 17H4C3.44772 17 3 16.5523 3 16V10Z"
        fill={color}
      ></path>
      <path
        d="M14 9C13.4477 9 13 9.44771 13 10V16C13 16.5523 13.4477 17 14 17H16C16.5523 17 17 16.5523 17 16V10C17 9.44771 16.5523 9 16 9H14Z"
        fill={color}
      ></path>
    </svg>,
  ];

  const tables = [
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      key={0}
    >
      <path
        d="M9 2C8.44772 2 8 2.44772 8 3C8 3.55228 8.44772 4 9 4H11C11.5523 4 12 3.55228 12 3C12 2.44772 11.5523 2 11 2H9Z"
        fill={color}
      ></path>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4 5C4 3.89543 4.89543 3 6 3C6 4.65685 7.34315 6 9 6H11C12.6569 6 14 4.65685 14 3C15.1046 3 16 3.89543 16 5V16C16 17.1046 15.1046 18 14 18H6C4.89543 18 4 17.1046 4 16V5ZM7 9C6.44772 9 6 9.44772 6 10C6 10.5523 6.44772 11 7 11H7.01C7.56228 11 8.01 10.5523 8.01 10C8.01 9.44772 7.56228 9 7.01 9H7ZM10 9C9.44772 9 9 9.44772 9 10C9 10.5523 9.44772 11 10 11H13C13.5523 11 14 10.5523 14 10C14 9.44772 13.5523 9 13 9H10ZM7 13C6.44772 13 6 13.4477 6 14C6 14.5523 6.44772 15 7 15H7.01C7.56228 15 8.01 14.5523 8.01 14C8.01 13.4477 7.56228 13 7.01 13H7ZM10 13C9.44772 13 9 13.4477 9 14C9 14.5523 9.44772 15 10 15H13C13.5523 15 14 14.5523 14 14C14 13.4477 13.5523 13 13 13H10Z"
        fill={color}
      ></path>
    </svg>,
  ];

  const billing = [
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      key={0}
    >
      <path
        d="M4 4C2.89543 4 2 4.89543 2 6V7H18V6C18 4.89543 17.1046 4 16 4H4Z"
        fill={color}
      ></path>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18 9H2V14C2 15.1046 2.89543 16 4 16H16C17.1046 16 18 15.1046 18 14V9ZM4 13C4 12.4477 4.44772 12 5 12H6C6.55228 12 7 12.4477 7 13C7 13.5523 6.55228 14 6 14H5C4.44772 14 4 13.5523 4 13ZM9 12C8.44772 12 8 12.4477 8 13C8 13.5523 8.44772 14 9 14H10C10.5523 14 11 13.5523 11 13C11 12.4477 10.5523 12 10 12H9Z"
        fill={color}
      ></path>
    </svg>,
  ];
  const logout = [
    <svg
      width="55"
      height="52"
      viewBox="0 0 55 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 26.9101C12.19 25.9801 12.33 25.0301 12.59 24.1201C13.1399 22.1115 14.0964 20.2372 15.4003 18.6134C16.7042 16.9896 18.3276 15.6508 20.17 14.6801C20.36 14.5701 20.56 14.4901 20.86 14.3501C20.86 16.0101 20.86 17.6001 20.86 19.1801C20.86 19.3901 20.6 19.6201 20.41 19.7901C19.0988 20.8812 18.0594 22.2624 17.3739 23.8244C16.6884 25.3863 16.3755 27.0864 16.46 28.7901C16.5956 31.2987 17.5737 33.6883 19.236 35.572C20.8983 37.4557 23.1477 38.7235 25.62 39.1701C27.112 39.4367 28.643 39.3921 30.117 39.0391C31.591 38.686 32.9761 38.0322 34.1855 37.1186C35.3948 36.205 36.4023 35.0514 37.1448 33.73C37.8873 32.4087 38.3486 30.9481 38.5 29.4401C38.737 27.6609 38.5139 25.8507 37.8522 24.1824C37.1904 22.514 36.112 21.043 34.72 19.9101C34.5226 19.7561 34.3657 19.5563 34.2629 19.3281C34.1601 19.0998 34.1144 18.8499 34.13 18.6001C34.13 17.2201 34.13 15.8401 34.13 14.3701C35.4475 14.938 36.6609 15.7222 37.72 16.6901C40.6415 19.2001 42.4855 22.7377 42.87 26.5701C42.8993 26.7358 42.9394 26.8995 42.99 27.0601V29.5701C42.93 29.9001 42.87 30.2301 42.82 30.5701C42.2784 34.1209 40.5203 37.3735 37.8463 39.7718C35.1723 42.1701 31.7483 43.5652 28.1596 43.7187C24.571 43.8722 21.0404 42.7746 18.1713 40.6134C15.3023 38.4523 13.2729 35.3617 12.43 31.8701C12.26 31.1101 12.14 30.3401 11.99 29.5801L12 26.9101ZM27.06 8.31006C26.565 8.42773 26.1234 8.70688 25.8047 9.10343C25.486 9.49999 25.3084 9.99138 25.3 10.5001C25.3 14.9501 25.3 19.4001 25.3 23.8501C25.3144 24.1403 25.3859 24.4248 25.5103 24.6874C25.6347 24.95 25.8096 25.1855 26.0251 25.3805C26.2405 25.5756 26.4922 25.7262 26.7659 25.8239C27.0395 25.9216 27.3298 25.9645 27.62 25.9501C27.9102 25.9356 28.1947 25.8641 28.4573 25.7397C28.7199 25.6153 28.9555 25.4404 29.1505 25.225C29.3455 25.0096 29.4961 24.7578 29.5939 24.4842C29.6916 24.2105 29.7344 23.9203 29.72 23.6301C29.72 19.4501 29.72 15.2701 29.72 11.0901C29.7964 10.4901 29.6588 9.88247 29.3314 9.37398C29.004 8.8655 28.5078 8.48876 27.93 8.31006H27.06Z" />
    </svg>,
  ];
  const rtl = [
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      key={0}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3 6C3 4.34315 4.34315 3 6 3H16C16.3788 3 16.725 3.214 16.8944 3.55279C17.0638 3.89157 17.0273 4.29698 16.8 4.6L14.25 8L16.8 11.4C17.0273 11.703 17.0638 12.1084 16.8944 12.4472C16.725 12.786 16.3788 13 16 13H6C5.44772 13 5 13.4477 5 14V17C5 17.5523 4.55228 18 4 18C3.44772 18 3 17.5523 3 17V6Z"
        fill={color}
      ></path>
    </svg>,
  ];

  const profile = [
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      key={0}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18 10C18 14.4183 14.4183 18 10 18C5.58172 18 2 14.4183 2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10ZM12 7C12 8.10457 11.1046 9 10 9C8.89543 9 8 8.10457 8 7C8 5.89543 8.89543 5 10 5C11.1046 5 12 5.89543 12 7ZM9.99993 11C7.98239 11 6.24394 12.195 5.45374 13.9157C6.55403 15.192 8.18265 16 9.99998 16C11.8173 16 13.4459 15.1921 14.5462 13.9158C13.756 12.195 12.0175 11 9.99993 11Z"
        fill={color}
      ></path>
    </svg>,
  ];

  const signin = [
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      key={0}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6 2C5.44772 2 5 2.44772 5 3V4H4C2.89543 4 2 4.89543 2 6V16C2 17.1046 2.89543 18 4 18H16C17.1046 18 18 17.1046 18 16V6C18 4.89543 17.1046 4 16 4H15V3C15 2.44772 14.5523 2 14 2C13.4477 2 13 2.44772 13 3V4H7V3C7 2.44772 6.55228 2 6 2ZM6 7C5.44772 7 5 7.44772 5 8C5 8.55228 5.44772 9 6 9H14C14.5523 9 15 8.55228 15 8C15 7.44772 14.5523 7 14 7H6Z"
        fill={color}
      ></path>
    </svg>,
  ];

  return (
    <>
      <div className="brand d-flex align-items-center">
        <NavLink to="/">
          <img src={logo} alt="" style={{
            filter: "invert(51%) sepia(26%) saturate(7287%) hue-rotate(190deg) brightness(98%) contrast(108%)"
          }} 
          className="me-2"
          />
        </NavLink>
        <span>MediTouch Dashboard</span>
      </div>
      <hr />
      <Menu theme="light" mode="inline">
        <Menu.Item key="1">
          <NavLink to="/dashboard">
            <span
              className="icon"
              style={{
                background: page === "dashboard" ? color : "",
              }}
            >
              {dashboard}
            </span>
            <span className="label"> {t("dashboard")}</span>
          </NavLink>
        </Menu.Item>
        {userData.userInfo?.userRole !== "ADMIN" && (
          <Menu.Item key="2">
            <NavLink to="/appointments">
              <span
                className="icon"
                style={{
                  background: page === "appointments" ? color : "",
                }}
              >
                {tables}
              </span>
              <span className="label">{t("appointments")}</span>
            </NavLink>
          </Menu.Item>
        )}

        <Menu.Item key="11">
          <NavLink to="/community-posts">
            <span
              className="icon"
              style={{
                background: page === "community-posts" ? color : "",
              }}
            >
              {billing}
            </span>
            <span className="label">{t("community_posts")}</span>
          </NavLink>
        </Menu.Item>
    
        {userData.userInfo?.userRole === "HEALTH_PROFESSIONAL" && (
          <Menu.Item key="4">
            <NavLink to="/patients">
              <span
                className="icon"
                style={{
                  background: page === "patients" ? color : "",
                }}
              >
                {rtl}
              </span>
              <span className="label">{t("patients")}</span>
            </NavLink>
          </Menu.Item>
        )}
        {userData.userInfo?.userRole === "HEALTH_PROFESSIONAL" && (
          <Menu.Item key="4">
            <NavLink to="/referrals">
              <span
                className="icon"
                style={{
                  background:
                    page === "referrals" || page === "appointment-details"
                      ? color
                      : "",
                }}
              >
                {rtl}
              </span>
              <span className="label">{t("Referrals")}</span>
            </NavLink>
          </Menu.Item>
        )}

        {userData.userInfo?.userRole !== "ADMIN" && (
          <Menu.Item className="menu-item-header" key="5">
           {t("account_settings")}
          </Menu.Item>
        )}
        {userData.userInfo?.userRole !== "ADMIN" && (
          <Menu.Item key="6">
            <NavLink
              to={
                userData.userInfo?.userRole === "PATIENT"
                  ? "/user-profile"
                  : "/profile"
              }
            >
              <span
                className="icon"
                style={{
                  background: page === "profile" ? color : "",
                }}
              >
                {profile}
              </span>
              <span className="label">{t("profile")}</span>
            </NavLink>
          </Menu.Item>
        )}
        {userData.userInfo?.userRole === "PATIENT" && (
          <Menu.Item key="7">
            <NavLink to="/reservation-slots">
              <span className="icon">{signin}</span>
              <span className="label">{t("reservation_slots")}</span>
            </NavLink>
          </Menu.Item>
        )}

        {userData.userInfo?.userRole === "HEALTH_PROFESSIONAL" && (
          <Menu.Item key="7">
            <NavLink to="/schedule">
              <span className="icon">{signin}</span>
              <span className="label">{t("schedule")}</span>
            </NavLink>
          </Menu.Item>
        )}
  {userData.userInfo?.userRole === "HEALTH_PROFESSIONAL" && (
          <Menu.Item key="9">
        <Menu.Item className="menu-item-header" key="8">
        {t("live_settings")}
        </Menu.Item>

      
            <NavLink to="/live-clinic">
              <span
                className="icon"
                style={{
                  background: page === "live-clinic" ? color : "",
                }}
              >
                {profile}
              </span>
              <span className="label">{t("live_clinic")}</span>
            </NavLink>
          </Menu.Item>
        )}

        <Menu.Item key="12" onClick={handleLogout}>
          <NavLink>
            <span className="icon">{logout}</span>
            <span className="label">{t("logout")}</span>
          </NavLink>
        </Menu.Item>
      </Menu>
    </>
  );
}

export default Sidenav;
