import { Button, Card, Col, Empty, Spin, Typography } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Main from "../components/layout/Main";
import { businessAccountController } from "../controllers/businessAccountController";
import { useTranslation } from "react-i18next";

export default function Referrals() {
  const [t, i18n] = useTranslation();
  const navigate = useNavigate();
  const userData = useSelector((state) => state);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(-1);
  const [totalNumberOfPages, setTotalNumberOfPages] = useState(1);
  const [loadMore, setLoadMore] = useState(true);

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
  function viewAppointment(appointmentFk) {
    navigate("/appointment-details", {
      state: {
        appointmentId: appointmentFk,
      },
    });
  }
  return (
    <Main>
      <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
        <Card bordered={false} className="criclebox cardbody ">
          <div className="project-ant">
            <div>
              <div className="heading-title">{t("your_referrals")}</div>
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
              <table className="width-100">
                <thead>
                  <tr>
                    <th>{t("doctor_name")}</th>
                    <th>{t("doctor_email")}</th>
                    <th>{t("patient_name")}</th>
                    <th>{t("patient_mail")}</th>

                    <th>{t("action")}</th>
                  </tr>
                </thead>
                <tbody>
                  {userData.myReferrals?.map((ap, index) => (
                    <tr key={index}>
                      <td>
                        <td className="heading-title">
                          {ap.referredByFirstName + " " + ap.referredByLastName}
                        </td>
                      </td>
                      <td>{ap.referredByUserEmail}</td>
                      <td>
                        <td className="heading-title">
                          {ap.patientFirstName + " " + ap.patientLastName}
                        </td>
                      </td>
                      <td>{ap.patientUserEmail}</td>
                      <td>
                        <span className="text-xs font-weight-bold">
                          <Button
                            onClick={() => viewAppointment(ap.appointmentFk)}
                            type="primary"
                          >
                            View Referral
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
