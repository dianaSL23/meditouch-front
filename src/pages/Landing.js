import "../assets/styles/LineIcons.2.0.css";
import "../assets/styles/tiny-slider.css";
import "../assets/styles/animate.css";
import "../assets/styles/landing.css";
import aboutusImage from "../assets/images/eye-care.png";
import img1 from "../assets/images/nutrition.png";
import img2 from "../assets/images/radiology.png";
import img3 from "../assets/images/pediatrics.png";
import img4 from "../assets/images/dentistry.png";
import img6 from "../assets/images/patient.png";
import img7 from "../assets/images/doctor.png";
import img8 from "../assets/images/appointments.png";
import img9 from "../assets/images/specialities.jpg";
import img10 from "../assets/images/doctors.jpg";
import Typewriter from "typewriter-effect";
import { useEffect, useState } from "react";
import { userController } from "../controllers/userController";
import { useTranslation } from "react-i18next";
import headerImage from "../assets/images/header.jpeg";

import LayoutWrapper from "../components/Layout";
import { useNavigate } from "react-router";
import classNames from "classnames";
import { useSelector } from "react-redux";
export default function Landing() {
  const [t, i18n] = useTranslation();
  const navigate = useNavigate();
  let userData = useSelector((state) => state);
  const [generalStatisticsData, setGeneralStatisticsData] = useState({
    number_of_hps: 0,
    number_of_pts: 0,
    number_of_appointments: 0,
    number_of_specialities: 0,
  });
  useEffect(() => {
    userController.getGeneralStatistics().then((response) => {
      setGeneralStatisticsData(response.data.statistics);
    });
  }, []);
  const getSpecialityId = (specialityName) => {
    return userData.specialities.filter(
      (s) => s.specialityName === specialityName
    )[0].specialityId;
  };

  return (
    <LayoutWrapper style={{ position: "relative" }} withFooter={true}>
      <section
        id="home"
        style={{}}
        className={classNames("hero-section", {
          "hero-section-ltr": i18n.language === "en",
          "hero-section-rtl": i18n.language === "ar",
        })}
      >
         <img
          src={headerImage}
          className={classNames("hero-section-img", {
            "hero-section-img-ltr": i18n.language === "en",
            "hero-section-img-rtl": i18n.language === "ar",
          })}
        /> 
        
        {/* <section class="section home-banner row-middle">
          <div class="inner-bg"></div>
        </section> */}
        <div
          style={{
            left: i18n.language === "en" ? "40px" : "",
            right: i18n.language === "ar" ? "40px" : "",
          }}
          className="container hero-section-content"
        >
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="hero-content">
                <div className="container d-flex align-items-center">
                  <div className="hero-headline">
                    {t("your_health_care_is_our")}
                    <Typewriter
                      options={{
                        delay: 50,
                        cursor: "|",
                        loop: true,
                      }}
                      onInit={(typewriter) => {
                        typewriter
                          .typeString(t("responsibility"))
                          .pauseFor(1000)
                          .deleteAll()
                          .typeString(t("purpose") + ".")
                          .pauseFor(1000)
                          .deleteAll()
                          .typeString(t("ambition") + ".")
                          .start();
                      }}
                    />
                  </div>
                </div>

                <div className="hero-bio ms-2" data-wow-delay=".6s">
                  {t("we_work_to_take_care_of_health_and_body")}
                </div>
                <button
                  onClick={() => navigate("/global-search")}
                  className="main-btn btn-hover wow fadeInUp"
                  data-wow-delay=".6s"
                >
                  {t("make_an_appointment")}
                </button>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="hero-img wow fadeInUp" data-wow-delay=".5s">
                <img src="../assets/img/hero/hero-img.svg" alt="" />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section
        id="service"
        className="service-section img-bg pt-30 pb-50 mt-150"
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xxl-5 col-xl-6 col-lg-7 col-md-10">
              <div className="section-title text-center mb-5 pb-5">
                <div className="speciality-title">{t("our_specialities")}</div>
                <div className="line"></div>
              </div>
            </div>
          </div>

          <div className="row">
            <div
              onClick={() =>
                navigate("/global-search", {
                  state: {
                    specialityFk: getSpecialityId("Radiology"),
                  },
                })
              }
              className="col-xl-3 col-md-6"
            >
              <div className="single-service">
                <div className="feature-img" style={{ borderRadius: "50%" }}>
                  <img src={img2} alt="" />
                </div>
                <div className="conten1 ">
                  <div
                    className="speciality-name"
                    style={{ whiteSpace: "nowrap", textAlign: "center" }}
                  >
                    {t("radiology")}
                  </div>
                </div>
              </div>
            </div>
            <div
              onClick={() =>
                navigate("/global-search", {
                  state: {
                    specialityFk: getSpecialityId("Nutrition"),
                  },
                })
              }
              className="col-xl-3 col-md-6"
            >
              <div className="single-service">
                <div className="feature-img" style={{ borderRadius: "50%" }}>
                  <img src={img1} alt="" />
                </div>
                <div className="content1">
                  <div className="speciality-name">{t("nutrition")}</div>
                </div>
              </div>
            </div>
            <div
              onClick={() =>
                navigate("/global-search", {
                  state: {
                    specialityFk: getSpecialityId("Pediatrics"),
                  },
                })
              }
              className="col-xl-3 col-md-6"
            >
              <div className="single-service">
                <div className="feature-img" style={{ borderRadius: "50%" }}>
                  <img src={img3} alt="" />
                </div>
                <div className="content1">
                  <div className="speciality-name">{t("pediatrics")}</div>
                </div>
              </div>
            </div>
            <div
              onClick={() =>
                navigate("/global-search", {
                  state: {
                    specialityFk: getSpecialityId("Dentistry"),
                  },
                })
              }
              className="col-xl-3 col-md-6"
            >
              <div className="single-service">
                <div className="feature-img" style={{ borderRadius: "50%" }}>
                  <img src={img4} alt="" />
                </div>
                <div className="content1">
                  <div className="speciality-name">{t("dentistry")}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="about" className="about-section bg-light" style={{paddingTop:"60px"}}>
        <div className="container">
          <div className="row ">
            <div className="col-lg-6">
              <div className="about-img mb-50">
                <img src={aboutusImage} alt="about" />
              </div>
            </div>
            <div className="col-lg-6 mt-5">
              <div className="about-content mb-50">
                <div className="section-title mb-50">
                  <div className="mb-25 developing-healthcare">{t("developing_healthcare_system")}</div>

                  <p>{t("developing_healthcare_system_p1")}</p>
                  <p className="wow fadeInUp" data-wow-delay=".4s">
                    {t("developing_healthcare_system_p2")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
     

      <section className="counter-up-section pt-130 ">
        <div className="container">
        <div className="mb-20 wow fadeInUp developing-healthcare text-center" data-wow-delay=".2s">
                    {t("why_best_why_hire")}
                  </div>
                  <div className="line"></div>
          <div
            className="row d-flex align-items-center justify-content-between pt-100"
            style={{ gap: "60px" }}
          >
            <div className="col-lg-6">
              <div className="counter-up-content  ">
                <div className="section-title mb-40">
               
                  <p className="wow fadeInUp content" data-wow-delay=".4s">
                    {t("get_care_you_need")}
                  </p>
                </div>
                <div className="counter-up-wrapper">
                  <div className="row">
                    <div className="col-lg-6 col-sm-6">
                      <div className="single-counter">
                        <div className="icon color-1">
                          <img src={img6} alt="" />
                        </div>
                        <div className="content1">
                          <h1
                            id="secondo1"
                            className="countup"
                            cup-end="3642"
                            cup-append=" "
                          >
                            {generalStatisticsData.number_of_pts}
                          </h1>
                          <span>{t("patients")}</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6 col-sm-6">
                      <div className="single-counter">
                        <div className="icon color-2">
                          <img src={img7} alt="" />
                        </div>
                        <div className="content1">
                          <h1
                            id="secondo2"
                            className="countup"
                            cup-end="5436"
                            cup-append=" "
                          >
                            {generalStatisticsData.number_of_hps}
                          </h1>
                          <span>{t("health_professionals")}</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6 col-sm-6">
                      <div className="single-counter">
                        <div className="icon color-3">
                          <img src={img8} alt="" />
                        </div>
                        <div className="content1">
                          <h1
                            id="secondo3"
                            className="countup"
                            cup-end="642"
                            cup-append="K"
                          >
                            {generalStatisticsData.number_of_appointments}
                          </h1>
                          <span>{t("appointments")}</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6 col-sm-6">
                      <div className="single-counter">
                        <div className="icon color-4">
                          <img src={img9} alt="" />
                        </div>
                        <div className="content1">
                          <h1
                            id="secondo4"
                            className="countup"
                            cup-end="42"
                            cup-append=" "
                          >
                            {generalStatisticsData.number_of_specialities}
                          </h1>
                          <span>{t("specialities")}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col specilities-img">
              <img src={img10} alt="" className="img-shadow pull-right " />
            </div>
            <div className="col-xl-6 col-lg-6">
              <div className="counter-up-img mb-50">
                <img src="../assets/img/counter-up/counter-up-img.svg" alt="" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </LayoutWrapper>
  );
}
