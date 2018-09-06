import React, { Component } from "react";
import axios from "axios";
import "../css/Homepage/ContactPage.css";
import FeedBackBtn from "../components/template/FeedBackBtn";
import AlertWindow from "../components/template/AlertWindow";

class ContactPage extends Component {
  constructor() {
    super();
    this.state = {
      name: null,
      telephone: null,
      email: null,
      message: null,
      invest: null,
      work: null,
      successSend: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleRadioChange = this.handleRadioChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleRadioChange(e) {
    if (e.target.checked) {
      this.setState({
        [e.target.name]: e.target.value
      });
    }
  }

  async handleSubmit(e) {
    e.preventDefault();
    const { name, telephone, email, message, invest, work } = this.state;

    await axios({
      method: "post",
      url: "http://127.0.0.1:3333/api/contact-form",
      data: {
        name,
        telephone,
        email,
        message,
        invest,
        work
      }
    });

    this.setState({ successSend: true });
  }

  // back to top when load
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    return (
      <React.Fragment>
        <div
          className="container"
          style={{
            marginTop: "50px",
            marginBottom: "50px",
            width: "800px"
          }}
        >
          <h1 style={{ textAlign: "center" }}>Contact Us</h1>
          <br />
          <form onSubmit={this.handleSubmit} data-toggle="validator">
            <div className="row">
              <div className="col">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="exampleFormControlInput2"
                    name="name"
                    placeholder="Name"
                    onChange={this.handleChange}
                    required
                  />
                </div>
              </div>
              <div className="col">
                <div className="form-group ">
                  <label>Telephone</label>
                  <input
                    type="text"
                    className="form-control"
                    id="exampleFormControlInput3"
                    required
                    name="telephone"
                    placeholder="Telephone number"
                    onChange={this.handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                id="exampleFormControlInput1"
                required
                name="email"
                placeholder="Email address"
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea
                className="form-control"
                id="exampleFormControlTextarea1"
                rows="3"
                name="message"
                placeholder="Message"
                onChange={this.handleChange}
                required
              />
            </div>
            {/* radio button */}

            <div className="form-group">
              <div
                className="row"
                style={{ marginRight: "300px", marginLeft: "50px" }}
              >
                <label className="col-sm" style={{ whiteSpace: "nowrap" }}>
                  Interested in investing with us?
                </label>
                <div className="custom-control custom-radio col-sm">
                  <input
                    className="custom-control-input"
                    type="radio"
                    name="invest"
                    id="inlineRadio1"
                    value="Yes"
                    onChange={this.handleRadioChange}
                    required
                  />
                  <label
                    className="custom-control-label"
                    htmlFor="inlineRadio1"
                  >
                    Yes
                  </label>
                </div>

                <div className="custom-control custom-radio col-sm">
                  <input
                    className="custom-control-input"
                    type="radio"
                    name="invest"
                    id="inlineRadio2"
                    value="No"
                    onChange={this.handleRadioChange}
                    required
                  />
                  <label
                    className="custom-control-label"
                    htmlFor="inlineRadio2"
                  >
                    No
                  </label>
                </div>
              </div>
            </div>

            {/* second choose */}
            <div className="form-group">
              <div
                className="row"
                style={{ marginRight: "300px", marginLeft: "50px" }}
              >
                <label style={{ whiteSpace: "nowrap" }} className="col-sm">
                  Interested in working with us?
                </label>
                <div className="custom-control custom-radio col-sm">
                  <input
                    className="custom-control-input"
                    type="radio"
                    name="work"
                    id="inlineRadio3"
                    value="Yes"
                    onChange={this.handleRadioChange}
                    required
                  />
                  <label
                    className="custom-control-label"
                    htmlFor="inlineRadio3"
                  >
                    Yes
                  </label>
                </div>

                <div className="custom-control custom-radio col-sm">
                  <input
                    className="custom-control-input"
                    type="radio"
                    name="work"
                    id="inlineRadio4"
                    value="No"
                    onChange={this.handleRadioChange}
                    required
                  />
                  <label
                    className="custom-control-label"
                    htmlFor="inlineRadio4"
                  >
                    No
                  </label>
                </div>
              </div>
            </div>

            {/* send button */}
            <div className="row">
              <div className="col-sm-2" />
              <div className="col-sm-8">
                <button
                  type="submit"
                  className="button"
                  style={{ width: "100%" }}
                  onClick={() => {
                    window.scrollTo(0, 0);
                  }}
                >
                  <span>Send</span>
                </button>
              </div>
              <div className="col-sm-2" />
            </div>
          </form>
          <br />
        </div>
        {/* success */}
        {this.state.successSend ? (
          <AlertWindow
            displayText={
              <div>
                <h4>Thank you for you Message</h4>
                <br />
                <h4>We will contact you soon</h4>
              </div>
            }
            btnNum="1"
            mode="linkMode"
            linkTo="/"
            btnText="Back To Home"
            onHandleClose={() => {
              this.setState({ successSend: false });
            }}
          />
        ) : (
          ""
        )}
        <FeedBackBtn />
      </React.Fragment>
    );
  }
}

export default ContactPage;
