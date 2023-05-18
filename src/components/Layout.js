import React from "react";
import { useTranslation } from "react-i18next";
import AuthenticationWrapper from "./AuthenticationWrapper";
import Footer from "./Footer";
import Navbar from "./Navbar";

const LayoutWrapper = ({ ...props }) => {
  const [t, i18n] = useTranslation();

  return (
    <AuthenticationWrapper>
      <div dir={i18n.language === "en" ? "LTR" : "RTL"}>
        <Navbar />
        <div className="layout-children">{props.children}</div>
        <div className="footer m-0">{props.withFooter && <Footer />}</div>
      </div>
    </AuthenticationWrapper>
  );
};

export default LayoutWrapper;
