import React, { useEffect, useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import { getApps, deleteApp, createApp } from '../../actions/application';

import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

import styles from "../layout/classes";
const useStyles = makeStyles(styles);

const AdminRequest = ({ auth, getApps, deleteApp, createApp, application: { apps, loading } }) => {
  useEffect(() => {
    getApps();
  },[getApps]);

  const classes = useStyles();

  const columns = [
    { id: 'name', label: 'User', minWidth: 100 },
    { id: 'number', label: 'Number', minWidth: 100 },
    { id: 'project', label: 'Project', minWidth: 100 },
    { id: 'tenant', label: 'Tenant', minWidth: 100 },
    { id: 'cloud', label: 'Cloud', minWidth: 100 },
    { id: 'status', label: 'Status', minWidth: 100 },
  ];

  const columnsVMs = [
    { id: 'name', label: 'Name', minWidth: 100 },
    { id: 'cluster', label: 'Cluster', minWidth: 100 },
    { id: 'hostname', label: 'Hostname', minWidth: 100 },
    { id: 'cpu', label: 'CPU', minWidth: 50 },
    { id: 'ram', label: 'RAM', minWidth: 50 },
    { id: 'space', label: 'Space', minWidth: 50 },
  ];

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const [selectedApp, setSelectedApp] = useState('');
  const handleChangeApp = (e) => {
    setSelectedApp(e);
    setPage(0);
  };

  const deleteApplication = async (e, num) => {
    await deleteApp(e, num);
    await getApps();
    if (selectedApp) handleChangeApp(null);
  };

  const approveApplication = async (e) => {
    await createApp(e, true);
    await getApps();
    if (selectedApp) setSelectedApp(e);
  };


  return ( loading && apps === null ? <Spinner /> :
    <Box component='div' className={classes.container}>    
      <h3 className="text-primary">Applications</h3>
      {selectedApp ? (
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
                  <TableCell>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow hover role="checkbox" tabIndex={-1} key={selectedApp._id} className={classes.tableRow}>
                  {columns.map((column) => {
                    let value = selectedApp[column.id];
                    if (column.id === 'name') {
                      value = selectedApp.user.name;
                    }
                    return (
                      <TableCell key={column.id} align={column.align} onClick={() => handleChangeApp(null)}>
                        {column.format && typeof value === 'number' ? column.format(value) : value}
                      </TableCell>
                    );
                  })}
                  <TableCell>
                    <Button
                      type="button"
                      variant="contained"
                      color="secondary"
                      className={classes.requestButton}
                      onClick={() => deleteApplication(selectedApp._id, selectedApp.number)}
                    >
                      Delete
                    </Button>
                    {' '}
                    {selectedApp.status !== 'Complete' && selectedApp.status !== 'Init' ? (
                      selectedApp.status === 'Requested' ? (
                        <Button
                          type="button"
                          variant="contained"
                          color="primary"
                          className={classes.requestButton}
                          onClick={() => approveApplication({...selectedApp, status: 'Approved'})}
                        >
                          Approve
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          variant="contained"
                          color="primary"
                          className={classes.requestButton}
                          onClick={() => approveApplication({...selectedApp, status: 'Complete'})}
                        >
                          Complete
                        </Button>
                      )
                    ) : null}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <TableContainer className={classes.container}>
            <Table stickyHeader size="small" aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columnsVMs.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedApp.vms.length < 1 ? (
                  <h3 className="text-primary-margin-top">No Virtual Machines Allocated</h3>
                ) : (
                  selectedApp.vms.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((vm) => {
                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={vm.code}>
                        {columnsVMs.map((column) => {
                          const value = vm[column.id];
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {column.format && typeof value === 'number' ? column.format(value) : value}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 20]}
            component="div"
            count={selectedApp.vms.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
          <Button
            type="button"
            variant="contained"
            color="primary"
            className={classes.requestButton}
            onClick={() => handleChangeApp(null)}
          >
            Back to Applications
          </Button>
        </Fragment>
      ) : (
        apps.length > 0 ? (
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
                    <TableCell>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {apps.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((app) => {
                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={app._id} className={classes.tableRow}>
                        {columns.map((column) => {
                          let value = app[column.id];
                          if (column.id === 'name') {
                            value = app.user.name;
                          }
                          return (
                            <TableCell key={column.id} align={column.align} onClick={() => handleChangeApp(app)}>
                              {column.format && typeof value === 'number' ? column.format(value) : value}
                            </TableCell>
                          );
                        })}
                        <TableCell>
                          <Button
                            type="button"
                            variant="contained"
                            color="secondary"
                            className={classes.requestButton}
                            onClick={() => deleteApplication(app._id, app.number)}
                          >
                            Delete
                          </Button>
                          {' '}
                          {app.status !== 'Complete' && app.status !== 'Init' ? (
                            app.status === 'Requested' ? (
                              <Button
                                type="button"
                                variant="contained"
                                color="primary"
                                className={classes.requestButton}
                                onClick={() => approveApplication({...app, status: 'Approved'})}
                              >
                                Approve
                              </Button>
                            ) : (
                              <Button
                                type="button"
                                variant="contained"
                                color="primary"
                                className={classes.requestButton}
                                onClick={() => approveApplication({...app, status: 'Complete'})}
                              >
                                Complete
                              </Button>
                            )
                          ) : null}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 20]}
              component="div"
              count={apps.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            />
          </Fragment>
        ) : (
          <h4>No Current Applications</h4>
        )
      )}
    </Box>
  );
}

AdminRequest.propTypes = {
  getApps: PropTypes.func.isRequired,
  deleteApp: PropTypes.func.isRequired,
  createApp: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  application: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
  application: state.application,
});

export default connect(mapStateToProps, { getApps, deleteApp, createApp })(AdminRequest);
