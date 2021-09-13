import { Box, Typography } from "@material-ui/core";
import ErrorTwoToneIcon from "@material-ui/icons/ErrorTwoTone";
import React from "react";
import * as constant from "../constant";

function ServiceUnavailable() {
  return (
    <Box
      display="flex"
      width="100%"
      height="100vh"
      justifyContent="center"
      alignItems="center"
    >
      <Box textAlign="center" fontWeight="fontWeightBold">
        <ErrorTwoToneIcon fontSize="large" color="error" />
        <Typography variant="h6">{constant.TEXT.error.serviceDown}</Typography>
        <Typography variant="subtitle1">
          {constant.TEXT.error.tryAgain}
        </Typography>
      </Box>
    </Box>
  );
}

export default ServiceUnavailable;
