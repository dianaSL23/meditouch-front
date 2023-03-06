import React, { useEffect, useRef, useState } from "react";
import Stomp from "stompjs";
import SockJS from "sockjs-client";
import { useDispatch, useSelector } from "react-redux";
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
  const favoriteDoctors = useRef([]);

  useEffect(() => {
    communityPostsRef.current = userData.communityPosts;
  }, [userData.communityPosts]);
  useEffect(() => {
    reservedSlots.current = userData.reservedSlots;
  }, [userData.reservedSlots]);
  useEffect(() => {
    favoriteDoctors.current = userData.favoriteDoctors;
  }, [userData.favoriteDoctors]);
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
            var reservedSlotId = JSON.parse(payload.body).reservedSlot;
            let allReservedSlots = [reservedSlotId, ...reservedSlots.current];
            dispatch({
              type: "SET_RESERVED_SLOTS",
              reservedSlots: allReservedSlots,
            });
          }
        );

        stompClientRef.current.subscribe(
          "/topic/communityPosts/",
          function (payload) {
            var message = JSON.parse(payload.body).communityPost;
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
      });
    }
  }
  useEffect(() => {
    if (userData.userInfo !== null && stompClientRef.current && connected) {
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
        "/topic/clinicTurn/" + userData.userInfo.userId,
        function (payload) {
          var message = JSON.parse(payload.body);
          console.log("Received: " + message.message);
        }
      );
    }
  }, [userData.userInfo, connected]);
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