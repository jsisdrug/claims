import { AppBar, IconButton, Toolbar, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import MenuIcon from "@material-ui/icons/Menu";
import clsx from "clsx";
import React, { Component } from "react";
import * as constant from "../constant";

const isMobile = window.innerWidth <= 480;

const styles = (theme) => ({
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: "100%",
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  hide: {
    display: "none",
  },
});

class Header extends Component {
  render() {
    const { classes } = this.props;
    return (
      <AppBar
        position="static"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: this.props.isLeftPanelOpen,
        })}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              edge="start"
              className={clsx(
                classes.menuButton,
                this.props.isLeftPanelOpen && classes.hide
              )}
              color="inherit"
              aria-label="menu"
              onClick={this.props.openLeftPanel}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h4" className={classes.title}>
            {constant.TEXT.brandName}
          </Typography>
        </Toolbar>
      </AppBar>
    );
  }
}

export default withStyles(styles)(Header);
