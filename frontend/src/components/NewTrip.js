import React, { useCallback, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormHelperText from '@material-ui/core/FormHelperText';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import { Typography } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import SvgIcon from '@material-ui/core/Icon';
import {ReactComponent as CreateAppointmentSvg} from "../illustrations/createAppointment.svg";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box'
import JsxParser from 'react-jsx-parser'
import { ToastContainer, toast } from 'react-toastify';






function preventDefault(event) {
    event.preventDefault();
  }

  const useStyles = makeStyles({
    depositContext: {
      flex: 1,
    },
    titleStyle: {
      textAlign: 'center'
  },
    illustrationSize:{
      width: 200,
      height: 200,
      justify: 'center',
      alignItems: 'center'
    },
    formSpacing:{
      paddingTop: 20,
      paddingBottom: 50
    }
  });

  

export default function NewTrip(){
    const classes = useStyles();

    const [washTypeValue, setWashTypeValue] = React.useState('Inside + Outside');
    const [levelOfDirtValue, setLevelOfDirtValue] = React.useState('medium')
    const [priceValue, setPriceValue] = React.useState(0)
    const [durationValue, setDurationValue] = React.useState(0)
    const [carName, setCarName] = React.useState('')
    const [carType, setCarType] = React.useState('')    
    const [timeIntervals, setTimeIntervals] = React.useState([])    
    const timeField = useRef('')
    const dateField = useRef('')

    
    function getToken (cookies) {
      var token = cookies.split('=')[1];
      return token;
    }

    function setDynamicCards(timeIntervals) {
      let htmlD = ``
      console.log(timeIntervals)
      timeIntervals.forEach(timeInterval => {
        let startHour = (timeInterval["start"] / 3600 | 0).toString() + ":" + (timeInterval["start"] % 3600 / 60 | 0).toString()
        let endHour = (timeInterval["end"] / 3600 | 0).toString() + ":" + (timeInterval["end"] % 3600 / 60 | 0).toString()
        console.log(timeInterval)
        htmlD += `
        <Card style={{marginBottom:"20px"}}>
        <CardContent>
         <Typography variant='h5'>Appointment interval ${startHour} - ${endHour}</Typography>                          
        </CardContent>
        </Card>`
      })

      return htmlD;
    }


    return (
      <Container maxWidth="xs">
      <h1 className={classes.titleStyle}>Create your appointment</h1>
      <Box textAlign="center">
      <SvgIcon component={CreateAppointmentSvg} className={classes.illustrationSize} />
      </Box>
      <Typography component = 'h1'>
              Complete the next form in order to create the appointment
      </Typography>
        <form className={classes.formSpacing}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl>
              <InputLabel htmlFor="my-input">Car name</InputLabel>
              <Input id="my-input" aria-describedby="helper-car-name" onChange = {event => setCarName(event.target.value)}/>
              <FormHelperText id="helper-car-name">Example: BMW 7 Series</FormHelperText>
             </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl>
                <FormLabel component="wash-type">Wash Type</FormLabel>
                <RadioGroup aria-label="wash-type" name="wash-type">
                    <FormControlLabel value="Inside" control={<Radio />} label="Inside" />
                    <FormControlLabel value="Outside" control={<Radio />} label="Outside" />
                    <FormControlLabel value="Inside + Outside" control={<Radio />} label="Inside + Outside" />
                </RadioGroup>
            </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl>
              <FormLabel component="level-of-dirt">Level of dirt</FormLabel>
              <RadioGroup aria-label="level-of-dirt" name="level-of-dirt">
                  <FormControlLabel value="low" control={<Radio />} label="Low" />
                  <FormControlLabel value="medium" control={<Radio />} label="Medium" />
                  <FormControlLabel value="high" control={<Radio />} label="High" />
                </RadioGroup>
                <TextField label='Date' helperText='Example: 15/05/2033' inputRef={dateField}></TextField>
          </FormControl>
        </Grid>
        <Grid>
          <Button type="button" variant="contained" color="primary">
            Find an appointment
          </Button>
          <ToastContainer />
        </Grid>
        </Grid>
        </form>
        <Typography>Duration: {durationValue} minutes</Typography>
        <Typography>Price: {priceValue} RON</Typography>
        {/* <div>{setDynamicCards(timeIntervals)}</div>  */}        
        <JsxParser components={{Card, CardContent, Typography, TextField, Button}} jsx={setDynamicCards(timeIntervals)}></JsxParser>
         
        <Typography>Choose when you want to come: </Typography>
        <TextField label='Example: 12:30' inputRef={timeField} style={{marginTop:"10px"}}></TextField>
        <Button variant="contained" color="secondary" style={{marginTop:"20px"}}>Choose this appointment</Button>
        <ToastContainer />
        </Container>
);
}