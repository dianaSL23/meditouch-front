import React, { useEffect, useMemo, useState } from "react";

import Scheduler, {
  AppointmentDragging,
  View,
} from "devextreme-react/scheduler";

import "../assets/styles/schedule.css";
import Main from "../components/layout/Main";
import { Button, Calendar, InputNumber, Spin } from "antd";
import { util } from "../public/util";
import moment from "moment";

import classNames from "classnames";
import { businessAccountController } from "../controllers/businessAccountController";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

 
const draggingGroupName = "appointmentsGroup";

export default function Schedule() {
  const [t, i18n] = useTranslation();
  const [allSlots, setAllSlots] = useState([]);
  const [services, setServices] = useState([]);
  const [serviceSelected, setServiceSelected] = useState(-1);
  const [restTime, setRestTime] = useState(0);
  const [mySlots, setMySlots] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [slotDuration, setSlotDuration] = useState(20);
  const [daysOfWeek, setDaysOfWeek] = useState([]);
  const [daysChosen, setDaysChosen] = useState([]);
  let tempDaysOfWeek = util.getDaysOfWeekDates();
  const userData = useSelector((state) => state);

  const [times, setTimes] = useState({
    startTime: "09:00",
    endTime: "10:00",
  });
  useEffect(() => {
    if (!userData.loadingApp) {
      setLoadingData(true);
      businessAccountController
        .getServices({
          businessAccountFk: userData.businessAccountInfo.businessAccountId,
        })
        .then((response) => {
          setServices(response.data.services);
        });
      businessAccountController
        .getBusinessAccountSchedule({
          businessAccountId: userData.businessAccountInfo.businessAccountId,
          pageNumber: -1,
          recordsByPage: -1,
        })
        .then((response) => {
          if (response.data.responseCode !== -1) {
            let tempSchedule = [];
            let schedule = response.data.body.businessAccountSchedule;
            for (let i = 0; i < schedule.length; i++) {
              let json = {
                index: i,
                text: "",
                startDate: moment(
                  util.formatTimeByOffset(
                    new Date(
                      moment(schedule[i].slotStartTime, "YYYY-MM-DD HH:mm:ss")
                    )
                  ),
                  "YYYY-MM-DD HH:mm:ss"
                ).format("YYYY-MM-DD HH:mm:ss"),

                endDate: moment(
                  util.formatTimeByOffset(
                    new Date(
                      moment(schedule[i].slotEndTime, "YYYY-MM-DD HH:mm:ss")
                    )
                  ),
                  "YYYY-MM-DD HH:mm:ss"
                ).format("YYYY-MM-DD HH:mm:ss"),
                allDay: false,
              };
              tempSchedule.push(json);
            }
            if (tempSchedule.length > 0) {
              let tempSlotDuration = moment(tempSchedule[0].endDate).diff(
                moment(tempSchedule[0].startDate),
                "minutes"
              );
              setSlotDuration(tempSlotDuration);
            }

            setMySlots(tempSchedule);
          }
        })
        .then(() => {
          setLoadingData(false);
        });
    }
  }, [userData.loadingApp]);
  useEffect(() => {
    let days = [];
    let keys = Object.keys(tempDaysOfWeek);
    for (let i = 0; i < keys.length; i++) {
      days.push(tempDaysOfWeek[keys[i]]);
    }
    setDaysOfWeek(days);
  }, []);
  function onAppointmentDrag(e) {
    // let tempMySlots = [...mySlots];
    // let tempStart = e.itemData.startDate;
    // let index = e.itemData.index;
    // tempMySlots[index].text = moment(tempStart).format("dd HH:mm");
    // setMySlots(tempMySlots);
    console.log(e.itemData);
    console.log(mySlots);
  }
  function onAppointmentRemove(e) {
    let tempMySlots = [...mySlots];
    let tempAllSlots = [...allSlots];

    const index = mySlots.indexOf(e.itemData);

    if (index >= 0) {
      tempMySlots.splice(index, 1);
      tempAllSlots.push(e.itemData);

      setAllSlots(tempAllSlots);
      setMySlots(tempMySlots);
    }
  }

  function onAppointmentAdd(e) {
    let tempAllSlots = [...allSlots];
    let tempMySlots = [...mySlots];

    const index = tempAllSlots.indexOf(e.fromData);

    if (index >= 0) {
      tempAllSlots.splice(index, 1);
      tempMySlots.push(e.itemData);
      setAllSlots(tempAllSlots);
      setMySlots(tempMySlots);
    }
  }

  function modifyTiming(key, value) {
    let temptimes = { ...times };
    temptimes[key] = value;
    setTimes(temptimes);
  }
  const isOverlapping = (startDate1, endDate1, startDate2, endDate2) => {
    return (
      (startDate1.isBefore(endDate2) && startDate2.isBefore(endDate1)) ||
      (startDate1.isSame(startDate2) && endDate1.isSame(endDate2))
    );
  };
  function fetchSlots() {
    if (daysChosen.length === 0 || serviceSelected === -1) {
      toast.warning("Choose days or service", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
      });
      return;
    }
    let tempMySlots = [...mySlots];
    let keys = Object.keys(tempDaysOfWeek);
    let tempIndex = tempMySlots.length;
    for (let i = 0; i < daysChosen.length; i++) {
      let startTime =
        tempDaysOfWeek[keys[daysChosen[i]]] + " " + times.startTime;
      let endTime = tempDaysOfWeek[keys[daysChosen[i]]] + " " + times.endTime;
      let proceed = true;
      while (proceed) {
        let json = {
          index: tempIndex,
          text: "",
          startDate: "",
          endDate: "",
          allDay: false,
          serviceFk: serviceSelected,
        };
        json.startDate = moment(startTime, "YYYY-MM-DD HH:mm").toString();
        json.endDate = moment(startTime, "YYYY-MM-DD HH:mm")
          .add(slotDuration, "minutes")
          .format("YYYY-MM-DD HH:mm")
          .toString();
        json.text = "";
        tempMySlots.push(json);
        tempIndex++;
        startTime = moment(startTime, "YYYY-MM-DD HH:mm").add(
          slotDuration + restTime,
          "minutes"
        );
        if (moment(startTime).isSameOrAfter(moment(endTime))) {
          proceed = false;
        }
      }
    }
    let overlapped = false;
    for (let i = 0; i < tempMySlots.length; i++) {
      for (let j = i + 1; j < tempMySlots.length; j++) {
        if (
          isOverlapping(
            moment(tempMySlots[i].startDate),
            moment(tempMySlots[i].endDate),
            moment(tempMySlots[j].startDate),
            moment(tempMySlots[j].endDate)
          ) &&
          !overlapped
        ) {
          overlapped = true;
        }
        if (overlapped) {
          break;
        }
      }
      if (overlapped) {
        break;
      }
    }
    if (!overlapped) {
      setMySlots(tempMySlots);
    } else {
      toast.warning("timings overlap", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
      });
    }
  }
  function addSlots() {
    let body = [];
    for (let i = 0; i < mySlots.length; i++) {
      body.push({
        slotDate: moment(mySlots[i].startDate).format("YYYY-MM-DD").toString(),
        slotStartTime: util
          .convertTZ(
            moment(mySlots[i].startDate)
              .format("YYYY/MM/DD HH:mm:ss")
              .toString(),
            "Europe/Paris"
          )
          .format("YYYY-MM-DDTHH:mm:ss"),

        slotEndTime: util
          .convertTZ(
            moment(mySlots[i].endDate).format("YYYY/MM/DD HH:mm:ss").toString(),
            "Europe/Paris"
          )
          .format("YYYY-MM-DDTHH:mm:ss"),
        serviceFk: serviceSelected,
      });
    }
    businessAccountController
      .setSchedule({
        businessAccountId: userData.businessAccountInfo.businessAccountId,
        body: body,
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
        } else {
          toast.success(data.message, {
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
  function deleteSchedule() {
    businessAccountController
      .deleteSchedule({
        businessAccountId: userData.businessAccountInfo.businessAccountId,
      })
      .then(() => {
        setMySlots([]);
      });
  }
  const [currentDate, setCurrentDate] = useState(new Date());
  const minDate = moment(daysOfWeek[0]) 
  const maxDate = moment(daysOfWeek[daysOfWeek.length - 1]) 
  return (
    <Main>
      <div className="d-flex justify-content-between schedule-btns">
        <div className="d-flex" style={{ gap: "10px" }}>
          <select
            onChange={(e) => setServiceSelected(e.target.value)}
            defaultValue={-1}
            className="schedule-time-date"
          >
            <option disabled value={-1}>
            {t("select_service")}
            </option>
            {services.map((service, index) => {
              return (
                <option value={service.serviceId}>{service.serviceName}</option>
              );
            })}
          </select>
          <InputNumber
            className="schedule-time-date"
            size="large"
            min={1}
            max={60}
            defaultValue={slotDuration}
            onChange={setSlotDuration}
          />
          <input
            className="schedule-time-date "
            style={{paddingTop:"2px"}}
            type={"time"}
            value={times.startTime}
            onChange={(e) => modifyTiming("startTime", e.target.value)}
          />
          <input
            className="schedule-time-date"
            type={"time"}
            style={{paddingTop:"2px"}}
            value={times.endTime}
            onChange={(e) => modifyTiming("endTime", e.target.value)}
          />
          <InputNumber
            className="schedule-time-date"
            size="large"
            min={1}
            max={60}
            defaultValue={restTime}
            onChange={setRestTime}
          />
        </div>

        <div className="d-flex align-items-center" style={{ gap: "5px" }}>
       
          {daysOfWeek.map((day, index) => {
            return (         
              <div
                title={moment(day).format("YYYY-MM-DD")}
                key={"day" + index}
                onClick={() => {
                  let tempDaysChosen = [...daysChosen];
                  let dayIndex = tempDaysChosen.findIndex((i) => i === index);
                  if (dayIndex < 0) {
                    tempDaysChosen.push(index);
                  } else {
                    tempDaysChosen.splice(dayIndex, 1);
                  }
                  setDaysChosen(tempDaysChosen);
                }}
                className={classNames("schedule-day ", {
                  "chosen-schedule-day":
                    daysChosen.findIndex((i) => i === index) >= 0,
                })}
              >
                {moment(day).format("dd")}
              </div>
       
            );
          })}
           

          <Button type="primary" onClick={() => fetchSlots()}>
          {t("publish_slots")}
          </Button>
          <Button type="primary" onClick={() => addSlots()}>
          {t("add_slots")}
          </Button>
          {mySlots.length !== 0 && (
            <Button type="primary" onClick={() => deleteSchedule()}>
            {t("delete_schedule")}
            </Button>
         
          )}
       
        </div>
      </div>
      <div className="d-flex h-100 justify-content-center align-items-center w-100 mt-3">
        {loadingData || daysOfWeek.length === 0 ? (
          <Spin tip="Loading" size="large">
            <div className="content" />
          </Spin>
        ) : (
          // <Scheduler
          //   min={new Date(daysOfWeek[0])}
          //   max={new Date(daysOfWeek[daysOfWeek.length - 1])}
          //   id="scheduler"
          //   dataSource={mySlots}
          //   defaultCurrentView="Vertical Grouping"
          //   defaultCurrentDate={currentDate}
          //   startDayHour={9}
          //   maxAppointmentsPerCell={1}
        
          //   editing={{
          //     allowDeleting: true,
          //     allowDragging: true,
          //     allowAdding: true,
          //   }}
          //   crossScrollingEnabled={true}
          //   showAllDayPanel={false}
          // >
          //   <View
          //     name="Weekly Schedule"
          //     type="week"
          //     groupOrientation="vertical"
          //     cellDuration={slotDuration}
          //   />
          //   <AppointmentDragging
          //     group={draggingGroupName}
          //     onRemove={onAppointmentRemove}
          //     onAdd={onAppointmentAdd}
          //     onDragEnd={onAppointmentDrag}
          //   />
          // </Scheduler>
          <Calendar
          mode="week"
          validRange={[minDate, maxDate]} // Set the valid range of dates
          showHeader={false}
          showTime
          dateCellRender={(date) => {
            const slotsForDate = mySlots.filter(
              (slot) => moment(slot.startDate).isSame(date, 'day')
            );
            return (
              <ul>
                {slotsForDate.map((slot) => (
                  <li key={slot.index}>{moment(slot.startDate).format('HH:mm')}</li>
                ))}
              </ul>
            );
          }}
        />
        )}
      </div>
    </Main>
  );
}
