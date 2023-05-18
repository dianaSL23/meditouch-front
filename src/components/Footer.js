import React from "react";
import FacebookIcon from "../icons/facebook-icon";
import InstagramIcon from "../icons/instagram-icon";
import LinkedinIcon from "../icons/linkedin-icon";
import PhoneIcon from "../icons/phone-icon";
import LocationIcon from "../icons/location-icon";
import EmailIcon from "../icons/email-icon";
import { useTranslation } from "react-i18next";
const Footer = () => {
  const [t, i18n] = useTranslation();

  return (
    <footer className="footer">
      <div className="container">
        <div className="row widget-boxes text-center">
          <div class="col-12 col-md-4 col-lg-4">
            <div class="widget-info-box">
              <div class="info-img">
                <PhoneIcon />
              </div>
              <h4>{t("phone")}</h4>
              <p>+961 81757536</p>
            </div>
          </div>

          <div class="col-12 col-md-4 col-lg-4">
            <div class="widget-info-box">
              <div class="info-img">
                <LocationIcon />
              </div>
              <h4>{t("address")}</h4>
              <p>{t("lebanon_saida")}</p>
            </div>
          </div>

          <div class="col-12 col-md-4 col-lg-4">
            <div class="widget-info-box">
              <div class="info-img">
                <EmailIcon />
              </div>
              <h4>{t("email")}</h4>
              <p>MediTouch@gmail.com</p>
            </div>
          </div>
        </div>
        <div class="footer-bar">
          <div class="container">
            <div class="row">
              <div class="col">
                <hr />
              </div>
            </div>
          </div>
        </div>
        <div
          className="row d-flex align-items-center justify-content-between m-4 "
          style={{ position: "relative", bottom: "30px" }}
        >
          <div className="col-lg-2">
            <div className="copyright" style={{ whiteSpace: "nowrap" }}>
              &copy; {t("copyright")}{" "}
              <strong>
                <span>MediTouch</span>
              </strong>
              . {t("all_rights_reserved")}
            </div>
          </div>
          <div className="col-lg-2">
            <div className="social-links mt-3">
              <a href="#" className="facebook me-3">
                <FacebookIcon color="#fff" />
              </a>
              <a href="#" className="instagram me-3">
                <InstagramIcon color="#fff" />
              </a>

              <a href="#" className="linkedin">
                <LinkedinIcon color="#fff" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
