import React, {Component} from "react";
import "../../css/ProfilePage/ProfilePage.css";
import SliderBar from "../../components/template/SliderBar";
import DisabilityForm from "../../components/template/DisabilityForm";
import AbilityLevelTip from "../../components/template/AbilityLevelTip";
import DisabilityTip from "../../components/template/DisabilityTip";
import {withCookies, Cookies} from "react-cookie";
import {Redirect} from "react-router-dom";
import {instanceOf} from "prop-types";
import AlertWindow from "../../components/template/AlertWindow";
import axios from "axios";
import moment from "moment";
import DatePicker from "react-datepicker";

function Birthday(props) {
    function handleChange(date) {
        props.onChange(date, "dob");
        props.checkValidate();
    }

    return (
        <React.Fragment>
            <DatePicker
                selected={moment(props.dob)}
                onChange={handleChange}
                dateFormat="YYYY-MM-DD"
                maxDate={moment().subtract(1, "days")}
                placeholderText="YYYY-MM-DD"
            />
        </React.Fragment>
    );
}

//TODO: add save photo to "public" folder function
class ProfilePage extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };

    constructor(props) {
        super(props);
        const {cookies} = props;
        this.state = {
            token: cookies.get("access-token") || null,
            provider: null,
            isValidToken: true,
            isShow: false,
            email: null,
            portrait: null,
            dob: null,
            birth_format_wrong: false,
            age: null,
            gender: null,
            firstName: null,
            lastName: null,
            phoneCode: null,
            phoneNumber: null,
            skiAbility: null,
            snowboardAbility: null,
            telemarkAbility: null,
            snowbikeAbility: null,
            snowmobileAbility: null,
            snowshoeAbility: null,
            hasDisAbility: false,
            isDisabled: false,
            disabilityMembership: null,
            disabilityMemberId: null,
            disabilityDetail: null,
            user_pic:
                "https://static.wixstatic.com/media/25b4a3_3c026a3adb9a44e1a02bcc33e8a2f282~mv2.jpg/v1/crop/x_7,y_0,w_1184,h_1184/fill/w_96,h_96,al_c,q_80,usm_0.66_1.00_0.01/25b4a3_3c026a3adb9a44e1a02bcc33e8a2f282~mv2.webp"
        };

        this.handleSubmit = this.handleSubmit.bind(this);

    }

//   validator = () => {
//     let isValid = true;

//     if (
//         moment(this.state.startDate).format("YYYY-MM-DD") ===
//         moment().format("YYYY-MM-DD") ||
//         moment(this.state.startDate).format("YYYY-MM-DD") >
//         moment().format("YYYY-MM-DD")
//     ) {
//         document
//             .getElementsByClassName("react-datepicker__input-container")[0]
//             .getElementsByTagName("input")[0].style.boxShadow =
//             "0px 2px 0px 0px red";
//         this.setState({birth_format_wrong: true});
//         isValid = false;
//     }

//     return isValid;
// };

    validateDate = () => {

        let aDate = moment(this.state.dob, 'YYYY-MM-DD', true),
            isValid = aDate.isValid(),
            birthday = this.refs.birthday;
        console.log(birthday)
        // if (isValid === false) {
        //   birthday.setCustomValidity("Invalid date format");
        // } else {
        //   birthday.setCustomValidity("");
        // }
    }

    dateChanged = (date, choice) => {
        this.setState({
            [choice]: date,
            dob: date
        }, () => {
            let countAge = moment().diff(
                moment(this.state.dob).format("YYYY"),
                "years"
            );
            if (countAge !== this.state.age) {
                this.setState({
                    age: countAge
                });
            }
            this.validateDate();
        });

    };

    //   upload btn animation
    handleHover = e => {
        if (e.target.id === "upload_btn") {
            e.target.style.backgroundColor = "rgba(78, 183, 245, 1)";
        }
    };

    handleLogout = () => {
        const {cookies} = this.props;

        sessionStorage.removeItem("userSocialData");
        sessionStorage.removeItem("userToken");
        cookies.remove("user-name");
        cookies.remove("access-token");
        cookies.remove("user-pic");
    };

    componentDidMount() {
        if (this.state.token === null && sessionStorage.getItem("userSocialData")) {
            let userData = JSON.parse(sessionStorage.getItem("userSocialData"));
            if (userData.provider) {
                this.setState({
                    provider: userData.provider
                });
            }
        }

        if (sessionStorage.getItem("userToken")) {
            let tokenData = JSON.parse(sessionStorage.getItem("userToken"));
            this.setState({
                token: tokenData.token
            });

            const setState = this.setState.bind(this);
            let url =
                "http://127.0.0.1:3333/api/user-profile/" +
                JSON.parse(sessionStorage.getItem("userToken")).token;
            //console.log(url);
            axios.get(url).then(response => {
                console.log("get success");

                if (response.data.skiAbility != null) {
                    setState({
                        skiAbility: response.data.skiAbility
                    });
                    //console.log(this.state.skiAbility)
                }
                if (response.data.snowboardAbility != null) {
                    setState({snowboardAbility: response.data.snowboardAbility});
                }
                if (response.data.telemarkAbility != null) {
                    setState({telemarkAbility: response.data.telemarkAbility});
                }
                if (response.data.snowbikeAbility != null) {
                    setState({snowbikeAbility: response.data.snowbikeAbility});
                }
                if (response.data.snowmobileAbility != null) {
                    setState({snowmobileAbility: response.data.snowmobileAbility});
                }
                if (response.data.snowshoeAbility != null) {
                    setState({snowshoeAbility: response.data.snowshoeAbility});
                }

                if (response.data.isDisabled) {
                    this.setState({
                        hasDisability: true
                    });
                    setState({isDisabled: response.data.isDisabled});
                    setState({
                        disabilityMembership: response.data.disabilityMembership
                    });
                    setState({
                        disabilityMemberId: response.data.disabilityMembershipId
                    });
                    setState({disabilityDetail: response.data.disabilityDetail});
                }

                setState({email: response.data.email});

                if (response.data.gender != null) {
                    //document.getElementById("gender").value = response.data.gender;
                    setState({gender: response.data.gender});
                }
                if (response.data.firstName != null) {
                    setState({firstName: response.data.firstName});
                }
                if (response.data.lastName != null) {
                    setState({lastName: response.data.lastName});
                }
                if (response.data.phoneCode != null) {
                    setState({phoneCode: response.data.phoneCode});
                }
                if (response.data.phoneNumber != null) {
                    setState({phoneNumber: response.data.phoneNumber});
                }
                if (response.data.dob != null) {
                    setState({dob: response.data.dob});
                    let countAge = moment().diff(
                        moment(this.state.dob).format("YYYY"),
                        "years"
                    );
                    document.getElementById("age").value = countAge;
                }
                document.getElementById("country").value = response.data.country;
                document.getElementById("postcode").value = response.data.postcode;

                if (this.state.hasDisability) {
                    document.getElementById("is_disability").checked = true;
                } else {
                    document.getElementById("is_disability").checked = false;
                }
            });
            //console.log(this.state.skiAbility)
        }
    }

    ageCount = e => {
        this.setState({dob: e.target.value}, () => {
            let countAge = moment().diff(
                moment(this.state.dob).format("YYYY"),
                "years"
            );
            if (countAge !== this.state.age) {
                this.setState({
                    age: countAge
                });
            }
            //console.log(countAge)
        });
    };

    async handleSubmit(e) {
        e.preventDefault();

        const isDisabledValue = document.getElementById("is_disability").checked;
        let disabilityMembershipValue = null;
        let disabilityMembershipIDValue = null;
        let disabilityDetailValue = null;

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
            disabilityMembershipValue = null;
            disabilityMembershipIDValue = null;
            disabilityDetailValue = null;
        }

        //TODO: should also send portrait to the backend
        const data = {
            SkiAbility: document.getElementById("ski_ability").value,
            SnowboardAbility: document.getElementById("snowboard_ability").value,
            TelemarkAbility: document.getElementById("telemark_ability").value,
            SnowbikeAbility: document.getElementById("snowbike_ability").value,
            SnowmobileAbility: document.getElementById("snowmobile_ability").value,
            SnowshoeAbility: document.getElementById("snowshoe_ability").value,
            IsDisabled: isDisabledValue,
            DisabilityMembership: disabilityMembershipValue,
            DisabilityMembershipID: disabilityMembershipIDValue,
            DisabilityDetail: disabilityDetailValue,
            token: this.state.token,
            provider: this.state.provider,
            FirstName: document.getElementById("firstName").value,
            LastName: document.getElementById("lastName").value,
            Gender: document.getElementById("gender").value,
            DOB: moment(this.state.dob).format("YYYY-MM-DD"),
            PhoneAreaCode: document.getElementById("phone_number_pre").value,
            PhoneNumber: document.getElementById("phoneNumber").value,
            Country: document.getElementById("country").value,
            Postcode: document.getElementById("postcode").value
        };

        //console.log(this.state.skiAbility);
        //console.log(document.getElementById("ski_ability").value);

        await axios.put("http://127.0.0.1:3333/api/user-profile", data).then(
            /*Proceed subsequent actions based on value */
            response => {
                //handle token is not valid
                if (response.data.tokenValid === false) {
                    console.log("token expired");
                    this.setState({
                        isValidToken: false,
                        isShow: true
                    });
                } else {
                    console.log("change success");
                    //save token into session
                    let userSocialData;
                    userSocialData = {
                        name: response.data.name,
                        //TODO: to be changed
                        // FIXME: Unhandled Rejection (QuotaExceededError): Failed to execute 'setItem' on 'Storage': Setting the value of 'userSocialData' exceeded the quota.
                        provider_pic: this.state.user_pic
                    };
                    sessionStorage.setItem(
                        "userSocialData",
                        JSON.stringify(userSocialData)
                    );
                    let userToken;
                    userToken = {
                        token: response.data.token
                    };
                    sessionStorage.setItem("userToken", JSON.stringify(userToken));

                    //save token into cookie
                    const {cookies} = this.props;

                    //only when user click "remember me", update the token in cookies
                    if (cookies.get("access-token")) {
                        let date = new Date();
                        date.setTime(date.getTime() + +2592000);
                        cookies.set("access-token", this.state.token, {
                            expires: date,
                            path: "/"
                        });
                        cookies.set("user-name", response.data.name, {
                            expires: date,
                            path: "/"
                        });
                        //TODO: to be changed
                        // FIXME: Unhandled Rejection (QuotaExceededError): Failed to execute 'setItem' on 'Storage': Setting the value of 'userSocialData' exceeded the quota.
                        cookies.set("user-pic", this.state.user_pic, {
                            expires: date,
                            path: "/"
                        });

                        console.log(
                            "token has been extended. Token is: " +
                            cookies.get("access-token")
                        );
                    }

                    this.setState({
                        token: response.data.token,
                        isValidToken: true,
                        isShow: true
                    });
                }
            }
        );
    }

    render() {
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
        if (!sessionStorage.getItem("userToken")) {
            return (
                <Redirect
                    to={{
                        pathname: "/login",
                        state: {from: this.props.location.pathname}
                    }}
                />
            );
        }

        let readOnly;
        let disabled;
        if (this.state.provider != null) {
            readOnly = true;
            disabled = true;
        } else {
            readOnly = false;
            disabled = false;
        }

        if (this.state.dob) {
            return (
                <React.Fragment>
                    <div className="container">
                        <br/>
                        {/* title */}
                        <div className="form-row">
                            <div className="form-group col-lg-2"/>
                            <div className="form-group col-4 col-lg-4">
                <span style={{fontSize: "2rem", whiteSpace: "nowrap"}}>
                  My Profile
                </span>
                            </div>
                            <div className="form-group col-8 col-lg-6"/>
                        </div>

                        <br/>
                        <form data-toggle="validator" onSubmit={this.handleSubmit}>
                            {/* photo */}
                            <div className="form-row">
                                <div className="form-group col-3"/>
                                <div
                                    className="form-group col-6"
                                    style={{
                                        alignItems: "center",
                                        textAlign: "center",
                                        alignContent: "center"
                                    }}
                                >
                                    <img
                                        id="user_pic"
                                        style={{
                                            width: "80px",
                                            height: "80px",
                                            borderRadius: "50%",
                                            fontSize: "20px",
                                            color: "#fff",
                                            lineHeight: "60px",
                                            textAlign: "center",
                                            boxShadow: "2px 2px 2px 2px grey",
                                            border: "5px solid white",
                                            backgroundSize: "contain",
                                            margin: "auto auto"
                                        }}
                                        src={this.state.user_pic}
                                    />
                                </div>
                                <div className="form-group col-3"/>
                            </div>
                            {/* upload btn */}
                            <div className="form-row">
                                <div className="form-group col-3 col-lg-5"/>
                                <label
                                    id="upload_btn"
                                    className="form-group col-6 col-lg-2"
                                    style={{
                                        width: "100%",
                                        height: "auto",
                                        borderRadius: "20px 20px 20px 20px",
                                        backgroundColor: "rgba(56, 153, 236, 1)",
                                        boxShadow: "1px 1px 1px gray",
                                        textAlign: "center",
                                        margin: "auto auto",
                                        padding: "5px 20px",
                                        color: "white",
                                        cursor: "pointer",
                                        fontSize: "20px",
                                        whiteSpace: "nowrap"
                                    }}
                                    onMouseEnter={this.handleHover}
                                    onMouseLeave={this.handleMouseLeave}
                                >
                                    Upload photo +
                                    <input
                                        type="file"
                                        accept="image/*"
                                        hidden
                                        disabled={disabled}
                                        onChange={e => {
                                            if (window.FileReader) {
                                                const reader = new FileReader();
                                                const file = e.target.files[0];
                                                reader.addEventListener(
                                                    "load",
                                                    () => {
                                                        this.setState({user_pic: reader.result});
                                                    },
                                                    false
                                                );
                                                if (file) {
                                                    reader.readAsDataURL(file);
                                                }
                                            } else {
                                                alert("Not supported by your browser!");
                                            }
                                        }}
                                    />
                                </label>
                                <div className="form-group col-3 col-lg-5"/>
                            </div>
                            {/* max size text */}
                            <div className="form-row">
                                <div className="form-group col-3"/>
                                <div
                                    className="form-group col-6"
                                    style={{
                                        width: "auto",
                                        height: "auto",
                                        margin: "auto auto",
                                        textAlign: "center",
                                        color: "#737373",
                                        opacity: "0.7",
                                        direction: "ltr"
                                    }}
                                >
                                    Max File Size 15MB
                                </div>
                                <div className="form-group col-3"/>
                            </div>

                            {/* user info */}
                            <div className="form-row">
                                <div className="form-group col-lg-2"/>
                                {/* email */}
                                <div className="form-group col-12 col-lg-4">
                                    <label htmlFor="inputEmail">Email</label>
                                    <input
                                        id="inputEmail"
                                        type="email"
                                        className="form-control"
                                        placeholder="Email"
                                        value={this.state.email}
                                        readOnly
                                    />
                                </div>
                                &ensp; &ensp;
                                {/* gender */}
                                <div className="form-group col-12 col-lg-4">
                                    <label htmlFor="gender">Gender</label>

                                    <select id="gender" className="form-control" value={this.state.gender}>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                </div>
                                <div className="form-group col-lg-2"/>
                            </div>

                            {/* first name */}
                            <div className="form-row">
                                <div className="form-group col-lg-2"/>
                                <div className="form-group col-12 col-lg-4">
                                    <label htmlFor="firstName">First Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="firstName"
                                        placeholder="First Name"
                                        readOnly={readOnly}
                                        value={this.state.firstName}
                                    />
                                </div>
                                &ensp; &ensp;
                                <div className="form-group col-12 col-lg-4">
                                    <label htmlFor="inputPassword">Last Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="lastName"
                                        placeholder="Last Name"
                                        readOnly={readOnly}
                                        value={this.state.lastName}
                                    />
                                </div>
                                <div className="form-group col-lg-2"/>
                            </div>

                            {/* phone */}
                            <div className="form-row">
                                <div className="form-group col-2"/>
                                {/* phone */}
                                <div className="form-group col-12 col-lg-4">
                                    <label htmlFor="phoneNumber">Phone</label>
                                    <div className="form-row">
                                        <div className="form-group col-4 col-lg-4">
                                            <select className="custom-select" id="phone_number_pre"
                                                    value={this.state.phoneCode}>
                                                <option value="+61">+61</option>
                                                <option value="2">Two</option>
                                                <option value="3">Three</option>
                                            </select>
                                        </div>
                                        <div className="form-group col-8 col-lg-8">
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="phoneNumber"
                                                placeholder="Phone"
                                                value={this.state.phoneNumber}
                                            />
                                        </div>
                                    </div>
                                </div>
                                &ensp; &ensp;
                                {/* DOB */}
                                <div className="form-group col-12 col-lg-4">
                                    <div className="form-row">
                                        <div className="form-group col-10 col-lg-10">
                                            <label htmlFor="inputPassword">Date of Birth</label>
                                            {/* <input
                        type="text"
                        className="form-control"
                        id="dob"
                        placeholder="YYYY-MM-DD"
                        value={this.state.dob}
                        onChange={this.ageCount}
                      /> */}
                                            <Birthday
                                                ref="birthday"
                                                checkValidate={() => {
                                                    this.setState({birth_format_wrong: false});
                                                }}

                                                dob={this.state.dob}
                                                onChange={this.dateChanged}
                                            />
                                            {/* if wrong */}
                                            {/* {this.state.birth_format_wrong ? (
                                <div style={{color: "red"}}>Please fill a valid birthday</div>
                            ) : (
                                ""
                            )} */}
                                        </div>
                                        <div className="form-group col-2 col-lg-2">
                                            <label htmlFor="inputPassword">Age</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="age"
                                                placeholder=""
                                                value={this.state.age}
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group col-2"/>
                            </div>

                            {/* country */}
                            <div className="form-row">
                                <div className="form-group col-lg-2"/>
                                <div className="form-group col-12 col-lg-4">
                                    <label htmlFor="inputEmail">Country</label>
                                    <input
                                        type=""
                                        className="form-control"
                                        id="country"
                                        placeholder=""
                                    />
                                </div>
                                &ensp; &ensp;
                                <div className="form-group col-12 col-lg-4">
                                    <label htmlFor="inputPassword">Postcode</label>
                                    <input
                                        type=""
                                        className="form-control"
                                        id="postcode"
                                        placeholder=""
                                    />
                                </div>
                                <div className="form-group col-lg-2"/>
                            </div>

                            {/* line */}
                            <div style={{position: "absolute", left: "50%"}}>
                <span
                    style={{
                        position: "relative",
                        left: "-50%",
                        fontSize: "20px"
                    }}
                >
                  - Ability Level -
                </span>
                            </div>
                            <br/>
                            <br/>

                            {/* my ability */}
                            <div className="form-row">
                                <div className="form-group col-lg-2"/>
                                <div className="form-group col-12 col-lg-10">
                                    My Ability&ensp;
                                    {/* tooltip */}
                                    <AbilityLevelTip/>
                                    {/* end tooltip */}
                                    &ensp; Not sure about your ability level?
                                </div>
                            </div>

                            {/* first line */}
                            <div className="form-row">
                                <div className="form-group col-lg-2"/>
                                <div className="form-group col-12 col-lg-4">
                                    <SliderBar
                                        lable="Ski"
                                        min="1"
                                        max="7"
                                        id="ski_ability"
                                        name="skiability"
                                        value={this.state.skiAbility}
                                    />
                                </div>
                                &ensp; &ensp;
                                <div className="form-group col-12 col-lg-4">
                                    <SliderBar
                                        lable="Snowboard"
                                        min="1"
                                        max="7"
                                        id="snowboard_ability"
                                        value={this.state.snowboardAbility}
                                    />
                                </div>
                                <div className="form-group col-lg-2"/>
                            </div>

                            {/* second line */}
                            <div className="form-row">
                                <div className="form-group col-lg-2"/>
                                <div className="form-group col-12 col-lg-4">
                                    <SliderBar
                                        lable="Telemark"
                                        min="1"
                                        max="7"
                                        id="telemark_ability"
                                        value={this.state.telemarkAbility}
                                    />
                                </div>
                                &ensp; &ensp;
                                <div className="form-group col-12 col-lg-4">
                                    <SliderBar
                                        lable="Snowbike"
                                        min="1"
                                        max="7"
                                        id="snowbike_ability"
                                        value={this.state.snowbikeAbility}
                                    />
                                </div>
                                <div className="form-group  col-lg-2"/>
                            </div>

                            {/* third line */}
                            <div className="form-row">
                                <div className="form-group col-lg-2"/>
                                <div className="form-group col-12 col-lg-4">
                                    <SliderBar
                                        lable="Snowmobile"
                                        min="1"
                                        max="7"
                                        id="snowmobile_ability"
                                        value={this.state.snowmobileAbility}
                                    />
                                </div>
                                &ensp; &ensp;
                                <div className="form-group col-12 col-lg-4">
                                    <SliderBar
                                        lable="Snowshoe"
                                        min="1"
                                        max="7"
                                        id="snowshoe_ability"
                                        value={this.state.snowshoeAbility}
                                    />
                                </div>
                                <div className="form-group col-lg-2"/>
                            </div>

                            {/* disable */}
                            <div className="form-row">
                                <div className="form-group col-lg-2"/>
                                <div className="form-group col-12 col-lg-10">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        onChange={e => {
                                            this.setState({hasDisability: e.target.checked});
                                        }}
                                        id="is_disability"
                                        value={this.state.isDisabled}
                                    />
                                    <label className="form-check-label" htmlFor="is_disability">
                                        Any physical or learning disabilities?
                                    </label>
                                    &ensp;
                                    {/* tooltip */}
                                    <DisabilityTip/>
                                </div>
                            </div>

                            {/* disable form */}
                            {this.state.hasDisability === true ? (
                                <DisabilityForm
                                    selected={this.state.disabilityMembership}
                                    disabilityMemberid={this.state.disabilityMemberId}
                                    disabilityDetail={this.state.disabilityDetail}
                                />
                            ) : (
                                ""
                            )}

                            {/* save btn */}
                            <div className="form-row">
                                <div className="form-group col-4 col-lg-2"/>
                                <div className="form-group col-4 col-lg-4">
                                    <button type="submit" className="btn btn-primary">
                                        Save
                                    </button>
                                </div>
                                <div className="form-group col-4 col-lg-6"/>
                            </div>
                        </form>
                    </div>

                    {this.state.isValidToken && this.state.isShow ? (
                        <AlertWindow
                            displayText="Your profile has been saved."
                            btnNum="1"
                            mode="linkMode"
                            btnText="OK"
                            linkTo="/profile"
                            onHandleClose={() => {
                                this.setState({isShow: false});
                                window.location.reload();
                            }}
                        />
                    ) : (
                        ""
                    )}

                    {this.state.isValidToken === false && this.state.isShow ? (
                        <AlertWindow
                            displayText="Sorry, your token has expired, please log in again"
                            btnNum="1"
                            mode="linkMode"
                            btnText="OK"
                            linkTo={{
                                pathname: "/login",
                                state: {from: this.props.location.pathname}
                            }}
                            onHandleClose={() => {
                                this.setState({isShow: false});
                                this.handleLogout();
                            }}
                        />
                    ) : (
                        ""
                    )}
                </React.Fragment>
            );
        }
        return <div>Loading...</div>;
    }
}

export default withCookies(ProfilePage);
