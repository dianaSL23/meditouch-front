import ReactApexChart from "react-apexcharts";
import { Row, Col, Typography } from "antd";
import eChart from "./configs/eChart";
import { useEffect, useRef, useState } from "react";
import { businessAccountController } from "../../controllers/businessAccountController";
import { useSelector } from "react-redux";
import { util } from "../../public/util";
import { userController } from "../../controllers/userController";
import { useTranslation } from "react-i18next";
import '../../assets/styles/landing.css'
function EChart() {
  const { Title, Paragraph } = Typography;
  const chartRef = useRef();
  const [t, i18n] = useTranslation();
  const userData = useSelector((state) => state);
  const eChartOptions = eChart.options;
  const [eChartData, setEChartData] = useState({
    [t("approved")]: 0,
    [t("cancelled")]: 0,
    [t("not_cancelled")]: 0,
    [t("not_approved")]: 0,
  });
  function publishChart(res, daysOfWeekDates, keys) {
    let results = res.data.results;
    let tempEChartData = { ...eChartData };
    for (let i = 0; i < results.length; i++) {
      tempEChartData[t("approved")] =
      tempEChartData[t("approved")] + results[i].numAppointmentsApproved;
    tempEChartData[t("not_approved")] =
      tempEChartData[t("not_approved")] + results[i].numAppointmentsNotApproved;
    tempEChartData[t("cancelled")] =
      tempEChartData[t("cancelled")] + results[i].numAppointmentsCancelled;
    tempEChartData[t("not_cancelled")] =
      tempEChartData[t("not_cancelled")] + results[i].numAppointmentsNotCancelled;
    }
    setEChartData(tempEChartData);
    let tempSeries = {
      series: [
        {
          name: "Appointments",
          data: [],
          color: "#fff",
        },
      ],
    };
    for (let i = 0; i < 7; i++) {
      let dateRecordsIndex = results.findIndex(
        (d) => d.appointmentDate === daysOfWeekDates[keys[i]]
      );
      tempSeries.series[0].data.push(
        dateRecordsIndex >= 0 ? results[dateRecordsIndex].numAppointments : 0
      );
    }
    setEChartSeries(tempSeries.series);
  }

  const [eChartSeries, setEChartSeries] = useState(eChart.series);
  useEffect(() => {

    if (
      userData.businessAccountInfo !== -1 &&
      userData.businessAccountInfo !== -2 &&
      userData.businessAccountInfo
    ) {
      let daysOfWeekDates = util.getDaysOfWeekDates();
      let firstDayDate = "";
      let lastDayDate = "";
      let keys = Object.keys(daysOfWeekDates);
      firstDayDate = daysOfWeekDates[keys[0]];
      lastDayDate = daysOfWeekDates[keys[keys.length - 1]];

      if (userData.businessAccountInfo !== -2) {
        if (userData.businessAccountInfo !== -1) {
          businessAccountController
            .getBusinessAccountAppointmentsStatistics({
              businessAccountId: userData.businessAccountInfo.businessAccountId,
              fromDate: firstDayDate,
              toDate: lastDayDate,
            })
            .then((res) => {
              publishChart(res, daysOfWeekDates, keys);
            });
        } else {
          userController
            .getUserAppointmentsStatistics({
              userFk: userData.userInfo.userId,
              fromDate: firstDayDate,
              toDate: lastDayDate,
            })
            .then((res) => {
              publishChart(res, daysOfWeekDates, keys);
            });
        }
      }
    }
  }, [userData.businessAccountInfo]);
  return (
    <>
      <div id="chart">
        <ReactApexChart
          ref={chartRef}
          className="bar-chart"
          options={eChartOptions}
          series={eChartSeries}
          type="bar"
          height={220}
        />
      </div>
      <div className="chart-vistior">
        <Title level={5}>{t("week_appointments")}</Title>
        <Paragraph className="lastweek">
          {/* than last week <span className="bnb2">+30%</span> */}
        </Paragraph>
        <Paragraph className="lastweek">
        {t("general_stat")}
        </Paragraph>
        <Row gutter>
        {Object.keys(eChartData).map((key, index) => (
  <Col xs={12} xl={6} sm={6} md={6} key={index}>
    <div className="chart-visitor-count">
      <div className="stat-txt" level={4}>{key}</div>
      <span>{eChartData[key]}</span>
    </div>
  </Col>
))}
        </Row>
      </div>
    </>
  );
}

export default EChart;
