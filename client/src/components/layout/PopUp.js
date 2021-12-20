import React from "react";

import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';

import styles from "../layout/classes";

const useStyles = makeStyles(styles);

const PopUp = props => {

  const classes = useStyles();
  
  return (
    <Box className={classes.popupBox}>
      <Box className={classes.box}>
        <span className={classes.closeIcon} onClick={props.handleClose}>x</span>
        {props.content}
      </Box>
    </Box>
  );
};
 
export default PopUp;