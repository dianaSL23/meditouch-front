import { Avatar, Button } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import avatar from "../assets/images/avatar.jpg";

export default function AllHealthProfessionals({
  healthProfessional,
  approveHp,
  index,
}) {
  const [profileUrl, setProfileUrl] = useState("");
  const userData = useSelector(state => state)
  useEffect(() => {
    if (userData.storage) {
      const getFile = userData.storage.root.children.find(
        (file) => file.name === "profile" + healthProfessional.userId
      );

      if (getFile) {
        getFile.downloadBuffer((error, data) => {
          if (error) {
            console.error(error);
          } else {
            setProfileUrl(data);
          }
        });
      }
    }
  }, [userData.storage]);
  return (
    <tr key={index}>
      <td>
        <Avatar.Group>
          <Avatar
            size={74}
            shape="square"
            src={
              profileUrl !== ""
                ? `data:image/png;base64,${profileUrl.toString("base64")}`
                : avatar
            }
          />

          <div className="avatar-info">
            <h6 className="font-semibold m-0" style={{fontSize:"14px"}}>
              {healthProfessional.firstName + " " + healthProfessional.lastName}
            </h6>
          </div>
        </Avatar.Group>
      </td>
      <td>{healthProfessional.userEmail}</td>

      <td>
        <div className="percent-progress">
          {!healthProfessional.isApproved ? (
            <Button onClick={() => approveHp(index)} type="primary">
              Approve
            </Button>
          ) : (
            "Approved"
          )}
        </div>
      </td>
    </tr>
  );
}
