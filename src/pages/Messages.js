import React, { useEffect, useState } from "react";
import Main from "../components/layout/Main";
import { userController } from "../controllers/userController";

const Messages = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    userController.getMessages({}).then((response) => {
      setData(response.data.Messages);
    });
  }, []);
  return (
    <Main>
    {Array.isArray(data) &&
      data.map((item, i) => {
        return (
          <div className="d-flex flex-column" key={item.contactId}>
            <div>First Name :{item.firstName}</div>
            <div>Last Name :{item.lastName}</div>
            <div>Subject : {item.subject}</div>
            <div>Message :{item.message}</div>
          </div>
        );
      })}
  </Main>
  );
};

export default Messages;
