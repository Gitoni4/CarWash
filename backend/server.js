const express = require('express')
const mongoose = require('mongoose');
const fs = require('fs')
mongoose.connect('mongodb+srv://root:root@cluster0.3zetn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true})

const User = require('./utils/models/user')
const Appointment = require('./utils/models/appointments')
const Car = require('./utils/models/cars')
const RequestBody = require('./utils/RequestBody')
const JWTController = require('./JWT/JWTController');
const { find } = require('./utils/models/user');

const app = express()
const httpPort = 5000

/////////////////////////// User

app.post('/signup', (req, res) => {
  let reqBody = ""
  req.on("data", (data) => {
    reqBody += data
  })

  req.on("end", async () => {
    req.body = reqBody    

    let formDataParams = (new RequestBody(req)).formData

    console.log(formDataParams["name"])
    console.log(formDataParams["email"])

    if (!formDataParams["name"] || !formDataParams["email"])
    {
      res.end(JSON.stringify( { status : 400,
        response : "Missing credentials"
      }))
      return
    }

    let userCheck = await User.find({ name : formDataParams["name"] })
    let emailCheck = await User.find({ email : formDataParams["email"] })

    if (userCheck.length || emailCheck.length) {
      res.end(JSON.stringify( { status : 400,
        response : "Credentials used"
      }))
      return
    }

    console.log(userCheck.length)
    console.log(emailCheck.length)

    let newUser = new User({ name : formDataParams["name"], email : formDataParams["email"], phone : formDataParams["phone"], password : formDataParams["password"]})
    newUser.save( (err, not) => {
      if (err) {
        console.log(err)
        res.end(JSON.stringify( { status : 500,
          response : err
        }))               
      } else {
        res.end(JSON.stringify( { status : 200,
          response : "Account created"
        }))
      }
    })
  })    
})

app.post('/login', (req, res) => {
  let reqBody = ""
  req.on("data", (data) => {
    reqBody += data
  })

  req.on("end", async () => {
    req.body = reqBody

    let formDataParams = (new RequestBody(req)).formData

    console.log(formDataParams["name"])
    console.log(formDataParams["password"])

    await User.find({ name : formDataParams["name"], password : formDataParams["password"]}).lean().exec(function (err, users) {
      if (err === null && users.length) {
        console.log(users)
        let authJWT = JWTController.getTokenWithPayload({ name : formDataParams["name"]}, 60 * 60 * 10)

        console.log(authJWT)

        res.writeHead(302, {
          "Location" : "",
          "Set-Cookie" : "token=" + authJWT + "; Path=/"
        })

        res.end(JSON.stringify( { status : 200,
                                  response : "Logged in"
                                  }))
      } else {
        console.log(err)
        res.writeHead(302, {
          "Location" : "",
          "Set-Cookie" : ""
        })
        res.end(JSON.stringify( { status : 500,
                                  response : "Account doesn't exist"
                                }))
      }
    })
  })
})

app.put('/updateUser', (req, res) => {
  if (!JWTController.authTokenValid) {
    res.end(JSON.stringify( { status : 400,
      response : "User not authenticated"
    }))
    return
  }

  let userName = JWTController.getAuthToken(req)["name"]
  let reqBody = ""

  console.log(userName)
  req.on("data", (data) => {
    reqBody += data
  })

  req.on("end", async () => {
    req.body = reqBody

    let formDataParams = (new RequestBody(req)).formData

    console.log(formDataParams)

    let updatedUser = await User.findOneAndUpdate({ name : userName}, { phone : formDataParams["phone"], password : formDataParams["password"], email : formDataParams["email"]}, { new : true})
    
    res.end()
  })
})

app.get('/getUser', async (req, res) => {
  if (!JWTController.authTokenValid) {
    res.end(JSON.stringify( { status : 400,
      response : "User not authenticated"
    }))
    return
  }

  let userName = JWTController.getAuthToken(req)["name"]

  let user = (await User.find({ name : userName}).lean().exec())[0]  

  console.log(user)

  res.end(JSON.stringify( { status : 200,
    response : user
  }))
})


/////////////////////////// Appointment

app.get('/checkAppointment', async (req, res) => {
  if (!JWTController.authTokenValid) {
    res.end(JSON.stringify( { status : 400,
      response : "User not authenticated"
    }))
    return
  }
  
  let params = (new RequestBody(req)).qsParams

  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  var today = dd + '/' + mm + '/' + yyyy

  if (yyyy > params["date"].split('/')[2] || mm > params["date"].split('/')[1] || dd > params["date"].split('/')[0]) {
    res.end(JSON.stringify( { status : 400,
      response : "Incorrect Date"
    }))
    return
  }

  let userName = JWTController.getAuthToken(req)["name"]  
  console.log(params)

  let appointmentList = await Appointment.find({ date : params["date"]}).lean().exec()
  for (let i = 0; i < appointmentList.length - 1; i++) {
    for (let j = i + 1; j < appointmentList.length; j++) {
      [appointmentList[i], appointmentList[j]] = [appointmentList[j], appointmentList[i]]
    }
  }

  console.log(appointmentList)

  let timePeriod = []

  let startHour = 0
  appointmentList.forEach(element => {
     let time = element["time"].split(':')
     let seconds = Number(time[0]) * 3600 + Number(time[1]) * 60

     if (startHour < seconds - element["duration"] * 60) {
       console.log(`${(startHour / 3600) | 0} : ${startHour % 3600 / 60 | 0} pana la ${(seconds - params["duration"] * 60) / 3600 | 0} : ${(seconds - params["duration"] * 60) % 3600 / 60 | 0}`)
       timePeriod.push({ start : startHour | 0, end : (seconds - params["duration"] * 60) | 0})
      }

     startHour = seconds + element["duration"] * 60
  })

  if (startHour + params["duration"] * 60 <= 24 * 3600) {
    timePeriod.push({ start : startHour | 0, end : 24 * 3600 | 0})
  }

  res.end(JSON.stringify( { 
    status : 200,
    response : timePeriod}
    ))
})

app.post('/new-trip', (req, res) => {
  if (!JWTController.authTokenValid) {
    res.end(JSON.stringify( { status : 400,
      response : "User not authenticated"
    }))
    return
  }

  let userName = JWTController.getAuthToken(req)["name"]

  let reqBody = ""
  req.on("data", (data) => {
    reqBody += data
  })

  req.on("end", async () => {
    req.body = reqBody

    let formDataParams = (new RequestBody(req)).formData

    let appCar = await Car.find({ name : formDataParams["carName"], type : formDataParams["carType"]}).lean().exec()

    if (!appCar.length) {
      res.end("Car is not supported")
      return
    }

    let newAppointment = new Appointment({ date : formDataParams["date"], time : formDataParams["time"], duration : formDataParams["duration"], 
                                           price : formDataParams["price"], username : userName, levelOfDirt : formDataParams["levelOfDirt"],
                                           washType : formDataParams["washType"], carName : formDataParams["carName"], carType : formDataParams["carType"]})
    newAppointment.save(function (err, not) {
      console.log(err)
      return
    })
  })

  res.end()
})

app.get('/getAppointmentsForUser', async (req, res) => {
  if (!JWTController.authTokenValid) {
    res.end(JSON.stringify( { status : 400,
      response : "User not authenticated"
    }))
    return
  }

  let userName = JWTController.getAuthToken(req)["name"]

  let appointmentList = await Appointment.find({ username : userName}).lean().exec()  

  res.end(JSON.stringify(appointmentList))
})

app.put('/delayAppointment', async (req, res) => {
  if (!JWTController.authTokenValid) {
    res.send(JSON.stringify( { status : 400,
      response : "User not authenticated"
    }))
    return
  }

  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  var today = dd + '/' + mm + '/' + yyyy

  let userName = JWTController.getAuthToken(req)["name"]
  let params = (new RequestBody(req)).qsParams

  let appointmentList = await Appointment.find({ date : today }).lean().exec()

  appointmentList.forEach(appointment => {
    let delayTime = Number(appointment["time"].split(':')[0]) * 3600 + Number(appointment["time"].split(':')[1]) * 60
    console.log(appointment["time"])
    delayTime += params["delayDuration"] * 60
    console.log("////////////////////////")
    let newTime = (delayTime / 3600 | 0).toString() + ":" + (delayTime % 3600 / 60 | 0).toString()
    console.log(newTime)
    Appointment.updateOne({ _id : appointment["_id"] }, { time : newTime}, function (err, not) {
      if (err) {
        console.log(err)
        return
      }
    })
  })
  res.end()
})
/////////////////////// Cars

app.post('/addCarsFromJson', (req, res) => {
    let jsonData = JSON.parse(fs.readFileSync('utils/cars.json'))
    jsonData["results"].forEach(async element => {
      let carCheck = (await Car.find({ name : element["Make"] + " " + element["Model"], type : element["Category"]}).lean().exec())[0]
      if (element["Make"] === "Lada") console.log(carCheck)
      if (!carCheck.length) {
        if (element["Make"] === "Lada") console.log("DA")
        let newCar = new Car({ name : element["Make"] + " " + element["Model"], type : element["Category"] })
        newCar.save(function (err, not) {
          res.end(err)
          return
        })
      }
    })

    res.end()
})

app.get('/getCar', async (req, res) => {
  let params = (new RequestBody(req)).qsParams
  let car = (await Car.find({ name : params["name"] }).lean().exec())[0]

  res.end(JSON.stringify(car))
})

app.listen(httpPort, function () {
  console.log(`Listening on port ${httpPort}!`)
})