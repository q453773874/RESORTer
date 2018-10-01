import React, { Component } from "react";
import EquipmentPageTip from "../../components/BookTripPage/EquipmentPageTip";
import ActivityCard from "../../components/BookTripPage/ActivityEquipmentCard";
import NumberSelector from "../../components/template/NumberSelector";
import styled from "styled-components";

const StyledSelect = styled.select`
  width: 80%;
  border: solid 1px rgba(198, 226, 247, 1);
`;
class EquipmentMemberCard extends Component {
  state = {
    shoeSize: "",
    height: "",
    weight: "",
    isShowTip: this.props.isShowTip,
    hasActivity: true,
    currentActivity: [
      {
        id: 1,
        ActivityName: "hit sb jiacheng",
        EquipmentOne: "Boots",
        EquipmentTwo: "Skis & Poles",
        Grade: "standard"
      },
      {
        id: 2,
        ActivityName: "Snowboard",
        EquipmentOne: "Boots",
        EquipmentTwo: "Board",
        Grade: "standard"
      }
    ]
  };

  handleChange = (name, value) => {
    this.setState({
      [name]: value
    });
  };

  handleClose = () => {
    this.setState({ isShowTip: false });
  };
  render() {
    const {
      isShowTip,
      hasActivity,
      currentActivity,
      shoeSize,
      height,
      weight
    } = this.state;
    return (
      <React.Fragment>
        <div>
          {/* 1 */}
          <div
            className="row"
            style={{ marginBottom: "10px", marginTop: "20px" }}
          >
            <div className="col-lg-1" />
            <div className="col-12 col-lg-4" style={{ whiteSpace: "nowrap" }}>
              Rental for &nbsp;
              <span style={{ color: "#FF4040" }}>{this.props.memberName}</span>
            </div>
            <div className="col-12 col-lg-2" style={{ whiteSpace: "nowrap" }}>
              Age &nbsp;
              <span style={{ color: "#3D9BE9" }}>{this.props.memberAge}</span>
            </div>

            <div className="col-12 col-lg-4">
              {isShowTip ? (
                <EquipmentPageTip onHandleClose={this.handleClose} />
              ) : (
                ""
              )}
            </div>
            <div className="col-12 col-lg-1" />
          </div>
          {/* 2 */}
          <div
            className="row"
            style={{
              fontWeight: "bold",
              marginBottom: "10px",
              marginTop: "20px",
              whiteSpace: "nowrap"
            }}
          >
            <div className="col-lg-1" />
            <div className="col-md-12 col-lg-10">
              <table className="table table-borderless">
                <thead>
                  <tr style={{ color: "#686369" }}>
                    <th scope="col-2">Activity</th>
                    <th scope="col-4">Equipment</th>
                    <th scope="col-2" />
                    <th scope="col-4">Grade</th>
                  </tr>
                </thead>
                {hasActivity
                  ? currentActivity.map(activity => (
                      <ActivityCard
                        key={activity.id}
                        ActivityName={activity.ActivityName}
                        EquipmentOne={activity.EquipmentOne}
                        EquipmentTwo={activity.EquipmentTwo}
                        Grade={activity.Grade}
                      />
                    ))
                  : null}
              </table>
            </div>
            <div className="col-lg-1" />
          </div>
          {/* 3 */}
          <div
            className="row"
            style={{
              fontWeight: "bold",
              whiteSpace: "nowrap"
            }}
          >
            <div className="col-lg-1" />
            <div className="col-md-12 col-lg-10">
              <table
                className="table table-borderless"
                style={{ color: "#686369" }}
              >
                <thead>
                  <tr>
                    <th scope="col-3" />
                    <th scope="col-3" />
                    <th scope="col-2" />
                    <th scope="col-1" />
                    <th scope="col-3" />
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Outfit (jacket, pants):*</td>
                    <td>
                      <StyledSelect id="outfit">
                        <option value="none">None</option>
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                      </StyledSelect>
                    </td>
                    <td />
                    <td>
                      Helmet:
                      <p>3132</p>
                    </td>
                    <td>
                      <StyledSelect id="helmet">
                        <option value="none">None</option>
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                      </StyledSelect>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="col-lg-1" />
          </div>

          {/* 4 */}
          <div
            className="row"
            style={{
              fontWeight: "bold",
              whiteSpace: "nowrap"
            }}
          >
            <div className="col-lg-1" />
            <div className="col-md-12 col-lg-10">
              <table
                className="table table-borderless"
                style={{ color: "#686369" }}
              >
                <thead>
                  <tr>
                    <th scope="col-4" />
                    <th scope="col-4" />
                    <th scope="col-4" />
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {/* 1 */}
                    <td>
                      <NumberSelector
                        labelName="Shoe size**:"
                        referName="shoeSize"
                        cur_value={shoeSize}
                        onChange={this.handleChange}
                        unit="(AU)"
                      />
                    </td>
                    {/* 2 */}
                    <td>
                      <NumberSelector
                        labelName="Height**:"
                        referName="height"
                        cur_value={height}
                        onChange={this.handleChange}
                        unit="(cm)"
                      />
                    </td>
                    {/* 3 */}
                    <td>
                      <NumberSelector
                        labelName="Weight**:"
                        referName="weight"
                        cur_value={weight}
                        onChange={this.handleChange}
                        unit="(kg)"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="col-lg-1" />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default EquipmentMemberCard;
