import ReactApexChart from "react-apexcharts";
import { Typography } from "antd";
import { MinusOutlined } from "@ant-design/icons";
import lineChart from "./configs/lineChart";
import { useEffect, useRef, useState } from "react";
import { businessAccountController } from "../../controllers/businessAccountController";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

function LineChart() {
  const [t, i18n] = useTranslation();
  const { Title, Paragraph } = Typography;
  const chartRef = useRef();
  const userData = useSelector((state) => state);

  const lineChartOptions = lineChart.options;
  const [lineChartSeries, setlineChartSeries] = useState(lineChart.series);
  function publishChart(data) {
    let tempSeries = {
      series: [
        {
          name:
            (userData.userInfo?.userRole === "PATIENT" ?  t("cost_usd"): t("revenue_usd")) 
            ,
          data: new Array(12).fill(0),
          offsetY: 0,
        },
        {
          name:
            (userData.userInfo?.userRole === "PATIENT" ? t("cost_lbp") : t("revenue_lbp")) ,
          data: new Array(12).fill(0),
          offsetY: 0,
        },
      ],
    };
    for (let i = 0; i < data.length; i++) {
      let json = data[i];
      if (json.currencyUnit === "USD") {
        tempSeries.series[0].data[json.month - 1] = json.revenue;
      } else {
        tempSeries.series[1].data[json.month - 1] = json.revenue;
      }
    }
    setlineChartSeries(tempSeries.series);

  }
  console.log(lineChartSeries)
  useEffect(() => {
    if (!userData.loadingApp) {
      if (userData.userInfo?.userRole === "HEALTH_PROFESSIONAL") {
        businessAccountController
          .getRevenueOfYear({
            businessAccountFk: userData?.businessAccountInfo.businessAccountId,
            userFk: -1,
          })
          .then((response) => {
            let data = response.data.result;
            publishChart(data);
          });
      } else if (userData.userInfo.userRole === "PATIENT") {
        businessAccountController
          .getRevenueOfYear({
            businessAccountFk: -1,
            userFk: userData.userInfo.userId,
          })
          .then((response) => {
            let data = response.data.result;
            publishChart(data);
          });
      }
    }
  }, [userData.businessAccountInfo, userData.loadingApp]);

  return (
    <>
      <div className="linechart">
        <div>
          <Title level={5}>
         
            {userData.userInfo?.userRole === "PATIENT" ? t("cost_revenue") : t("year_revenue")}
          </Title>
          <Paragraph className="lastweek">
            {/* than last week <span className="bnb2">+30%</span> */}
          </Paragraph>
        </div>
      </div>

      <ReactApexChart
        ref={chartRef}
        className="full-width"
        options={lineChartOptions}
        series={lineChartSeries}
        type="area"
        height={350}
        width={"100%"}
      />
    </>
  );
}

export default LineChart;
