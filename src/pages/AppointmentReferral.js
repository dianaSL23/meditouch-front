import { Button, Card, Col, Empty, Modal, Row } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import Main from "../components/layout/Main";
import { businessAccountController } from "../controllers/businessAccountController";
import { userController } from "../controllers/userController";
import referralImage from "../assets/images/referralDoctor.png";
import img from "../assets/images/healthcare.png";
import BgProfile from "../assets/images/doctorProfile.jpg";
import { toast } from "react-toastify";

export default function AppointmentReferral() {
  const { state } = useLocation();
  const userData = useSelector((state) => state);
  const [hpList, setHPList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(-1);
  const [totalNumberOfPages, setTotalNumberOfPages] = useState(1);
  const [loadMore, setLoadMore] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selectedHps, setSelectedHps] = useState([]);
  const [referralDescription, setReferralDescription] = useState("");
  useEffect(() => {
    if (!userData.loadingApp) {
      if (loadMore && pageNumber <= totalNumberOfPages) {
        setLoading(true);
        userController
          .getHealthProfessionals({
            userFk: userData.userInfo.userId,
            pageNumber: pageNumber === -1 ? 1 : pageNumber,
            recordsByPage: 10,
            searchText: searchText === "" ? "null" : searchText,
          })
          .then((response) => {
            let data = response.data;
            setTotalNumberOfPages(data.totalNumberOfPages);
            setPageNumber(pageNumber === -1 ? 2 : pageNumber + 1);
            setHPList((hps) => [...hps, ...data.health_professionals]);
          })
          .then(() => {
            setLoading(false);
            setLoadMore(false);
          });
      }
    }
  }, [loadMore, userData.loadingApp]);

  function modifySelectedHps(hp) {
    let tempSelectedHps = [...selectedHps];
    let hpIndex = tempSelectedHps.findIndex((hps) => hps.userId === hp.userId);
    if (hpIndex >= 0) {
      tempSelectedHps.splice(hpIndex, 1);
    } else {
      tempSelectedHps.push(hp);
    }
    setSelectedHps(tempSelectedHps);
  }
  console.log(selectedHps)
  const valid = () => {
    let valid = true;
    if (referralDescription.replace(/\s+/g, "") === "") {
      valid = false;
      toast.warn("please fill the referral description", {
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
  function addReferral() {
    if (valid()) {
      let referralBody = [];
      for (let i = 0; i < selectedHps.length; i++) {
        let json = {
          userFk: state.appointment.currentUserId,
          appointmentFk: state.appointment.appointmentId,
          referralDescription: referralDescription,
          referredByBusinessAccountFk:
            userData.businessAccountInfo.businessAccountId,
          referredToBusinessAccountFk: selectedHps[i].businessAccountId,
        };
        referralBody.push(json);
      }
      businessAccountController.addReferrals({ body: referralBody }).then((response)=>{
if(response && response.status===200){
  toast.success("Referral Added successfully", {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: false,
  });
}
      })
    }
    setReferralDescription("");
  }
  console.log(hpList);
  const [referralModel, setReferralModel] = useState(false);
  const handlePrescriptionOk = (e) => {
    setReferralModel(false);
  };
  const handlePrescriptionCancel = (e) => {
    setReferralModel(false);
  };

  const appointmentModalUi = (
    <Modal
      open={referralModel}
      // onOk={handlePrescriptionOk}
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
      <div className="d-flex flex-column mt-2">
      <div
        className="d-flex align-items-center appointment-pres-wrapper 
      justify-content-center"
        style={{ gap: "20px" }}
      >
        <div>
          <img src={img} alt="" />
        </div>
      </div>
        <div className="all-txts me-2">Referral Description: </div>
        <div className="appointment-desc-input-wrapper mt-1">
          <textarea
            className="appointment-info-input mt-2 pt-2"
            type="text"
            value={referralDescription}
            onChange={(e) => setReferralDescription(e.target.value)}
            placeholder="Referral Description"
         
          />
        </div>
        <div
            style={{
              position: "relative",
             marginLeft:"auto",
             marginTop:"10px"
            }}
        >
          <input
            type="button"
            className="add-prescription-btn"
            value="Add"
            onClick={() => {
              addReferral();
              setReferralModel(false);
            }}
          />
        </div>
      </div>
    </Modal>
  );
  

  return (
    <Main>
      {appointmentModalUi}
      <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
        <div className="services-txt mt-3 text-center">
          {" "}
          Please refer{" "}
          {state.appointment.firstName + " " + state.appointment.lastName} into
          another doctor
        </div>
       
        <div className="layout-content">
        <Row gutter={[24, 0]}>
          <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
            <Card bordered={false} className="criclebox cardbody ">
            <div className="d-flex mt-3 justify-content-center align-items-center">
          <input
            className="referral-search-doctor "
            type="text"
            placeholder="Search doctor"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Button
            type="primary"
            style={{height:"40px",marginLeft:"10px"}}
            className="referral-search-btn"
            onClick={() => {
              setHPList([]);
              setPageNumber(-1);
              setTotalNumberOfPages(1);
              setLoadMore(true);
            }}
          >
            Search
          </Button>
        </div>
            <div className="ant-list-box table-responsive mt-5 " >
        {hpList.length===0 ? 
         <Empty />
        : 
        <table className="w-100 referral-table" style={{ overflow: "hidden" }}>
        <thead>
          <tr>
            <th>Doctor Name</th>
            <th>Doctor Email</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {hpList?.map((hp, index) => (
       
            <tr
          
              key={index}
              style={{
                cursor: "pointer",
                backgroundColor:
                  selectedHps.findIndex((hps) => hps.userId === hp.userId) >= 0
                    ? "#f5f7ff"
                    : "",
                
              }}
              onClick={() => modifySelectedHps(hp)}
            >
              <td >
                <td className="heading-title" style={{ fontSize: "14px", fontWeight: "normal" }}>
                  {hp.firstName + " " + hp.lastName}
                </td>
              </td>
              <td className="heading-title " style={{ fontSize: "14px", fontWeight: "normal" }}>{hp.userEmail}</td>
              <td>
                <span className="text-xs font-weight-bold mt-10">
                  <Button onClick={() => setReferralModel(true)} type="primary">
                    Add Referral Description
                  </Button>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table> }
 
</div>

            </Card>
          </Col>
        </Row>
    </div>
      </Col>
    </Main>
  );
}
