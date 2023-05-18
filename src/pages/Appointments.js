import { Row, Col, Card, Button, Select, Tag, Modal, Avatar } from "antd";

import "../assets/styles/appointments.css";

import avatar from "../assets/images/avatar.jpg";
import Main from "../components/layout/Main";
import { useEffect, useState } from "react";
import { businessAccountController } from "../controllers/businessAccountController";
import { useDispatch, useSelector } from "react-redux";
import { userController } from "../controllers/userController";
import Calendar from "../icons/calendar";
import Dollor from "../icons/dollor";
import { useNavigate } from "react-router-dom";
import { util } from "../public/util";
import moment from "moment";
import classNames from "classnames";
import Lock from "../icons/lock";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import img from "../assets/images/healthcare.png";
function Appointments() {
  const [t, i18n] = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [totalNumberOfPages, setTotalNumberOfPages] = useState(1);
  const [pageNumber, setPageNumber] = useState(1);
  const [doctorSelected, setDoctorSelected] = useState("");
  const [scheduleModal, setScheduleModal] = useState(false);
  const [doctorSchedule, setDoctorSchedule] = useState([]);
  const [loadingSchedule, setLoadingSchedule] = useState(false);
  const [loading, setLoading] = useState(false);
  const userData = useSelector((state) => state);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [daysOfWeek, setDaysOfWeek] = useState([]);
  const [dayChosen, setDayChosen] = useState(-1);
  const [slotIndexChosen, setSlotIndexChosen] = useState(0);
  const [slots, setSlots] = useState([]);
  const [appointmentSelected, setAppointmentSelected] = useState("");
  const [prescriptionModal, setPrescriptionModal] = useState(false);
  const [prescriptionData, setPrescriptionData] = useState([[]]);
  useEffect(() => {
    let daysOfWeek = util.getDaysOfWeekDates();
    let days = [];
    let keys = Object.keys(daysOfWeek);
    for (let i = 0; i < keys.length; i++) {
      days.push(daysOfWeek[keys[i]]);
    }
    setDaysOfWeek(days);
  }, []);
  const [filters, setFilters] = useState({
    appointmentStatus: "",
    appointmentType: "ALL",
    isCancelled: -1,
  });
  useEffect(() => {
    if (doctorSelected.businessAccountId) {
      setLoadingSchedule(true);
      businessAccountController
        .getBusinessAccountSchedule({
          businessAccountId: doctorSelected.businessAccountId,
          pageNumber: -1,
          recordsByPage: -1,
        })
        .then((response) => {
          let data = response.data;
          if (data.responseCode !== -1) {
            let schedule = data.body.businessAccountSchedule;
            for (let i = 0; i < schedule.length; i++) {
              schedule[i].slotStartTime = moment(
                util.formatTimeByOffset(
                  new Date(
                    moment(schedule[i].slotStartTime, "YYYY-MM-DD HH:mm:ss")
                  )
                ),
                "YYYY-MM-DD HH:mm:ss"
              ).format("YYYY-MM-DD HH:mm:ss");
              schedule[i].slotEndTime = moment(
                util.formatTimeByOffset(
                  new Date(
                    moment(schedule[i].slotEndTime, "YYYY-MM-DD HH:mm:ss")
                  )
                ),
                "YYYY-MM-DD HH:mm:ss"
              ).format("YYYY-MM-DD HH:mm:ss");
            }

            setDoctorSchedule(schedule);
            setDayChosen(0);
          }
        })
        .then(() => {
          setLoadingSchedule(false);
        });
    }
  }, [doctorSelected]);
  useEffect(() => {
    if (dayChosen !== -1) {
      let tempSchedule = [...doctorSchedule];
      tempSchedule = tempSchedule.filter(
        (s) => s.slotDate === daysOfWeek[dayChosen]
      );
      tempSchedule.sort(
        (a, b) => new Date(a.slotStartTime) - new Date(b.slotStartTime)
      );
      let indexOfNotLockedSlot = tempSchedule.findIndex(
        (s) => s.isLocked === false && s.isReserved === false
      );
      if (indexOfNotLockedSlot < 0) {
        setSlotIndexChosen(-1);
      } else {
        setSlotIndexChosen(indexOfNotLockedSlot);
      }
      setSlots(tempSchedule);
    }
  }, [dayChosen]);
  console.log(userData.myAppointments)
  useEffect(() => {
    if (!scheduleModal) {
      setDayChosen(-1);
      setSlots([]);
      setDoctorSelected("");
      setSlotIndexChosen(-1);
    }
  }, [scheduleModal]);
  const handleOk = (e) => {
    setScheduleModal(false);
  };
  const handleCancel = (e) => {
    setScheduleModal(false);
  };
  function postponeAppointment() {
    userController
      .postponeAppointment({
        body: {
          newSlotFk: slots[slotIndexChosen].slotId,
          oldSlotFk: appointmentSelected.slotId,
          appointmentId: appointmentSelected.appointmentId,
          userFk: userData.userInfo.userId,
          businessAccountUserId: appointmentSelected.businessAccountUserId,
        },
      })
      .then((response) => {
        let data = response.data;
        toast.success(data.message, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
        });
        let tempAppointments = [...userData.myAppointments];

        let indexOfApp = tempAppointments.findIndex(
          (ap) => ap.appointmentId === appointmentSelected.appointmentId
        );
        tempAppointments[indexOfApp].slotStartTime =
          slots[slotIndexChosen].slotStartTime;
        dispatch({
          type: "SET_MY_APPOINTMENTS",
          myAppointments: tempAppointments,
        });
        setScheduleModal(false);
      });
  }

  const handlePrescriptionOk = (e) => {
    setPrescriptionModal(false);
  };
  const handlePrescriptionCancel = (e) => {
    setPrescriptionModal(false);
  };

  const modal = (
    <Modal
      open={scheduleModal}
      onOk={handleOk}
      onCancel={handleCancel}
      okButtonProps={{
        disabled: true,
        hidden: true,
      }}
      cancelButtonProps={{
        disabled: true,
        hidden: true,
      }}
    >
      {loadingSchedule ? (
        "loading..."
      ) : (
        <div>
          <div className="global-search-card-titles">
            Schedule between {moment(daysOfWeek[0]).format("YYYY-MM-DD")} and{" "}
            {moment(daysOfWeek[daysOfWeek.length - 1]).format("YYYY-MM-DD")}
          </div>
          <Row className="rowgap-vbox mt-3" gutter={[24, 0]}>
            {daysOfWeek.map((day, index) => {
              return (
                <Col
                  xs={3}
                  sm={3}
                  md={3}
                  lg={3}
                  xl={3}
                  title={moment(day).format("YYYY-MM-DD")}
                  onClick={() => setDayChosen(index)}
                  key={"day" + doctorSelected?.businessAccountId + "" + index}
                >
                  <div
                    className={classNames("global-search-card-schedule-days", {
                      "global-search-card-selected-schedule-days":
                        dayChosen === index,
                    })}
                  >
                    {moment(day).format("dd")}
                  </div>
                </Col>
              );
            })}
          </Row>
          <div className="d-flex flex-wrap mt-3">
            {slots.length === 0
              ? "No slots"
              : slots.map((slot, index) => {
                  return (
                    <div
                      className={classNames(
                        "d-flex search-item-slot align-items-center global-search-card-schedule-slots",
                        {
                          "global-search-card-locked-schedule-slot":
                            slot.isLocked,
                          "global-search-card-reserved-schedule-slot":
                            slot.isReserved,
                          "global-search-card-selected-schedule-slot":
                            slotIndexChosen === index,
                        }
                      )}
                      onClick={() => {
                        if (slot.isLocked === false && !slot.isReserved) {
                          setSlotIndexChosen(index);
                        }
                      }}
                      key={
                        "slot" + doctorSelected?.businessAccountId + "" + index
                      }
                    >
                      {slot.isLocked && <Lock />}
                      {moment(slot.slotStartTime).format("HH:mm")} -
                      {moment(slot.slotEndTime).format("HH:mm")}
                    </div>
                  );
                })}
          </div>
          <div className="w-100 justify-content-center d-flex mt-3">
            <Button
              type={slotIndexChosen !== -1 ? "primary" : ""}
              // disabled={slotIndexChosen === -1 || userData.userInfo.userId === item.userDetails.userId}
              disabled={slotIndexChosen === -1}
              onClick={() => postponeAppointment()}
            >
              {t("postpone_appointment")}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );

  function acceptAppointment(i) {
    let newData = [...upcomingAppointments];
    userController
      .updateAppointment({
        body: {
          appointmentActualStartTime: new Date(
            newData[i].appointmentActualStartTime
          ),
          appointmentActualEndTime: new Date(
            newData[i].appointmentActualEndTime
          ),
          appointmentStatus: "ACCEPTED",
          isApproved: 1,
          slotFk: newData[i].slotId,
          isCancelled: 0,
          userFk: newData[i].currentUserId,
          businessAccountUserId: userData.userInfo.userId,
          appointmentId: newData[i].appointmentId,
        },
      })
      .then(() => {
        newData[i].appointmentStatus = "ACCEPTED";
        newData[i].isApproved = 1;
        newData[i].isCancelled = 0;
        setUpcomingAppointments(newData);
      });
  }
  function rejectAppointment(i) {
    let newData = [...upcomingAppointments];
    userController
      .updateAppointment({
        body: {
          appointmentActualStartTime: newData[i].appointmentActualStartTime,
          appointmentActualEndTime: newData[i].appointmentActualEndTime,
          appointmentStatus: "REJECTED",
          isApproved: 1,
          slotFk: newData[i].slotId,
          isCancelled: 0,
          userFk: newData[i].currentUserId,
          businessAccountUserId: userData.userInfo.userId,
          appointmentId: newData[i].appointmentId,
        },
      })
      .then(() => {
        newData[i].appointmentStatus = "REJECTED";
        newData[i].isApproved = 0;
        newData[i].isCancelled = 0;
        setUpcomingAppointments(newData);
      });
  }
  useEffect(() => {
    if (!userData.loadingApp) {
      if (userData.userInfo) {
        if (userData.businessAccountInfo) {
          setLoading(true);
          businessAccountController
            .getAppointments({
              userType: userData.userInfo.userRole,
              id:
                userData.userInfo.userRole === "PATIENT"
                  ? userData.userInfo.userId
                  : userData.businessAccountInfo.businessAccountId,
              pageNumber: pageNumber,
              recordsByPage: 2,
              body: filters,
            })
            .then((response) => {
              let appointmentsData = response.data.appointments;
              for (let i = 0; i < appointmentsData.length; i++) {
                appointmentsData[i].appointmentActualStartTime =
                  appointmentsData[i].appointmentActualStartTime &&
                  moment(
                    util.formatTimeByOffset(
                      new Date(
                        moment(
                          appointmentsData[i].appointmentActualStartTime,
                          "YYYY-MM-DD HH:mm:ss"
                        )
                      )
                    ),
                    "YYYY-MM-DD HH:mm:ss"
                  ).format("YYYY-MM-DD HH:mm:ss");
                appointmentsData[i].appointmentActualEndTime =
                  appointmentsData[i].appointmentActualEndTime &&
                  moment(
                    util.formatTimeByOffset(
                      new Date(
                        moment(
                          appointmentsData[i].appointmentActualEndTime,
                          "YYYY-MM-DD HH:mm:ss"
                        )
                      )
                    ),
                    "YYYY-MM-DD HH:mm:ss"
                  ).format("YYYY-MM-DD HH:mm:ss");
              }
              setUpcomingAppointments((app) => [...app, ...appointmentsData]);

              setTotalNumberOfPages(response.data.totalNumberOfPages);
            })
            .then(() => {
              setLoading(false);
            });
        }
      }
    }
  }, [userData.loadingApp, pageNumber, filters]);
  useEffect(() => {
    let allMyAppointments = [...upcomingAppointments];
    dispatch({
      type: "SET_MY_APPOINTMENTS",
      myAppointments: allMyAppointments,
    });
  }, [upcomingAppointments]);
  useEffect(() => {
    let tempAppointments = [...userData.appointmentModifications];
    let allMyAppointments = [...userData.myAppointments];

    for (let i = 0; i < tempAppointments.length; i++) {
      let indexOfAppointment = allMyAppointments.findIndex(
        (a) => a.appointmentId === tempAppointments[i].appointmentId
      );
      if (indexOfAppointment >= 0) {
        allMyAppointments[indexOfAppointment][tempAppointments[i].key] =
          tempAppointments[i].key === "slotStartTime"
            ? moment(
                util.formatTimeByOffset(
                  new Date(
                    moment(tempAppointments[i].value, "YYYY-MM-DD HH:mm:ss")
                  )
                ),
                "YYYY-MM-DD HH:mm:ss"
              ).format("YYYY-MM-DD HH:mm:ss")
            : tempAppointments[i].value;
      }
    }
    dispatch({
      type: "SET_MY_APPOINTMENTS",
      myAppointments: allMyAppointments,
    });
  }, [userData.appointmentModifications]);
  const [options, setOptions] = useState([
    { id: 2, value: "Upcoming" },
    { id: 3, value: "History" },
    { id: 4, value: "Accepted" },
    { id: 5, value: "Pending" },
    { id: 6, value: "Rejected" },
    { id: 7, value: "Cancelled" },
    { id: 8, value: "Not Cancelled" },
  ]);

  const tagRender = (props) => {
    const { label, closable, onClose } = props;

    const onPreventMouseDown = (event) => {
      event.preventDefault();
      event.stopPropagation();
    };
    return (
      <Tag
        color={"black"}
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
        style={{ marginRight: 3 }}
      >
        {label}
      </Tag>
    );
  };
  function onChangeFilters(e) {
    let array = e;
    let tempOptions = [...options];

    let indexOfCancelled = array.findIndex((u) => u === "Cancelled");
    let indexOfNotCancelled = array.findIndex((u) => u === "Not Cancelled");
    if (array[array.length - 1] === "All") {
      let index = tempOptions.findIndex((u) => u.value === "Upcoming");
      tempOptions.splice(index, 1);
      index = tempOptions.findIndex((u) => u.value === "History");
      tempOptions.splice(index, 1);
    } else if (array[array.length - 1] === "Upcoming") {
      let index = tempOptions.findIndex((u) => u.value === "History");
      tempOptions.splice(index, 1);
    } else if (array[array.length - 1] === "History") {
      let index = tempOptions.findIndex((u) => u.value === "Upcoming");
      tempOptions.splice(index, 1);
    } else {
      if (tempOptions.findIndex((u) => u.value === "Upcoming") < 0) {
        tempOptions.push({
          id: 2,
          value: "Upcoming",
        });
      }
      if (tempOptions.findIndex((u) => u.value === "History") < 0) {
        tempOptions.push({
          id: 3,
          value: "History",
        });
      }
    }

    if (array[array.length - 1] === "Accepted") {
      let index = tempOptions.findIndex((u) => u.value === "Rejected");
      tempOptions.splice(index, 1);
      index = tempOptions.findIndex((u) => u.value === "Pending");
      tempOptions.splice(index, 1);
    } else if (array[array.length - 1] === "Rejected") {
      let index = tempOptions.findIndex((u) => u.value === "Accepted");
      tempOptions.splice(index, 1);
      index = tempOptions.findIndex((u) => u.value === "Pending");
      tempOptions.splice(index, 1);
    } else if (array[array.length - 1] === "Pending") {
      let index = tempOptions.findIndex((u) => u.value === "Accepted");
      tempOptions.splice(index, 1);
      index = tempOptions.findIndex((u) => u.value === "Rejected");
      tempOptions.splice(index, 1);
    } else {
      if (tempOptions.findIndex((u) => u.value === "Accepted") < 0) {
        tempOptions.push({
          id: 4,
          value: "Accepted",
        });
      }
      if (tempOptions.findIndex((u) => u.value === "Pending") < 0) {
        tempOptions.push({
          id: 5,
          value: "Pending",
        });
      }
      if (tempOptions.findIndex((u) => u.value === "Rejected") < 0) {
        tempOptions.push({
          id: 6,
          value: "Rejected",
        });
      }
    }
    if (indexOfCancelled >= 0) {
      let index = tempOptions.findIndex((u) => u.value === "Not Cancelled");
      tempOptions.splice(index, 1);
    } else {
      let index = tempOptions.findIndex((u) => u.value === "Cancelled");
      if (index < 0) {
        tempOptions.push({
          id: 7,
          value: "Cancelled",
        });
      }
    }
    if (indexOfNotCancelled >= 0) {
      let index = tempOptions.findIndex((u) => u.value === "Cancelled");
      tempOptions.splice(index, 1);
    } else {
      let index = tempOptions.findIndex((u) => u.value === "Not Cancelled");
      if (index < 0 && indexOfCancelled < 0) {
        tempOptions.push({
          id: 8,
          value: "Not Cancelled",
        });
      }
    }
    tempOptions.sort(function (a, b) {
      return parseInt(a.id) - parseInt(b.id);
    });
    let tempFilters = {
      appointmentStatus: "",
      appointmentType: "ALL",
      isCancelled: -1,
    };
    if (array.findIndex((u) => u === "All") >= 0) {
      tempFilters.appointmentType = "ALL";
    } else if (array.findIndex((u) => u === "Upcoming") >= 0) {
      tempFilters.appointmentType = "UPCOMING";
    } else if (array.findIndex((u) => u === "History") >= 0) {
      tempFilters.appointmentType = "HISTORY";
    }

    if (array.findIndex((u) => u === "Accepted") >= 0) {
      tempFilters.appointmentStatus = "ACCEPTED";
    } else if (array.findIndex((u) => u === "Rejected") >= 0) {
      tempFilters.appointmentStatus = "REJECTED";
    } else if (array.findIndex((u) => u === "Pending") >= 0) {
      tempFilters.appointmentStatus = "PENDING";
    }
    if (array.findIndex((u) => u === "Cancelled") >= 0) {
      tempFilters.isCancelled = 1;
    } else if (array.findIndex((u) => u === "Not Cancelled") >= 0) {
      tempFilters.isCancelled = 0;
    }
    setUpcomingAppointments([]);
    setPageNumber(1);
    setFilters(tempFilters);
    setOptions(tempOptions);
  }
  function cancelAppointment(index) {
    userController
      .updateAppointment({
        body: {
          appointmentActualStartTime: null,
          appointmentActualEndTime: null,
          appointmentStatus: userData.myAppointments[index].appointmentStatus,
          isApproved: userData.myAppointments[index].isApproved,
          isCancelled: 1,
          slotFk: userData.myAppointments[index].slotId,
          userFk: userData.userInfo.userId,
          businessAccountUserId:
            userData.myAppointments[index].businessAccountUserId,
          cancelledBy: userData.userInfo.userRole,
          appointmentId: userData.myAppointments[index].appointmentId,
        },
      })
      .then(() => {
        let tempAppointments = [...userData.myAppointments];
        tempAppointments[index].isCancelled = true;
        dispatch({
          type: "SET_MY_APPOINTMENTS",
          myAppointments: tempAppointments,
        });
      });
  }

  const getAppPrescriptions = (id) => {
    businessAccountController
      .getAppointmentPrescription({
        appointmentId: id,
      })
      .then((response) => {
        setPrescriptionData(response.data);
      });
  };
  const modal2 = (
    <Modal
      open={prescriptionModal}
      onOk={handlePrescriptionOk}
      onCancel={handlePrescriptionCancel}
      okButtonProps={{
        disabled: false,
        hidden: false,
      }}
      cancelButtonProps={{
        disabled: true,
        hidden: true,
      }}
    >
      <div>
        {t("appointment_prescription") + ":"}{" "}
        {prescriptionData.result?.prescriptionDescription}
      </div>
    </Modal>
  );
  console.log(prescriptionData);
  const modal3 = (
    <Modal
    width={600}
      open={prescriptionModal}
      onOk={handlePrescriptionOk}
      onCancel={handlePrescriptionCancel}
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

        <div className="d-flex flex-column justify-content-center pe-4">
          <div className="all-txts4  " style={{ fontSize: "18px" }}>
            MediTouch
          </div>
          <div className="all-txts3">Your healthcare is our responsibility</div>
        </div>
      </div>
      <div
        className="d-flex mt-4 justify-content-start"
        style={{ gap: "20px" }}
      >
        <div className="d-flex ">
        <div className="all-txts1">
          Name:
        </div>
        <div className="all-txts1 ms-2" style={{borderBottom:"5px dotted rgb(219, 216, 216)"}}>
          {userData.userInfo?.firstName + " " + userData.userInfo?.lastName}
        </div>
        </div>
       
      </div>
      <div className="all-txts1 mt-4 p-3 prescription-info">
        {prescriptionData.result?.prescriptionDescription}
      </div>
    </Modal>
  );
  return (
    <Main>
      {modal}
      {modal2}
      {modal3}
      <div className="tabled">
      <Row gutter={[24, 0]}>

      
          <Col xs={24} md={24} sm={24} lg={24} xl={24}>
            <Card
              bordered={false}
              className="criclebox tablespace mb-24"
              title={t("all_appointments")}
              extra={
                <Select
                  mode="multiple"
                  placeholder="Select filter"
                  onChange={onChangeFilters}
                  showArrow
                  tagRender={tagRender}
                  style={{ width: "200px" }}
                  options={options}
                />
              }
            >
              <div className="appointments-wrapper row d-flex flex-wrap justify-content-between">
                {userData.myAppointments.map((ap, index) => {
                  return (
                    <div
                      key={index}
                      className="col-lg-5 col-md-5 col-sm-12 appointment-card mt-1 mb-2"
                    >
                      <div className="d-flex flex-column ">
                        <div
                          className="d-flex align-items-center "
                          style={{
                            borderBottom: "1px solid rgb(219, 216, 216)",
                          }}
                        >
                          <div className="me-2">
                            <Avatar.Group>
                              <Avatar
                                className="appointment-profile"
                                size={50}
                                shape="circle"
                                src={
                                 ap?.profilePicture
                                    ? ap?.profilePicture
                                    : avatar
                                }
                              />
                            </Avatar.Group>
                          </div>
                          <div className="d-flex flex-column justify-content-center all-txts1">
                            {ap.firstName + " " + ap.lastName}
                            {/* <div> {ap.serviceName}</div> */}
                            <div className="appointment-status">
                              {ap.appointmentStatus}
                            </div>
                          </div>
                        </div>
                        <div className="d-flex align-items-center mb-2 mt-2">
                          <div className="services-txt1 me-2">
                            {" "}
                            {t("service_name") + ":"}
                          </div>
                          <div className="services-txt1">{ap.serviceName}</div>
                        </div>
                        <div className="d-flex justify-content-between w-100 mb-2 ">
                          <div className="d-flex align-items-center appointment-datetime services-txt1 ">
                            <div className="me-2">
                              {" "}
                              <Calendar />
                            </div>
                            {ap.slotStartTime}
                          </div>
                          <div className="d-flex align-items-center appointment-datetime all-txts1">
                            <Dollor color={"black"} />
                            {ap.servicePrice + "" + ap.currencyUnit}
                          </div>
                        </div>
                        {ap.isCancelled ? (
                          <div className="d-flex  w-100 justify-content-center">
                            <Button type="primary" disabled className="w-100">
                              {t("cancelled")}
                            </Button>
                          </div>
                        ) : userData.userInfo?.userRole !== "PATIENT" ? (
                          <div className="mt-3">
                            {ap.appointmentStatus === "PENDING" ? (
                              <div className="d-flex  w-100 justify-content-between">
                                <Button
                                  type="primary"
                                  className="w-50"
                                  onClick={() => acceptAppointment(index)}
                                >
                                  {t("accept")}
                                </Button>
                                <Button
                                  className="w-50 mx-2"
                                  danger
                                  onClick={() => rejectAppointment(index)}
                                >
                                  {t("reject")}
                                </Button>
                              </div>
                            ) : ap.appointmentStatus === "ACCEPTED" ? (
                              <Button type="primary" disabled className="w-100">
                                {t("accepted")}
                              </Button>
                            ) : (
                              <Button danger className="w-100">
                                {t("rejected")}
                              </Button>
                            )}
                            {ap.appointmentActualEndTime !== undefined &&
                              ap.appointmentActualStartTime !== undefined && (
                                <Button
                                  type="primary"
                                  className="w-100 mt-3"
                                  onClick={() => {
                                    navigate("/referral", {
                                      state: {
                                        appointment: ap,
                                      },
                                    });
                                  }}
                                >
                                  {t("refer_doctor")}
                                </Button>
                              )}
                          </div>
                        ) : userData.userInfo?.userRole === "PATIENT" ? (
                          moment(ap.slotStartTime).isBefore(moment()) &&
                          ap.appointmentActualStartTime === undefined &&
                          ap.appointmentActualEndTime === undefined && 
                          ap.appointmentStatus !== "PENDING"? (
                            t("did_not_attend")
                          ) : ap.appointmentActualStartTime === undefined &&
                            ap.appointmentActualEndTime === undefined &&
                            moment(ap.slotStartTime).isAfter(
                              moment(moment(new Date()).subtract(1, "days"))
                            ) ? (
                            ap.appointmentStatus === "PENDING" && (
                              <div className="d-flex">
                                <Button
                                  type="primary"
                                  className="w-100 me-2 mt-3"
                                  onClick={() => {
                                    setAppointmentSelected(ap);
                                    setDoctorSelected({
                                      businessAccountId: ap.businessAccountFk,
                                    });
                                    setScheduleModal(true);
                                  }}
                                >
                                  {t("postpone_appointment")}
                                </Button>
                                <Button
                                  type="primary"
                                  className="w-100 mt-3"
                                  onClick={() => {
                                    cancelAppointment(index);
                                  }}
                                >
                                  {t("cancel_appointment")}
                                </Button>
                              </div>
                            )
                          ) : ap.prescriptionId === -1 ? (
                            ap.appointmentActualStartTime !== undefined &&
                            ap.appointmentActualEndTime === undefined ? (
                              "In Progress..."
                            ) : ap.appointmentActualStartTime !== undefined &&
                              ap.appointmentActualEndTime !== undefined ? (
                              "Prescription In Progress"
                            ) : (
                              ""
                            )
                          ) : (
                            <Button
                              type="primary"
                              onClick={() => {
                                setPrescriptionModal(true);
                                getAppPrescriptions(ap.appointmentId);
                              }}
                            >
                              {t("view_prescription")}
                            </Button>
                          )
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  );
                })}
                {!loading && upcomingAppointments.length === 0 && (
                  <div
                    style={{
                      textAlign: "center",

                      lineHeight: "32px",
                    }}
                  >
                    <Button>{t("no_data")}</Button>
                  </div>
                )}
                {loading && (
                  <div
                    className="mt-3"
                    style={{
                      textAlign: "center",

                      lineHeight: "32px",
                    }}
                  >
                    <Button
                      loading={loading}
                      onClick={() => setPageNumber(pageNumber + 1)}
                    >
                      {t("loading")}
                    </Button>
                  </div>
                )}
                {totalNumberOfPages > pageNumber && !loading && (
                  <div
                    className="mt-3"
                    style={{
                      textAlign: "center",

                      lineHeight: "32px",
                    }}
                  >
                    <Button onClick={() => setPageNumber(pageNumber + 1)}>
                      {t("load_more")}
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </Main>
  );
}

export default Appointments;
