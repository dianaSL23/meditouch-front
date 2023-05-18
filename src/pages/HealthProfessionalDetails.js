import { DeleteOutlined, SmileOutlined } from "@ant-design/icons";
import { Button, Card, Col, Layout, Result, Row } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import AuthenticationWrapper from "../components/AuthenticationWrapper";
import LayoutWrapper from "../components/Layout";
import { businessAccountController } from "../controllers/businessAccountController";
import { userController } from "../controllers/userController";
import { util } from "../public/util";
import img from "../assets/images/profile.avif";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
export default function HealthProfessionalDetails() {
  const [t, i18n] = useTranslation();
  const [specialities, setSpecialities] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [completed, setCompleted] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state);
  const { state } = useLocation();
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [myClinicLocation, setMyClinicLocation] = useState(false);
  const [userForm, setUserForm] = useState({
    speciality: -1,
    biography: "",
    clinicLocation: "",
    clinicLocationLongitude: -1,
    clinicLocationLatitude: -1,
    services: [
      {
        serviceId: 1,
        isDeleted: false,
        new: true,
        servicePrice: 0,
        serviceName: "",
        currencyUnit: "USD",
      },
    ],
  });
  function addService() {
    let tempUserForm = { ...userForm };
    tempUserForm.services.push({
      serviceId: tempUserForm.services.length + 1,
      servicePrice: -1,
      serviceName: "",
      currencyUnit: "USD",
      isDeleted: false,
      new: true,
    });
    setUserForm(tempUserForm);
  }
  function deleteService(index) {
    let tempUserForm = { ...userForm };
    tempUserForm.services[index].isDeleted = true;
    setUserForm(tempUserForm);
  }
  function updateForm(key, value) {
    let tempUserForm = { ...userForm };
    tempUserForm[key] = value;
    setUserForm(tempUserForm);
  }
  function updateService(index, key, value) {
    let tempUserForm = { ...userForm };
    tempUserForm.services[index][key] = value;
    setUserForm(tempUserForm);
  }
  useEffect(() => {
    userController.getSpecialities().then((response) => {
      setSpecialities(response.data.specialities);
    });
  }, []);
  function getServices(tempUserForm) {
    businessAccountController
      .getServices({
        businessAccountFk: userData.businessAccountInfo.businessAccountId,
      })
      .then((response2) => {
        let data2 = response2.data;
        tempUserForm.services = data2.services;
        for (let i = 0; i < tempUserForm.services.length; i++) {
          tempUserForm.services[i].new = false;
          tempUserForm.services[i].isDeleted = false;
        }
        setUserForm({ ...tempUserForm });
        setDataLoaded(true);
      });
  }

  useEffect(() => {
    if (!userData.loadingApp) {
      if (navigator.geolocation) {
        navigator.permissions
          .query({ name: "geolocation" })
          .then(function (result) {
            if (result.state === "granted" || result.state === "prompt") {
              //If granted then you can directly call your function here
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  let tempUserData = { ...userForm };
                  userForm.clinicLocationLatitude = position.coords.latitude;
                  userForm.clinicLocationLongitude = position.coords.longitude;

                  setUserForm(tempUserData);
                  setLocationEnabled(true);
                },
                (error) => {}
              );
            } else if (result.state === "denied") {
              //If denied then you have to show instructions to enable location
            }
            result.onchange = function () {
              console.log(result.state);
            };
          });
      } else {
        toast.warning("Sorry Not available!", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
        });
      }
      if (
        userData.businessAccountInfo &&
        userData.businessAccountInfo !== -1 &&
        userData.businessAccountInfo !== -2 &&
        userData.userInfo &&
        !dataLoaded
      ) {
        let tempUserForm = { ...userForm };
        businessAccountController
          .getBusinessAccount({ userId: userData.userInfo.userId })
          .then((response) => {
            let data = response.data.businessAccount;
            tempUserForm.speciality = data.specialityFk;
            tempUserForm.clinicLocation = data.clinicLocation;
            tempUserForm.biography = data.biography;
            tempUserForm.clinicLocationLatitude = data.clinicLocationLatitude;
            tempUserForm.clinicLocationLongitude = data.clinicLocationLongitude;
            getServices(tempUserForm);
          });
      }
    }
  }, [userData.loadingApp]);
  function submit() {
    if (
      userForm.speciality === -1 ||
      userForm.services.filter(
        (s) =>
          s.isDeleted === false &&
          (s.servicePrice.toString().replace(/\s+/g, "") === "" ||
            s.serviceName.toString().replace(/\s+/g, "") === "" ||
            s.currencyUnit.toString().replace(/\s+/g, "") === "")
      ).length !== 0 ||
      userForm.clinicLocation.toString().replace(/\s+/g, "") === ""
    ) {
      toast.error("fields required", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
      });
      return;
    }
    let body = {
      businessAccountId: state
        ? state.businessAccountId
        : userData.businessAccountInfo.businessAccountId,
      specialityFk: parseInt(userForm.speciality),
      biography: userForm.biography,
      clinicLocation: userForm.clinicLocation,
    };
    if (locationEnabled && myClinicLocation) {
      body.clinicLocationLatitude = userForm.clinicLocationLatitude;
      body.clinicLocationLongitude = userForm.clinicLocationLongitude;
    }
    businessAccountController
      .updateBusinessAccount({
        body: body,
      })
      .then(() => {
        if (util.isUserAuthorized()) {
          let businessAccountInfo = userData.businessAccountInfo;
          businessAccountInfo.biography = userForm.biography;
          businessAccountInfo.clinicLocation = userForm.clinicLocation;
          dispatch({
            type: "SET_BUSINESS_ACCOUNT_INFO",
            businessAccountInfo: businessAccountInfo,
          });
        }
        let jsonArrayNew = [];
        let jsonArrayOld = [];
        let jsonArrayToDelete = [];

        for (let i = 0; i < userForm.services.length; i++) {
          if (userForm.services[i].new === true) {
            jsonArrayNew.push({
              businessAccountFk: state
                ? state.businessAccountId
                : userData.businessAccountInfo.businessAccountId,
              servicePrice: parseInt(userForm.services[i].servicePrice),
              serviceName: userForm.services[i].serviceName,
              currencyUnit: userForm.services[i].currencyUnit,
            });
          } else {
            jsonArrayOld.push({
              serviceId: userForm.services[i].serviceId,
              businessAccountFk: state
                ? state.businessAccountId
                : userData.businessAccountInfo.businessAccountId,
              servicePrice: parseInt(userForm.services[i].servicePrice),
              serviceName: userForm.services[i].serviceName,
              currencyUnit: userForm.services[i].currencyUnit,
            });
          }
        }
        businessAccountController
          .addService({ body: jsonArrayNew })
          .then(() => {
            businessAccountController
              .updateService({ body: jsonArrayOld })
              .then(() => {
                let data = userForm.services.filter(
                  (s) => s.isDeleted === true && s.new === false
                );
                if (data.length !== 0) {
                  for (let i = 0; i < data.length; i++) {
                    jsonArrayToDelete.push({
                      serviceId: data[i].serviceId,
                      businessAccountFk: state
                        ? state.businessAccountId
                        : userData.businessAccountInfo.businessAccountId,
                    });
                  }
                  businessAccountController
                    .deleteService({ body: jsonArrayToDelete })
                    .then(() => {
                      setCompleted(true);
                    });
                } else {
                  setCompleted(true);
                }
              });
          });
      });
  }
  return (
    <AuthenticationWrapper>
      {!completed ? (
        <LayoutWrapper withFooter={true}>
          <Layout className="layout-default layout-signin">
            <Row
              justify="center"
              className="d-flex align-items-center justify-content-center pb-150"
              style={{ position: "relative", top: "130px" }}
            >
              <Col xs={{ span: 24 }} lg={{ span: 12 }} md={{ span: 12 }}>
                <img src={img} alt="" className="signup-image" />
              </Col>
              <Col span={24} md={8}>
                <Card
                  bordered={false}
                  title={
                    <div className="m-0 text-center txt-txt">
                      {" "}
                      {t("Health_Professional_Details")}
                    </div>
                  }
                  className="header-solid h-full card-profile-information "
                  extra={<Button type="link">{}</Button>}
                  bodyStyle={{ paddingTop: 0 }}
                >
                  <div
                    className="all-cards-info pe-2 "
                    style={{ height: "400px", overflowY: "auto" }}
                  >
                    <div className="d-flex flex-column" style={{ gap: "10px" }}>
                      <div className="all-txts"> {t("Speciality") + "*"}</div>
                      <select
                        className="patient-details-input"
                        style={{ border: "none !important" }}
                        defaultValue={-1}
                        value={userForm.speciality}
                        onChange={(e) =>
                          updateForm("speciality", e.target.value)
                        }
                      >
                        <option value={-1}>All Specialities</option>
                        {specialities.map((sp) => {
                          return (
                            <option value={sp.specialityId}>
                              {sp.specialityName}
                            </option>
                          );
                        })}
                      </select>
                      <div className="all-txts">
                        {" "}
                        {t("clinic_location") + "*"}
                      </div>
                      <input
                        className="patient-details-input"
                        type="text"
                        value={userForm.clinicLocation}
                        placeholder={t("clinic_location")}
                        onChange={(e) =>
                          updateForm("clinicLocation", e.target.value)
                        }
                      />
                      <div className="all-txts">{t("Biography")}</div>
                      <input
                        className="patient-details-input"
                        type="text"
                        placeholder={t("Biography")}
                        value={userForm.biography}
                        onChange={(e) =>
                          updateForm("biography", e.target.value)
                        }
                      />
                      <div>
                        {locationEnabled ? (
                          <div className="all-txts">
                            {t("clinic_now")}
                            <div className="d-flex">
                              <div className="all-txts me-2 mt-3">
                                {t("yes")}
                              </div>
                              <input
                                className="me-2 mt-3"
                                type="radio"
                                name="clinic"
                                onClick={(e) => setMyClinicLocation(true)}
                                checked={myClinicLocation}
                              />
                              <div className="all-txts me-2 mt-3">
                                {t("no")}
                              </div>
                              <input
                                className="me-2 mt-3"
                                type="radio"
                                name="clinic"
                                onClick={(e) => setMyClinicLocation(false)}
                                checked={!myClinicLocation}
                              />
                            </div>
                          </div>
                        ) : (
                          "Enable location to set your clinic position"
                        )}
                      </div>

                      <Button type="primary" onClick={() => addService()}>
                        {t("add_service")}
                      </Button>
                      {userForm.services.map((service, index) => {
                        return (
                          service.isDeleted === false && (
                            <div>
                              <div className="d-flex align-items-center mt-3 mb-3">
                                <div className="me-3 all-txts">
                                  {" "}
                                  {t("service")}
                                  {index + 1}
                                </div>
                                {userForm.services.filter(
                                  (s) => s.isDeleted === false
                                ).length > 1 && (
                                  <div
                                    className="mb-2"
                                    onClick={() => deleteService(index)}
                                  >
                                    <DeleteOutlined />
                                  </div>
                                )}
                              </div>
                              <div
                                className="d-flex flex-column"
                                style={{ gap: "10px" }}
                              >
                                <div className="all-txts">
                                  {t("service_name")}
                                </div>
                                <input
                                  className="patient-details-input"
                                  type="text"
                                  value={service.serviceName}
                                  placeholder={t("service_name")}
                                  onChange={(e) =>
                                    updateService(
                                      index,
                                      "serviceName",
                                      e.target.value
                                    )
                                  }
                                />
                                <div className="all-txts">{t("price")}</div>
                                <input
                                  className="patient-details-input"
                                  type="number"
                                  value={service.servicePrice}
                                  placeholder={t("price")}
                                  onChange={(e) =>
                                    updateService(
                                      index,
                                      "servicePrice",
                                      e.target.value
                                    )
                                  }
                                />
                                <div className="all-txts">{t("currency")}</div>
                                <select
                                  className="patient-details-input"
                                  defaultValue={-1}
                                  value={service.currencyUnit}
                                  onChange={(e) =>
                                    updateService(
                                      index,
                                      "currencyUnit",
                                      e.target.value
                                    )
                                  }
                                >
                                  <option value={-1}>
                                    {t("all_currenices")}
                                  </option>
                                  <option value={"USD"}>{t("usd")}</option>
                                  <option value={"LBP"}>{t("lbp")}</option>
                                </select>
                              </div>
                            </div>
                          )
                        );
                      })}
                      <Button type="primary" onClick={() => submit()}>
                        {t("continue")}
                      </Button>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
          </Layout>
        </LayoutWrapper>
      ) : (
        <LayoutWrapper withFooter={true}>
          <Layout
            className="layout-default layout-signin"
            style={{ padding: "200px" }}
          >
            <Result
              icon={<SmileOutlined />}
              title={t("great") + (util.isUserAuthorized() ? "" : t("wait"))}
              extra={
                <Button onClick={() => navigate("/dashboard")} type="primary">
                  {t("next")}
                </Button>
              }
            />
          </Layout>
        </LayoutWrapper>
      )}
      ;
    </AuthenticationWrapper>
  );
}
