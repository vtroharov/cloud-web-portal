import React, { useEffect, useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import Spinner from '../layout/Spinner';
import { getAppUser, getNumber, createApp, addVM, deleteVM } from '../../actions/application';

import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

import styles from "../layout/classes";
const useStyles = makeStyles(styles);

const Request = ({ auth, getAppUser, getNumber, application: { apps, number, loading }, createApp, addVM, deleteVM }) => {
  useEffect(() => {
    getAppUser(auth.user._id);
    getNumber();
  },[getAppUser, getNumber, auth.user._id]);

  const classes = useStyles();

  const [selectedApp, setSelectedApp] = useState('');
  const [chosenApp, setChosenApp] = useState('');
  const [selectVM, setSelectVM] = useState('');
  const [displayAddVM, toggleAddVM] = useState(false);


  let { project, tenant, cloud, status } = chosenApp;
  let { name, cluster, hostname, cpu, ram, space } = selectVM;

  const handleChange = (e) => {
    setSelectedApp(e.target.value);
    toggleAddVM(false);
    setChosenApp({...chosenApp, project: "", tenant: "", cloud: "", status: ""})
  };
  const handleToggle = () => {
    if ((project && tenant && cloud) || selectedApp > 0) {
      toggleAddVM(!displayAddVM); 
    }
  }

	const onChange = e => setChosenApp({...chosenApp, [e.target.name]: e.target.value});
  const onChangeVM = e => setSelectVM({...selectVM, [e.target.name]: e.target.value});

	const onSubmit = async e => {
    e.preventDefault();
    await createApp({number, project, tenant, cloud, status});
    await getAppUser(auth.user._id);
    await getNumber();
    setSelectedApp(apps.length + 1);
  }

  const onSubmitVM = async e => {
    e.preventDefault();
    await addVM(selectVM, apps[selectedApp-1]._id);
    await getAppUser(auth.user._id);
    toggleAddVM(false);
    setSelectVM({name: "", cluster: "", hostname: "", cpu: "", ram: "", space: ""});
  }

  const requestApplication = async (e) => {
    await createApp(e, true);
    await getAppUser(auth.user._id);
  };

  const columns = [
    { id: 'name', label: 'Name', minWidth: 100 },
    { id: 'cluster', label: 'Cluster', minWidth: 100 },
    { id: 'hostname', label: 'Hostname', minWidth: 100 },
    { id: 'cpu', label: 'CPU', minWidth: 50 },
    { id: 'ram', label: 'RAM', minWidth: 50 },
    { id: 'space', label: 'Space', minWidth: 50 },
  ];

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const deleteVMFrom = async (e, vmName) => {
    await deleteVM(apps[selectedApp-1]._id, e, vmName);
    await getAppUser(auth.user._id);
  }

  return ( loading && apps && number === null ? <Spinner /> :
    <Paper className={classes.paperFull}>
      <Box component='div' className={classes.container}>
        <h1 className="large text-primary">Requests</h1>
        <Grid container className={classes.gridRoot} spacing={4}>
          <Grid item xs={12} sm={6}>
            <FormControl className={classes.formControl}>
              <InputLabel id="select-helper-label">Application</InputLabel>
              <Select
                labelId="select-helper-label"
                id="select-helper"
                value={selectedApp}
                onChange={handleChange}
              >
                <MenuItem value="0">
                  <em>New</em>
                </MenuItem>
                {apps.map((app, index) => (
                  <MenuItem key={app._id} value={index+1}>
                    {app.number}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>Please Select an Application</FormHelperText>
            </FormControl>
          </Grid>
          {selectedApp && displayAddVM ? (
          <Hidden xsDown>
            <Grid item xs={12} sm={6}>
              <h1 className="text-primary">Virtual Machine</h1>
              <h3 className="text-primary">Please define the VM Specs</h3>
            </Grid>
          </Hidden>
          ) : null}
        </Grid>
        {selectedApp ? (
          <Grid container className={classes.gridRoot} spacing={4}>
            <Grid item xs={12} sm={6}>
              <form className={classes.form} onSubmit={e => onSubmit(e)}>
                <Grid container justify="flex-start" spacing={2}>
                  <Grid item className={classes.mediumContainer}>
                    <TextField disabled={true}
                      className={classes.txtField}
                      name="date"
                      variant="outlined"
                      fullWidth
                      id="date"
                      label="Date Created"
                      value={selectedApp === "0" ? moment().format('YYYY-MM-DD') : apps[selectedApp-1].date.slice(0, 10)}
                    />
                  </Grid>
                  <Grid item className={classes.mediumContainer}>
                    <TextField disabled={true}
                      className={classes.txtField}
                      name="number"
                      variant="outlined"
                      fullWidth
                      id="number"
                      label="Number"
                      value={selectedApp === "0" ? number : apps[selectedApp-1].number}
                      onChange={e => onChange(e)}
                    />
                  </Grid>
                </Grid>
                <Grid container justify="flex-start" spacing={2}>
                  <Grid item className={classes.mediumContainer}>
                    <TextField disabled={selectedApp === "0" ? false : true} 
                      className={classes.txtField}
                      name="project"
                      variant="outlined"
                      fullWidth
                      id="project"
                      required
                      label="Project"
                      value={selectedApp === "0" ? project : (project ? project : apps[selectedApp-1].project)}
                      onChange={e => onChange(e)}
                      autoFocus
                    />
                  </Grid>
                  <Grid item className={classes.mediumContainer}>
                    <TextField disabled={selectedApp === "0" ? false : true} 
                      className={classes.txtField}
                      name="tenant"
                      variant="outlined"
                      fullWidth
                      id="tenant"
                      required
                      label="Tenant"
                      value={selectedApp === "0" ? tenant : (tenant ? tenant : apps[selectedApp-1].tenant)}
                      onChange={e => onChange(e)}
                    />
                  </Grid>
                </Grid>
                <Grid container justify="flex-start" spacing={2}>
                  <Grid item className={classes.mediumContainer}>
                    <TextField disabled={selectedApp === "0" ? false : true} 
                      className={classes.txtField}
                      name="cloud"
                      variant="outlined"
                      fullWidth
                      id="cloud"
                      required
                      label="Cloud"
                      value={selectedApp === "0" ? cloud : (cloud ? cloud : apps[selectedApp-1].cloud)}
                      onChange={e => onChange(e)}
                    />
                  </Grid>
                  <Grid item className={classes.mediumContainer}>
                    <TextField disabled={true}
                      className={classes.txtField}
                      name="status"
                      variant="outlined"
                      fullWidth
                      id="status"
                      label="Status"
                      value={selectedApp === "0" ? "Init" : (status ? status : apps[selectedApp-1].status)}
                      onChange={e => onChange(e)}
                    />
                  </Grid>
                </Grid>
                {selectedApp === "0" ? (<Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                >
                  Create Application
                </Button>) : null}
                {!displayAddVM && selectedApp > 0 && apps[selectedApp-1].status === 'Init' &&
                    <Fragment>
                      <Button
                        type="button"
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={() => handleToggle()}
                      >
                        Add a Virtual Machine
                      </Button>
                      <Button
                        type="button"
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={() => requestApplication({...apps[selectedApp-1], status: 'Requested'})}
                      >
                        Submit Application
                      </Button>
                    </Fragment>
                  }
              </form>
            </Grid>
            {displayAddVM && ((project && tenant && cloud) || selectedApp > 0) && 
            <Grid item xs={12} sm={6}>
              <Hidden smUp>
                <Grid item xs={12} sm={6}>
                  <h1 className="text-primary">Virtual Machine</h1>
                  <h3 className="text-primary">Please define the VM Specs</h3>
                </Grid>
              </Hidden>
              <form className={classes.form} onSubmit={e => onSubmitVM(e)}>
                <Grid container justify="flex-start" spacing={2}>
                  <Grid item className={classes.mediumContainer}>
                    <TextField
                      className={classes.txtField}
                      name="name"
                      variant="outlined"
                      fullWidth
                      required
                      id="name"
                      label="Name"
                      value={name}
                      onChange={e => onChangeVM(e)}
                    />
                  </Grid>
                  <Grid item className={classes.mediumContainer}>
                    <TextField
                      className={classes.txtField}
                      name="cluster"
                      variant="outlined"
                      fullWidth
                      required
                      id="cluster"
                      label="Cluster"
                      value={cluster}
                      onChange={e => onChangeVM(e)}
                    />
                  </Grid>
                </Grid>
                <Grid container justify="flex-start" spacing={2}>
                  <Grid item className={classes.mediumContainer}>
                    <TextField
                      className={classes.txtField}
                      name="hostname"
                      variant="outlined"
                      fullWidth
                      required
                      id="hostname"
                      label="Hostname"
                      value={hostname}
                      onChange={e => onChangeVM(e)}
                    />
                  </Grid>
                  <Grid item className={classes.mediumContainer}>
                    <TextField
                      className={classes.txtField}
                      name="cpu"
                      variant="outlined"
                      fullWidth
                      required
                      id="cpu"
                      label="Numbner of CPUs"
                      value={cpu}
                      onChange={e => onChangeVM(e)}
                    />
                  </Grid>
                </Grid>
                <Grid container justify="flex-start" spacing={2}>
                  <Grid item className={classes.mediumContainer}>
                    <TextField
                      className={classes.txtField}
                      name="ram"
                      variant="outlined"
                      fullWidth
                      required
                      id="ram"
                      label="RAM in (GB)"
                      value={ram}
                      onChange={e => onChangeVM(e)}
                    />
                  </Grid>
                  <Grid item className={classes.mediumContainer}>
                    <TextField
                      className={classes.txtField}
                      name="space"
                      variant="outlined"
                      fullWidth
                      required
                      id="space"
                      label="Space in (GB)"
                      value={space}
                      onChange={e => onChangeVM(e)}
                    />
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  // fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                >
                  Add VM
                </Button>
              </form>
            </Grid>}
          </Grid>
        ): null}
      </Box>
      <Box component='div' className={classes.container}>
        {selectedApp > 0 ? (
          <Fragment>
            <h3 className="text-primary">Virtual Machines Allocated</h3>
            {apps[selectedApp-1].vms.length > 0 ? (
              <Fragment>
                <TableContainer className={classes.container}>
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        {columns.map((column) => (
                          <TableCell
                            key={column.id}
                            align={column.align}
                            style={{ minWidth: column.minWidth }}
                          >
                            {column.label}
                          </TableCell>
                        ))}
                        {apps[selectedApp-1].status === 'Init' &&
                          <TableCell>
                            Delete
                          </TableCell>
                        } 
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {apps[selectedApp-1].vms.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((vm) => {
                        return (
                          <TableRow hover role="checkbox" tabIndex={-1} key={vm.code}>
                            {columns.map((column) => {
                              const value = vm[column.id];
                              return (
                                <TableCell key={column.id} align={column.align}>
                                  {column.format && typeof value === 'number' ? column.format(value) : value}
                                </TableCell>
                              );
                            })}
                            {apps[selectedApp-1].status === 'Init' &&
                              <TableCell>
                                <Button
                                  type="button"
                                  variant="contained"
                                  color="secondary"
                                  className={classes.delete}
                                  onClick={() => deleteVMFrom(vm._id, vm.name)}
                                >
                                  X
                                </Button>
                              </TableCell>
                            }
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 20]}
                  component="div"
                  count={apps[selectedApp-1].vms.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onChangePage={handleChangePage}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
                />
              </Fragment>
            ) : (
              <h4>No VMs Requested</h4>
            )}
          </Fragment>
        ) : null}
      </Box>
    </Paper>
  );
}

Request.propTypes = {
  getAppUser: PropTypes.func.isRequired,
  getNumber: PropTypes.func.isRequired,
  createApp: PropTypes.func.isRequired,
  addVM: PropTypes.func.isRequired,
  deleteVM: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  application: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
  application: state.application,
});

export default connect(mapStateToProps, { getAppUser, getNumber, createApp, addVM, deleteVM })(Request);
