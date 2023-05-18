import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Layout,
  Button,
  Row,
  Col,
  Form,
  Input,
  Switch,
  Spin,
} from "antd";
import signinbg from "../assets/images/login.jpg";

import { userController } from "../controllers/userController";
import { useDispatch } from "react-redux";
import { businessAccountController } from "../controllers/businessAccountController";
import { EncryptStorage } from "encrypt-storage";
import LayoutWrapper from "../components/Layout";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
toast.configure();
const { Header, Footer, Content } = Layout;

export default function SignIn() {
  const encryptStorage1 = new EncryptStorage("secret-key", {
    prefix: "@instance1",
  });
  const [t, i18n] = useTranslation();
  const [signingIn, setSigningIn] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userForm, setUserForm] = useState({
    userEmail: "",
    password: "",
  });
  function updateUser(key, value) {
    let tempUser = { ...userForm };
    tempUser[key] = value;
    setUserForm(tempUser);
  }
  useEffect(() => {
    let user = encryptStorage1.getItem("meditouch_user");
    if (user) {
      navigate("/dashboard");
    }
  }, []);

  const content = (
    <Content className="signin">
      <Row justify="center" className="d-flex align-items-center justify-content-evenly">
        <Col xs={{ span: 24 }} lg={{ span: 12 }} md={{ span: 12 }}>
          <img src={signinbg} alt="" className="signup-image" />
        </Col>
        <Col
          xs={{ span: 24, offset: 0 }}
          lg={{ span: 6, offset: 2 }}
          md={{ span: 12 }}
          className="signin-wrapper"
        >
          <div className="text-center forgotPass-txt mb-4"> {t("Login")}</div>

          <Form
            onSubmitCapture={(e) => {
              e.preventDefault();
            }}
            layout="vertical"
            className="row-col"
          >
            <Form.Item
              className="username"
              label={t("email")}
              name="email"
              rules={[
                {
                  required: true,
                  message: t("input_ur_email_error"),
                },
              ]}
            >
              <Input
                onChange={(e) => updateUser("userEmail", e.target.value)}
                placeholder={t("email")}
              />
            </Form.Item>

            <Form.Item
              className="username"
              label={t("Password")}
              name="password"
              rules={[
                {
                  required: true,
                  message:t("input_ur_pass_error"),
                },
              ]}
            >
              <Input
                onChange={(e) => updateUser("password", e.target.value)}
                type="password"
                placeholder={t("Password")}
              />
            </Form.Item>

            <Form.Item
              name="remember"
              className="aligin-center"
              valuePropName="checked"
            >
              <Switch defaultChecked />
              {t("Remember_me")}
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="button"
                onClick={(e) => {
                  e.preventDefault();
                  if (
                    userForm.userEmail.replace(/\s+/g, "") !== "" &&
                    userForm.password.replace(/\s+/g, "") !== ""
                  ) {
                    setSigningIn(true);
                    userController
                      .loginUser({
                        body: userForm,
                      })
                      .then((response) => {
                        let data = response.data;
                        if (data.responseCode === -1) {
                          toast.error(data.message, {
                            position: "top-center",
                            autoClose: 5000,
                            hideProgressBar: true,
                            closeOnClick: true,
                            pauseOnHover: false,
                            draggable: false,
                          });

                          setSigningIn(false);

                          return;
                        }
                        dispatch({
                          type: "SET_USER_INFO",
                          userInfo: data.user,
                        });

                        if (data.user.userRole === "HEALTH_PROFESSIONAL") {
                          businessAccountController
                            .getBusinessAccount({
                              userId: data.user.userId,
                            })
                            .then((res) => {
                              let businessData = res.data;
                              dispatch({
                                type: "SET_BUSINESS_ACCOUNT_INFO",
                                businessAccountInfo:
                                  businessData.businessAccount,
                              });
                              encryptStorage1.setItem("meditouch_user", {
                                userInfo: data.user,
                                businessAccountInfo:
                                  businessData.businessAccount,
                              });
                              setSigningIn(false);
                              navigate("/dashboard");
                            });
                        } else {
                          userController
                            .getMedicalInformation({ userFk: data.user.userId })
                            .then((response) => {
                              dispatch({
                                type: "SET_MEDICAL_INFO",
                                userMedicalInfo:
                                  response.data.medical_information,
                              });
                            });
                          encryptStorage1.setItem("meditouch_user", {
                            userInfo: data.user,
                            businessAccountInfo:
                              data.user.userRole === "ADMIN" ? -2 : -1,
                          });
                        
                          toast.success("You have successfully logged in!", {
                            position: "top-center",
                            autoClose: 5000,
                            hideProgressBar: true,
                            closeOnClick: true,
                            pauseOnHover: false,
                            draggable: false,
                          });
                          setSigningIn(false);
                          navigate("/dashboard");
                        }
                      });
                  }
                }}
                style={{ width: "100%" }}
              >
                    {t("sign_in")}
              </Button>
            </Form.Item>
            <div className="d-flex justify-content-between flex-column">
              <div
                className="d-flex align-items-center"
                style={{ gap: "10px" }}
              >
                <p className="font-semibold text-muted">
                  <Link to="/forget-password" className="signin-txt">
                  {t("Forget_Password")}
                  </Link>
                </p>

                <p className="font-semibold text-muted">
                  <Link to="/verify" className="signin-txt">
                  {t("Verify_Account")}
                  </Link>
                </p>
              </div>
              <p className="font-semibold text-muted">
              {t("Dont_have_an_account")}
                <Link
                  to="/sign-up"
                  className="signin-txt ms-2"
                  style={{ textDecoration: "underline" }}
                >
                  {t("Sign_Up")}
                </Link>
              </p>
            </div>
          </Form>
        </Col>
      </Row>
    </Content>
  );
  return (
    <LayoutWrapper style={{ position: "relative" }} withFooter={true}>
      <Layout
        className="layout-default layout-signin"
        style={{ padding: "100px" }}
      >
        {signingIn ? <Spin tip="Loading...">{content}</Spin> : content}
      </Layout>
    </LayoutWrapper>
  );
}
