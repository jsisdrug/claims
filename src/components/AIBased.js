import {
  Button,
  ButtonGroup,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
} from "@material-ui/core";
import { ArrowDownward, ArrowUpward } from "@material-ui/icons";
import CloseIcon from "@material-ui/icons/Close";
import DoneIcon from "@material-ui/icons/Done";
import React from "react";
import * as constant from "../constant";

export const AIBased = (props) => {
  const {
    classes,
    claims,
    onStatusChange,
    onAddComment,
    columns,
    onToggleSort,
  } = props;
  const fitleredColumns = columns.filter((col) => col.show);

  function getCell(col, claim) {
    switch (col.name) {
      case "comment":
        return (
          <TableCell style={{ minWidth: col.width }} key={col.name}>
            <TextField
              id={`filled-textarea-${col.name}`}
              label={constant.TEXT.comment}
              placeholder={constant.TEXT.commentPlaceholder}
              multiline
              variant="filled"
              style={{
                width: "100%",
              }}
              value={claim.comment}
              onChange={(e) => onAddComment(e, claim)}
            />
          </TableCell>
        );
      case "action":
        return (
          <TableCell style={{ minWidth: col.width }} key={col.name}>
            <ButtonGroup disableElevation>
              <Button
                color="secondary"
                variant={claim.status === 1 ? "contained" : "outlined"}
                onClick={() => onStatusChange(claim, 1)}
              >
                <Tooltip title="Dispute">
                  <CloseIcon />
                </Tooltip>
              </Button>
              <Button
                variant={claim.status === "Nil" ? "contained" : "outlined"}
                onClick={() => onStatusChange(claim, "Nil")}
              >
                Nil
              </Button>
              <Button
                color="primary"
                variant={claim.status === 0 ? "contained" : "outlined"}
                onClick={() => onStatusChange(claim, 0)}
              >
                <Tooltip title="Accept">
                  <DoneIcon />
                </Tooltip>
              </Button>
            </ButtonGroup>
          </TableCell>
        );
      case "AISuggestion":
        return (
          <TableCell style={{ minWidth: col.width }} key={col.name}>
            {constant.StatusMap.get(claim["AI-Suggestion"])}
          </TableCell>
        );
      default:
        return (
          <TableCell style={{ minWidth: col.width }} key={col.name}>
            {claim[constant.FieldNameMap.get(col.name)]}
          </TableCell>
        );
    }
  }

  function getTh(col) {
    if (col.sort) {
      return (
        <TableCell
          style={{ minWidth: col.width, cursor: "pointer" }}
          key={col.name}
          onClick={() => onToggleSort(col)}
        >
          {constant.TEXT[col.name]}
          {col.sort !== true &&
            (col.sort === "asc" ? (
              <ArrowUpward fontSize="small" />
            ) : (
              <ArrowDownward fontSize="small" />
            ))}
        </TableCell>
      );
    } else {
      return (
        <TableCell style={{ minWidth: col.width }} key={col.name}>
          {constant.TEXT[col.name]}
        </TableCell>
      );
    }
  }

  return (
    <TableContainer component={Paper} className={classes.restrictedHeight}>
      <Table className={classes.table} size="small">
        <TableHead>
          <TableRow>{fitleredColumns.map((col) => getTh(col))}</TableRow>
        </TableHead>
        <TableBody>
          {claims.map((claim) => (
            <TableRow key={claim.id}>
              {fitleredColumns.map((col) => getCell(col, claim))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
