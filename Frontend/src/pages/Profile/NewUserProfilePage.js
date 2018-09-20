import React, {Component} from "react";
import moment from "moment";
import "../../css/NewUserProfilePage/NewUserProfilePage.css";
import {withCookies, Cookies} from "react-cookie";
import {instanceOf} from "prop-types";
import {Redirect} from "react-router-dom";
import AlertWindow from "../../components/template/AlertWindow";
// pages
import FirstPage from "../../components/NewUserProfilePage/FirstPage";
import SecondPage from "../../components/NewUserProfilePage/SecondPage";
import ThirdPage from "../../components/NewUserProfilePage/ThirdPage";
import ForthPage from "../../components/NewUserProfilePage/ForthPage";
import FifthPage from "../../components/NewUserProfilePage/FifthPage";
import axios from "axios/index";

// main component
class NewUserProfilePage extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };

    constructor(props) {
        super(props);
        const {cookies} = props;
        this.state = {
            token: cookies.get("access-token") || null,
            provider: cookies.get("user-provider") || null,
            isValidToken: true,
            isShow: false,
            currentPage: "page_1",
            progress: "0%",
            file: null,
            firstName: null,
            lastName: null,
            gender: null,
            dob: null,
            phoneNumberPre: null,
            phoneNumber: null,
            country: null,
            postcode: null,
            skiAbility: 1,
            snowboardAbility: 1,
            telemarkAbility: 1,
            snowbikeAbility: 1,
            snowmobileAbility: 1,
            snowshoeAbility: 1,
            hasDisability: null,
            disabilityMembership: null,
            disabilityMemberid: null,
            disabilityDetail: null,
            user_pic:
                "https://static.wixstatic.com/media/25b4a3_993d36d976a24a77ba7bb9267d05bd54~mv2.png/v1/fill/w_96,h_96,al_c,usm_0.66_1.00_0.01/25b4a3_993d36d976a24a77ba7bb9267d05bd54~mv2.png"
        };

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        if (this.state.token === null && sessionStorage.getItem("userSocialData")) {
            let userData = JSON.parse(sessionStorage.getItem("userSocialData"));
            //if provider is not email, redirect to second page
            if(userData.provider !== "email")
            {
                const name = userData.name.split(" ");
                this.setState({
                    firstName: name[0],
                    lastName: name[1],
                    provider: userData.provider,
                    user_pic: userData.provider_pic,
                    currentPage: "page_2",
                    progress: "25%"
                });
            }
            else {
                this.setState({
                    provider: userData.provider
                });
            }
        }

        if (this.state.token === null && sessionStorage.getItem("userToken")) {
            let tokenData = JSON.parse(sessionStorage.getItem("userToken"));
            this.setState({
                token: tokenData.token
            });
        }
    }

    handleLogout = () => {
        const {cookies} = this.props;

        this.setState({
            token: null,
            user_pic: null,
            provider: null
        });

        sessionStorage.removeItem("userSocialData");
        sessionStorage.removeItem("userToken");
        sessionStorage.removeItem("userFinishProfile");
        cookies.remove("user-name");
        cookies.remove("access-token");
        cookies.remove("user-pic");
        cookies.remove("user-provider");
        cookies.remove("user-profileFinished");
    };

    handleNextPage = page => {
        this.setState({currentPage: page});
    };
    handleSetState = (stateName, stateVal) => {
        this.setState({[stateName]: stateVal});
    };

    handleChangeProgress = newProgress => {
        this.setState({progress: newProgress});
    };

    async handleSubmit(e) {
        e.preventDefault();

        console.log(this.state.user_pic);
        console.log(this.state.file);
        let postData;
        postData = {
            token: this.state.token,
            provider: this.state.provider,
            FirstName: this.state.firstName,
            LastName: this.state.lastName,
            //TODO: send image file to the backend
            Gender: this.state.gender,
            DOB: moment(this.state.dob).format("YYYY-MM-DD"),
            PhoneAreaCode: this.state.phoneNumberPre,
            PhoneNumber: this.state.phoneNumber,
            Country: this.state.country,
            Postcode: this.state.postcode,
            SkiAbility: this.state.skiAbility,
            SnowboardAbility: this.state.snowboardAbility,
            TelemarkAbility: this.state.telemarkAbility,
            SnowbikeAbility: this.state.snowbikeAbility,
            SnowmobileAbility: this.state.snowmobileAbility,
            SnowshoeAbility: this.state.snowshoeAbility,
            IsDisabled: this.state.hasDisability === "yes",
            DisabilityMembership: this.state.disabilityMembership,
            DisabilityMembershipID: this.state.disabilityMemberid,
            DisabilityDetail: this.state.disabilityDetail,
            IsProfileComplete: true
        };

        await axios.put("http://127.0.0.1:3333/api/user-profile", postData).then(
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
                        provider: this.state.provider,
                        //TODO: to be changed
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
                    //if success, set profile is finished
                    let userFinishProfile;
                    userFinishProfile = {
                        isFinished: 1
                    };
                    sessionStorage.setItem(
                        "userFinishProfile",
                        JSON.stringify(userFinishProfile)
                    );

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
                        cookies.set("user-profileFinished", 1, {
                            expires: date,
                            path: "/"
                        });
                        cookies.set("user-provider", "email", {
                            expires: date,
                            path: "/"
                        });
                        //TODO: to be changed
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
        const {cookies} = this.props;
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

        //if directly type this page's url, and user has finished the profile
        if (sessionStorage.getItem("userFinishProfile")) {
            let userFinishProfile = JSON.parse(
                sessionStorage.getItem("userFinishProfile")
            );
            if (userFinishProfile.isFinished === 1) {
                return <Redirect to={"/profile"}/>;
            }
        }

        return (
            <React.Fragment>
                <div className="container">
                    <br/>
                    {/* title */}
                    <div className="form-row">
                        <div className="form-group col-4">
              <span style={{fontSize: "2rem", whiteSpace: "nowrap"}}>
                My Profile
              </span>
                        </div>
                        <div className="form-group col-8"/>
                    </div>
                    {/* prograss */}
                    <div className="form-row">
                        <div className="form-group col-12">
                            <div className="progress form-row">
                                <div
                                    className="form-group col-12 progress-bar"
                                    id="progress_in_new_profile"
                                    role="progressbar"
                                    style={{width: this.state.progress}}
                                    aria-valuenow={this.state.progress.replace(/%/, "")}
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                />
                                <div
                                    className="form-group col-1"
                                    style={{position: "absolute", left: "50%"}}
                                >
                                    {/* process bar text */}
                                    <span
                                        style={{
                                            position: "relative",
                                            left: "-50%",
                                            color: "red"
                                        }}
                                    >
                    {this.state.progress}
                  </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* page 1 */}
                    {this.state.currentPage === "page_1" ? (
                        <FirstPage
                            onHandleNextPage={this.handleNextPage}
                            onChangeState={this.handleSetState}
                            firstName={this.state.firstName}
                            lastName={this.state.lastName}
                            userPic={this.state.user_pic}
                            file={this.state.file}
                            onHandleProgress={this.handleChangeProgress}
                        />
                    ) : (
                        ""
                    )}
                    {/* page 2 */}
                    {this.state.currentPage === "page_2" ? (
                        <SecondPage
                            onHandleNextPage={this.handleNextPage}
                            onChangeState={this.handleSetState}
                            gender={this.state.gender}
                            dob={this.state.dob}
                            onHandleProgress={this.handleChangeProgress}
                        />
                    ) : (
                        ""
                    )}
                    {/* page 3 */}
                    {this.state.currentPage === "page_3" ? (
                        <ThirdPage
                            onHandleNextPage={this.handleNextPage}
                            onChangeState={this.handleSetState}
                            phoneNumberPre={this.state.phoneNumberPre}
                            phoneNumber={this.state.phoneNumber}
                            country={this.state.country}
                            postcode={this.state.postcode}
                            onHandleProgress={this.handleChangeProgress}
                        />
                    ) : (
                        ""
                    )}
                    {/* page 4 */}
                    {this.state.currentPage === "page_4" ? (
                        <ForthPage
                            onHandleNextPage={this.handleNextPage}
                            onChangeState={this.handleSetState}
                            skiAbility={this.state.skiAbility}
                            snowboardAbility={this.state.snowboardAbility}
                            telemarkAbility={this.state.telemarkAbility}
                            snowbikeAbility={this.state.snowbikeAbility}
                            snowmobileAbility={this.state.snowmobileAbility}
                            snowshoeAbility={this.state.snowshoeAbility}
                            onHandleProgress={this.handleChangeProgress}
                        />
                    ) : (
                        ""
                    )}
                    {/* page 5 */}

                    {this.state.currentPage === "page_5" ? (
                        <FifthPage
                            onHandleNextPage={this.handleNextPage}
                            onChangeState={this.handleSetState}
                            hasDisability={this.state.hasDisability}
                            disabilityMembership={this.state.disabilityMembership}
                            disabilityMemberid={this.state.disabilityMemberid}
                            disabilityDetail={this.state.disabilityDetail}
                            onHandleTriggerSubmit={() => {
                                document
                                    .getElementById("user_profile_signup_form_submit")
                                    .click();
                            }}
                        />
                    ) : (
                        ""
                    )}
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
                <form style={{display: "none"}} onSubmit={this.handleSubmit}>
                    <input value={this.state.user_pic}/>
                    <input value={this.state.firstName}/>
                    <input value={this.state.lastName}/>
                    <input value={this.state.gender}/>

                    <input value={moment(this.state.dob).format("YYYY-MM-DD")}/>
                    <input value={this.state.phoneNumberPre}/>
                    <input value={this.state.phoneNumber}/>
                    <input value={this.state.country}/>

                    <input value={this.state.postcode}/>
                    <input value={this.state.skiAbility}/>
                    <input value={this.state.snowboardAbility}/>
                    <input value={this.state.telemarkAbility}/>

                    <input value={this.state.snowbikeAbility}/>
                    <input value={this.state.snowmobileAbility}/>
                    <input value={this.state.snowshoeAbility}/>
                    <input value={this.state.hasDisability}/>

                    <input value={this.state.disabilityMembership}/>
                    <input value={this.state.disabilityMemberid}/>
                    <input value={this.state.disabilityDetail}/>
                    <button type="submit" id="user_profile_signup_form_submit"/>
                </form>
            </React.Fragment>
        );
    }
}

export default withCookies(NewUserProfilePage);
