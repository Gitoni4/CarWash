import React , {useCallback, useState, useRef} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import SvgIcon from '@material-ui/core/Icon';
import {ReactComponent as DelayAppointmentsSvg} from "../illustrations/delayAppointments.svg";
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import { Link } from 'react-router-dom';
import {Route} from 'react-router-dom'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const useStyles = makeStyles({
    titleStyle: {
        textAlign: 'center'
    },
    illustrationSize:{
        width: 200,
        height: 200,
        justify: 'center',
        alignItems: 'center'
    }
});

export default function DelayAppointments(){
    const classes = useStyles();
    const delayField = useRef('')

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    var today = dd + '/' + mm + '/' + yyyy
     

    function getToken (cookies) {
        var token = cookies.split('=')[1];
        return token;
      }

    const reqDelayAppointments = useCallback(() => {
         fetch('/delayAppointment?delayDuration=' + delayField.current.value, {
             method: 'PUT',
             headers: {
                'x-auth-token': getToken(document.cookie)
              }
         })
         toast("Appointments for today have been delayed")
    })

    return(
        <Container maxWidth="xs">
            <h1 className={classes.titleStyle}>Delay appointments</h1>
            <Box textAlign="center">
                 <SvgIcon component={DelayAppointmentsSvg} className={classes.illustrationSize} />
            </Box>
            <Box textAlign="center" style={{paddingTop:'40px'}}>
                <Typography>Fill the next input with the desired number of minutes, in order to delay users' appointments</Typography>
            </Box>
            <Box textAlign="center" style={{paddingTop:'40px'}}>
                <TextField helperText="Number of minutes" inputRef={delayField}></TextField>
            </Box>
            <Box textAlign="center" style={{paddingTop:'40px'}}>
                <Button type="button" variant="contained" color="primary" onClick={reqDelayAppointments}>
                         Delay
                 </Button>
            </Box>
            <ToastContainer />
        </Container>
    )
}