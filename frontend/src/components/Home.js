import React , {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import SvgIcon from '@material-ui/core/Icon';
import {ReactComponent as HomeSvg} from "../illustrations/home.svg";
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import { Link } from 'react-router-dom';
import {Route} from 'react-router-dom'



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

export default function Home(){
    const classes = useStyles();

    return(
        <Container maxWidth="xs">
            <h1 className={classes.titleStyle}>Welcome to Car Wash Appointment App</h1>
            <Box textAlign="center">
            <SvgIcon component={HomeSvg} className={classes.illustrationSize} />
            </Box>
            <h3 className={classes.titleStyle}>Use this application to create appointments to your favourite car wash.</h3>
            <h3 className={classes.titleStyle}>The appointments are optimized based on your inputs, so forget the waiting in line.</h3>
            <Box textAlign="center">
            
            <Button component={Link} to="/make-appointment" className={classes.button} variant="contained" color="primary">Create your appointment now</Button>
            
            </Box>
        </Container>
    )
}