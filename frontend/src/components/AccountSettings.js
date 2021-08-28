import React , {useCallback, useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import SvgIcon from '@material-ui/core/Icon';
import {ReactComponent as HistorySvg} from "../illustrations/history.svg";
import Box from '@material-ui/core/Box'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField'
import { Typography } from '@material-ui/core';
import { useRef } from 'react'
import Button from '@material-ui/core/Button';
import {ReactComponent as UserSettingsSvg} from "../illustrations/userSettings.svg";
import Grid from '@material-ui/core/Grid'
import Divider from '@material-ui/core/Divider'



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

export default function AccountSettings(){
    const classes = useStyles()

    const [user, setUser] = useState({})
    const [formData, setFormData] = useState(0)
    const phoneField = useRef('')
    const emailField = useRef('')
    const passwordField = useRef('')

    function getToken (cookies) {
        var token = cookies.split('=')[1];
        return token;
    }    

    const setValues = () => {
        let data = new FormData()
        if (!phoneField.current.value) {
          data.append('phone', user["phone"])
        } else {
          data.append('phone', phoneField.current.value)
        }
        if (!emailField.current.value) {
          data.append('email', user["email"])
        } else {
          data.append('email', emailField.current.value)
        }
        if (!passwordField.current.value) {
          data.append('password', user["password"])
        } else {
          data.append('password', passwordField.current.value)
        }

        setFormData(data)
    }

    useEffect(() => {
        fetch('/getUser', {
            method: 'GET',
            headers: {
              'x-auth-token': getToken(document.cookie)
            }
          }).then(response => response.json())
            .then(json => setUser(json["response"]))
            console.log(user)
            console.log(document.cookie)
    })

    const reqUpdateUser = useCallback (() => {
       setValues()
       fetch('/updateUser', {
           method: 'PUT',
           body: formData,
           headers: {
            'x-auth-token': getToken(document.cookie)
          }
       })
    })

    return(

        <Container maxWidth='xs'>
            <h1 className={classes.titleStyle}>Your account</h1>
            <Box textAlign="center">
            <SvgIcon component={UserSettingsSvg} className={classes.illustrationSize} />
            </Box>
            <Card style={{marginTop:"20px", marginBottom:"40px"}}>
              <CardContent>
                <Typography>Your account information:</Typography>
                <Divider></Divider>
                <Typography>Username: {user["name"]}</Typography>
                <Typography>Phone number: {user["phone"]}</Typography>
                <Typography>Email: {user["email"]}</Typography>
              </CardContent>
            </Card>
            <Typography component = 'h1'>
              Complete the form with the desired values for updating
            </Typography>
            <Grid container spacing={2} direction="column" alignItems="center" justify="center" style={{paddingTop: "20px"}}>
            <Grid item xs={12}>
            <TextField helperText="New phone number" inputRef={phoneField}/>
            </Grid>
            <Grid item xs={12}>
            <TextField helperText="New email" inputRef={emailField}/>
            </Grid>
            <Grid item xs={12}>
            <TextField helperText="New password" type="password" inputRef={passwordField}/>
            </Grid>
            <Grid item xs={12}>
            <TextField helperText="Confirm new password" type="password" inputRef={passwordField}/>
            </Grid>
            <Grid item xs={12}>
            <Button
            type="button"
            fullWidth
            variant="contained"
            color="primary"            
            onClick={reqUpdateUser}>
            Update Account
          </Button>
          </Grid>

          </Grid>
        </Container>
    )
}