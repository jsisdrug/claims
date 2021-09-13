import {
  Button,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import React from "react";
import * as constant from "../constant";

export const AIBased = (props) => {
  const { classes, claims, onAction } = props;
  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} size="small">
        <TableHead>
          <TableRow>
            <TableCell>{constant.TEXT.uniqueId}</TableCell>
            <TableCell>{constant.TEXT.vin}</TableCell>
            <TableCell>{constant.TEXT.mileage}</TableCell>
            <TableCell>{constant.TEXT.cost}</TableCell>
            <TableCell>{constant.TEXT.status}</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {claims.map((claim) => (
            <TableRow key={claim.id}>
              <TableCell>{claim.id}</TableCell>
              <TableCell>{claim.VIN}</TableCell>
              <TableCell>{claim.Mileage}</TableCell>
              <TableCell>
                {claim.isLoading ? (
                  <CircularProgress disableShrink />
                ) : (
                  claim.MaterialCost
                )}
              </TableCell>
              <TableCell>
                {claim.status !== undefined
                  ? constant.StatusMap.get(claim.status.toString())
                  : ""}
              </TableCell>
              <TableCell>
                {!claim.isLoading && (
                  <Button
                    variant={
                      claim.status === 0 || claim.status === 1
                        ? "outlined"
                        : "contained"
                    }
                    color="primary"
                    onClick={() => onAction(claim)}
                  >
                    {claim.status === 0 || claim.status === 1
                      ? constant.TEXT.modify
                      : constant.TEXT.action}
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
