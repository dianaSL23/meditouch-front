import { Button, Card, Col,  Layout, Row } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { userController } from "../controllers/userController";
import { SmileOutlined } from "@ant-design/icons";
import { Result } from "antd";
import { util } from "../public/util";
import LayoutWrapper from "../components/Layout";
import patientImg from "../assets/images/patientProfile.jpg";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
export default function PatientDetails() {
  const [t, i18n] = useTranslation();
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state);
  const [completed, setCompleted] = useState(false);
  const [medicalInformation, setMedicalInformation] = useState({
    height: "",
    weight: "",
    diseasesDescription: "",
    vaccinationDescription: "",
  });
  function updateMedicalInformation(key, value) {
    let tempMedicalInformation = { ...medicalInformation };
    tempMedicalInformation[key] = value;
    setMedicalInformation(tempMedicalInformation);
  }
  function addMedicalInformation() {
    if (
      medicalInformation.height.toString().replace(/\s+/g, "") !== "" &&
      medicalInformation.weight.toString().replace(/\s+/g, "") !== "" &&
      medicalInformation.diseasesDescription.replace(/\s+/g, "") !== "" &&
      medicalInformation.vaccinationDescription.replace(/\s+/g, "") !== ""
    ) {
      userController
        .setMedicalInformation({
          body: {
            userFk: state ? state.userId : userData.userInfo.userId,
            ...medicalInformation,
          },
        })
        .then(() => {
          dispatch({
            type: "SET_MEDICAL_INFO",
            userMedicalInfo: { ...medicalInformation },
          });
          setCompleted(true);
        });
    } else {
    
      toast.error("info required", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
      });
    }
  }
  useEffect(() => {
    setMedicalInformation(userData.userMedicalInfo);
  }, [userData.userMedicalInfo]);

  return !completed ? (
   <LayoutWrapper  withFooter={true}>
        <Layout
        className="layout-default layout-signin"
        
      >
       
      <Row justify="center" 
      className="d-flex align-items-center justify-content-center pb-150"  style={{position:"relative",top:"130px"}}>
      <Col xs={{ span: 24 }} lg={{ span: 12 }} md={{ span: 12 }}>
          <img src={patientImg} alt=""  style={{width:"500px"}}/>
        </Col>
        <Col span={24} md={8} className="mb-24 ">
          <Card
            bordered={false}
            title={<div className="m-0 text-center all-txts">{t("patient_details")} </div>}
            className="header-solid h-full card-profile-information  "
            extra={<Button type="link">{}</Button>}
            bodyStyle={{ paddingTop: 0 }}
          >
              <div
                    className="all-cards-info pe-2 "
                    style={{ height: "400px", overflowY: "auto" }}
                  >
            <div className="d-flex flex-column 
            " style={{gap:"20px"}}>
            <div className="all-txts" >
            {t("height")+"(cm)*"}
            </div>
            <input
            className="patient-details-input"
              type="number"
              onChange={(e) =>
                updateMedicalInformation("height", parseInt(e.target.value))
              }
              value={medicalInformation.height}
              placeholder={t("height")}
            />
            <div className="all-txts">
              {" "}
              {t("weight")+"(kg)*"} 
            </div>
            <input
              className="patient-details-input"
              type="number"
              onChange={(e) =>
                updateMedicalInformation("weight", parseInt(e.target.value))
              }
              value={medicalInformation.weight}
              placeholder={t("weight")} 
            />
            <div className="all-txts">
            {t("diseases")+"*"} 
            </div>
            <input
              className="patient-details-input"
              type="text"
              onChange={(e) =>
                updateMedicalInformation("diseasesDescription", e.target.value)
              }
              value={medicalInformation.diseasesDescription}
              placeholder={t("diseases")}
            />
            <div className="all-txts">
            {t("vaccination")+"*"}
            </div>
            <input
              className="patient-details-input"
              type="text"
              onChange={(e) =>
                updateMedicalInformation(
                  "vaccinationDescription",
                  e.target.value
                )
              }
              value={medicalInformation.vaccinationDescription}
              placeholder={t("vaccination")}
            />
            <Button type="primary" onClick={() => addMedicalInformation()}>
            {t("update")}
            </Button>
            </div>
            </div>
          </Card>
        </Col>
      </Row>
      
      </Layout>
      </LayoutWrapper>  
   
  ) : (
    <LayoutWrapper  withFooter={true}>
    <Layout
    className="layout-default layout-signin"
    style={{ padding: "200px" }}
  >
    <Result
      icon={<SmileOutlined />}
      title= {t("great")}
      extra={
        <Button
          onClick={() => {
            if (util.isUserAuthorized()) {
              navigate("/dashboard");
            } else {
              navigate("/sign-in");
            }
          }}
          type="primary"
        >
        {t("next")}
        </Button>
      }
    />
    
    </Layout>
      </LayoutWrapper>
  );
}
