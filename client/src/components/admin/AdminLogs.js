import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getLogs, createLog, deleteLogs, deleteLog } from '../../actions/logs';
import Spinner from '../layout/Spinner';
import Moment from 'moment';

import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';

import styles from "../layout/classes";
const useStyles = makeStyles(styles);

const columns = [
  { id: 'date', label: 'Time', minWidth: 100 },
  { id: 'name', label: 'User', minWidth: 100 },
  { id: 'desc', label: 'Description', minWidth: 500 },
];

const AdminLogs = ({ auth: { user, loading }, getLogs, createLog, deleteLogs, deleteLog, logs: { logs } }) => {
  useEffect(() => {
    getLogs();
  }, [getLogs]);

  const classes = useStyles();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const deleteAll = () => {
    deleteLogs();
    getLogs();
  };

  const deleteLogId = (e) => {
    deleteLog(e);
    getLogs();
  };

  return ( loading && logs === null ? <Spinner /> :
    <Box component='div' className={classes.logsTable}>
      <Box component='div' className={classes.container}>
        <Button
          type="button"
          size="small"
          variant="contained"
          color="secondary"
          className={classes.requestButton}
          onClick={() => deleteAll()}
        >
          Clear All Logs
        </Button>
      </Box>
      <TableContainer className={classes.logsContainer}>
        <Table stickyHeader size="small" aria-label="sticky table">
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
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((log) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={log._id} className={classes.tableRowLogs}>
                  {columns.map((column) => {
                    let value = log[column.id];
                    if (column.id === 'name') {
                      value = log.user.name;
                    } else if (column.id === 'date') {
                      value = Moment(log.date).format('DD/MM/YYYY HH:mm:ss');
                    }
                    return (
                      <TableCell key={column.id} align={column.align} onClick={() => deleteLogId(log._id)}>
                        {column.format && typeof value === 'number' ? column.format(value) : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={logs.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
          
    </Box>
  );
}

AdminLogs.propTypes = {
  getLogs: PropTypes.func.isRequired,
  createLog: PropTypes.func.isRequired,
  deleteLogs: PropTypes.func.isRequired,
  deleteLog: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  logs: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
  logs: state.logs,
});

export default connect(mapStateToProps, { getLogs, createLog, deleteLogs, deleteLog })(AdminLogs);
