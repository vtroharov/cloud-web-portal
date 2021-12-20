import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getVMs, pushVMs, deleteVMs } from '../../actions/vms';
import Spinner from '../layout/Spinner';

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

const columns = [
  { id: 'cluster', label: 'Cluster', minWidth: 120 },
  { id: 'tenant', label: 'Tenant', minWidth: 120 },
  { id: 'vm', label: 'VM Name', minWidth: 80 },
  // { id: 'hostname', label: 'Hostname', minWidth: 100 },
  { id: 'num_cpu', label: 'CPUs', minWidth: 20 },
  { id: 'memory_alloc', label: 'Memory', minWidth: 30 },
  { id: 'commited_space', label: 'Space', minWidth: 30 },
  { id: 'uptime', label: 'Uptime', minWidth: 30 },
];

const AdminVMs = ({ auth: { user, loading }, getVMs, pushVMs, deleteVMs, vms: { vms } }) => {
  useEffect(() => {
    getVMs();
  }, [getVMs]);

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

  const loadVMs = async () => {
    await pushVMs();
    await getVMs()
  };

  const offLoadVMs = async () => {
    await deleteVMs();
    await getVMs();
  };

  return ( loading && vms === null ? <Spinner /> :
    <Box component='div' className={classes.container}>
      <Box component='div' className={classes.container}>
        <Button
          type="button"
          variant="contained"
          color="primary"
          className={classes.requestButton}
          onClick={() => loadVMs()}
        >
          Load VMs
        </Button>
        {' '}
        <Button
          type="button"
          variant="contained"
          color="secondary"
          className={classes.requestButton}
          onClick={() => offLoadVMs()}
        >
          Off Load VMs
        </Button>
      </Box>
      <Box component='div' className={classes.container}>
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
              {vms && vms.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((vm) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={vm._id}>
                    {columns.map((column) => {
                      let value = vm[column.id];
                      if (column.id === 'commited_space') {
                        value = vm.commited_space + vm.uncommited_space;
                      }
                      return (
                        <TableCell key={column.id} align={column.align}>
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
        {vms && <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={vms.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />}
      </Box>
    </Box>
  );
}

AdminVMs.propTypes = {
  getVMs: PropTypes.func.isRequired,
  pushVMs: PropTypes.func.isRequired,
  deleteVMs: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  vms: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
  vms: state.vms,
});

export default connect(mapStateToProps, { getVMs, pushVMs, deleteVMs })(AdminVMs);
