import { Avatar, Badge, Button, Card, Col, Empty, Modal, Row } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import Lock from "../icons/lock";
import { util } from "../public/util";
import "../assets/styles/search-item.css";
import { useDispatch, useSelector } from "react-redux";
import { userController } from "../controllers/userController";
import avatar from "../assets/images/avatar.jpg";
import classNames from "classnames";
import {
  ExclamationCircleOutlined,
  HeartFilled,
  HeartOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function SearchItem({ item }) {
  const [daysOfWeek, setDaysOfWeek] = useState([]);
  const [loadingSchedule, setLoadingSchedule] = useState(true);
  const [appointmentDescription, setAppointmentDescription] = useState("");
  const [slotLocked, setSlotLocked] = useState(-1);
  const [isSlotReserved, setIsSlotReserved] = useState(false);
  const [loadingIsReservedSlot, setLoadingIsReservedSlot] = useState(false);
  const [reservedModal, setReservedModal] = useState(false);
  const userData = useSelector((state) => state);
  const [dayChosen, setDayChosen] = useState(0);
  const [doctorSchedule, setDoctorSchedule] = useState([]);
  const [appointmentModal, setAppointmentModal] = useState(false);
  function formatSchedule(schedule) {
    for (let i = 0; i < schedule.length; i++) {
      schedule[i].slotStartTime = moment(
        util.formatTimeByOffset(
          new Date(moment(schedule[i].slotStartTime, "YYYY-MM-DD HH:mm:ss"))
        ),
        "YYYY-MM-DD HH:mm:ss"
      ).format("YYYY-MM-DD HH:mm:ss");
      schedule[i].slotEndTime = moment(
        util.formatTimeByOffset(
          new Date(moment(schedule[i].slotEndTime, "YYYY-MM-DD HH:mm:ss"))
        ),
        "YYYY-MM-DD HH:mm:ss"
      ).format("YYYY-MM-DD HH:mm:ss");
      if (
        moment(schedule[i].slotStartTime).isSameOrBefore(moment(new Date()))
      ) {
        schedule[i].disabled = true;
      } else {
        schedule[i].disabled = false;
      }
    }
    setDoctorSchedule(schedule);
    setLoadingSchedule(false);
  }
  useEffect(() => {
    let indexOfBusinessAccountFk = userData.schedules.findIndex(
      (s) => s?.businessAccountFk === item.userDetails?.businessAccountId
    );
    if (indexOfBusinessAccountFk >= 0) {
      setLoadingSchedule(true);

      let tempSchedule = userData.schedules[indexOfBusinessAccountFk].schedule;

      formatSchedule(tempSchedule);
    }
  }, [userData.schedules]);
  useEffect(() => {
    let schedule = item.userSchedule;

    if (schedule) {
      formatSchedule(schedule);
    }
  }, []);

  const [slotIndexChosen, setSlotIndexChosen] = useState(0);
  const [slots, setSlots] = useState([]);
  console.log(slots);
  const dispatch = useDispatch();

  useEffect(() => {
    let daysOfWeek = util.getDaysOfWeekDates();
    let days = [];
    let keys = Object.keys(daysOfWeek);
    for (let i = 0; i < keys.length; i++) {
      days.push(daysOfWeek[keys[i]]);
    }
    setDaysOfWeek(days);
  }, []);
  useEffect(() => {
    if (!loadingSchedule) {
      let schedule = [...doctorSchedule];

      schedule = schedule.filter((s) => s.slotDate === daysOfWeek[dayChosen]);
      schedule.sort(
        (a, b) => new Date(a.slotStartTime) - new Date(b.slotStartTime)
      );
      let indexOfNotLockedSlot = schedule.findIndex(
        (s) =>
          s.isLocked === false && s.isReserved === false && s.disabled === false
      );
      if (indexOfNotLockedSlot < 0) {
        setSlotIndexChosen(-1);
      } else {
        setSlotIndexChosen(indexOfNotLockedSlot);
      }
      setSlots(schedule);
    }
  }, [dayChosen, daysOfWeek, doctorSchedule]);
  useEffect(() => {
    if (!appointmentModal) {
      setAppointmentDescription("");
    }
  }, [appointmentModal]);
  function reserveAppointment() {
    if (util.isUserAuthorized()) {
      if (appointmentDescription.replace(/\s+/g, "") === "") {
        toast.warning("Add description to your appointment", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
        });
        return;
      }
      userController
        .registerAppointment({
          body: {
            slotFk: slots[slotIndexChosen].slotId,
            businessAccountFk: item.userDetails?.businessAccountId,
            businessAccountUserId: item.userDetails?.userId,
            userFk: userData.userInfo?.userId,
            serviceFk: slots[slotIndexChosen].serviceId,
            appointmentDescription: appointmentDescription,
          },
        })
        .then((response) => {
          toast.success(response.data.message, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
          });
          setAppointmentModal(false);
        });
    } else {
      toast.warning("Login First", {
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
    let tempSlots = [...slots];
    let tempSlotIndexChosen = -1;
    for (let i = 0; i < userData.reservedSlots.length; i++) {
      let reservedSlot = userData.reservedSlots[i];
      if (reservedSlot.type === "ADD") {
        let indexOfSlot = tempSlots.findIndex(
          (s) => s.slotId === reservedSlot.reservedSlotId
        );
        if (indexOfSlot >= 0) {
          tempSlots[indexOfSlot].isReserved = true;
          let indexOfNotLockedSlot = tempSlots.findIndex(
            (s) => s.isLocked === false && s.isReserved === false
          );
          if (indexOfNotLockedSlot < 0) {
            tempSlotIndexChosen = -1;
          } else {
            tempSlotIndexChosen = indexOfNotLockedSlot;
          }
        }
      } else {
        let indexOfSlot = tempSlots.findIndex(
          (s) => s.slotId === reservedSlot.reservedSlotId
        );
        if (indexOfSlot >= 0) {
          tempSlots[indexOfSlot].isReserved = false;
          let indexOfNotLockedSlot = tempSlots.findIndex(
            (s) => s.isLocked === false && s.isReserved === false
          );
          if (indexOfNotLockedSlot < 0) {
            tempSlotIndexChosen = -1;
          } else {
            tempSlotIndexChosen = indexOfNotLockedSlot;
          }
        }
      }
    }
    setSlotIndexChosen(tempSlotIndexChosen);
    setSlots(tempSlots);
  }, [userData.reservedSlots]);
  function modifyFavorite() {
    let indexOfFavorite = userData.favoriteDoctors.findIndex(
      (d) => d.businessAccountFk === item.userDetails?.businessAccountId
    );
    if (indexOfFavorite >= 0) {
      userController.deleteFavorite({
        favoriteId: userData.favoriteDoctors[indexOfFavorite].favoriteId,
      });
    } else {
      userController.addFavorite({
        body: {
          businessAccountFk: item.userDetails?.businessAccountId,
          userFk: userData.userInfo.userId,
        },
      });
    }
    window.location.reload();
  }
  const handleOk = (e) => {
    setReservedModal(false);
    setSlotLocked(-1);
  };
  const handleCancel = (e) => {
    setReservedModal(false);
    setSlotLocked(-1);
  };
  useEffect(() => {
    if (slotLocked !== -1) {
      setLoadingIsReservedSlot(true);
      let slot = slots[slotLocked];
      userController
        .isSlotReservedByUser({
          userId: userData.userInfo.userId,
          slotFk: slot.slotId,
        })
        .then((response) => {
          setIsSlotReserved(response.data.responseCode === 200 ? true : false);
        })
        .then(() => {
          setLoadingIsReservedSlot(false);
        });
    }
  }, [slotLocked]);
  function reserveSlot() {
    userController
      .addReservationSlot({
        body: {
          userFk: userData.userInfo.userId,
          slotFk: slots[slotLocked].slotId,
        },
      })
      .then(() => {
        setReservedModal(false);
        setSlotLocked(-1);
      });
  }
  function removeReservationSlot() {
    userController
      .deleteReservationSlotBySlot({
        userFk: userData.userInfo.userId,
        slotFk: slots[slotLocked].slotId,
      })
      .then(() => {
        setReservedModal(false);
        setSlotLocked(-1);
      });
  }
  const modal = (
    <Modal
      open={reservedModal}
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
      <div className="d-flex justify-content-center w-100 all-txts">
        {loadingIsReservedSlot
          ? "loading..."
          : isSlotReserved
          ? "You already reserved this slot"
          : "This slot is taken. You can reserve it if the patient cancels the appointment. A notification will be sent to you when it is free"}
      </div>
      {!loadingIsReservedSlot &&
        (!isSlotReserved ? (
          <div className="d-flex justify-content-center w-100">
            <Button
              type="primary"
              onClick={() => reserveSlot()}
              className="mt-3"
            >
              Agree
            </Button>
          </div>
        ) : (
          <div className="d-flex justify-content-center w-100">
            <Button type="primary" onClick={() => removeReservationSlot()}>
              Remove Reservation
            </Button>
          </div>
        ))}
    </Modal>
  );
  const appointmentModalUi = (
    <Modal
      open={appointmentModal}
      onOk={() => {
        if (userData.userMedicalInfo.height !== 0) {
          reserveAppointment();
        } else {
          setAppointmentModal(false);
        }
      }}
      onCancel={() => setAppointmentModal(false)}
      okButtonProps={{
        disabled: false,
        hidden: false,
      }}
      cancelButtonProps={{
        disabled: true,
        hidden: true,
      }}
    >
      {userData.userMedicalInfo.height !== 0 ? (
        <div>
          <div className="all-txts">
            Are you sure you want to reserve this appointment?
          </div>
          <div className="d-flex align-items-center mt-2">
            <div className="all-txts me-2"> Doctor Name: </div>
            {item.userDetails.firstName + " " + item.userDetails?.lastName}
          </div>
          <div className="d-flex align-items-center mt-2">
            <div className="all-txts me-2">Speciality Name: </div>
            <div>{item.userDetails.specialityName}</div>
          </div>
          <div className="d-flex align-items-center mt-2">
            <div className="all-txts me-2"> Service Name and Price: </div>
            <div>
              {slots[slotIndexChosen]?.serviceName +
                " for" +
                slots[slotIndexChosen]?.servicePrice +
                " " +
                slots[slotIndexChosen]?.currencyUnit}
            </div>
          </div>
          <div className="d-flex align-items-center mt-2">
            <div className="all-txts me-2">Appointment Time: </div>
            <div>{slots[slotIndexChosen]?.slotStartTime}</div>
          </div>
          <div className="d-flex flex-column mt-2">
            <div className="all-txts me-2">Appointment Description: </div>
            <div className="appointment-desc-input-wrapper mt-1">
              <textarea
                className="appointment-info-input mt-2 pt-2"
                type="text"
                value={appointmentDescription}
                onChange={(e) => setAppointmentDescription(e.target.value)}
                placeholder="Appointment Description"
              />
            </div>
          </div>
        </div>
      ) : (
        <div>
          Please complete your{" "}
          <Link to="/patient-details" className="text-dark font-bold ">
            medical information
          </Link>{" "}
          to be able to reserve an appointment
        </div>
      )}
    </Modal>
  );

  return (
    <Col
      xs={24}
      sm={24}
      md={12}
      lg={9}
      xl={10}
      style={{ marginBottom: "10px" }}
    >
      {modal}
      {appointmentModalUi}

      <Card
        title={
          <div className="d-flex justify-content-between">
            <Avatar.Group>
              <Avatar
                className="appointment-profile"
                size={50}
                shape="circle"
                src={
                  item.userDetails?.profilePicture
                    ? item.userDetails?.profilePicture
                    : avatar
                }
              />

              <div className="avatar-info ms-2">
                <div className="">
                  {item.userDetails?.firstName +
                    " " +
                    item.userDetails?.lastName}
                </div>
                <p>{item.userDetails?.specialityName}</p>
              </div>
            </Avatar.Group>
            {util.isUserAuthorized() &&
              (item.userDetails?.businessAccountId !==
              userData.businessAccountInfo?.businessAccountId ? (
                <div
                  title={
                    userData.favoriteDoctors.findIndex(
                      (d) =>
                        d.businessAccountFk ===
                        item.userDetails?.businessAccountId
                    ) >= 0
                      ? "Remove Favorite"
                      : "Add Favorite"
                  }
                  onClick={() => modifyFavorite()}
                >
                  {userData.favoriteDoctors.findIndex(
                    (d) =>
                      d.businessAccountFk ===
                      item.userDetails?.businessAccountId
                  ) >= 0 ? (
                    <HeartFilled />
                  ) : (
                    <HeartOutlined />
                  )}
                </div>
              ) : (
                <></>
              ))}
          </div>
        }
      >
        <div className="global-search-card-body">
          <div className="global-search-card-titles">
            {slotIndexChosen !== -1 && (
              <div>
                <div className="services-txt">
                  {" Service Name : " + slots[slotIndexChosen]?.serviceName}
                </div>
                <div className="services-txt">
                  {" Service Price : " +
                    slots[slotIndexChosen]?.servicePrice +
                    " " +
                    slots[slotIndexChosen]?.currencyUnit}
                </div>
              </div>
            )}
          </div>
          <div>
            <div className="global-search-card-titles services-txt">
              Schedule between {moment(daysOfWeek[0]).format("YYYY-MM-DD")} and{" "}
              {moment(daysOfWeek[daysOfWeek.length - 1]).format("YYYY-MM-DD")}
            </div>
            <Row
              className="display-flex align-items-center justify-content-center  mt-3"
              gutter={[24, 0]}
            >
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
                    key={
                      "day" + item.userDetails?.businessAccountId + "" + index
                    }
                    className="slots-time"
                  >
                    <div
                      className={classNames(
                        "global-search-card-schedule-days ",
                        {
                          "global-search-card-selected-schedule-days":
                            dayChosen === index,
                        }
                      )}
                    >
                      {moment(day).format("dd")}
                    </div>
                  </Col>
                );
              })}
            </Row>
            <div
              className={classNames(
                "d-flex justify-content-center flex-wrap mt-3 all-slots",
                {}
              )}
            >
              {slots.length === 0 ? (
                <Empty description="No Slots" />
              ) : (
                slots.map((slot, index) => {
                  return (
                    <div
                      className={classNames(
                        "d-flex search-item-slot align-items-center global-search-card-schedule-slots",
                        {
                          "global-search-card-disabled-schedule-slot":
                            slot.disabled,
                          "global-search-card-locked-schedule-slot":
                            slot.isLocked && !slot.disabled,

                          "global-search-card-reserved-schedule-slot":
                            slot.isReserved && !slot.disabled,
                          "global-search-card-can-reserve-schedule-slot":
                            slot.isLocked === false &&
                            slot.isReserved === true &&
                            !slot.disabled,
                          "global-search-card-selected-schedule-slot":
                            slotIndexChosen === index,
                        }
                      )}
                      onClick={() => {
                        if (
                          slot.isLocked === false &&
                          slot.isReserved &&
                          !slot.disabled
                        ) {
                          setSlotLocked(index);
                          setReservedModal(true);
                        }
                        if (
                          slot.isLocked === false &&
                          !slot.isReserved &&
                          !slot.disabled
                        ) {
                          setSlotIndexChosen(index);
                        }
                      }}
                      key={
                        "slot" +
                        item.userDetails?.businessAccountId +
                        "" +
                        index
                      }
                    >
                      {slot.isLocked && <Lock />}
                      {moment(slot.slotStartTime).format("HH:mm")} -
                      {moment(slot.slotEndTime).format("HH:mm")}
                    </div>
                  );
                })
              )}
            </div>
            {slots.length !== 0 && (
              <div className="d-flex align-items-center mt-3 all-txts1 ms-3">
                <Badge status="default" />
                Reserved slots
                <div
                  style={{ cursor: "pointer" }}
                  title="Click on this slot to reserve it for futture cancelation"
                  className="mx-1"
                >
                  <ExclamationCircleOutlined />
                </div>
              </div>
            )}
            <div className="w-100 justify-content-center d-flex mt-3">
              <Button
                type={slotIndexChosen !== -1 ? "primary" : ""}
                // disabled={slotIndexChosen === -1 || userData.userInfo.userId === item.userDetails.userId}
                disabled={
                  slotIndexChosen === -1 ||
                  userData.userInfo?.userRole !== "PATIENT" ||
                  item.userDetails.blockId !== -1
                }
                onClick={() => setAppointmentModal(true)}
              >
                Reserve Appointment
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </Col>
  );
}
