import { Avatar, Button, Card, Col, Empty, Modal, Row, Spin } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Main from "../components/layout/Main";
import { businessAccountController } from "../controllers/businessAccountController";
import { util } from "../public/util";
import img from "../assets/images/healthcare.png";
import avatar from "../assets/images/avatar.jpg";
export default function AppointmentDetails() {
  const [appointmentData, setAppointmentData] = useState({});
  const [loading, setLoading] = useState(false);
  const userData = useSelector((state) => state);

  const { state } = useLocation();
  const navigate = useNavigate();
  // useEffect(() => {
  //   if (!userData.loadingApp) {
  //     if (!state) {
  //       if (util.isUserAuthorized()) {
  //         navigate("/dashboard");
  //       } else {
  //         navigate("/");
  //       }
  //     } else {
  //       setLoading(true);
  //       businessAccountController
  //         .getAppointmentById({ appointmentFk: state.appointmentId })
  //         .then((response) => {
  //           setAppointmentData(response.data.appointment);
  //         })
  //         .then(() => {
  //           setLoading(false);
  //         });
  //     }
  //   }
  // }, [state, userData.loadingApp]);
  const [pageNumber, setPageNumber] = useState(-1);
  const [totalNumberOfPages, setTotalNumberOfPages] = useState(1);
  const [loadMore, setLoadMore] = useState(true);
  const dispatch = useDispatch();
  const [referralData, setReferralData] = useState([]);
  useEffect(() => {
    if (!userData.loadingApp) {
      if (loadMore && pageNumber <= totalNumberOfPages) {
        setLoading(true);
        businessAccountController
          .getReferrals({
            businessAccountFk: userData.businessAccountInfo.businessAccountId,
            pageNumber: pageNumber === -1 ? 1 : pageNumber,
            recordsByPage: 4,
          })
          .then((response) => {
            let data = [...userData.myReferrals, ...response.data.referrals];
            let uniqueArray = data.filter((obj, index, arr) => {
              return index === arr.findIndex((t) => t.id === obj.id);
            });

            setTotalNumberOfPages(data.totalNumberOfPages);
            setPageNumber(pageNumber === -1 ? 2 : pageNumber + 1);
            dispatch({
              type: "SET_REFERRALS",
              myReferrals: uniqueArray,
            });
          })
          .then(() => {
            setLoading(false);
            setLoadMore(false);
          });
      }
    }
  }, [loadMore, userData.loadingApp]);
  console.log("data", userData.myReferrals);
  console.log(appointmentData);
  const [appointmentDesc, setAppointmentDesc] = useState(false);
  const handlePrescriptionOk = (e) => {
    setAppointmentDesc(false);
  };
  const handlePrescriptionCancel = (e) => {
    setAppointmentDesc(false);
  };

  const modal2 = (
    <Modal
      open={appointmentDesc}
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
     
      <div className="d-flex align-items-center appointment-pres-wrapper 
      justify-content-center"
        style={{ gap: "20px" }}>
          <img src={img} alt="" />
        </div>
     
    
      {userData.myReferrals?.map((ap,index)=>{
        return(   <div className="global-search-card-schedule-all-slots1">
        {ap.referralDescription}
      </div>
     )
      
      })}
      
    </Modal>
  );
  return (
    <Main>
      {modal2}
      <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
        <Card bordered={false} className="criclebox cardbody ">
          <div className="project-ant">
            <div>
              <div className="heading-title">Referral </div>
            </div>
          </div>
          {loading ? (
            <Spin tip="Loading" size="large">
              <div className="content" />
            </Spin>
          ) : !loading && userData.myReferrals.length === 0 ? (
            <Empty />
          ) : (
        <div className="ant-list-box table-responsive">
          <table className="width-100 appointment-details-info">
            <thead className="pb-4">
              <tr>
                <th>Patient Name</th>
                <th>Doctor Name</th>
                <th>Referral Description</th>
              </tr>
            </thead>
            <tbody>
              {userData.myReferrals?.map((ap, index) => (
                <tr key={index}>
                  <td>
                    <td className="heading-title">
                      <Avatar.Group>
                        <Avatar
                          className="appointment-profile me-2"
                          size={50}
                          shape="circle"
                          src={
                            ap?.patientProfilePicture
                              ? ap?.patientProfilePicture
                              : avatar
                          }
                        />
                      </Avatar.Group>
                    </td>
                    <td className="heading-title" style={{fontSize:"14px"}}>
                      {" "}
                      {ap.patientFirstName + " " + ap.patientLastName}
                    </td>
                  </td>
                  <td>
                    <td className="heading-title">
                      <Avatar.Group>
                        <Avatar
                          className="appointment-profile me-2"
                          size={50}
                          shape="circle"
                          src={
                            ap?.doctorProfilePicture
                              ? ap?.doctorProfilePicture
                              : avatar
                          }
                        />
                      </Avatar.Group>
                    </td>
                    <td className="heading-title" style={{fontSize:"14px"}}>
                      {ap.referredByFirstName + " " + ap.referredByFirstName}
                    </td>
                  </td>

                  <td className="heading-title appointment-desc">
                    <span className="text-xs font-weight-bold">
                      <Button
                        type="primary"
                        onClick={() => {
                          setAppointmentDesc(true);
                        }}
                      >
                        View Referral Description
                      </Button>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
             </Card>
          </Col>
    </Main>

  );
}
