import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Layout,
  Button,
  Row,
  Col,
  Typography,
  Form,
  Input,

} from "antd";

import { userController } from "../controllers/userController";
import { useDispatch } from "react-redux";
import { EncryptStorage } from "encrypt-storage";
import LayoutWrapper from "../components/Layout";
import { toast } from "react-toastify";
import img from '../assets/images/verify.jpg'
const { Title } = Typography;
const { Header, Footer, Content } = Layout;

export default function VerifyUser() {
  const [index, setIndex] = useState(0);
  const { state } = useLocation();

  const encryptStorage1 = new EncryptStorage("secret-key", {
    prefix: "@instance1",
  });
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [userForm, setUserForm] = useState({
    userEmail: "",
    token: "",
    userFk: -1,
  });
  function updateUser(key, value) {
    let tempUser = { ...userForm };
    tempUser[key] = value;
    setUserForm(tempUser);
  }
  useEffect(() => {
    if (state) {
      if (state.userFk !== null && state.userFk !== undefined) {
        updateUser("userFk", state.userFk);
      }
    }
  }, [state]);
  useEffect(() => {
    let user = encryptStorage1.getItem("meditouch_user");
    if (user) {
      navigate("/dashboard");
    }
  }, []);
  return (
    <LayoutWrapper style={{ position: "relative" }} withFooter={true}>
      <Layout
        className="layout-default layout-signin"
        style={{ marginTop: "100px", padding: "100px" }}
      >
        <Content className="signin">
          <Row justify="center" className="d-flex align-items-center justify-content-evenly"  style={{position:"relative",bottom:"100px"}}>
          <Col xs={{ span: 24 }} lg={{ span: 12 }} md={{ span: 12 }}>
                 <img src={img} alt="" className="signup-image" />
               </Col>
            <Col
            xs={{ span: 24, offset: 0 }}
            lg={{ span: 6, offset: 2 }}
            md={{ span: 12 }}
              className="signin-wrapper"
            >
              <div className="text-center forgotPass-txt">
                {userForm.userFk !== -1
                  ? "Check your email"
                  : "Enter your email"}
              </div>

              <Form
                onSubmitCapture={(e) => e.preventDefault()}
                layout="vertical"
                className="row-col"
              >
                {userForm.userFk !== -1 ? (
                  <Form.Item
                    className="username"
                    name="token"
                    rules={[
                      {
                        required: true,
                        message: "Please input your token!",
                      },
                    ]}
                  >
                    <Input
                      onChange={(e) => setToken(e.target.value)}
                      placeholder="Please input your token"
                    />
                  </Form.Item>
                ) : (
                  <Form.Item
                    name="email"
                    rules={[
                      {
                        type: "email",
                        required: true,
                        message: "Please input your email!",
                      },
                    ]}
                  >
                    <Input
                      onChange={(e) => updateUser("userEmail", e.target.value)}
                      placeholder="Email"
                    />
                  </Form.Item>
                )}

                <Form.Item>
                  {userForm.userFk !== -1 ? (
                    <Button
                      type="primary"
                      htmlType="submit"
                      onClick={() => {
                        if (token.replace(/\s+/g, "") !== "") {
                          userController
                            .checkToken({
                              body: {
                                tokenValue: token,
                                userFk: userForm.userFk,
                              },
                              tokenType: "REGISTRATION",
                            })
                            .then((response) => {
                              if (response.data.responseCode === 200) {
                                userController
                                  .verifyUser({
                                    body: {
                                      userId: userForm.userFk,
                                    },
                                  })
                                  .then((responseVerify) => {
                                    if (
                                      responseVerify.data.responseCode !== 200
                                    ) {
                                      toast.error(responseVerify.data.message, {
                                        position: "top-center",
                                        autoClose: 5000,
                                        hideProgressBar: true,
                                        closeOnClick: true,
                                        pauseOnHover: false,
                                        draggable: false,
                                      });
                                      return;
                                    }

                                    toast.success(responseVerify.data.message, {
                                      position: "top-center",
                                      autoClose: 5000,
                                      hideProgressBar: true,
                                      closeOnClick: true,
                                      pauseOnHover: false,
                                      draggable: false,
                                    });
                                    if (
                                      responseVerify.data.userRole === "PATIENT"
                                    ) {
                                      navigate("/patient-details", {
                                        state: {
                                          userId: userForm.userFk,
                                        },
                                      });
                                    } else {
                                      navigate("/hp-details", {
                                        state: {
                                          businessAccountId:
                                            responseVerify.data
                                              .businessAccountId,
                                        },
                                      });
                                    }
                                  });
                              } else {
                                toast.error(response.data.message, {
                                  position: "top-center",
                                  autoClose: 5000,
                                  hideProgressBar: true,
                                  closeOnClick: true,
                                  pauseOnHover: false,
                                  draggable: false,
                                });
                                return;
                              }
                            });
                        }
                      }}
                      style={{ width: "100%" }}
                    >
                      Verify
                    </Button>
                  ) : (
                    <Button
                      type="primary"
                      htmlType="submit"
                      onClick={() => {
                        if (userForm.userEmail.replace(/\s+/g, "") !== "") {
                          userController
                            .generateToken({
                              body: {
                                userEmail: userForm.userEmail,
                              },
                              tokenType: "REGISTRATION",
                            })
                            .then((response) => {
                              if (response.data.responseCode !== 200) {
                                toast.error(response.data.message, {
                                  position: "top-center",
                                  autoClose: 5000,
                                  hideProgressBar: true,
                                  closeOnClick: true,
                                  pauseOnHover: false,
                                  draggable: false,
                                });
                                return;
                              }
                              updateUser("userFk", response.data.userId);
                              setIndex(1);
                            });
                        }
                      }}
                      style={{ width: "100%" }}
                    >
                      Send Token
                    </Button>
                  )}
                </Form.Item>
              </Form>
            </Col>
          </Row>
        </Content>
      </Layout>
    </LayoutWrapper>
  );
}
