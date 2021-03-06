import React, { Component } from "react";
import SmallEllipseBtn from "../../components/template/SmallEllipseBtn";
import { Link } from "react-router-dom";


class BookHistoryCard extends Component {
  state = {};

  render() {
    return (
      <React.Fragment>
        <tbody
          style={{
            border: "1px solid rgb(232, 234, 237)",
            height: "auto",
            boxShadow: "2px 3px rgb(232, 234, 237)"
          }}
        >
          <tr>
            <td>{this.props.submitDate}</td>
            <td>{this.props.resort}</td>
            <td>{this.props.startDate}</td>
            <td>{this.props.endDate}</td>
            <td>{this.props.status}</td>
            {/* <td>{this.props.id}</td> */}
            <td>
              {/* <SmallEllipseBtn text="View" btnColor="rgba(255, 97, 97, 1)" /> */}
            </td>
            <td className ="d-flex justify-content-end">
            <Link
              to={this.props.linkTo}
            >
              <SmallEllipseBtn 
                 text={this.props.buttonText} 
                 btnColor="rgba(255, 97, 97, 1)" 
                 width="80px"
                 paddingLeft="10px"
                 paddingRight= "10px"                 
              />
            </Link>
            </td>
          </tr>
        </tbody>
      </React.Fragment>
    );
  }
}

export default BookHistoryCard;
