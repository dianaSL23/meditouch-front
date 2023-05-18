import { EncryptStorage } from "encrypt-storage";
import React from "react";
import { useTranslation } from "react-i18next";
import img5 from "../assets/images/1.jfif";
import { userController } from "../controllers/userController";
import { util } from "../public/util";
import Notifications from "./Notifications";
import '../assets/styles/main.css'
const Navbar = () => {
  const [t, i18n] = useTranslation();

  const encryptStorage1 = new EncryptStorage("secret-key", {
    prefix: "@instance1",
  });

  const isLoggedIn =
    encryptStorage1.getItem("meditouch_user") !== null &&
    encryptStorage1.getItem("meditouch_user") !== undefined;
 
    
  return (
    <header className="header">
      <div className="navbar navbar-expand-lg navbar-light fixed-top py-3 d-block bg-light shadow-transition">
        <div className="" style={{ paddingRight: "50px", paddingLeft: "50px" }}>
          <div className="row w-100 align-items-center">
            <div className="col-lg-12">
              <nav className="navbar d-flex justify-content-between navbar-expand-lg" >
                <a
                  className="navbar-brand"
                  href="/"
                  style={{ fontWeight: "bold", color: "#4E6EF1" }}
                >
                  <img src={img5} alt="" />
                </a>
                <button
                  className="navbar-toggler"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#navbarSupportedContent"
                  aria-controls="navbarSupportedContent"
                  aria-expanded="false"
                  aria-label="Toggle navigation"
                >
                  <span className="toggler-icon"></span>
                  <span className="toggler-icon"></span>
                  <span className="toggler-icon"></span>
                </button>

                <div
                  className="collapse navbar-collapse sub-menu-bar "
                  id="navbarSupportedContent"
                >
                  <ul class="navbar-nav ml-auto pt-2 pt-lg-0 font-base">
                    <li class="nav-item active">
                      <a class="nav-link" aria-current="page" href="/#/">
                        {t("home")}
                      </a>
                    </li>
                    {isLoggedIn && (
                      <li className="nav-item">
                        <a className="page-scroll nav-link" href="/#/dashboard">
                          {t("dashboard")}
                        </a>
                      </li>
                    )}
                    <li class="nav-item ">
                      <a class="nav-link" href="/#/contactUs">
                        {t("contact_us")}
                      </a>
                    </li>
                    <div className="d-flex align-items-center ">
                      <li  className="nav-item">
                        <a
                          class="nav-link"
                          aria-current="page"
                          onClick={() => {
                            window.location.reload();

                            let user =
                              encryptStorage1.getItem("meditouch_user");
                            if (user) {
                              let userInfo = user.userInfo;
                              userInfo.userLanguage = "en";
                              encryptStorage1.setItem("meditouch_user", {
                                userInfo: userInfo,
                                businessAccountInfo: user.businessAccountInfo,
                              });
                              userController.updateUserLanguage({
                                body: {
                                  userId: userInfo.userId,
                                  userLanguage: "en",
                                },
                              });
                            }
                            i18n.changeLanguage("en");
                          }}
                        >
                          {t("en")}
                        </a>
                      </li>
                      /
                      <li style={{ marginLeft: "0px" }} className="nav-item">
                        <a
                          class="nav-link"
                          aria-current="page"
                          onClick={() => {
                          
                            window.location.reload();

                            let user =
                              encryptStorage1.getItem("meditouch_user");
                            if (user) {
                              let userInfo = user.userInfo;
                              userInfo.userLanguage = "en";
                              encryptStorage1.setItem("meditouch_user", {
                                userInfo: userInfo,
                                businessAccountInfo: user.businessAccountInfo,
                              });
                              userController.updateUserLanguage({
                                body: {
                                  userId: userInfo.userId,
                                  userLanguage: "ar",
                                },
                              });
                            }
                            i18n.changeLanguage("ar");
                          }}
                        >
                          {t("ar")}
                        </a>
                      </li>
                    </div>
                  </ul>
                  {util.isUserAuthorized() ? (
                   <div style={{marginLeft:"30px"}} > <Notifications /></div>
                  ) : (
               
                    <a
                    class="btn btn-sm btn-outline-primary rounded-0 order-1 order-lg-0 ms-lg-4 px-3 py-2"
                    href="/#/sign-in"
                  >
                    {t("sign_in")}
                  </a>
                  )}
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
