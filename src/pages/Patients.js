import { useEffect, useState } from "react";

import { Button, Card, Col, Empty, Row, Spin, Typography } from "antd";

import Main from "../components/layout/Main";
import { businessAccountController } from "../controllers/businessAccountController";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

export default function Patients() {
  const userData = useSelector((state) => state);
  const [t, i18n] = useTranslation();
  const { Title, Text } = Typography;

  const [patientsData, setPatientsData] = useState([]);
  useEffect(() => {
    if (!userData.loadingApp) {
      businessAccountController
        .getBusinessAccountPatients({
          businessAccountId: userData.businessAccountInfo.businessAccountId,
        })
        .then((response) => {
          setPatientsData(response.data.patients);
        });
    }
  }, [userData.loadingApp]);
  function blockUser(userId, index) {
    businessAccountController
      .blockUser({
        body: {
          businessAccountFk: userData.businessAccountInfo.businessAccountId,
          userFk: userId,
        },
      })
      .then((response) => {
        let tempPatients = [...patientsData];
        tempPatients[index].blockId = response.data.blockInfo.blockId;
        setPatientsData(tempPatients);
      });
  }
  function unblockUser(blockId, index) {
    businessAccountController
      .removeBlockUser({
        blockId: blockId,
      })
      .then((response) => {
        let tempPatients = [...patientsData];
        tempPatients[index].blockId = -1;
        setPatientsData(tempPatients);
      });
  }
  const [loading, setLoading] = useState(false);
  return (
    <Main>
          {loading ? (
            <Spin tip="Loading" size="large">
              <div className="content" />
            </Spin>
          ) : !loading && patientsData.length === 0 ? (
            <Empty />
          ) : ( 
      <div className="layout-content">
        <Row gutter={[24, 0]}>
          <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
            <Card bordered={false} className="criclebox cardbody ">
              <div className="project-ant">
                <div>
                  <div className="heading-title" level={5}>{t("your_patients")}</div>
                </div>
              </div>
              <div className="ant-list-box table-responsive">
                <table className="width-100">
                  <thead>
                    <tr >
                      <th >{t("patient_name")}</th>
                      <th >{t("patient_mail")}</th>
                      <th >{t("action")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patientsData?.map((ap, index) => (
                      <tr key={index}>
                        <td>
                          <td className="heading-title">{ap.firstName + " " + ap.lastName}</td>
                        </td>
                        <td>{ap.userEmail}</td>
                        <td>
                          <span className="text-xs font-weight-bold">
                            {ap.blockId === -1 ? (
                              <Button
                                onClick={() => blockUser(ap.userId, index)}
                                danger
                              >
                               {t("block")}
                              </Button>
                            ) : (
                              <Button
                                onClick={() => unblockUser(ap.blockId, index)}
                                type="primary"
                              >
                               {t("unblock")}
                              </Button>
                            )}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
           )}
    </Main>
  );
}
