import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  TextField,
} from "@material-ui/core";
import React from "react";
import * as constant from "../constant";

export const SendFileForm = (props) => {
  const { onChange, onSubmit, filePath } = props;
  return (
    <Box my="auto" mx="auto">
      <Card variant="outlined">
        <CardContent>
          <form noValidate autoComplete="off">
            <TextField
              id="standard-basic"
              label={constant.TEXT.inputForm.title}
              onChange={onChange}
            />
          </form>
        </CardContent>
        <CardActions>
          <Button variant="contained" color="primary" onClick={onSubmit} disabled={!filePath}>
            {constant.TEXT.inputForm.button}
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
};
