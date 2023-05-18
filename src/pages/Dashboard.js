import { useEffect, useState } from "react";

import { Button, Card, Col, Row, Spin, Typography } from "antd";
import { RightOutlined } from "@ant-design/icons";
import Paragraph from "antd/lib/typography/Paragraph";

import Echart from "../components/chart/EChart";
import LineChart from "../components/chart/LineChart";
import { Empty } from "antd";

import card from "../assets/images/info-card-1.jpg";
import Main from "../components/layout/Main";
import { businessAccountController } from "../controllers/businessAccountController";
import { useDispatch, useSelector } from "react-redux";
import Dollor from "../icons/dollor";
import Profile from "../icons/profile";
import Heart from "../icons/heart";
import Cart from "../icons/cart";
import { util } from "../public/util";
import moment from "moment";
import { userController } from "../controllers/userController";
import AllHealthProfessionals from "../components/AllHealthProfessionals";
import { useTranslation } from "react-i18next";

export default function Dashboard() {
  const [t, i18n] = useTranslation();
  const count = [
    {
      today: t("total_appointment"),
      title: "$53,000",
      icon: <Dollor />,
      bnb: "bnb2",
      key: "totalAppointments",
    },
    {
      today: t("Total_Patients"),
      title: "3,200",
      icon: <Profile />,
      bnb: "bnb2",
      key: "totalPatients",
    },
    {
      today: t("Total_Blocked_Users"),
      title: "+1,200",
      icon: <Heart />,
      bnb: "bnb2",
      key: "totalBlockedUsers",
    },
    {
      today:  t("Total_Referrals"),
      title: "$13,200",
      icon: <Cart />,
      bnb: "bnb2",
      key: "totalReferrals",
    },
  ];

  const count2 = [
    {
      today: t("total_appointment"),
      title: "$53,000",
      icon: <Dollor />,
      bnb: "bnb2",
      key: "totalAppointments",
    },
    {
      today:t("done_appointment"),
      title: "3,200",
      icon: <Profile />,
      bnb: "bnb2",
      key: "totalDoneAppointments",
    },
    {
      today: t("accepted_appointment"),
      title: "+1,200",
      icon: <Heart />,
      bnb: "bnb2",
      key: "totalAcceptedAppointments",
    },
    {
      today: t("rejected_appointment"),
      title: "$13,200",
      icon: <Cart />,
      bnb: "bnb2",
      key: "totalRejectedAppointments",
    },
  ];

  const count3 = [
    {
      today: t("total_appointment"),
      title: "$53,000",
      icon: <Dollor />,
      bnb: "bnb2",
      key: "totalAppointments",
    },
    {
      today: t("Total_Patients"),
      title: "3,200",
      icon: <Profile />,
      bnb: "bnb2",
      key: "totalPatients",
    },
    {
      today:t("Total_hp"),
      title: "+1,200",
      icon: <Heart />,
      bnb: "bnb2",
      key: "totalHps",
    },
    {
      today:t("Total_users"),
      title: "$13,200",
      icon: <Cart />,
      bnb: "bnb2",
      key: "totalUsers",
    },
  ];
  const userData = useSelector((state) => state);
  const dispatch = useDispatch();
  const [healthProfessionalList, setHealthProfessionalList] = useState([]);
  const [paginationProps, setPaginationProps] = useState({
    pageNumber: -1,
    totalNumberOfPages: 1,
  });
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [loadMore, setLoadMore] = useState(true);
  const [isWithApprove, setIsWithApprove] = useState(false);
  const [withApproveVal, setWithApproveVal] = useState(-2);
  const [searchHpText, setSearchHpText] = useState("");
  const [cardsStatistics, setCardsStatisitcs] = useState({
    totalReferrals: 0,
    totalBlockedUsers: 0,
    totalPatients: 0,
    totalAppointments: 0,
    totalAcceptedAppointments: 0,
    totalRejectedAppointments: 0,
    totalDoneAppointments: 0,
    totalAppointments: 0,
    totalPatients: 0,
    totalHps: 0,
    totalUsers: 0,
  });
  const { Title, Text } = Typography;

  const [appointmentsData, setAppointmentsData] = useState({});
  useEffect(() => {
    if (!userData.loadingApp) {
      if (userData.userInfo.userRole === "HEALTH_PROFESSIONAL") {
        businessAccountController
          .getBusinessAccountStatistics({
            businessAccountId: userData.businessAccountInfo.businessAccountId,
          })
          .then((response) => {
            setCardsStatisitcs(response.data.result);
          });
      }
      if (userData.userInfo.userRole === "PATIENT") {
        userController
          .getUserStatistics({ userFk: userData.userInfo.userId })
          .then((response) => {
            setCardsStatisitcs(response.data.result);
          });
      }
      if (userData.userInfo.userRole === "ADMIN") {
        businessAccountController.getAdminStatistics().then((response) => {
          setCardsStatisitcs(response.data.result);
        });
      } else {
        businessAccountController
          .getAppointments({
            userType: userData.userInfo.userRole,
            id:
              userData.userInfo.userRole === "PATIENT"
                ? userData.userInfo.userId
                : userData.businessAccountInfo.businessAccountId,
            pageNumber: 1,
            recordsByPage: 4,
            body: {
              appointmentStatus: "",
              appointmentType: "ALL",
              isCancelled: -1,
            },
          })
          .then((response) => {
            let data = response.data;
            for (let i = 0; i < data.length; i++) {
              data[i].appointmentActualStartTime = moment(
                util.formatTimeByOffset(
                  new Date(
                    moment(
                      data[i].appointmentActualStartTime,
                      "YYYY-MM-DD HH:mm:ss"
                    )
                  )
                ),
                "YYYY-MM-DD HH:mm:ss"
              ).format("YYYY-MM-DD HH:mm:ss");
              data[i].appointmentActualEndTime = moment(
                util.formatTimeByOffset(
                  new Date(
                    moment(
                      data[i].appointmentActualEndTime,
                      "YYYY-MM-DD HH:mm:ss"
                    )
                  )
                ),
                "YYYY-MM-DD HH:mm:ss"
              ).format("YYYY-MM-DD HH:mm:ss");
            }
            setAppointmentsData(data);
            setLoadingAppointments(false);
          })
          .then(() => {});
      }
    }
  }, [userData.loadingApp]);

  useEffect(() => {
    if (!userData.loadingApp) {
      if (
        userData.userInfo.userRole === "ADMIN" &&
        loadMore &&
        paginationProps.pageNumber <= paginationProps.totalNumberOfPages
      ) {
        businessAccountController
          .getAllHealthProfessionals({
            searchText: searchHpText === "" ? "null" : searchHpText,
            pageNumber:
              paginationProps.pageNumber === -1
                ? 1
                : paginationProps.pageNumber,
            recordsByPage: 4,
            isApproved: withApproveVal,
          })
          .then((response) => {
            let data = response.data;
            let tempPaginationProps = { ...paginationProps };
            tempPaginationProps.totalNumberOfPages = data.totalNumberOfPages;
            tempPaginationProps.pageNumber =
              tempPaginationProps.pageNumber === -1
                ? 2
                : tempPaginationProps.pageNumber + 1;
            setPaginationProps(tempPaginationProps);
            setHealthProfessionalList(data.hps);
          })
          .then(() => {
            setLoadMore(false);
          });
      }
    }
  }, [userData.loadingApp, loadMore]);
  function approveHp(index) {
    userController
      .approveUser({ userId: healthProfessionalList[index].userId })
      .then(() => {
        let tempHealthProfessionalList = [...healthProfessionalList];
        tempHealthProfessionalList[index].isApproved = true;
        setHealthProfessionalList(tempHealthProfessionalList);
      });
  }

  return (
    <Main>
      <div className="layout-content">
        <Row className="rowgap-vbox" gutter={[24, 0]}>
          {Array.from(
            userData.userInfo?.userRole === "ADMIN"
              ? count3
              : userData.userInfo?.userRole === "PATIENT"
              ? count2
              : count
          ).map((c, index) => (
            <Col
              key={index}
              xs={24}
              sm={24}
              md={12}
              lg={6}
              xl={6}
              className="mb-24"
            >
              <Card bordered={false} className="criclebox ">
                <div className="number">
                  <Row align="middle" gutter={[24, 0]}>
                    <Col xs={18}>
                      <span>{c.today}</span>
                      <Title level={3}>{cardsStatistics[c.key]}</Title>
                    </Col>
                    <Col xs={6}>
                      <div className="icon-box">{c.icon}</div>
                    </Col>
                  </Row>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        {userData.userInfo?.userRole !== "ADMIN" && (
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={24} md={12} lg={12} xl={10} className="mb-24">
              <Card bordered={false} className="criclebox h-full">
                <Echart />
              </Card>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={14} className="mb-24">
              <Card bordered={false} className="criclebox h-full">
                <LineChart />
              </Card>
            </Col>
          </Row>
        )}

        {userData.userInfo?.userRole !== "ADMIN" && (
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
              <Card bordered={false} className="criclebox cardbody ">
                <div className="project-ant">
                  <div>
                    <Title level={5}>Appointments</Title>
                    <Paragraph className="lastweek">
                      {/* done this month<span className="blue">40%</span> */}
                    </Paragraph>
                  </div>
                </div>
                <div className="ant-list-box table-responsive">
                  {loadingAppointments ? (
                    <Spin tip="Loading" size="large">
                      <div className="content" />
                    </Spin>
                  ) : appointmentsData.appointments.length === 0 ? (
                    <Empty />
                  ) : (
                    <table className="width-100">
                      <thead>
                        <tr>
                          <th>
                            {userData.userInfo?.userRole === "PATIENT"
                              ? "DOCTOR NAME"
                              : "PATIENT NAME"}
                          </th>
                          <th>SERVICE NAME</th>
                          <th>BUDGET</th>
                          <th>DATETIME</th>
                        </tr>
                      </thead>
                      <tbody>
                        {appointmentsData.appointments?.map((ap, index) => (
                          <tr key={index}>
                            <td>
                              <h6>{ap.firstName + " " + ap.lastName}</h6>
                            </td>
                            <td>{ap.serviceName}</td>
                            <td>
                              <span className="text-xs font-weight-bold">
                                {ap.servicePrice + "" + ap.currencyUnit}
                              </span>
                            </td>
                            <td>
                              <div className="percent-progress">
                                {ap.slotStartTime}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </Card>
            </Col>
          </Row>
        )}

        {userData.userInfo?.userRole === "ADMIN" && (
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
              <Card
                bordered={false}
                className="criclebox cardbody "
                extra={
                  <div className="d-flex flex-column ">
                    <div className="d-flex">
                      <input
                      className="patient-details-input "
                        type="text"
                        value={searchHpText}
                        onChange={(e) => setSearchHpText(e.target.value)}
                        placeholder="Search"
                      />
                      <Button
                      className="referral-search-btn ms-2"
                        onClick={() => {
                          if (searchHpText.replace(/\s+/g, "") !== "") {
                            let tempPaginationProps = { ...paginationProps };
                            tempPaginationProps.pageNumber = -1;
                            tempPaginationProps.totalNumberOfPages = 1;
                            setPaginationProps(tempPaginationProps);
                            setLoadMore(true);
                          }
                        }}
                      >
                        Search
                      </Button>
                    </div>
                    <div className="d-flex mt-2 align-items-center flex-column ">
                      <div className="d-flex align-items-center">
                     <div className="me-2 all-txts ">Add Approve Condition{" "}</div> 
                      <input
                        type="checkbox"
                        checked={isWithApprove}
                        onClick={() => {
                          setIsWithApprove(!isWithApprove);
                          if (isWithApprove) {
                            setWithApproveVal(-2);
                            let tempPaginationProps = { ...paginationProps };
                            tempPaginationProps.pageNumber = -1;
                            tempPaginationProps.totalNumberOfPages = 1;
                            setPaginationProps(tempPaginationProps);
                            setLoadMore(true);
                          }
                        }}
                      />
                      </div>
                      {isWithApprove && (
                        <div className="d-flex ms-2">
                          <div className="me-2">Approved{" "}</div>
                          <input
                            type="radio"
                            className="me-2"
                            name="withApproved"
                            onClick={() => {
                              setWithApproveVal(1);
                              let tempPaginationProps = { ...paginationProps };
                              tempPaginationProps.pageNumber = -1;
                              tempPaginationProps.totalNumberOfPages = 1;
                              setPaginationProps(tempPaginationProps);
                              setLoadMore(true);
                            }}
                          />
                         <div className="me-2">Not{" "}</div>
                          <input
                            type="radio"
                            name="withApproved"
                            className="me-s"
                            onClick={() => {
                              setWithApproveVal(0);
                              let tempPaginationProps = { ...paginationProps };
                              tempPaginationProps.pageNumber = -1;
                              tempPaginationProps.totalNumberOfPages = 1;
                              setPaginationProps(tempPaginationProps);
                              setLoadMore(true);
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                }
              >
                <div className="project-ant">
                  <div>
                    <Title level={5}>Health Professionals</Title>
                    <Paragraph className="lastweek">
                      {/* done this month<span className="blue">40%</span> */}
                    </Paragraph>
                  </div>
                </div>
                <div className="ant-list-box table-responsive">
                  <table className="width-100">
                    <thead>
                      <tr>
                        <th>DOCTOR NAME</th>
                        <th>DOCTOR EMAIL</th>
                        <th>ACTION</th>
                      </tr>
                    </thead>
                    <tbody>
                      {healthProfessionalList.map((hp, index) => {
                        return (
                          <AllHealthProfessionals
                            healthProfessional={hp}
                            approveHp={approveHp}
                            index={index}
                          />
                        );
                      })}
                    </tbody>
                  </table>

                  {loadMore && <div> Loading...</div>}
                  {paginationProps.pageNumber <=
                    paginationProps.totalNumberOfPages &&
                    !loadMore && (
                      <Button type="primary" onClick={() => setLoadMore(true)}>
                        Load More
                      </Button>
                    )}
                </div>
              </Card>
            </Col>
          </Row>
        )}
      </div>
    </Main>
  );
}
