import React, {Component} from "react";
import SliderBar from "../../components/template/SliderBar";
import SmallEllipseBtn from "../../components/template/SmallEllipseBtn";
import DisabilityForm from "../template/DisabilityForm";
import axios from "axios";
import AbilityLevelTip from "../template/AbilityLevelTip";
import DisabilityTip from "../template/DisabilityTip";
import DatePicker from "react-datepicker";
import moment from "moment";
import AlertWindow from "../template/AlertWindow"
import {Redirect} from "react-router-dom";
import {withCookies, Cookies} from 'react-cookie';
import {instanceOf} from 'prop-types';

function StartDate(props) {
    function handleChange(date) {
        props.onChange(date, "startDate");
        props.checkValidate();
    }

    return (
        <React.Fragment>
            <DatePicker
                selected={props.startDate}
                onChange={handleChange}
                minDate={props.validMinDate}
                dateFormat="YYYY-MM-DD"
            />
        </React.Fragment>
    );
}

class AddGroupMemberCard extends Component {

    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            hasDisability: false,
            startDate: moment(),
            birth_format_wrong: false,
            token: this.props.token,
            alert: null, //what is the status of the alertWindow
            showAlertWindow: false, //whether show the alertWindow
            redirect: false //redirect to login page
        };
    }

    // choose date
    handleChange = (date, choice) => {
        this.setState({
            [choice]: date,
            startDate: date
        });
    };

    handleLogout = () => {
        const {cookies} = this.props;

        sessionStorage.removeItem("userSocialData");
        sessionStorage.removeItem("userToken");
        cookies.remove("user-name");
        cookies.remove("access-token");
        cookies.remove("user-pic");
    };

    validator = () => {
        let isValid = true;

        if (
            moment(this.state.startDate).format("YYYY-MM-DD") ===
            moment().format("YYYY-MM-DD") ||
            moment(this.state.startDate).format("YYYY-MM-DD") >
            moment().format("YYYY-MM-DD")
        ) {
            document
                .getElementsByClassName("react-datepicker__input-container")[0]
                .getElementsByTagName("input")[0].style.boxShadow =
                "0px 2px 0px 0px red";
            this.setState({birth_format_wrong: true});
            isValid = false;
        }

        return isValid;
    };

    componentDidMount() {
        document
            .getElementsByClassName("react-datepicker__input-container")[0]
            .getElementsByTagName("input")[0].style.cssText =
            "width: 100%;box-sizing: border-box !important;padding: 3px;text-align: center;max-width: 100%;min-width: 100%;min-height: 100%;text-overflow: ellipsis;margin: auto auto;font-size: 20px;";
        document
            .getElementsByClassName("react-datepicker__input-container")[0]
            .getElementsByTagName("input")[0].className = "form-control";
    }

    handleSubmit = event => {
        event.preventDefault();

        const isDisabledValue = document.getElementById("is_disability").checked;
        let disabilityMembershipValue = "";
        let disabilityMembershipIDValue = "";
        let disabilityDetailValue = "";

        if (isDisabledValue === true) {
            disabilityMembershipValue = document.getElementById(
                "disability_membership"
            ).value;
            disabilityMembershipIDValue = document.getElementById(
                "disability_memberid"
            ).value;
            disabilityDetailValue = document.getElementById("disability_detail")
                .value;
        } else {
            disabilityMembershipValue = "";
            disabilityMembershipIDValue = "";
            disabilityDetailValue = "";
        }

        const data = JSON.stringify({
            token: this.state.token,
            FirstName: document.getElementById("firstName").value,
            LastName: document.getElementById("lastName").value,
            Gender: document.getElementById("gender").value,
            DOB: moment(this.state.startDate).format("YYYY-MM-DD"),
            AbilityLevel: JSON.stringify({
                SkiAbility: document.getElementById("ski_ability").value,
                SnowboardAbility: document.getElementById("snowboard_ability").value,
                TelemarkAbility: document.getElementById("telemark_ability").value,
                SnowbikeAbility: document.getElementById("snowbike_ability").value,
                SnowmobileAbility: document.getElementById("snowmobile_ability").value,
                SnowshoeAbility: document.getElementById("snowshoe_ability").value
            }),
            Disability: JSON.stringify({
                IsDisabled: isDisabledValue,
                DisabilityMembership: disabilityMembershipValue,
                DisabilityMembershipID: disabilityMembershipIDValue,
                DisabilityDetail: disabilityDetailValue
            })
        });
        axios.post("http://127.0.0.1:3333/api/add-member", JSON.parse(data)).then(
            /*Proceed subsequent actions based on value */
            response => {

                if (response.data.status === 'ExpiredJWT') {
                    console.log("token expired");

                    this.setState({
                        token: "",
                        alert: 'ExpiredJWT'
                    });

                } else if (response.data.status === 'fail') {
                    console.log("token expired");
                    this.setState({
                        alert: 'fail'
                    })

                } else if (response.data.status === 'success') {
                    console.log("token valid");
                    let userToken = {
                        token: response.data.token
                    };

                    //save token into session
                    sessionStorage.setItem("userToken", JSON.stringify(userToken));

                    //save token into cookie
                    let date = new Date();
                    date.setTime(date.getTime() + +2592000);
                    const {cookies} = this.props;

                    //only when user click "remember me", update the token in cookies
                    if (cookies.get("access-token")) {
                        cookies.set("access-token", response.data.token, {
                            expires: date,
                            path: "/"
                        });

                        console.log(
                            "token has been extended. Token is: " + cookies.get("access-token")
                        );
                    }

                    this.setState({
                        token: response.data.token,
                        alert: 'success'
                    })
                }
                this.setState({showAlertWindow: true})
            }
        );
    };

    render() {
        if (this.state.redirect) {
            return <Redirect to={"/login"}/>;
        }

        let alertWindow;
        if (this.state.showAlertWindow) {
            if (this.state.alert === 'success') {
                alertWindow = <AlertWindow
                    displayText={<div>Congratulation, You have already successfully add your group member.</div>}
                    btnNum='1'
                    btnText="OK"
                    mode='customMode'
                    onHandClick={() => this.setState({showAlertWindow: false})}
                />
            } else if (this.state.alert === 'ExpiredJWT' || this.state.alert === 'fail') {
                alertWindow = <AlertWindow
                    displayText={<div>Sorry, you token is expired. Please login again.</div>}
                    btnNum='1'
                    btnText="Login"
                    mode='customMode'
                    onHandClick={() => {
                        this.setState({showAlertWindow: false});
                        this.setState({redirect: true});
                        this.handleLogout();
                    }}
                />
            }
        }

        return (
            <React.Fragment>
                {alertWindow}
                <div
                    style={{
                        border: "1px solid black",
                        width: "auto",
                        height: "auto",
                        padding: "25px 50px"
                    }}
                >
                    <div className="form-row">
                        <div className="form-group col-11"/>
                        <div className="form-group col-1">
              <span
                  style={{fontSize: "30px", top: "0", right: "0"}}
                  onClick={this.props.onHandleClose}
              >
                <i className="far fa-times-circle"/>
              </span>
                        </div>
                    </div>
                    {/* title */}
                    <div className="form-row">
                        <div className="form-group col-4">
              <span style={{fontSize: "20px", color: "#686369"}}>
                Add Group Member:
              </span>
                        </div>
                    </div>
                    {/* name row */}
                    <form data-toggle="validator">
                        <div className="form-row">
                            <div className="form-group col-6">
                                <lable
                                    style={{fontSize: "20px", color: "#686369"}}
                                    htmlFor="firstName"
                                >
                                    First Name *:
                                </lable>
                                <input
                                    type="text"
                                    id="firstName"
                                    className="form-control"
                                    required
                                />
                            </div>
                            <div className="form-group col-6">
                                <lable
                                    style={{fontSize: "20px", color: "#686369"}}
                                    htmlFor="lastName"
                                >
                                    Last Name *:
                                </lable>
                                <input
                                    type="text"
                                    id="lastName"
                                    className="form-control"
                                    required
                                />
                            </div>
                        </div>
                        {/* gender row */}
                        <div className="form-row">
                            <div className="form-group col-6">
                                <lable
                                    style={{fontSize: "20px", color: "#686369"}}
                                    htmlFor="gender"
                                >
                                    Gender *:
                                </lable>
                                <select id="gender" className="form-control" required>
                                    <option selected value="male">
                                        Male
                                    </option>
                                    <option value="female">Female</option>
                                </select>
                            </div>
                            <div className="form-group col-6">
                                <lable
                                    style={{fontSize: "20px", color: "#686369"}}
                                    htmlFor="birth"
                                >
                                    Date of Birth *:
                                </lable>

                                <StartDate
                                    checkValidate={() => {
                                        this.setState({birth_format_wrong: false});
                                    }}
                                    startDate={this.state.startDate}
                                    onChange={this.handleChange}
                                />
                                {/* if wrong */}
                                {this.state.birth_format_wrong ? (
                                    <div style={{color: "red"}}>
                                        Please fill a valid birthday
                                    </div>
                                ) : (
                                    ""
                                )}
                            </div>
                        </div>
                        {/* ability row */}
                        Ability Level&ensp;
                        {/* tooltip */}
                        <AbilityLevelTip/>
                        {/* ability slider bar */}
                        <div className="form-row">
                            <div className="form-group col-6">
                                <SliderBar
                                    lable="Ski"
                                    min="1"
                                    max="7"
                                    id="ski_ability"
                                    value=""
                                />
                            </div>
                            <div className="form-group col-6">
                                <SliderBar
                                    lable="Snowboard"
                                    min="1"
                                    max="7"
                                    id="snowboard_ability"
                                    value=""
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-6">
                                <SliderBar
                                    lable="Telemark"
                                    min="1"
                                    max="7"
                                    id="telemark_ability"
                                    value=""
                                />
                            </div>
                            <div className="form-group col-6">
                                <SliderBar
                                    lable="Snowbike"
                                    min="1"
                                    max="7"
                                    id="snowbike_ability"
                                    value=""
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-6">
                                <SliderBar
                                    lable="Snowmobile"
                                    min="1"
                                    max="7"
                                    id="snowmobile_ability"
                                    value=""
                                />
                            </div>
                            <div className="form-group col-6">
                                <SliderBar
                                    lable="Snowshoe"
                                    min="1"
                                    max="7"
                                    id="snowshoe_ability"
                                    value=""
                                />
                            </div>
                        </div>
                        {/* disbility item */}
                        <div className="form-group col-12">
                            <input
                                className="form-check-input"
                                onChange={e => {
                                    this.setState({hasDisability: e.target.checked});
                                }}
                                type="checkbox"
                                id="is_disability"
                            />
                            <label className="form-check-label" htmlFor="is_disability">
                                &nbsp;&nbsp; Any physical or learning disabilities?
                            </label>
                            &ensp;
                            {/* tooltip */}
                            <DisabilityTip/>
                            {/* end tooltip */}
                            {/* disable form */}
                            {this.state.hasDisability === true ? (
                                <div className="form-row">
                                    <div className="form-group col-12">
                                        <DisabilityForm/>
                                    </div>
                                </div>
                            ) : (
                                ""
                            )}
                        </div>
                        <span onClick={this.handleSubmit.bind(this)}>
              <SmallEllipseBtn
                  text="Add"
                  btnColor="rgba(255, 97, 97, 1)"
                  btnType="submit"
              />
            </span>
                    </form>
                </div>
            </React.Fragment>
        );
    }
}

export default withCookies(AddGroupMemberCard);
