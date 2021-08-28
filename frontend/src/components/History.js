import React , {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import SvgIcon from '@material-ui/core/Icon';
import {ReactComponent as HistorySvg} from "../illustrations/history.svg";
import Box from '@material-ui/core/Box'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField'
import { Typography } from '@material-ui/core';
import ReactDOM from "react-dom";
//import ReactHTMLParser from "react-html-parser"
//import babel from 'babel-core'
import JsxParser from 'react-jsx-parser'

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
})

export default function History(){
    const classes = useStyles()

    const [appointmentList, setAppointmentList] = useState([])

    function getToken (cookies) {
        var token = cookies.split('=')[1];
        return token;
      }

    function setDynamicAppointmens(appointmentList) {
        let htmlD = ``        
        appointmentList.forEach(appointment => {
            console.log(appointment)
            htmlD += `
            <Card style={{marginBottom:'20px', marginTop:'20px'}}>
            <CardContent>
              <Typography>Date: ${appointment["date"]}</Typography>              
              <Typography>Hour: ${appointment["time"]}</Typography>              
              <Typography>Duration: ${appointment["duration"]} minutes</Typography>
              <Typography>Car: ${appointment["carName"]} with a ${appointment["levelOfDirt"]} level of dirt</Typography>                            
              <Typography>Price: ${appointment["price"]} RON</Typography>
              <Typography>You car type: ${appointment["carType"]}</Typography>                                        
              <Typography>Service: ${appointment["washType"]}</Typography>              
            </CardContent>
            </Card>`
        });

        //return ReactHTMLParser(htmlD);

        //return {__html: htmlD}
        return htmlD;
    }
    //var Cards = eval(babel.transform(setDynamicAppointmens(appointmentList)))

    useEffect(() => {
        fetch('/getAppointmentsForUser', {
            method: 'GET',
            headers: {
              'x-auth-token': getToken(document.cookie)
            }
          }).then(response => response.json())
            .then(json => setAppointmentList(json))
    })

    return(

        <Container maxWidth='xs'>
            <h1 className={classes.titleStyle}>Your appointment history</h1>
            <Box textAlign="center">
            <SvgIcon component={HistorySvg} className={classes.illustrationSize} />
            </Box>
            <JsxParser components={{Card, CardContent, Typography}} jsx={setDynamicAppointmens(appointmentList)}></JsxParser>
           
        </Container>
    )
}
