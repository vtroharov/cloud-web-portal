import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import AdminUser from './AdminUser';
import AdminRequest from './AdminRequest';
import AdminVMs from './AdminVMs';
import AdminLogs from './AdminLogs';

import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';

import SwipeableViews from 'react-swipeable-views';
import styles from "../layout/classes";
const useStyles = makeStyles(styles);

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={1}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

const Admin = ({ auth: { user, loading }, admin: { users } }) => {
  const classes = useStyles();
  const theme = useTheme();

  const [value, setValue] = useState(0);
  const handleChangeTabs = (event, newValue) => {
    setValue(newValue);
  };
  const handleChangeIndex = (index) => {
    setValue(index);
  };

  return ( loading && users === null ? <Spinner /> :
    <Paper className={classes.paperFull}>
      <Box component='div' className={classes.container}>
        <h1 className="large text-primary">Admin Control Center</h1>
        <p className="lead">
          Welcome Admin { user.name }
        </p>
        <Box component='div' className={classes.TabsRoot}>
          <AppBar position="static" color="default">
            <Tabs
              value={value}
              onChange={handleChangeTabs}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
              aria-label="full width tabs example"
            >
              <Tab label="Users" {...a11yProps(0)} />
              <Tab label="Requests" {...a11yProps(1)} />
              <Tab label="VMs" {...a11yProps(2)} />
              <Tab label="Logs" {...a11yProps(3)} />
            </Tabs>
          </AppBar>
          <SwipeableViews
            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
            index={value}
            onChangeIndex={handleChangeIndex}
          >
            <TabPanel value={value} index={0} dir={theme.direction} className={classes.tabsColour}>
              <AdminUser />
            </TabPanel>
            <TabPanel value={value} index={1} dir={theme.direction} className={classes.tabsColour}>
              <AdminRequest />
            </TabPanel>
            <TabPanel value={value} index={2} dir={theme.direction} className={classes.tabsColour}>
              <AdminVMs />
            </TabPanel>
            <TabPanel value={value} index={3} dir={theme.direction} className={classes.tabsColour}>
              <AdminLogs />
            </TabPanel>
          </SwipeableViews>
        </Box>
      </Box>
    </Paper>
  );
}

Admin.propTypes = {
  auth: PropTypes.object.isRequired,
  admin: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
  admin: state.admin
});

export default connect(mapStateToProps, null)(Admin);
