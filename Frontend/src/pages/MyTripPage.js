import React, {Component} from "react";
import BookHistoryCard from "../components/MyTripPage/BookHistoryCard";
import axios from "axios/index";
import Pagination from "../components/template/Pagination";
import SmallEllipseBtn from "../components/template/SmallEllipseBtn";
import {Link, Redirect} from "react-router-dom";
import {withCookies, Cookies} from "react-cookie";
import {instanceOf} from "prop-types";
import moment from "moment";

class MyTripPage extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            hasTrips: true,
            allTrips: [],
            currentTrips: [],
            currentPage: null,
            totalPages: null
        };
        this.getBookingHistory = this.getBookingHistory.bind(this);
    }

    async getBookingHistory(token) {
        let BaseURL = "http://127.0.0.1:3333/api/";
        //get the list of trips
        await axios.get(BaseURL + "getBookingHistory/" + token).then(response => {
            console.log("get history trips successfully");
            this.setState({
                hasTrips: response.data.hasTrips,
                allTrips: response.data.bookingHistory
            });
            //console.log("hasTrips " + response.data.hasTrips);
        });
    }

    onPageChanged = data => {
        const {allTrips} = this.state;
        const {currentPage, totalPages, pageLimit} = data;

        const offset = (currentPage - 1) * pageLimit;
        const currentTrips = allTrips.slice(offset, offset + pageLimit);
        this.setState({currentPage, currentTrips, totalPages});
    };

    componentDidMount() {
        if (sessionStorage.getItem("userToken")) {
            let tokenData = JSON.parse(sessionStorage.getItem("userToken"));
            this.getBookingHistory(tokenData.token);
        }
    }

    render() {
        //console.log(this.props.history);
        const {cookies, history} = this.props;
        //if token has been expired, redirect to login page
        //console.log(this.props.location.state);
        if (this.props.location.state) {
            const {lastValid} = this.props.location.state;
            //console.log(lastValid);

            if (!lastValid) {
                return (
                    <Redirect
                        to={{
                            pathname: "/login",
                            state: {from: this.props.location.pathname}
                        }}
                    />
                );
            }
        }

        //if directly type this page's url, redirect to login page
        if (!sessionStorage.getItem("userToken") && !cookies.get("access-token")) {
            return (
                <Redirect
                    to={{
                        pathname: "/login",
                        state: {from: this.props.location.pathname}
                    }}
                />
            );
        }

        const {
            hasTrips,
            allTrips,
            currentTrips,
            currentPage,
            totalPages
        } = this.state;

        let totalTrips = 0;
        if (hasTrips) {
            totalTrips = allTrips.length;
            if (totalTrips === 0) return null;
        }

        return (
            <React.Fragment>
                <div className="container">
                    <br/>
                    {/* title */}
                    <div className="form-row">
                        {/* <div className="form-group col-2" /> */}
                        <div className="form-group col-4">
              <span
                  style={{
                      fontSize: "2rem",
                      color: "#686369",
                      whiteSpace: "nowrap"
                  }}
              >
                My Booking History
              </span>
                        </div>
                        <div className="form-group col-6"/>
                    </div>
                    {/* table title */}
                    <table className="table table-borderless">
                        <thead>
                        <tr style={{color: "#686369"}}>
                            <th scope="col">Submit Date</th>
                            <th scope="col">Resort</th>
                            <th scope="col">Start Date</th>
                            <th scope="col">End Date</th>
                            <th scope="col">Status</th>
                            {/* <th scope="col">Price</th> */}
                            <th scope="col"/>
                            <th scope="col"/>
                        </tr>
                        </thead>
                        {hasTrips
                            ? currentTrips.map(trip => (
                                <BookHistoryCard
                                    key={trip.id}
                                    submitDate={trip.submitDate}
                                    resort={trip.name}
                                    startDate={trip.startDate}
                                    endDate={trip.endDate}
                                    status={trip.status}
                                    buttonText={trip.checkButton}
                                    linkTo={trip.bookingStep}
                                    masterID={trip.masterID}
                                    resortID={trip.resortID}
                                    tripID={trip.id}
                                />
                            ))
                            : null}
                    </table>
                    <Link to="/">
                        <SmallEllipseBtn
                            text="Back to Home"
                            style={{backgroundColor: "rgba(104, 99, 105, 1)"}}
                        />
                    </Link>
                    {hasTrips ? (
                        <div className="d-flex flex-row py-4 justify-content-center">
                            <Pagination
                                totalRecords={totalTrips}
                                pageLimit={5}
                                pageNeighbours={1}
                                onPageChanged={this.onPageChanged}
                            />
                            <span className="current-page d-inline-block h-150 pl-4 text-secondary">
                Page <span className="font-weight-bold">{currentPage}</span> /{" "}
                                <span className="font-weight-bold">{totalPages}</span>
              </span>
                        </div>
                    ) : null}

                    {/* end container */}
                </div>
            </React.Fragment>
        );
    }
}

export default withCookies(MyTripPage);
