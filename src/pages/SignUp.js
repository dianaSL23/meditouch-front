import React, { useState } from "react";
import signinbg from "../assets/images/signup.png";
import {
  Layout,
  Button,
  Typography,
  Card,
  Form,
  Input,
  Checkbox,
  Select,
  Row,
  Col,
} from "antd";

import { Link, useNavigate } from "react-router-dom";

import { userController } from "../controllers/userController";
import LayoutWrapper from "../components/Layout";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const { Header, Footer, Content } = Layout;

export default function SignUp() {
  const [t, i18n] = useTranslation();
  const navigate = useNavigate();
  const { Option } = Select;
  const [userForm, setUserForm] = useState({
    firstName: "",
    lastName: "",
    userEmail: "",
    password: "",
    userRole: "",
    userLanguage: "",
    profilePicture: "",
  });
  function updateUser(key, value) {
    let tempUser = { ...userForm };
    tempUser[key] = value;
    setUserForm(tempUser);
  }
  return (
    <LayoutWrapper style={{ position: "relative" }} withFooter={true}>
      <div
        className="layout-default ant-layout layout-sign-up"
        style={{ marginTop: "100px", padding: "100px" }}
      >
        <Content className="p-0 ">
          <Row justify="center" >
            <Col xs={{ span: 24 }} lg={{ span: 12 }} md={{ span: 12 }} >
              <img src={signinbg} alt="" />
            </Col>
            <Col
              xs={{ span: 24, offset: 0 }}
              lg={{ span: 6, offset: 2 }}
              md={{ span: 12 }}
              className="signup-wrapper"
            >
              <Card
                className="card-signup header-solid h-full ant-card pt-0"
                title={<div className="forgotPass-txt text-center">{t("register")}</div>}
                bordered="false"
              >
                <Form
                  name="basic"
                  initialValues={{ remember: true }}
                  className="row-col"
                >
                  <Form.Item
                    name="firstName"
                    rules={[
                      {
                        required: true,
                        message: t("input_ur_firstname_error"),
                      },
                    ]}
                  >
                    <Input
                      onChange={(e) => updateUser("firstName", e.target.value)}
                      placeholder={t("first_name")}
                    />
                  </Form.Item>
                  <Form.Item
                    name="lastName"
                    rules={[
                      {
                        required: true,
                        message: t("input_ur_lastname_error"),
                      },
                    ]}
                  >
                    <Input
                      onChange={(e) => updateUser("lastName", e.target.value)}
                      placeholder={t("last_name")}
                    />
                  </Form.Item>
                  <Form.Item
                    name="email"
                    rules={[
                      {
                        type: "email",
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
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: t("input_ur_pass_error"),
                      },
                    ]}
                  >
                    <Input
                      type="password"
                      onChange={(e) => updateUser("password", e.target.value)}
                      placeholder={t("Password")}
                    />
                  </Form.Item>

                  <Form.Item
                    name="userLanguage"
                    rules={[
                      {
                        required: true,
                      message: t("input_ur_language_error"),
                      },
                    ]}
                  >
                    <Select
                      defaultValue="preselect"
                      style={{ width: "100%" }}
                      onChange={(e) => updateUser("userLanguage", e)}
                    >
                      <Option value="preselect" disabled>
                      {t("select_language")}
                      </Option>

                      <Option value="en">English</Option>
                      <Option value="ar">Arabic</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name="userType"
                    rules={[
                      { required: true,    message: t("input_ur_role_error"),},
                    ]}
                  >
                    <Select
                      defaultValue="preselect"
                      style={{ width: "100%" }}
                      onChange={(e) => updateUser("userRole", e)}
                    >
                      <Option value="preselect" disabled>
                      {t("select_role")}
                      </Option>

                      <Option value="PATIENT">{t("patient")}</Option>
                      <Option value="HEALTH_PROFESSIONAL">
                      {t("doctor")}
                      </Option>
                    </Select>
                  </Form.Item>

                  <Form.Item name="remember" valuePropName="checked">
                    <Checkbox>
                    {t("agree")}
                      <a  className="font-bold text-dark ms-2">
                      {t("terms_condition")}
                      </a>
                    </Checkbox>
                  </Form.Item>

                  <Form.Item>
                    <Button
                      onClick={() => {
                        if (
                          userForm.userEmail.replace(/\s+/g, "") !== "" &&
                          userForm.password.replace(/\s+/g, "") !== "" &&
                          userForm.firstName.replace(/\s+/g, "") !== "" &&
                          userForm.lastName.replace(/\s+/g, "") !== "" &&
                          userForm.userRole.replace(/\s+/g, "") !== "" &&
                          userForm.userLanguage.replace(/\s+/g, "") !== ""
                        ) {
                          userController
                            .registerUser({
                              body: userForm,
                            })
                            .then((response) => {
                              let data = response.data;
                              if (data.responseCode !== 200) {
                                toast.error(data.message, {
                                  position: "top-center",
                                  autoClose: 5000,
                                  hideProgressBar: true,
                                  closeOnClick: true,
                                  pauseOnHover: false,
                                  draggable: false,
                                });
                                return;
                              }
                              toast.success(data.message, {
                                position: "top-center",
                                autoClose: 5000,
                                hideProgressBar: true,
                                closeOnClick: true,
                                pauseOnHover: false,
                                draggable: false,
                              });
                              navigate("/verify", {
                                state: {
                                  userFk: data.userId,
                                },
                              });
                            });
                        }
                      }}
                      style={{ width: "100%" }}
                      type="primary"
                      htmlType="submit"
                    >
                       {t("Sign_Up")}
                    </Button>
                  </Form.Item>
                </Form>
                <p className="font-semibold text-muted text-center">
                 {t("Already_have_an_account")}

                  <Link to="/sign-in" className="signin-txt ms-2" style={{textDecoration:"underline"}}>
                  {t("sign_in")}
                  </Link>
                </p>
              </Card>
            </Col>

            <Col
              style={{ padding: 12 }}
              xs={{ span: 24 }}
              lg={{ span: 12 }}
              md={{ span: 12 }}
            ></Col>
          </Row>
        </Content>
      </div>
    </LayoutWrapper>
  );
}
