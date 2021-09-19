import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Drawer,
  Grid,
  List,
  ListItem,
  ListItemText,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import React, { Component } from "react";
import {
  getCaseInfo,
  getRuleBasedCases,
  patchCaseInfo,
  sendFilePath,
} from "../axios/service";
import * as constant from "../constant";
import { afterAll, getChunks } from "../util";
import { AIBased } from "./AIBased";
import { RuleBased } from "./RuleBased";
import { SendFileForm } from "./SendFileForm";

const styles = (theme) => ({
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: 0,
    height: `calc(100vh - 64px)`,
    display: "flex",
    overflow: "auto",
  },
  contentShiftRight: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: constant.STYLE.drawerWidth,
  },
  button: {
    margin: "20px 10px",
  },
  rightPanel: {
    width: constant.STYLE.drawerWidth,
    flexShrink: 0,
    paddingTop: "10px",
  },
  "@keyframes blinker": {
    from: { opacity: 1 },
    to: { opacity: 0 },
  },
  highlight: {
    animationName: "$blinker",
    animationDuration: "1s",
    animationTimingFunction: "linear",
    animationIterationCount: "infinite",
  },
});

class MainView extends Component {
  state = {
    isLoading: false,
    selectedTab: "rule",
    showRightPanel: false,
    ruleBasedClaims: [],
    aiBasedClaims: [],
    selectedCase: null,
    caseList: [
      // {
      //   id: "48d18a8c3709fdfc4dc5f5603fcbef006c791274",
      //   VIN: "2FMPK4J93HBC66809",
      //   Mileage: "10359",
      //   MaterialCost: "0.0",
      //   WarrantyStartDate: "1970-01-01",
      //   RepairDate: "1970-01-01",
      //   CountryRepaired: "USA",
      //   RuleCode: "4.0",
      //   TechnicianComment:
      //     "TEST DROVE VEHICLE USED ELECTRONIC CHASSIS EARS TO DIAGNOSE CLUNK NOISE FROM REAR OF VEHICLE ALSO TEST DROVE VEHICEL WITH CUSTOMER AND SHOP FOREMAN UNABLE TO VERIFY CUSTOMERS CONCERN AT THIS TIME",
      //   "AI-Suggestion": "0",
      //   "AI-DisputeComment": "Testing Feedback comment",
      // },
    ],
  };

  componentDidMount() {
    // this.onSubmit();
  }

  loadAIBasedClaims = () => {
    const chunks = getChunks(
      [...this.state.aiBasedClaims],
      constant.DATA.concurrencyLimit
    );
    const chunkPromises = [];
    setTimeout(async () => {
      for (const chunk of chunks) {
        const promise = new Promise(async (resolve) => {
          await this.makeParallelCalls(chunk);
          resolve();
        });
        chunkPromises.push(promise);
        await promise;
      }
      await afterAll(chunkPromises);
    });
  };

  makeParallelCalls = (claims) => {
    let promises = [];
    promises = claims.map((claim) => {
      return getCaseInfo(claim.id).then((response) => {
        this.setState({
          aiBasedClaims: this.state.aiBasedClaims.map((cl) =>
            cl.id === claim.id
              ? { ...claim, ...response.data, isLoading: false }
              : cl
          ),
        });
        return response;
      });
    });
    return afterAll(promises);
  };

  onSubmit = () => {
    this.setState({ isLoading: true }, async () => {
      const uniqueIds = (await sendFilePath(this.state.filePath)).data
        .ClaimKeys;
      const ruleBasedClaims = (await getRuleBasedCases()).data.data;
      const aiBasedClaims = uniqueIds
        .filter((id) => !ruleBasedClaims.some((claim) => claim.id === id))
        .map((id) => ({ id, isLoading: true }));
      this.setState(
        { ruleBasedClaims, aiBasedClaims, isLoading: false },
        () => {
          this.loadAIBasedClaims();
        }
      );
    });
  };

  handleFileUrlChange = (e) => this.setState({ filePath: e.target.value });

  handleTabChange = (e, selectedTab) => {
    this.setState({ selectedTab });
  };

  onAddComment = (e, claim) => {
    claim.comment = e.target.value;
    this.setState({
      aiBasedClaims: this.state.aiBasedClaims.map((cl) =>
        cl.id === claim.id ? claim : cl
      ),
    });
  };

  onUpdateStatus = (claim, status) => {
    claim.status = status;
    claim.isModified = true;
    this.setState({
      aiBasedClaims: this.state.aiBasedClaims.map((cl) =>
        cl.id === claim.id ? claim : cl
      ),
    });
  };

  onTakeAction = (claim) => {
    this.setState({
      selectedCase: claim,
      showRightPanel: true,
    });
  };

  closeRightPanel = () => {
    this.setState({ showRightPanel: false });
  };

  saveAll = () => {
    const payload = this.state.aiBasedClaims.map((claim) => {
      return {
        id: claim.id,
        expertComment: claim.comment ? claim.comment : "No comments added",
        finalStatus: claim.status === 0 || claim.status === 1 ? claim.status : "Nil",
      };
    });
    console.log(payload);
    this.setState({ isLoading: true }, async () => {
      await patchCaseInfo(payload);
      this.setState({
        isLoading: false,
        aiBasedClaims: this.state.aiBasedClaims.map((claim) => {
          return claim.isModified ? { ...claim, isModified: false } : claim;
        }),
      });
    });
  };

  render() {
    const { classes } = this.props;
    const {
      aiBasedClaims,
      ruleBasedClaims,
      selectedCase,
      isLoading,
      selectedTab,
    } = this.state;
    const mainClass = clsx(classes.content, {
      [classes.contentShiftRight]: this.state.showRightPanel,
    });
    const hasClaims = aiBasedClaims.length > 0 || ruleBasedClaims.length > 0;
    const claims = selectedTab === "rule" ? ruleBasedClaims : aiBasedClaims;
    return (
      <main className={mainClass}>
        {isLoading ? (
          <Box my="auto" mx="auto">
            <CircularProgress />
          </Box>
        ) : !hasClaims ? (
          <SendFileForm
            filePath={this.state.filePath}
            onChange={this.handleFileUrlChange}
            onSubmit={this.onSubmit}
          />
        ) : (
          <Box>
            <Box component="section" marginBottom="20px">
              <Grid justify="space-between" width="100%" container>
                <Grid item>
                  <Tabs
                    value={selectedTab}
                    indicatorColor="primary"
                    textColor="primary"
                    onChange={this.handleTabChange}
                  >
                    <Tab label={constant.TEXT.tab1} value="rule" />
                    <Tab label={constant.TEXT.tab2} value="ai" />
                  </Tabs>
                </Grid>
                {selectedTab === "ai" && (
                  <Grid item>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={this.saveAll}
                      diplay="inline"
                    >
                      {constant.TEXT.saveAll}
                    </Button>
                  </Grid>
                )}
              </Grid>
            </Box>
            <Box component="section">
              {selectedTab === "rule" ? (
                <RuleBased claims={claims} classes={classes} />
              ) : (
                <AIBased
                  claims={claims}
                  classes={classes}
                  onAction={this.onTakeAction}
                />
              )}
            </Box>
          </Box>
        )}

        {this.state.showRightPanel && (
          <Drawer
            anchor="right"
            open={!!this.state.showRightPanel}
            onClose={this.closeRightPanel}
            transitionDuration={{ enter: 300, exit: 300 }}
            classes={{
              paper: clsx(classes.rightPanel),
            }}
          >
            <Box p={1}>
              <Typography variant="h5">{constant.TEXT.panelTitle}</Typography>
              <Divider />

              <List>
                <ListItem>
                  <ListItemText
                    primary={constant.TEXT.uniqueId}
                    secondary={selectedCase.id}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary={constant.TEXT.vin}
                    secondary={selectedCase.VIN}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary={constant.TEXT.mileage}
                    secondary={selectedCase.Mileage}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary={constant.TEXT.cost}
                    secondary={selectedCase.MaterialCost}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary={constant.TEXT.startDate}
                    secondary={selectedCase.WarrantyStartDate}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary={constant.TEXT.repairDate}
                    secondary={selectedCase.RepairDate}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary={constant.TEXT.countryRepaired}
                    secondary={selectedCase.CountryRepaired}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary={constant.TEXT.technicianComment}
                    secondary={selectedCase.TechnicianComment}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary={constant.TEXT.AISuggestion}
                    secondary={constant.StatusMap.get(
                      selectedCase["AI-Suggestion"]
                    )}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary={constant.TEXT.AIDisputeComment}
                    secondary={selectedCase["AI-DisputeComment"]}
                  />
                </ListItem>
              </List>

              <Divider />

              <TextField
                id="filled-textarea"
                label={constant.TEXT.comment}
                placeholder={constant.TEXT.commentPlaceholder}
                multiline
                variant="filled"
                style={{
                  marginTop: "20px",
                  width: "100%",
                }}
                value={selectedCase.comment}
                onChange={(e) => this.onAddComment(e, selectedCase)}
              />

              <Box textAlign="center" style={{ marginBottom: "60px" }}>
                <Button
                  variant={selectedCase.status !== 1 ? "outlined" : "contained"}
                  color="secondary"
                  onClick={() => this.onUpdateStatus(selectedCase, 1)}
                  className={classes.button}
                >
                  {selectedCase.status === 1
                    ? constant.TEXT.panelBtn4
                    : constant.TEXT.panelBtn2}
                </Button>
                <Button
                  variant={selectedCase.status !== 0 ? "outlined" : "contained"}
                  color="primary"
                  onClick={() => this.onUpdateStatus(selectedCase, 0)}
                  className={classes.button}
                >
                  {selectedCase.status === 0
                    ? constant.TEXT.panelBtn3
                    : constant.TEXT.panelBtn1}
                </Button>
              </Box>
            </Box>
          </Drawer>
        )}
      </main>
    );
  }
}

export default withStyles(styles)(MainView);
