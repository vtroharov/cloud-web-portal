const useStyles = theme => ({
  paper: {
    marginTop: theme.spacing(15),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontFamily: 'Raleway',
  },
  paperFull: {
    margin: theme.spacing(9, 5),
    fontFamily: 'Raleway',
    minHeight: '600px',
    // height: '97%',
    elevation: '3'
  },
  navBar: {
    fontFamily: 'Raleway',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  button: {
    margin: theme.spacing(0.5, 1, 0.5),
    opacity: 0.8
  },
  submit: {
    margin: theme.spacing(2, 2, 2, 0),
    opacity: 0.8
  },
  requestButton: {
    margin: theme.spacing(0, 0.5, 0),
    opacity: 0.8
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 200,
  },
  container: {
    padding: theme.spacing(1, 2),
    // border: '1px solid black'
  },
  xsmallContainer: {
    width: '25%',
    // border: '1px solid black'
  },
  smallContainer: {
    width: '30%',
    // border: '1px solid black'
  },
  mediumContainer: {
    width: '50%',
    // border: '1px solid black'
  },
  
  largeContainer: {
    width: '70%',
    // border: '1px solid black'
  },
  gridRoot: {
    flexGrow: 1,
    // border: '1px solid blue'
  },
  graphBorder: {
    margin: '3px',
    border: '1px solid',
    borderColor: "lightBlue",
    borderRadius: 16,
    '&:hover': {
      background: "rgba(225, 204, 248, 0.3)",
    }
  },
  copyright: {
    alignItems: 'center',
    marginTop: theme.spacing(3),
  },
  popupBox: {
    position: 'fixed',
    background: '#00000050',
    width: '100%',
    height: '100vh',
    top: 0,
    left: 0,
    zIndex: '2000'
  },
  box: {
    position: 'relative',
    width: '70%',
    margin: 'auto',
    height: 'auto',
    maxHeight: '70vh',
    marginTop: 'calc(100vh - 85vh - 20px)',
    background: '#fff',
    borderRadius: '4px',
    padding: '20px',
    border: '1px solid #999',
    overflow: 'auto',
    zIndex: '2000'
  },
  closeIcon: {
    content: 'x',
    cursor: 'pointer',
    position: 'fixed',
    right: 'calc(15% - 30px)',
    top: 'calc(100vh - 85vh - 33px)',
    background: '#ededed',
    width: '25px',
    height: '25px',
    borderRadius: '50%',
    lineHeight: '20px',
    textAlign: 'center',
    border: '1px solid #999',
    fontSize: '20px',
    zIndex: '2000'
  },
  txtField: {
    marginRight: '20px',
    marginBottom: '10px'
  },
  tabsRoot: {
    backgroundColor: theme.palette.background.paper,
    width: 500,
  },
  tabsColour: {
    border: '1px solid rgba(225, 204, 248, 0.6)'
  },
  tableRow: {
    cursor: 'pointer'
  },
  tableRowLogs: {
    cursor: 'pointer',
    "&:hover": {
      backgroundColor: "red !important",
      opacity: 0.8
    }
  },
  vmsField: {
    marginTop: '5px',
    backgroundColor: 'lightgrey'
  },
  vmsFieldText: {
    color: "black",
    fontSize: "12px"
  },
  logsContainer: {
    maxHeight: 440,
  },
  logsTable: {
    padding: theme.spacing(1, 2),
    width: '100%',
  }
});

export default useStyles