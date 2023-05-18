import React, { useState } from "react";
import LayoutWrapper from "../components/Layout";
import "../assets/styles/contactUs.css";
import contactus from "../assets/images/contact.jpg";
import {
  Layout,
  Menu,
  Button,
  Row,
  Col,
  Typography,
  Form,
  Input,
  Switch,
  Card,
  Spin,
} from "antd";
import { Content } from "antd/lib/layout/layout";
import { userController } from "../controllers/userController";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const { TextArea } = Input;

const ContactUs = () => {
  const [t, i18n] = useTranslation();
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
const valid=()=>{
  let valid=true;

  if(firstname.replace(/\s+/g, "") === "" || lastname.replace(/\s+/g, "") === ""
  || subject.replace(/\s+/g, "") === "" || message.replace(/\s+/g, "") === ""){
    valid=false;
    toast.error("missing fields", {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
    });
  }
  return valid;
}
  const submit = () => {
    if(valid()){
      userController
      .contactUs({
        body: {
          firstName: firstname,
          lastName: lastname,
          subject: subject,
          message: message,
        },
      })
      .then((response) => {
        let data = response.data;
        if (data.responseCode=== 200) {
     
          toast.success("message submitted sucessfully", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
          });
        }
      });
    }
    setFirstName("");
    setLastName("");
    setSubject("");
    setMessage("");
  }
  const content = (
    <Content className="p-0 ">
      <Row justify="center"  className="d-flex align-items-center justify-content-center"
      >
        <Col xs={{ span: 24 }} lg={{ span: 12 }} md={{ span: 12 }}>
          <img
            src={contactus}
            alt=""
            className="signup-image"
            
          />
        </Col>
        <Col
          xs={{ span: 24, offset: 0 }}
          lg={{ span: 6, offset: 2 }}
          md={{ span: 12 }}
        >
          <div className="text-center forgotPass-txt mb-4">{t("contact_us")}</div>

          <Form layout="vertical" className="row-col">
            <Form.Item
              className="username"
              label={t("first_name")}
              name="first name"
              rules={[
                {
                  required: true,
                  message: "Please input your first name!",
                },
              ]}
            >
              <Input
                value={firstname}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder={t("first_name")}
              />
            </Form.Item>

            <Form.Item
              className="username"
              label={t("last_name")}
              name="lastname"
              rules={[
                {
                  required: true,
                  message: "Please input your last name!",
                },
              ]}
            >
              <Input
                placeholder={t("last_name")}
                value={firstname}
                onChange={(e) => setLastName(e.target.value)}
              />
            </Form.Item>
            <Form.Item
              className="username"
              label={t("subject")}
              name="subject"
              rules={[
                {
                  required: true,
                  message: "Please input your subject!",
                },
              ]}
            >
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={t("subject")}
              />
            </Form.Item>
            <Form.Item
              className="username"
              label={t("message")}
              name="message"
              rules={[
                {
                  required: true,
                  message: "Please input your message!",
                },
              ]}
            >
              <TextArea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </Form.Item>

            <Form.Item>
              <Button
                onClick={() => submit()}
                type="primary"
                htmlType="submit"
                style={{ width: "100%" }}
              >
                {t("submit")}
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </Content>
  );
  return (
    <LayoutWrapper style={{ position: "relative" }} withFooter={true}>
      <Layout
        className="layout-default layout-signin"
        style={{ marginTop: "60px", padding: "100px" }}
      >
        <div className="contactUs-wrapper">{content}</div>
      </Layout>
    </LayoutWrapper>
  );
};

export default ContactUs;
