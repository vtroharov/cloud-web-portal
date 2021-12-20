import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import { getVMsTenant } from '../../actions/vms';
import PopUp from '../layout/PopUp';
import DashboardGraph1 from './DashboardGraph1';
import DashboardGraph2 from './DashboardGraph2';
import DashboardGraph3 from './DashboardGraph3';
import DashboardGraph4 from './DashboardGraph4';

import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import styles from "../layout/classes";

const useStyles = makeStyles(styles);

const DashboardAdmin = ({ auth: { isAuthenticated, user, loading }, getVMsTenant, vms: { vms } }) => {
  useEffect(() => {
    getVMsTenant();
  }, [getVMsTenant]);

  const classes = useStyles();
  const [isOpen1, setIsOpen1] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [isOpen3, setIsOpen3] = useState(false);
  const [isOpen4, setIsOpen4] = useState(false);

  const togglePopup1 = () => {
    setIsOpen1(!isOpen1);
  }
  const togglePopup2 = () => {
    setIsOpen2(!isOpen2);
  }
  const togglePopup3 = () => {
    setIsOpen3(!isOpen3);
  }
  const togglePopup4 = () => {
    setIsOpen4(!isOpen4);
  }

  if(!isAuthenticated) {
    return <Redirect to="/" />;
  }

  return (loading && user.permissions === null ? <Spinner /> : 
    <Paper component='div' className={classes.paperFull}>
      {isOpen1 && <PopUp 
        content={<>
          <h1>CPU Allocated</h1>
          <DashboardGraph1 cat={"tenant"} showLabel={""} display={false} valueX={"100%"} valueY={(vms.length * 50).toString() + "px"} />
          </>}
        handleClose={togglePopup1}
      />}
      {isOpen2 && <PopUp 
        content={<>
          <h1>RAM Allocated (GB)</h1>
          <DashboardGraph2 cat={"tenant"} showLabel={""} display={false} valueX={"100%"} valueY={(vms.length * 50).toString() + "px"} />
          </>}
        handleClose={togglePopup2}
      />}
      {isOpen3 && <PopUp 
        content={<>
          <h1>Uptime (hours)</h1>
          <DashboardGraph3 cat={"tenant"} showLabel={""} display={false} valueX={"100%"} valueY={(vms.length * 50).toString() + "px"} />
          </>}
        handleClose={togglePopup3}
      />}
      {isOpen4 && <PopUp 
        content={<>
          <h1>Space (GB)</h1>
          <DashboardGraph4 cat={"tenant"} showLabel={"{name}"} display={false} valueX={"100%"} valueY={(vms.length * 50).toString() + "px"} />
          </>}
        handleClose={togglePopup4}
      />}
      <Box className={classes.container}>
        <h1 className="large text-primary">Admin Dashboard</h1>
        <p className="lead">
          Welcome { user && user.name }
        </p>
      </Box>
      { user.permissions.length > 0 ? (
        <Box className={classes.container}>
          <Grid container className={classes.gridRoot} spacing={4}>
            <Grid item xs={12}>
              <Grid container justify="flex-start" spacing={2}>
                <Grid item className={classes.graphBorder} style={{ width: "50vh" }}>
                  Just some empty space to fill up with something useful
                </Grid>
                <Grid item className={classes.graphBorder} onClick={togglePopup1}>
                  CPU Allocated
                  <DashboardGraph1 cat={"tenant"} showLabel={"{tenant}"} display={true} valueX={"50vh"} valueY={"100%"} />
                </Grid>
                <Grid item className={classes.graphBorder} onClick={togglePopup2}>
                  RAM Allocated (GB)
                  <DashboardGraph2 cat={"tenant"} showLabel={"{tenant}"} display={true} valueX={"50vh"} valueY={"100%"} />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid container justify="flex-start" spacing={2}>
                <Grid item className={classes.graphBorder} style={{ width: "50vh" }}>
                Just some empty space to fill up with something useful
                </Grid>
                <Grid item className={classes.graphBorder} onClick={togglePopup3}>
                  Uptime (hours)
                  <DashboardGraph3 cat={"tenant"} showLabel={"{tenant}"} display={true} valueX={"50vh"} valueY={"100%"} />
                </Grid>
                <Grid item className={classes.graphBorder} onClick={togglePopup4}>
                  Space (GB)
                  <DashboardGraph4 cat={"tenant"} showLabel={"{name}"} display={true} valueX={"50vh"} valueY={"100%"} />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      ) : (
        <Box component="div" className={classes.container}>
          <p>You do not have any Permissions set, please wait for an Admin to allocate.</p> 
        </Box>
      )}
      <Grid container justify="center" className={classes.copyright}>
        Copyright © 2020 Optus Cloud Team. All rights reserved.
      </Grid>
    </Paper>
  );
}

DashboardAdmin.propTypes = {
  auth: PropTypes.object.isRequired,
  vms: PropTypes.object.isRequired,
  getVMsTenant: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
  vms: state.vms
});

export default connect(mapStateToProps, { getVMsTenant })(DashboardAdmin);
