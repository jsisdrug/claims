import { CssBaseline } from "@material-ui/core";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import React, { Component } from "react";
import { getAppStatus } from "./axios/service";
import Header from "./components/Header";
import MainView from "./components/MainView";
import ServiceUnavailable from "./components/ServiceUnavailable";
import Splash from "./components/Splash";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#339933",
    },
  },
});

class App extends Component {
  state = {
    isAppReady: false,
    isOutOfService: false,
  };

  async componentDidMount() {
    try {
      await getAppStatus();
      this.setState({ isAppReady: true });
    } catch (err) {
      console.error(err);
      this.setState({ isOutOfService: true });
    }
  }

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {this.state.isAppReady ? (
          <React.Fragment>
            <Header
              isLeftPanelOpen={this.state.isLeftPanelOpen}
              openLeftPanel={this.openLeftPanel}
            />
            <MainView />
          </React.Fragment>
        ) : this.state.isOutOfService ? (
          <ServiceUnavailable />
        ) : (
          <Splash />
        )}
      </MuiThemeProvider>
    );
  }
}

export default App;
