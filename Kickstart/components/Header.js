import React from "react";
import { Menu } from "semantic-ui-react";
// "Link" is a React component which allows us to create anchor tag inside other React components
import { Link } from "../routes";

export default (props) => {
  return (
    <Menu style={{ marginTop : '10px' }}>
        <Link route="/">
          <a className="item">Kickstarter</a>
        </Link>

        <Menu.Menu position="right">
          <Link route="/">
            <a className="item">Campaigns</a>
          </Link>
          <Link route="/campaigns/new">
            <a className="item">+</a>
          </Link>
        </Menu.Menu>
      </Menu>
  );
}