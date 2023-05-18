import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Layout, Drawer, Affix } from "antd";
import Sidenav from "./Sidenav";
import Header from "./Header";

import { useDispatch, useSelector } from "react-redux";
import { EncryptStorage } from "encrypt-storage";
import { businessAccountController } from "../../controllers/businessAccountController";
import AuthenticationWrapper from "../AuthenticationWrapper";
import { useTranslation } from "react-i18next";

const { Header: AntHeader, Content, Sider } = Layout;

function Main({ children }) {
  const navigate = useNavigate();
  const userData = useSelector((state) => state);
  const dispatch = useDispatch();
  const encryptStorage1 = new EncryptStorage("secret-key", {
    prefix: "@instance1",
  });
  const [visible, setVisible] = useState(false);
  const [placement, setPlacement] = useState("right");
  const [sidenavColor, setSidenavColor] = useState("#1890ff");
  const [sidenavType, setSidenavType] = useState("transparent");
  const [fixed, setFixed] = useState(false);

  const openDrawer = () => setVisible(!visible);
  const handleSidenavType = (type) => setSidenavType(type);
  const handleSidenavColor = (color) => setSidenavColor(color);
  const handleFixedNavbar = (type) => setFixed(type);
  const [t, i18n] = useTranslation();

  let { pathname } = useLocation();
  pathname = pathname.replace("/", "");

  useEffect(() => {
    if (i18n.language === "en") {
      setPlacement("left");
    } else {
      setPlacement("right");
    }
  }, [pathname]);
  useEffect(() => {
    let user = encryptStorage1.getItem("meditouch_user");
    if (user) {
      if (userData.userInfo === null) {
        dispatch({
          type: "SET_USER_INFO",
          userInfo: encryptStorage1.getItem("meditouch_user").userInfo,
        });
      }

      if (user.businessAccountInfo) {
        if (userData.businessAccountInfo === null) {
          dispatch({
            type: "SET_BUSINESS_ACCOUNT_INFO",
            businessAccountInfo:
              encryptStorage1.getItem("meditouch_user").businessAccountInfo,
          });
        }
      }
    } else {
      navigate("/sign-in");
    }
  }, []);
  useEffect(() => {
    if (userData.userInfo) {
      if (
        userData.userInfo.userRole !== "ADMIN" &&
        userData.notificationSettings.onReferral === -1
      ) {
        businessAccountController
          .getNotificationsSettings({ userFk: userData.userInfo.userId })
          .then((response) => {
            let data = response.data.notificationsSettings;
            dispatch({
              type: "SET_NOTIFCATION_SETTINGS",
              notificationSettings: data,
            });
          });
      }
    }
  }, [userData.userInfo]);

  return (
    <AuthenticationWrapper>
      <Layout
    
        className={`layout-dashboard ${
          pathname === "profile" ? "layout-profile" : ""
        } ${placement === "right" ? "layout-dashboard-rtl" : ""}`}
      >
        <Drawer
          title={false}
          placement={placement === "right" ? "left" : "right"}
          closable={false}
          onClose={() => setVisible(false)}
          visible={visible}
          key={placement === "right" ? "left" : "right"}
          width={250}
          className={`drawer-sidebar ${
            pathname === "rtl" ? "drawer-sidebar-rtl" : ""
          } `}
        >
          <Layout
            className={`layout-dashboard ${
              pathname === "rtl" ? "layout-dashboard-rtl" : ""
            }`}
          >
            <Sider
              trigger={null}
              width={250}
              theme="light"
              className={`sider-primary ant-layout-sider-primary ${
                sidenavType === "#fff" ? "active-route" : ""
              }`}
              style={{ background: sidenavType }}
            >
              <Sidenav color={sidenavColor} />
            </Sider>
          </Layout>
        </Drawer>
        <Sider
          breakpoint="lg"
          collapsedWidth="0"
          onCollapse={(collapsed, type) => {
            // console.log(collapsed, type);
          }}
          trigger={null}
          width={250}
          theme="light"
          className={`sider-primary ant-layout-sider-primary ${
            sidenavType === "#fff" ? "active-route" : ""
          }`}
          style={{ background: sidenavType }}
        >
          <Sidenav color={sidenavColor} />
        </Sider>
        <Layout>
          {fixed ? (
            <Affix>
              <AntHeader className={`${fixed ? "ant-header-fixed" : ""}`}>
                <Header
                  onPress={openDrawer}
                  name={pathname}
                  subName=""
                  handleSidenavColor={handleSidenavColor}
                  handleSidenavType={handleSidenavType}
                  handleFixedNavbar={handleFixedNavbar}
                />
              </AntHeader>
            </Affix>
          ) : (
            <AntHeader className={`${fixed ? "ant-header-fixed" : ""}`}>
              <Header
                onPress={openDrawer}
                name={pathname}
                subName=""
                handleSidenavColor={handleSidenavColor}
                handleSidenavType={handleSidenavType}
                handleFixedNavbar={handleFixedNavbar}
              />
            </AntHeader>
          )}
          <Content className="content-ant">{children}</Content>
        </Layout>
      </Layout>
    </AuthenticationWrapper>
  );
}

export default Main;
