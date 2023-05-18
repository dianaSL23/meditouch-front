import { Button, Card, Col, Empty, Row, Slider, Spin } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LayoutWrapper from "../components/Layout";
import SearchItem from "../components/SearchItem";
import { businessAccountController } from "../controllers/businessAccountController";
import { util } from "../public/util";
import "../assets/styles/global-search.css";
import moment from "moment";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
export default function GlobalSearch() {
  const [searchData, setSearchData] = useState([]);
  const state = useLocation();
  const dispatch = useDispatch();
  const [loadingPageState, setLoadingPageState] = useState(true);
  const userData = useSelector((state) => state);
  const [loading, setLoading] = useState(false);
  const [withFavorite, setWithFavorite] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [sliderPrice, setSliderPrice] = useState({
    min: 20,
    max: 40,
  });
  const [sliderDistance, setSliderDistance] = useState({
    min: 20,
    max: 40,
  });
  const [availabilityRange, setAvailabilityRange] = useState({
    min: "",
    max: "",
  });
  const [paginationProps, setPaginationProps] = useState({
    pageNumber: -1,
    totalNumberOfPages: 1,
  });
  const [filtersData, setFiltersData] = useState({
    specialityFk: -1,
    minDistance: -1,
    maxDistance: -1,
    minPrice: -1,
    maxPrice: -1,
    isFavorite: -2,
    myLongitude: -1,
    myLatitude: -1,
    minAvailability: null,
    maxAvailability: null,
    searchText: "null",
  });
  const [filtersVisibility, setFiltersVisibility] = useState({
    specialities: false,
    price: false,
    distance: false,
    favorites: false,
    availability: false,
  });
  const [locationEnabled, setLocationEnabled] = useState(false);
  const loadPageState = (tempFiltersData = null) => {
    if (state?.state) {
      if (state.state.specialityFk) {
        let tempFilters =
          tempFiltersData === null ? { ...filtersData } : tempFiltersData;
        tempFilters.specialityFk = state.state.specialityFk;
        let tempfiltersVisibility = { ...filtersVisibility };
        tempfiltersVisibility.specialities = true;
        setFiltersData(tempFilters);
        setFiltersVisibility(tempfiltersVisibility);
        setLoadingPageState(false);
      } else {
        if (tempFiltersData !== null) {
          setFiltersData(tempFiltersData);
        }
        setLoadingPageState(false);
      }
    } else {
      if (tempFiltersData !== null) {
        setFiltersData(tempFiltersData);
      }
      setLoadingPageState(false);
    }
  };
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then(function (result) {
          if (result.state === "granted" || result.state === "prompt") {
            //If granted then you can directly call your function here
            navigator.geolocation.getCurrentPosition(
              (position) => {
                let tempFilters = { ...filtersData };
                tempFilters.myLatitude = position.coords.latitude;
                tempFilters.myLongitude = position.coords.longitude;
                loadPageState(tempFilters);
                setLocationEnabled(true);
              },
              (error) => {
                loadPageState();
              }
            );
          } else if (result.state === "denied") {
            loadPageState();
          }
          result.onchange = function () {
            loadPageState();
          };
        });
    } else {
      toast.warning("Enable location to benifit from search by distance!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
      });
      loadPageState();
    }
  }, []);
  const [loadMore, setLoadMore] = useState(paginationProps.pageNumber === -1);
  useEffect(() => {
    if (
      loadMore &&
      !loadingPageState &&
      !userData.loadingApp &&
      paginationProps.pageNumber <= paginationProps.totalNumberOfPages
    ) {
      setLoading(true);
      let tempFilters = { ...filtersData };
      tempFilters["date"] = moment().format("YYYY-MM-DD");
      if (util.isUserAuthorized()) {
        let user = util.getUser();
        tempFilters["userId"] = user.userInfo.userId;
        tempFilters["searchText"] =
          tempFilters["searchText"].replace(/\s+/g, "") === ""
            ? "null"
            : tempFilters["searchText"];
      }
      businessAccountController
        .globalSearch({
          body: tempFilters,
          pageNumber:
            paginationProps.pageNumber === -1 ? 1 : paginationProps.pageNumber,
          recordsByPage: 3,
        })
        .then((response) => {
          let data = response.data;
       
          setSearchData(data.data);
          let tempPaginationProps = { ...paginationProps };
          tempPaginationProps.pageNumber =
            tempPaginationProps.pageNumber === -1
              ? 2
              : tempPaginationProps.pageNumber + 1;
          tempPaginationProps.totalNumberOfPages = data.totalNumberOfPages;
          setPaginationProps(tempPaginationProps);
        })
        .then(() => {
          setLoadMore(false);
          setLoading(false);
        });
    }
  }, [loadMore, userData.loadingApp, loadingPageState]);


  function updateFilters(key, value) {
    let tempFilters = { ...filtersData };
    tempFilters[key] = value;
    setFiltersData(tempFilters);
    setPaginationProps({
      pageNumber: -1,
      totalNumberOfPages: 1,
    });
    setLoadMore(true);
  }
  function modifyFiltersVisibility(key, value) {
    let tempFiltersVisibility = { ...filtersVisibility };
    tempFiltersVisibility[key] = value;
    setFiltersVisibility(tempFiltersVisibility);
  }
  useEffect(() => {
    if (util.isUserAuthorized()) {
      let tempSearchData = [...searchData];
      tempSearchData = tempSearchData.filter(
        (sd) => sd.userDetails.favoriteId !== -1
      );
    
      let tempFavorites = [];
      for (let i = 0; i < tempSearchData.length; i++) {
        tempFavorites.push({
          businessAccountFk: tempSearchData[i].userDetails.businessAccountId,
          favoriteId: tempSearchData[i].userDetails.favoriteId,
        });
      }
      dispatch({
        type: "SET_FAVORITE_DOCTORS",
        favoriteDoctors: tempFavorites,
      });
    }
  }, [searchData]);
  return (
    <LayoutWrapper withFooter={true}>
      <section
        style={{
          padding: "160px 0 120px",
          paddingRight: "50px",
          paddingLeft: "50px",
        }}
      >
        <div className="d-flex">
          <input
            type="text"
            value={searchText}
            placeholder="Search by name/clinic location"
            onChange={(e) => setSearchText(e.target.value)}
            className="doctor-search me-2"
          />
          <Button
            type="primary"
            className="search-btn mt-2"
            onClick={() => {
              if (
                searchText.replace(/\s+/g, "") !== "" ||
                (searchText.replace(/\s+/g, "") === "" &&
                  filtersData["searchText"].replace(/\s+/g, "") !== "")
              ) {
                
                updateFilters("searchText", searchText);
              }
            }}
          >
            Search
          </Button>
        </div>
        <Row className="rowgap-vbox mt-4" gutter={[24, 0]}>
          <Col xs={24} sm={24} md={6} lg={6} xl={4} className="mb-24">
            <Card className="h-100 w-100">
              <div className="d-flex flex-column">
                <div className="d-flex justify-content-between">
                  <div className="globalsearch-txt">Specialities</div>
                  <div
                    onClick={() =>
                      modifyFiltersVisibility(
                        "specialities",
                        !filtersVisibility.specialities
                      )
                    }
                  >
                    {filtersVisibility.specialities ? (
                      <UpOutlined />
                    ) : (
                      <DownOutlined />
                    )}
                  </div>
                </div>
                {filtersVisibility.specialities && (
                  <select
                    value={filtersData.specialityFk}
                    onChange={(e) =>
                      updateFilters("specialityFk", e.target.value)
                    }
                    className="all-specialities"
                  >
                    <option value={-1}>All Specialities</option>
                    {userData.specialities.map((sp) => {
                      return (
                        <option value={sp.specialityId}>
                          {sp.specialityName}
                        </option>
                      );
                    })}
                  </select>
                )}
              </div>
              <div className="d-flex flex-column mt-3">
                <div className="d-flex justify-content-between">
                  <div className="globalsearch-txt">Price Range</div>
                  <div
                    onClick={() =>
                      modifyFiltersVisibility("price", !filtersVisibility.price)
                    }
                  >
                    {filtersVisibility.price ? (
                      <UpOutlined />
                    ) : (
                      <DownOutlined />
                    )}
                  </div>
                </div>
                {filtersVisibility.price && (
                  <div className="d-flex flex-column">
                    <Slider
                      range
                      onChange={(e) => {
                        let tempSliderPrice = { ...sliderPrice };
                        tempSliderPrice.min = e[0];
                        tempSliderPrice.max = e[1];
                        setSliderPrice(tempSliderPrice);
                      }}
                      step={5}
                      min={0}
                      max={50}
                      defaultValue={[20, 40]}
                      className="global-search-slider"
                    />
                    <div className="d-flex justify-content-center">
                      <Button
                        type="primary"
                        onClick={() => {
                          let tempFilters = { ...filtersData };
                          tempFilters["minPrice"] = sliderPrice.min;
                          tempFilters["maxPrice"] = sliderPrice.max;
                          setFiltersData(tempFilters);
                          setPaginationProps({
                            pageNumber: -1,
                            totalNumberOfPages: 1,
                          });
                          setLoadMore(true);
                        }}
                      >
                        Apply
                      </Button>
                      {filtersData.minPrice !== -1 &&
                        filtersData.maxPrice !== -1 && (
                          <Button
                            className="ms-3"
                            type="primary"
                            onClick={() => {
                              let tempFilters = { ...filtersData };
                              tempFilters["minPrice"] = -1;
                              tempFilters["maxPrice"] = -1;
                              setFiltersData(tempFilters);
                              setPaginationProps({
                                pageNumber: -1,
                                totalNumberOfPages: 1,
                              });
                              setLoadMore(true);
                            }}
                          >
                            Reset
                          </Button>
                        )}
                    </div>
                  </div>
                )}
              </div>
              <div className="d-flex flex-column mt-3">
                <div className="d-flex justify-content-between">
                  <div className="globalsearch-txt">Availability</div>
                  <div
                    onClick={() =>
                      modifyFiltersVisibility(
                        "availability",
                        !filtersVisibility.availability
                      )
                    }
                  >
                    {filtersVisibility.availability ? (
                      <UpOutlined />
                    ) : (
                      <DownOutlined />
                    )}
                  </div>
                </div>
                {filtersVisibility.availability && (
                  <div className="d-flex flex-column">
                    <div className="d-flex w-100 flex-column align-items-center">
                      <input
                        placeholder="select start date time"
                        type="datetime-local"
                        className="global-search-datetime"
                        onChange={(e) => {
                          let tempAvailabilityRange = { ...availabilityRange };
                          tempAvailabilityRange.min = e.target.value;
                          setAvailabilityRange(tempAvailabilityRange);
                        }}
                      />

                      <input
                        placeholder="select start date time"
                        className="global-search-datetime"
                        type="datetime-local"
                        onChange={(e) => {
                          let tempAvailabilityRange = { ...availabilityRange };
                          tempAvailabilityRange.max = e.target.value;
                          setAvailabilityRange(tempAvailabilityRange);
                        }}
                      />
                    </div>
                    <div className="d-flex justify-content-center mt-3">
                      <Button
                        className="me-3"
                        type="primary"
                        onClick={() => {
                          let m1 = moment(availabilityRange.min);
                          let m2 = moment(availabilityRange.max);
                          if (
                            availabilityRange.min === "" ||
                            availabilityRange.max === ""
                          ) {
                            toast.error("times error", {
                              position: "top-center",
                              autoClose: 5000,
                              hideProgressBar: true,
                              closeOnClick: true,
                              pauseOnHover: false,
                              draggable: false,
                            });
                            return;
                          }
                          if (m1.isAfter(m2)) {
                            toast.error("times error", {
                              position: "top-center",
                              autoClose: 5000,
                              hideProgressBar: true,
                              closeOnClick: true,
                              pauseOnHover: false,
                              draggable: false,
                            });
                            return;
                          }
                          let tempFilters = { ...filtersData };
                          tempFilters["minAvailability"] =
                            availabilityRange.min;
                          tempFilters["maxAvailability"] =
                            availabilityRange.max;
                          setFiltersData(tempFilters);
                          setPaginationProps({
                            pageNumber: -1,
                            totalNumberOfPages: 1,
                          });
                          setLoadMore(true);
                        }}
                      >
                        Apply
                      </Button>
                      {filtersData.minAvailability !== null &&
                        filtersData.maxAvailability !== null && (
                          <Button
                            type="primary"
                            onClick={() => {
                              let tempFilters = { ...filtersData };
                              tempFilters["minAvailability"] = null;
                              tempFilters["maxAvailability"] = null;
                              setFiltersData(tempFilters);
                              setPaginationProps({
                                pageNumber: -1,
                                totalNumberOfPages: 1,
                              });
                              setLoadMore(true);
                            }}
                          >
                            Reset
                          </Button>
                        )}
                    </div>
                  </div>
                )}
              </div>

              <div className="d-flex flex-column mt-3">
                <div className="d-flex justify-content-between">
                  <div className="globalsearch-txt">Distance in Km</div>
                  <div
                    onClick={() =>
                      modifyFiltersVisibility(
                        "distance",
                        !filtersVisibility.distance
                      )
                    }
                  >
                    {filtersVisibility.distance ? (
                      <UpOutlined />
                    ) : (
                      <DownOutlined />
                    )}
                  </div>
                </div>
                {filtersVisibility.distance &&
                  (filtersData.myLatitude !== -1 ? (
                    <div className="d-flex flex-column">
                      <Slider
                        range
                        onChange={(e) => {
                          let tempSliderDistance = { ...sliderDistance };
                          tempSliderDistance.min = e[0];
                          tempSliderDistance.max = e[1];
                          setSliderDistance(tempSliderDistance);
                        }}
                        step={5}
                        min={0}
                        max={50}
                        defaultValue={[20, 40]}
                        className="global-search-slider"
                      />
                      <div className="d-flex justify-content-center">
                        <Button
                          type="primary"
                          onClick={() => {
                            let tempFilters = { ...filtersData };
                            tempFilters["minDistance"] = sliderDistance.min;
                            tempFilters["maxDistance"] = sliderDistance.max;
                            setFiltersData(tempFilters);
                            setPaginationProps({
                              pageNumber: -1,
                              totalNumberOfPages: 1,
                            });
                            setLoadMore(true);
                          }}
                        >
                          Apply
                        </Button>
                      </div>
                    </div>
                  ) : (
                    "Enable location to benifit from this feature"
                  ))}
              </div>

              {util.isUserAuthorized() && (
                <div className="d-flex flex-column mt-3">
                  <div className="d-flex justify-content-between">
                    <div className="globalsearch-txt"> Favorites </div>
                    <div
                      onClick={() => {
                        modifyFiltersVisibility(
                          "favorites",
                          !filtersVisibility.favorites
                        );
                        if (withFavorite) {
                          updateFilters("isFavorite", -2);
                        }
                        setWithFavorite(!withFavorite);
                      }}
                    >
                      {filtersVisibility.favorites ? (
                        <UpOutlined />
                      ) : (
                        <DownOutlined />
                      )}
                    </div>
                  </div>

                  {filtersVisibility.favorites && (
                    <div className="d-flex" style={{ gap: "5px" }}>
                      <input
                        type="radio"
                        name="withFavorite"
                        onClick={() =>  updateFilters("isFavorite", 1)}
                      />{" "}
                      Favorite
                      <input
                        type="radio"
                        name="withFavorite"
                        onClick={() => updateFilters("isFavorite", -1)}
                      />{" "}
                      Not Favorite
                    </div>
                  )}
                </div>
              )}
            </Card>
          </Col>
          <Col xs={24} sm={24} md={18} lg={18} xl={20} className="mb-24">
          {loading ? (
            <Spin tip="Loading" size="large">
              <div className="content" />
            </Spin>
          ) : !loading && searchData.length === 0 ? (
            <Empty />
          )  : (
              <Row
                className="rowgap-vbox"
                gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
              >
                {searchData.map((sd, index) => {
                  return <SearchItem item={sd} />;
                })}
              </Row>
            )}
          </Col>
        </Row>
      </section>
    </LayoutWrapper>
  );
}
