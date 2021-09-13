import { Box, LinearProgress, Typography } from "@material-ui/core";
import React from "react";
import * as constant from "../constant";

function Splash() {
  return (
    <Box
      display="flex"
      width="100%"
      height="100vh"
      justifyContent="center"
      alignItems="center"
    >
      <Box>
        <Box mb={1} textAlign="center">
          <Typography variant="h3">{constant.TEXT.splash}</Typography>
        </Box>
        <LinearProgress />
      </Box>
    </Box>
  );
}

export default Splash;
