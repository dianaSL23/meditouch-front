import { MenuUnfoldOutlined } from "@ant-design/icons";
import { Button, Card, Col, Typography, Timeline, Modal } from "antd";
import Title from "antd/lib/skeleton/Title";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import img from "../assets/images/healthcare.png";
import "../assets/styles/schedule.css";
import Main from "../components/layout/Main";
import { businessAccountController } from "../controllers/businessAccountController";
import { userController } from "../controllers/userController";
import { util } from "../public/util";
import { toast } from "react-toastify";

export default function LiveClinic() {
  const { Title, Text } = Typography;
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const userData = useSelector((state) => state);
  const [currentAppointmentIndex, setCurrentAppointmentIndex] = useState(-1);
  const [minutesRemaining, setMinutesRemaining] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [message, setMessage] = useState("Work in progress...");
  const [medicalInfoModal, setMedicalInfoModal] = useState(false);
  const [viewMedicalInfoIndex, setViewMedicalInfoIndex] = useState(-1);
  const [prescriptionModal, setPrescriptionModal] = useState(false);
  const [prescriptionData, setPrescriptionData] = useState("");
  useEffect(() => {
    if (!userData.loadingApp) {
      let tempCurrentAppointmentIndex = -1;

      businessAccountController
        .getTodaysAppointments({
          businessAccountId: userData.businessAccountInfo.businessAccountId,
        })
        .then((response) => {
          let data = response.data.appointments;
          for (let i = 0; i < data.length; i++) {
            data[i].appointmentActualStartTime =
              data[i].appointmentActualStartTime !== -1
                ? moment(
                    util.formatTimeByOffset(
                      new Date(
                        moment(
                          data[i].appointmentActualStartTime,
                          "YYYY-MM-DD HH:mm:ss"
                        )
                      )
                    ),
                    "YYYY-MM-DD HH:mm:ss"
                  ).format("YYYY-MM-DD HH:mm:ss")
                : -1;
            data[i].appointmentActualEndTime =
              data[i].appointmentActualEndTime !== -1
                ? moment(
                    util.formatTimeByOffset(
                      new Date(
                        moment(
                          data[i].appointmentActualEndTime,
                          "YYYY-MM-DD HH:mm:ss"
                        )
                      )
                    ),
                    "YYYY-MM-DD HH:mm:ss"
                  ).format("YYYY-MM-DD HH:mm:ss")
                : -1;
            data[i].started =
              data[i].appointmentActualStartTime !== -1 ? true : false;
            data[i].ended =
              data[i].appointmentActualEndTime !== -1 ? true : false;
            data[i].timeEnded = false;
            if (
              data[i].appointmentActualStartTime !== -1 &&
              data[i].appointmentActualEndTime === -1
            ) {
              tempCurrentAppointmentIndex = i;
            }
          }
          if (
            data.filter(
              (ap) =>
                ap.appointmentActualEndTime !== -1 &&
                ap.appointmentActualStartTime !== -1
            ).length === data.length
          ) {
            setMessage("You're done for today");
          }
          setAppointments(data);
        })
        .then(() => {
          setCurrentAppointmentIndex(tempCurrentAppointmentIndex);

          setLoading(false);
        });
    }
  }, [userData.loadingApp]);
  function modifyAppointment(key, index) {
    let tempAppointments = [...appointments];
    tempAppointments[index][key] = true;
    setAppointments(tempAppointments);
    setMinutesRemaining(
      moment(tempAppointments[index].slotEndTime).diff(
        tempAppointments[index].slotStartTime,
        "minutes"
      ) - 1
    );
    setSecondsRemaining(59);
    if (key === "started") {
      tempAppointments[index]["appointmentActualStartTime"] = util
        .convertTZ(
          moment(moment(new Date())).format("YYYY/MM/DD HH:mm:ss").toString(),
          "Europe/Paris"
        )
        .format("YYYY-MM-DDTHH:mm:ss")
        .toString();

      userController
        .updateAppointment({
          body: {
            appointmentActualStartTime:
              tempAppointments[index]["appointmentActualStartTime"],
            appointmentActualEndTime: null,
            appointmentStatus: "ACCEPTED",
            businessAccountUserId: userData.userInfo.userId,
            isApproved: 1,
            isCancelled: 0,
            userFk: tempAppointments[index].userFk,
            appointmentId: tempAppointments[index].appointmentId,
            slotFk: tempAppointments[index].slotFk,
          },
        })
        .then(() => {
          setCurrentAppointmentIndex(index);
        });
    } else if (key === "ended") {
      if (index === appointments.length - 1) {
        setMessage("You're done for today");
      }
      tempAppointments[index]["appointmentActualEndTime"] = util
        .convertTZ(
          moment(moment(new Date())).format("YYYY/MM/DD HH:mm:ss").toString(),
          "Europe/Paris"
        )
        .format("YYYY-MM-DDTHH:mm:ss")
        .toString();
      userController
        .updateAppointment({
          body: {
            appointmentActualStartTime: moment(
              tempAppointments[index]["appointmentActualStartTime"]
            ).format("YYYY-MM-DDTHH:mm:ss"),
            appointmentActualEndTime:
              tempAppointments[index]["appointmentActualEndTime"],
            appointmentStatus: "ACCEPTED",
            isApproved: 1,
            slotFk: tempAppointments[index].slotFk,
            businessAccountUserId: userData.userInfo.userId,
            userFk:
              index === appointments.length - 1
                ? -1
                : tempAppointments[index + 1]?.userFk,
            isCancelled: 0,
            appointmentId: tempAppointments[index].appointmentId,
          },
        })
        .then(() => {
          setCurrentAppointmentIndex(-1);
        });
    }
  }
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (currentAppointmentIndex === -1) {
        clearInterval(intervalId);
      } else {
        if (secondsRemaining === 0) {
          if (minutesRemaining === 0) {
            modifyAppointment("timeEnded", currentAppointmentIndex);
            setCurrentAppointmentIndex(-1);
            clearInterval(intervalId);
          } else {
            setMinutesRemaining((prevMinutes) => prevMinutes - 1);
            setSecondsRemaining(59);
          }
        } else {
          setSecondsRemaining((prevSeconds) => prevSeconds - 1);
        }
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [currentAppointmentIndex, minutesRemaining, secondsRemaining]);
  const valid = () => {
    let valid = true;
    if (prescriptionData.replace(/\s+/g, "") === "") {
      valid = false;
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
  };

  function modifyAppointmentPrescription(t, index) {
    if (valid()) {
      if (t.prescriptionId === -1) {
        businessAccountController
          .addAppointmentPrescription({
            body: {
              appointmentFk: t.appointmentId,
              prescriptionDescription: prescriptionData,
            },
          })
          .then((response) => {
            if (response && response.status === 200) {
              let prescriptionId = response.data.result.prescriptionId;
              let tempAppointments = [...appointments];
              tempAppointments[index].prescriptionId = prescriptionId;
              setAppointments(tempAppointments);
              toast.success("Prescription Added Successfully", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
              });
            }
          });
      } else {
        businessAccountController
          .updateAppointmentPrescription({
            body: {
              prescriptionId: t.prescriptionId,
              prescriptionDescription: prescriptionData,
              appointmentFk: t.appointmentId,
            },
          })
          .then((response) => {
            if (response && response.status === 200) {
              toast.success("Prescription Updated Successfully", {
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
    }
    setPrescriptionData("");
  }
  const handleOk = (e) => {
    setMedicalInfoModal(false);
  };
  const handlePrescriptionOk = (e) => {
    setPrescriptionModal(false);
  };
  const handlePrescriptionCancel = (e) => {
    setPrescriptionModal(false);
  };
  const handleCancel = (e) => {
    setMedicalInfoModal(false);
  };
  const modal = (
    <Modal
      open={medicalInfoModal}
      onOk={handleOk}
      onCancel={handleCancel}
      okButtonProps={{
        disabled: false,
        hidden: false,
      }}
      cancelButtonProps={{
        disabled: true,
        hidden: true,
      }}
    >
      <div
        className="d-flex align-items-center appointment-pres-wrapper 
      justify-content-center"
        style={{ gap: "20px" }}
      >
        <div>
          <img src={img} alt="" />
        </div>
      </div>
      <div>Height : {appointments[viewMedicalInfoIndex]?.height + " cm"}</div>
      <div className="mt-2">
        Weight : {appointments[viewMedicalInfoIndex]?.weight + " Kg"}
      </div>
      <div className="mt-2">
        Diseases : {appointments[viewMedicalInfoIndex]?.diseasesDescription}
      </div>
      <div className="mt-2">
        Vacination :{" "}
        {appointments[viewMedicalInfoIndex]?.vaccinationDescription}
      </div>
      <div className="mt-2">
        Appointment Description :{" "}
        {appointments[viewMedicalInfoIndex]?.appointmentDescription}
      </div>
    </Modal>
  );

  return (
    <Main>
      <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
        {modal}

        <Card bordered={false} className="criclebox h-full">
          <div className="timeline-box">
            {loading ? (
              "Loading..."
            ) : !loading && appointments.length === 0 ? (
              "no appointments"
            ) : (
              <div className="d-flex flex-column">
                {message}
                <Timeline
                  className="timelinelist mt-3"
                  //   reverse={reverse}
                >
                  {appointments.map((t, index) => (
                    <Timeline.Item key={index}>
                      <Title level={5}>
                        {"Appointment with " + t.firstName + " " + t.lastName}
                      </Title>
                      <div className="d-flex flex-column">
                        <Text>{t.slotStartTime}</Text>
                        <Text>
                          Appointment Duration:{" "}
                          {moment(t.slotEndTime).diff(
                            t.slotStartTime,
                            "minutes"
                          )}{" "}
                          mins
                        </Text>
                        {t.started === true &&
                          currentAppointmentIndex !== -1 &&
                          t.ended === false && (
                            <Text>
                              {t.appointmentActualStartTime !== -1 &&
                                t.appointmentActualEndTime === -1 &&
                                "Actual Start Time " +
                                  moment(t.appointmentActualStartTime).format(
                                    "HH:mm:ss"
                                  )}
                            </Text>
                          )}

                        <Text>
                          <Button
                            onClick={() => modifyAppointment("started", index)}
                            disabled={
                              index === 0
                                ? t.started === true
                                : t.started === true ||
                                  appointments[index - 1].ended === false
                            }
                            type="primary"
                            className="me-3 mt-2"
                          >
                            Start
                          </Button>
                          <Button
                            onClick={() => modifyAppointment("ended", index)}
                            disabled={
                              t.started === false ||
                              t.appointmentActualEndTime !== -1
                            }
                            danger
                            className="me-3 mt-2"
                          >
                            End
                          </Button>
                          <Button
                            onClick={() => {
                              setViewMedicalInfoIndex(index);
                              setMedicalInfoModal(true);
                            }}
                            type="primary"
                            className="me-3 mt-2"
                          >
                            Medical Info
                          </Button>
                          {t.started === true && t.ended === true && (
                            <>
                              <Button
                                type="primary"
                                className="add-pres"
                                onClick={() => setPrescriptionModal(true)}
                              >
                                {t.prescriptionId === -1
                                  ? " Add Appointment Prescription"
                                  : " Edit Appointment Prescription"}
                              </Button>
                              <Modal
                                open={prescriptionModal}
                                onOk={handlePrescriptionOk}
                                onCancel={handlePrescriptionCancel}
                                okButtonProps={{
                                  disabled: false,
                                  hidden: true,
                                }}
                                cancelButtonProps={{
                                  disabled: true,
                                  hidden: true,
                                }}
                              >
                                <div
                                  className="d-flex align-items-center appointment-pres-wrapper 
      justify-content-center"
                                  style={{ gap: "20px" }}
                                >
                                  <div>
                                    <img src={img} alt="" />
                                  </div>
                                  <div className="d-flex flex-column justify-content-center pe-4">
                                    <div
                                      className="all-txts4  "
                                      style={{ fontSize: "18px" }}
                                    >
                                      MediTouch
                                    </div>
                                    <div className="all-txts3">
                                      Your healthcare is our responsibility
                                    </div>
                                  </div>
                                </div>
                                <div className="appointment-pres-information">
                                  <textarea
                                    className="add-prescription-info"
                                    value={prescriptionData}
                                    onChange={(e) =>
                                      setPrescriptionData(e.target.value)
                                    }
                                  />
                                </div>
                                <div
                                  style={{
                                    position: "relative",
                                    float: "right",
                                    top: "13px",
                                    marginLeft: "10px",
                                  }}
                                >
                                  <input
                                    type="button"
                                    className="add-prescription-btn"
                                    value="Add"
                                    onClick={() => {
                                      modifyAppointmentPrescription(t, index);
                                      setPrescriptionModal(false);
                                    }}
                                  />
                                </div>
                              </Modal>
                            </>
                          )}
                        </Text>
                      </div>
                    </Timeline.Item>
                  ))}
                </Timeline>
              </div>
            )}
          </div>
        </Card>
      </Col>
    </Main>
  );
}
