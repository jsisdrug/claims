import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Menu,
  MenuItem,
  Tab,
  Tabs,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import DoneIcon from "@material-ui/icons/Done";
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
  restrictedHeight: {
    height: `calc(100vh - 165px)`,
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
    selectedTab: constant.defaultTab,
    ruleBasedClaims: [],
    aiBasedClaims: [],
    filePath: "",
    anchorEl: null,
    columns: constant.columns,
  };

  componentDidMount() {}

  loadAIBasedClaims = () => {
    const ids = this.state.aiBasedClaims.map((claim) => claim.id);
    getCaseInfo(ids).then((response) => {
      this.setState({
        aiBasedClaims: response.data.map((cl) => ({ ...cl, status: "Nil" })),
      });
    });
  };
  _loadAIBasedClaims = () => {
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

  _makeParallelCalls = (claims) => {
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

  saveAll = () => {
    const payload = this.state.aiBasedClaims.map((claim) => {
      return {
        id: claim.id,
        expertComment: claim.comment ? claim.comment : "No comments added",
        finalStatus: claim.status,
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

  onToggleColumn = (col, e) => {
    e.stopPropagation();
    this.setState({
      columns: this.state.columns.map((cl) => {
        return cl.name === col.name ? { ...cl, show: !cl.show } : cl;
      }),
    });
  };

  onToggleSort = (col) => {
    const sortField = constant.FieldNameMap.get(col.name);
    const sort =
      col.sort === true ? "asc" : col.sort === "asc" ? "desc" : "asc";
    this.setState({
      columns: this.state.columns.map((cl) => {
        return cl.name === col.name
          ? { ...cl, sort }
          : { ...cl, sort: cl.sort !== false ? true : false };
      }),
      aiBasedClaims: [
        ...this.state.aiBasedClaims.sort((a, b) => {
          return sort === "asc"
            ? a[sortField] - b[sortField]
            : b[sortField] - a[sortField];
        }),
      ],
    });
  };

  render() {
    const { classes } = this.props;
    const { aiBasedClaims, ruleBasedClaims, isLoading, selectedTab } =
      this.state;
    const mainClass = clsx(classes.content);
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
          <Box width="100%" maxWidth="100%">
            <Box component="section" marginBottom="20px">
              <Grid justify="space-between" container>
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
                      aria-controls="simple-menu"
                      aria-haspopup="true"
                      onClick={(e) =>
                        this.setState({ anchorEl: e.currentTarget })
                      }
                      style={{ marginRight: "10px" }}
                    >
                      {constant.TEXT.toggleColumns}
                    </Button>
                    <Menu
                      id="simple-menu"
                      anchorEl={this.state.anchorEl}
                      keepMounted
                      open={Boolean(this.state.anchorEl)}
                      onClick={(e) => this.setState({ anchorEl: null })}
                    >
                      {this.state.columns.map((col) => {
                        return (
                          <MenuItem
                            key={col.name}
                            style={{ justifyContent: "space-between" }}
                            onClick={(e) => this.onToggleColumn(col, e)}
                            divider
                          >
                            {constant.TEXT[col.name]}
                            {col.show && <DoneIcon />}
                          </MenuItem>
                        );
                      })}
                    </Menu>
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
                  columns={this.state.columns}
                  claims={claims}
                  classes={classes}
                  onAddComment={this.onAddComment}
                  onStatusChange={this.onUpdateStatus}
                  onToggleSort={this.onToggleSort}
                />
              )}
            </Box>
          </Box>
        )}
      </main>
    );
  }
}

export default withStyles(styles)(MainView);
