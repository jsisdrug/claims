import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { groupBy } from "lodash";
import React from "react";
import * as constant from "../constant";

export const RuleBased = (props) => {
  const { classes, claims } = props;
  const claimsByCode = groupBy(claims, "RuleCode");
  return Object.keys(claimsByCode).map((code, index) => {
    return (
      <Accordion key={index}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          id={"panel-header" + index}
        >
          <Typography className={classes.heading}>
            {constant.CodeMap.get(code)}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            {claimsByCode[code].map((claims, index2) => {
              return (
                <ListItem key={index2}>
                  <ListItemText primary={claims.id} />
                </ListItem>
              );
            })}
          </List>
        </AccordionDetails>
      </Accordion>
    );
  });
};
