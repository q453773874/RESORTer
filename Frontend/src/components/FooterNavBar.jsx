import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/Footer.css";
import { Link } from "react-router-dom";

export default class Footer extends React.Component {
  render() {
    return (
      <React.Fragment>
        <hr />
        <footer className="page-footer font-small">
          <div className="container text-md-center py-3">
            <div className="row no-gutters">
              <div className="col-md-6 mt-md-0 mt-3">
                <Link className="terms" to={`/term-privacy/term-of-use`}>
                  Terms of Use
                </Link>
              </div>

              <hr className="clearfix w-100 d-md-none pb-3" />

              <div className="col-md-6 mt-md-0 mt-3">
                <Link
                  className="privacy"
                  to={`/term-privacy/privacy-statement`}
                >
                  Privacy Statement
                </Link>
              </div>
              <hr />
            </div>

            <hr />
            <div className="footer-copyright">
              <div className="row">
                <div className="col-md-3 mx-auto">Melbourne, Australia</div>
                <div className="col-md-4 mx-auto">
                  <a href="mailto:info@resorter.app">info@resorter.app</a>
                </div>
                <div className="col-md-5 mx-auto">
                  Copyright 2017 - RESORTer - All Rights Reserved
                </div>
              </div>
            </div>
          </div>
        </footer>
      </React.Fragment>
    );
  }
}
