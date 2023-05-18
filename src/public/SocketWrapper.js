import React, { useEffect, useRef, useState } from "react";
import Stomp from "stompjs";
import SockJS from "sockjs-client";
import { useDispatch, useSelector } from "react-redux";
import { userController } from "../controllers/userController";
import { util } from "./util";
import moment from "moment";
export const SocketWrapperContext = React.createContext("");
export const SocketWrapperProvider = ({ ...props }) => {
  const [connected, setConnected] = useState(false);
  let stompClientRef = useRef(null);
  const dispatch = useDispatch();
  const userData = useSelector((state) => state);
  const communityPostsRef = useRef({
    pageNumber: -1,
    totalNumberOfPages: 1,
    posts: [],
  });
  const reservedSlots = useRef([]);
  const myReservedSlots = useRef([]);
  const myReferrals = useRef([]);

  const favoriteDoctors = useRef([]);
  const myAppointments = useRef([]);
  const notifications = useRef([]);
  const specialities = useRef([]);
  const schedules = useRef([]);
  const appointmentModifications = useRef();
 
  useEffect(() => {
    appointmentModifications.current = userData.appointmentModifications;
  }, [userData.appointmentModifications]);
  useEffect(() => {
    communityPostsRef.current = userData.communityPosts;
  }, [userData.communityPosts]);
  useEffect(() => {
    schedules.current = userData.schedules;
  }, [userData.schedules]);
  useEffect(() => {
    reservedSlots.current = userData.reservedSlots;
  }, [userData.reservedSlots]);
  useEffect(() => {
    myAppointments.current = userData.myAppointments;
  }, [userData.myAppointments]);
  useEffect(() => {
    notifications.current = userData.notifications;
  }, [userData.notifications]);
  useEffect(() => {
    myReservedSlots.current = userData.myReservedSlots;
  }, [userData.myReservedSlots]);
  useEffect(() => {
    myReferrals.current = userData.myReferrals;
  }, [userData.myReferrals]);
  useEffect(() => {
    if (userData.specialities.length === 0) {
      userController.getSpecialities().then((response) => {
        specialities.current = response.data.specialities;
        dispatch({
          type: "SET_SPECIALITIES",
          specialities: specialities.current,
        });
      });
    }
  }, []);
  useEffect(() => {
    if (stompClientRef.current === null) {
      connect();
    }
  }, []);
  function connect() {
    if (!connected) {
      let socket = new SockJS("http://localhost:8080/ws");
      stompClientRef.current = Stomp.over(socket);
      stompClientRef.current.connect({}, function (frame) {
        console.log("Connected: " + frame);
        setConnected(true);
        stompClientRef.current.subscribe(
          "/topic/greetings",
          function (greeting) {
            var message = JSON.parse(greeting.body);
            console.log("Received: " + message.name);
          }
        );

        stompClientRef.current.subscribe(
          "/topic/reservedSlots/",
          function (payload) {
            var reservedSlot = JSON.parse(payload.body);
            let allReservedSlots = [...reservedSlots.current, reservedSlot];

            dispatch({
              type: "SET_RESERVED_SLOTS",
              reservedSlots: allReservedSlots,
            });
          }
        );

        stompClientRef.current.subscribe(
          "/topic/schedules",
          function (payload) {
            var body = JSON.parse(payload.body);
            let businessAccountFk = body.businessAccountFk;
            let tempSchedules = [...schedules.current];
            let indexOfBusinessAccountFk = tempSchedules.findIndex(
              (s) => s?.businessAccountFk === businessAccountFk
            );
            if (indexOfBusinessAccountFk < 0) {
              tempSchedules.push({
                businessAccountFk: businessAccountFk,
                schedule: body.schedule,
              });
            } else {
              tempSchedules[indexOfBusinessAccountFk] = body.schedule;
            }

            dispatch({
              type: "SET_SCHEDULES",
              schedules: tempSchedules,
            });
          }
        );

        stompClientRef.current.subscribe(
          "/topic/communityPosts/",
          function (payload) {
            var message = JSON.parse(payload.body).communityPost;
            message.communityPostComments = {
              pageNumber: -1,
              totalNumberOfPages: 1,
              comments: [],
            };
            let allCommunityPosts = [
              message,
              ...communityPostsRef.current.posts,
            ];
            dispatch({
              type: "SET_COMMUNITY_POSTS",
              communityPosts: {
                pageNumber: communityPostsRef.current.pageNumber,
                totalNumberOfPages:
                  communityPostsRef.current.totalNumberOfPages,
                posts: allCommunityPosts,
              },
            });
          }
        );

        stompClientRef.current.subscribe(
          "/topic/communityPostComment/",
          function (payload) {
            var message = JSON.parse(payload.body);
            let indexOfPost = communityPostsRef.current.posts.findIndex(
              (p) => (p.postId = message.postId)
            );
            communityPostsRef.current.posts[indexOfPost].commentCount =
              communityPostsRef.current.posts[indexOfPost].commentCount + 1;
            communityPostsRef.current.posts[
              indexOfPost
            ].communityPostComments.comments.unshift(message);
            dispatch({
              type: "SET_COMMUNITY_POSTS",
              communityPosts: {
                pageNumber: communityPostsRef.current.pageNumber,
                totalNumberOfPages:
                  communityPostsRef.current.totalNumberOfPages,
                posts: communityPostsRef.current.posts,
              },
            });
          }
        );
      });
    }
  }
  useEffect(() => {
    if (
      !userData.loadingApp &&
      stompClientRef.current &&
      connected &&
      util.isUserAuthorized()
    ) {
      stompClientRef.current.subscribe(
        "/topic/notifications/" + userData.userInfo.userId,
        function (payload) {
          var newNotification = JSON.parse(payload.body);
          let notificationText = newNotification.notificationText;
          let outputString = notificationText.replace(
            /\[.*?\]/g,
            function (match, captureGroup) {
              let date = match.substring(1, match.length - 1);
              date = moment(
                util.formatTimeByOffset(
                  new Date(moment(date, "YYYY-MM-DD HH:mm:ss"))
                ),
                "YYYY-MM-DD HH:mm:ss"
              ).format("YYYY-MM-DD HH:mm:ss");
              return date;
            }
          );
          newNotification.notificationText = outputString;

          let allNotifications = [newNotification, ...notifications.current.notifications];
          dispatch({
            type: "SET_MY_NOTIFICATIONS",
            notifications: {
              notifications: allNotifications,
              pageNumber: userData.notifications.pageNumber,
              totalNumberOfPages: userData.notifications.totalNumberOfPages,
            },
          });
        }
      );

      // stompClientRef.current.subscribe(
      //   "/topic/addAppointment/" + userData.userInfo.userId,
      //   function (payload) {
      //     var appointment = JSON.parse(payload.body).appointment;
      //     let allMyAppointments = [appointment, ...myAppointments.current];
      //     dispatch({
      //       type: "SET_MY_APPOINTMENTS",
      //       myAppointments: allMyAppointments,
      //     });
      //   }
      // );

      stompClientRef.current.subscribe(
        "/topic/favoriteDoctors/" + userData.userInfo.userId,
        function (payload) {
          var message = JSON.parse(payload.body);
          let allFavoriteDoctors = [...favoriteDoctors.current];
          if (message.type === "ADD") {
            allFavoriteDoctors.push(message.favoriteDoctorInfo);
          } else {
            let indexOfFavorite = allFavoriteDoctors.findIndex(
              (fd) => fd.favoriteId === message.favoriteId
            );
            allFavoriteDoctors.splice(indexOfFavorite, 1);
          }
          dispatch({
            type: "SET_FAVORITE_DOCTORS",
            favoriteDoctors: allFavoriteDoctors,
          });
        }
      );

      stompClientRef.current.subscribe(
        "/topic/myReservedSlots/" + userData.userInfo.userId,
        function (payload) {
          var newMyReservedSlots = JSON.parse(payload.body);
          if (newMyReservedSlots.message === "ADD") {
            let allMyReservedSlots = [
              newMyReservedSlots.reservation,
              ...myReservedSlots.current.slots,
            ];
            dispatch({
              type: "SET_MY_RESERVED_SLOTS",
              myReservedSlots: {
                loaded: userData.myReservedSlots.loaded,
                slots: allMyReservedSlots,
              },
            });
          } else {
            let allMyReservedSlots = [...myReservedSlots.current.slots];
            let index = allMyReservedSlots.findIndex(
              (rs) => rs.reservationId === newMyReservedSlots.reservationId
            );
            allMyReservedSlots.splice(index, 1);
            dispatch({
              type: "SET_MY_RESERVED_SLOTS",
              myReservedSlots: {
                loaded: userData.myReservedSlots.loaded,
                slots: allMyReservedSlots,
              },
            });
          }
        }
      );

      stompClientRef.current.subscribe(
        "/topic/clinicTurn/" + userData.userInfo.userId,
        function (payload) {
          var message = JSON.parse(payload.body);
          console.log("Received: " + message.message);
        }
      );

      stompClientRef.current.subscribe(
        "/topic/appointmentModifications/" + userData.userInfo.userId,
        function (payload) {
          var appointment = JSON.parse(payload.body);
          let allMyAppointmentsModifications = [
            appointment,
            ...appointmentModifications.current,
          ];
          dispatch({
            type: "SET_APPOINTMENT_MODIFICATIONS",
            appointmentModifications: allMyAppointmentsModifications,
          });
        }
      );

      stompClientRef.current.subscribe(
        "/topic/referral/" + userData.userInfo.userId,
        function (payload) {
          var referral = JSON.parse(payload.body);
          referral.socket = true;
          let allMyReferral = [referral, ...myReferrals.current];
          dispatch({
            type: "SET_REFERRALS",
            myReferrals: allMyReferral,
          });
        }
      );
      stompClientRef.current.subscribe(
        "/topic/appointmentModifications/" + userData.userInfo.userId,
        function (payload) {
          var appointment = JSON.parse(payload.body);
          let allMyAppointmentsModifications = [
            appointment,
            ...appointmentModifications.current,
          ];
          dispatch({
            type: "SET_APPOINTMENT_MODIFICATIONS",
            appointmentModifications: allMyAppointmentsModifications,
          });
        }
      );
    }
  }, [userData.loadingApp, connected]);
  useEffect(() => {
    if (connected) {
      stompClientRef.current.send(
        "/app/hello",
        {},
        JSON.stringify({ firstName: "Mohammad" })
      );
    }
  }, [connected]);
  return (
    <SocketWrapperContext.Provider value={{}}>
      {props.children}
    </SocketWrapperContext.Provider>
  );
};
