import React from "react";
import { Menu } from "semantic-ui-react";

export default (props) => {
  return (
    <Menu style={{ marginTop : '10px' }}>
        <Menu.Item name="kickstarter">
          Kickstarter
        </Menu.Item>

        <Menu.Menu position="right">
          <Menu.Item name="campaigns">
            Campaigns
          </Menu.Item>
          <Menu.Item name="plus">
            +
          </Menu.Item>
        </Menu.Menu>
      </Menu>
  );
}