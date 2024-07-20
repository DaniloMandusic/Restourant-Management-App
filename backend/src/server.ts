import express from 'express';
import connectToDatabase from './db';
import fs from 'fs/promises';
import { Request, Response } from 'express';
import UserModel from './models/user';
import { Binary } from 'mongodb';
import RestourantModel from './models/restourant';
import ReservationModel from './models/reservation';
import RestourantWaiterModel from './models/restourantWaiter';
import DishModel from './models/dish';
import OrderModel from './models/order';


const app = express();

app.use(express.json());

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  //res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.get('/', (req, res) => res.send('Hello World!'));
app.listen(3000, () => console.log(`Express server running on port 3000`));

const crypto = require('crypto');

// Your secret encryption key (keep this secure)
const secretKey = 'your-secret-key';

// Function to encrypt a password
function encryptPassword(password: any) {
  const cipher = crypto.createCipher('aes-256-cbc', secretKey);
  let encryptedPassword = cipher.update(password, 'utf-8', 'hex');
  encryptedPassword += cipher.final('hex');
  return encryptedPassword;
}

// Function to decrypt a password
function decryptPassword(encryptedPassword: any) {
  const decipher = crypto.createDecipher('aes-256-cbc', secretKey);
  let decryptedPassword = decipher.update(encryptedPassword, 'hex', 'utf-8');
  decryptedPassword += decipher.final('utf-8');
  return decryptedPassword;
}



app.post('/users/addUser', upload.single('file') , async (req, res) => {
    try {
      // Connect to the database
      console.log("post addUser")
      await connectToDatabase();
  
      //moras npm i @types/multer --save-dev
      //npm i multer
      let file = null
      if(req.file){
        file = req.file.buffer;
      }
  
      //console.log(file)
      const username = req.body.username;
      const password = req.body.password;
      const securityQuestion = req.body.securityQuestion;
      const securityAnswer = req.body.securityAnswer;
      const name = req.body.name;
      const surname = req.body.surname;
      const gender = req.body.gender;
      const address = req.body.address;
      const phoneNumber = req.body.phoneNumber;
      const email = req.body.email;
      const profileType = req.body.profileType;
      const profileStatus = req.body.profileStatus;
      const cardNumber = req.body.cardNumber;
      
  
      //console.log("post parameters: " + username+"", password+"")

      const user = new UserModel({
          username,
          password,
          profilePicture: file,
          securityQuestion,
          securityAnswer,
          name,
          surname,
          gender,
          address,
          phoneNumber,
          email,
          profileType,
          profileStatus,
          cardNumber
      })
  
      user.password = encryptPassword(user.password)
  
      //just for picture
      let u = await UserModel.findOne({ username: "ana" });
  
      if(file){
        user.profilePicture = file
      } else {
        user.profilePicture = u?.profilePicture
        //user.profilePicture = ""
      }

      //for encrypted password
      u = await UserModel.findOne({ username: username });
  
      if(u){
        console.log("changing user")
  
        await UserModel.updateOne({ username: username}, {$set:{
          username: user.username,
          password: user.password,
          profilePicture: user.profilePicture,
          securityQuestion: user.securityQuestion,
          securityAnswer: user.securityAnswer,
          name: user.name,
          surname: user.surname,
          gender: user.gender,
          address: user.address,
          phoneNumber: user.phoneNumber,
          email: user.email,
          profileType: user.profileType,
          profileStatus: user.profileStatus,
          cardNumber: user.cardNumber
        }})
        
        res.status(201).send('User changed successfully');
        return
      }
  
      await user.save();
  
      res.status(201).send('User created successfully');
      
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.post('/users/checkUsername', upload.single('file') , async (req, res) => {
    try {
      // Connect to the database
      console.log("post checkUsername")
      await connectToDatabase();
  
      const username = req.body.username;   
  
      let u = await UserModel.findOne({ username: username });
  
      if(u){
        res.json({status: "taken"})
        
        //res.status(201).send('User changed successfully');
        return
      } else{
        res.json({status: "free"})
        return
      }
      
    } catch (error) {
      console.error('Error checking username:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.post('/users/login', upload.single('file') , async (req, res) => {
    try {
      // Connect to the database
      console.log("post login")
      await connectToDatabase()
  
      const username = req.body.username;
      const password = encryptPassword(req.body.password)
  
      let u = await UserModel.findOne({ username: username, password: password });
  
      res.json(u)
      
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.post('/users/changePassword', upload.single('file') , async (req, res) => {
    try {
      // Connect to the database
      console.log("post changePassword")
      await connectToDatabase()
  
      const username = req.body.username;
      const password = encryptPassword(req.body.oldPassword)
      const newPassword = encryptPassword(req.body.newPassword)
  
      let u = await UserModel.findOne({ username: username, password: password });
  
      if(u){
        await UserModel.updateOne({ username: username}, {$set:{
          password: newPassword,
        }})
      }

      res.json(u)
      
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.post('/users/changeUser', upload.single('file') , async (req, res) => {
    try {
      // Connect to the database
      console.log("post changeUser")
      await connectToDatabase()
  
      const username = req.body.username;
      const password = encryptPassword(req.body.password)
      const securityQuestion = req.body.securityQuestion
      const securityAnswer = req.body.securityAnswer
      const name = req.body.name
      const surname = req.body.surname
      const gender = req.body.gender
      const address = req.body.address
      const phoneNumber = req.body.phoneNumber
      const email = req.body.email
      const profileType = req.body.profileType
      const restourant = req.body.restourant

  
      let u = await UserModel.findOne({ username: username, password: password });
  
      if(u){
        await UserModel.updateOne({ username: username}, {$set:{
          password: password, username: username, securityQuestion: securityQuestion,
          securityAnswer: securityAnswer,
          name: name,
          surname: surname,
          gender: gender,
          address: address,
          phoneNumber: phoneNumber,
          email: email,
          profileType: profileType,
          restourant: restourant
        }})
      }

      res.json({status: "successfull"})
      
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.post('/restourants/changeRestourant', upload.single('file') , async (req, res) => {
    try {
      // Connect to the database
      console.log("post changeRestourant")
      await connectToDatabase()
  
      const name = req.body.name;
      const type = req.body.type
      const address = req.body.address

  
      let r = await RestourantModel.findOne({ name: name });
  
      if(r){
        await RestourantModel.updateOne({ name: name}, {$set:{
          name: name, type: type, address: address,
        }})
      }

      res.json({status: "successfull"})
      
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.get('/users', async (req, res) => {
    try {
      console.log("get users")
      await connectToDatabase();

      let allUsers = await UserModel.find({});
  
      for(let user of allUsers){
        user.profilePictureUrl = user.profilePicture?.toString('base64')
  
        user.password = decryptPassword(user.password)
      }
  
      res.json(allUsers);
    } catch (error) {
      console.error('Error listing users:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.get('/users/guests', async (req, res) => {
    try {
      console.log("get guests")
      await connectToDatabase();

      let allUsers = await UserModel.find({profileType: "guest"});
  
      for(let user of allUsers){
        user.profilePictureUrl = user.profilePicture?.toString('base64')
  
        user.password = decryptPassword(user.password)
      }
  
      res.json(allUsers);
    } catch (error) {
      console.error('Error listing users:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.get('/users/waiters', async (req, res) => {
    try {
      console.log("get waiters")
      await connectToDatabase();

      let allUsers = await UserModel.find({profileType: "waiter"});
  
      for(let user of allUsers){
        user.profilePictureUrl = user.profilePicture?.toString('base64')
  
        user.password = decryptPassword(user.password)
      }
  
      res.json(allUsers);
    } catch (error) {
      console.error('Error listing users:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.post('/users/userByUsername',upload.single('file'), async (req, res) => {
    try {
      console.log("post userByUsername")
      await connectToDatabase();

      let username = req.body.username
      //console.log(username)

      let u = await UserModel.find({username: username});

      let user = u[0]
      user.profilePictureUrl = user.profilePicture?.toString('base64')
      user.password = decryptPassword(user.password)
  
      res.json({"user": user});
    } catch (error) {
      console.error('Error getting user by username:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.post('/restourants/restourantByName',upload.single('file'), async (req, res) => {
    try {
      console.log("post restourantByName")
      await connectToDatabase();

      let name = req.body.name
      //console.log(username)

      let r = await RestourantModel.find({name: name});

      let restourant = r[0]
  
      res.json({"restourant": restourant});
    } catch (error) {
      console.error('Error getting user by username:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.get('/restourants', async (req, res) => {
    try {
      console.log("get restourants")
      await connectToDatabase();
      //console.log(username)

      let r = await RestourantModel.find();
  
      res.json(r);
    } catch (error) {
      console.error('Error getting user by username:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.post('/restourants/menuListByName',upload.single('file'), async (req, res) => {
    try {
      console.log("post menuListByName")
      await connectToDatabase();

      let name = req.body.name
      //console.log(username)

      let dishes = await DishModel.find({restourant: name});
  
      res.json(dishes);
    } catch (error) {
      console.error('Error getting user by username:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.post('/guests/currentReservationsList',upload.single('file'), async (req, res) => {
    try {
      console.log("post currentReservationsList")
      await connectToDatabase();

      let username = req.body.username
      //console.log(username)

      let reservations = await ReservationModel.find({user: username});
  
      let currentReservations = []

      let currentDate = new Date()

      for(let reservation of reservations){
        let combinedString = `${reservation.date}T${reservation.time}:00`
        let reservationDate = new Date(combinedString)
        if(currentDate < reservationDate){
          currentReservations.push(reservation)
        }
      }

      for(let i = 0; i < currentReservations.length-1; i++){
        for(let j = 0; j < currentReservations.length-i-1; j++){
          let date1 = new Date(`${currentReservations[j].date}T${currentReservations[j].time}:00`)
          let date2 = new Date(`${currentReservations[j+1].date}T${currentReservations[j+1].time}:00`)

          if(date1 > date2){
            let tmp:any = currentReservations[j]
            currentReservations[j] = currentReservations[j+1]
            currentReservations[j+1] = tmp
          }

        }

      }

      res.json(currentReservations);
    } catch (error) {
      console.error('Error getting user by username:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.post('/guests/pastReservationsList',upload.single('file'), async (req, res) => {
    try {
      console.log("post pastReservationsList")
      await connectToDatabase();

      let username = req.body.username
      //console.log(username)

      let reservations = await ReservationModel.find({user: username});
  
      let currentReservations = []

      let currentDate = new Date()

      for(let reservation of reservations){
        let combinedString = `${reservation.date}T${reservation.time}:00`
        let reservationDate = new Date(combinedString)
        if(currentDate > reservationDate){
          currentReservations.push(reservation)
        }
      }

      for(let i = 0; i < currentReservations.length-1; i++){
        for(let j = 0; j < currentReservations.length-i-1; j++){
          let date1 = new Date(`${currentReservations[j].date}T${currentReservations[j].time}:00`)
          let date2 = new Date(`${currentReservations[j+1].date}T${currentReservations[j+1].time}:00`)

          if(date1 < date2){
            let tmp:any = currentReservations[j]
            currentReservations[j] = currentReservations[j+1]
            currentReservations[j+1] = tmp
          }

        }

      }

      res.json(currentReservations);
    } catch (error) {
      console.error('Error getting user by username:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.get('/dishesTmp', async (req, res) => {
    try {
      console.log("get dishesTmp")
      await connectToDatabase();

      //console.log(username)

      let dishes = await DishModel.find({});

      let u = await UserModel.findOne({ username: "ana" });
      let profilePicture = u?.profilePicture
      let profilePictureUrl = u?.profilePicture?.toString('base64')

      for(let dish of dishes){
        // dish.profilePicture = profilePicture
        // dish.profilePictureUrl = profilePictureUrl
        // dish.updateOne({profilePicture: profilePicture, profilePictureUrl: profilePictureUrl})
        // dish.save()

        let newDish = new DishModel({
          uniqueName:dish.uniqueName,
          restourant:dish.restourant,
          name:dish.name,
          price:dish.price,
          profilePicture:profilePicture,
          profilePictureUrl:profilePictureUrl
        })
  
        newDish.save()
        .then(() => {
          console.log('Reservation saved successfully');
        })
        .catch((err) => {
          console.error('Error saving reservation:', err);
        });
      }
  
      res.json(dishes);
    } catch (error) {
      console.error('Error getting user by username:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.post('/waiterGraph1',upload.single('file'), async (req, res) => {
    try {
      console.log("post waiterGraph1")
      await connectToDatabase();

      let waiter = req.body.waiter

      let reservations = await ReservationModel.find({waiter: waiter});

      let ret = [0,0,0,0,0,0,0]

      for(let reservation of reservations){
        if(reservation.date){
          let date = new Date(reservation.date)

          if(reservation.numOfPersons){
            ret[date.getDay()] += +reservation.numOfPersons
          }else{
            console.log("no reservation numOfPersons")
          }

        }else{
          console.log("no reservation date")
        }
        
      }

      res.json({ret: ret});
    } catch (error) {
      console.error('Error getting user by username:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.post('/waiterGraph2', upload.single('file'), async (req, res) => {
    try {
      console.log("post waiterGraph2")
      await connectToDatabase();

      let restourant = req.body.restourant

      let waiters = await UserModel.find({restourant: restourant});
      
      let waiterNames = []
      let waiterCustomers = []
      for(let waiter of waiters){
        waiterNames.push(waiter.username)
        waiterCustomers.push(0)
      }

      let reservations = await ReservationModel.find({restourant: restourant})

      for(let reservation of reservations){

        for(let i=0; i < waiterNames.length; i++){
          if(waiterNames[i] === reservation.waiter){
            if(reservation.numOfPersons){
              waiterCustomers[i] += +reservation.numOfPersons
            }
          }
        }
      }

      let ret = {
        waiterNames: waiterNames,
        waiterCustomers: waiterCustomers
      }

      res.json(ret);
    } catch (error) {
      console.error('Error getting user by username:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.post('/waiterGraph3', upload.single('file'), async (req, res) => {
    try {
      console.log("post waiterGraph1")
      await connectToDatabase();

      let restourant = req.body.restourant

      let reservations = await ReservationModel.find({restourant: restourant});

      let dates: string[] = []

      for(let reservation of reservations){
        if(reservation.date){
          if(!dates.includes(reservation.date)){
            dates.push(reservation.date)
          }
        }
      }

      let ret:number[] = [0,0,0,0,0,0,0]
      let count:number[] = [0,0,0,0,0,0,0]

      for(let date of dates){
        let day = new Date(date).getDay()

        let resCount = await ReservationModel.find({date: date})

        if(resCount.length > 0){
          ret[day] += resCount.length
          count[day] += 1
        }
      }

      for(let i=0; i<ret.length; i++){
        if(count[i]>0){
          ret[i] = ret[i] / count[i]
        }
      }

      res.json({ret: ret});
    } catch (error) {
      console.error('Error getting user by username:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.post('/reservations/addReservation',upload.single('file'), async (req, res) => {
    try {
      console.log("post addReservation")
      await connectToDatabase();

      let user = req.body.user
      let restourant = req.body.restourant
      let restourantAddress = req.body.restourantAddress
      let date = req.body.date
      let time = req.body.time
      let numOfPersons = req.body.numOfPersons
      let additionalInfo = req.body.additionalInfo
      let waiter = req.body.waiter
      let reservationStatus = req.body.status
      let declineComment = req.body.declineComment

      let currentDate = new Date()
      let combinedString = `${date}T${time}:00`
      let reservationDate = new Date(combinedString)
      if(currentDate > reservationDate){
        let status = "not created"
        res.json({"status": status});
        return
      }
      
      //implement num of reservations if needed
      let allReservations = await ReservationModel.find({restourant: restourant});

      for(let reservation of allReservations){

      }

      let reservation = new ReservationModel({
        user:user,
        restourant:restourant,
        date:date,
        time:time,
        numOfPersons:numOfPersons,
        additionalInfo:additionalInfo,
        restourantAddress: restourantAddress,
        waiter: waiter,
        declineComment: declineComment,
        status: reservationStatus
      })

      reservation.save()
      .then(() => {
        console.log('Reservation saved successfully');
      })
      .catch((err) => {
        console.error('Error saving reservation:', err);
      });
  
      let status = "created"
  
      res.json({"status": status});
    } catch (error) {
      console.error('Error getting user by username:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.post('/orders/addOrder',upload.single('file'), async (req, res) => {
    try {
      console.log("post addOrder")
      await connectToDatabase();

      let user = req.body.user
      let restourant = req.body.restourant
      let date = req.body.date
      let time = req.body.time
      let products = req.body.products
      let orderStatus = req.body.status
      let approximateTime = req.body.approximateTime

      console.log("date, time: ", date, time)

      let order = new OrderModel({
        user: user,
        restourant: restourant,
        date:date,
        time:time,
        products:products,
        status: orderStatus,
        approximateTime: approximateTime,
      })

      order.save()
      .then(() => {
        console.log('Order saved successfully');
      })
      .catch((err) => {
        console.error('Error saving reservation:', err);
      });

      let status = "created"  
      res.json({"status": status});
    } catch (error) {
      console.error('Error getting user by username:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.post('/orders/approvedOrders',upload.single('file'), async (req, res) => {
    try {
      console.log("post approvedOrders")
      await connectToDatabase();

      let user = req.body.user

      let orders = await OrderModel.find({user: user, status: "approved"})

      res.json(orders);
    } catch (error) {
      console.error('Error getting user by username:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.post('/orders/finishedOrders',upload.single('file'), async (req, res) => {
    try {
      console.log("post finishedOrders")
      await connectToDatabase();

      let user = req.body.user

      let orders = await OrderModel.find({user: user, status: "finished"})

      res.json(orders);
    } catch (error) {
      console.error('Error getting user by username:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.post('/orders/notApprovedOrdersByRestourant',upload.single('file'), async (req, res) => {
    try {
      console.log("post ordersByRestourant")
      await connectToDatabase();

      let restourant = req.body.restourant

      let orders = await OrderModel.find({restourant: restourant, status: "not approved"})

      res.json(orders);
    } catch (error) {
      console.error('Error getting user by username:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.post('/orders/confirmOrder',upload.single('file'), async (req, res) => {
    try {
      console.log("post confirmOrder")
      await connectToDatabase();

      let user = req.body.user
      let date = req.body.date
      let time = req.body.time
      let approximateTime = req.body.approximateTime

      let orders = await OrderModel.findOneAndUpdate({user: user, date: date, time: time}, {status: "confirmed", approximateTime: approximateTime})

      res.json({status: 'successfull'});
    } catch (error) {
      console.error('Error getting user by username:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.post('/orders/declineOrder',upload.single('file'), async (req, res) => {
    try {
      console.log("post declineOrder")
      await connectToDatabase();

      let user = req.body.user
      let date = req.body.date
      let time = req.body.time

      let orders = await OrderModel.findOneAndUpdate({user: user, date: date, time: time}, {status: "declined"})

      res.json({status: 'successfull'});
    } catch (error) {
      console.error('Error getting user by username:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.get('/restourants/count', async (req, res) => {
    try {
      console.log("get restourants count")
      await connectToDatabase();

      let allRestourants = await RestourantModel.find({});
  
      let count = allRestourants.length

      res.json({count: count})
    } catch (error) {
      console.error('Error listing users:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.get('/users/guestCount', async (req, res) => {
    try {
      console.log("get guest count")
      await connectToDatabase();

      let allUsers = await UserModel.find({});
  
      let count = 0

      for(let user of allUsers){
        if(user.profileType === "guest"){
          count++
        }
      }

      res.json({count: count})
    } catch (error) {
      console.error('Error listing users:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.get('/reservations/count24', async (req, res) => {
    try {
      console.log("get reservation24 count")
      await connectToDatabase();

      let allReservations = await ReservationModel.find({});
  
      let count = 0

      const now = new Date()
      const last24Hours = new Date(now.getTime() - (24 * 60 * 60 * 1000));

      for(let reservation of allReservations){
        let combinedString = `${reservation.date}T${reservation.time}:00`
        let reservationDate = new Date(combinedString)

        if(reservationDate > last24Hours && reservationDate <= now){
          count++
        }
      }

      res.json({count: count})
    } catch (error) {
      console.error('Error listing users:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.get('/reservations/count7', async (req, res) => {
    try {
      console.log("get reservation24 count")
      await connectToDatabase();

      let allReservations = await ReservationModel.find({});
  
      let count = 0

      const now = new Date()
      const last7days = new Date(now.getTime() - (7*24 * 60 * 60 * 1000));

      for(let reservation of allReservations){
        let combinedString = `${reservation.date}T${reservation.time}:00`
        let reservationDate = new Date(combinedString)

        if(reservationDate > last7days && reservationDate <= now){
          count++
        }
      }

      res.json({count: count})
    } catch (error) {
      console.error('Error listing users:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.get('/reservations/count30', async (req, res) => {
    try {
      console.log("get reservation24 count")
      await connectToDatabase();

      let allReservations = await ReservationModel.find({});
  
      let count = 0

      const now = new Date()
      const last30days = new Date(now.getTime() - (30*24 * 60 * 60 * 1000));

      for(let reservation of allReservations){
        let combinedString = `${reservation.date}T${reservation.time}:00`
        let reservationDate = new Date(combinedString)

        if(reservationDate > last30days && reservationDate <= now){
          count++
        }
      }

      res.json({count: count})
    } catch (error) {
      console.error('Error listing users:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.post('/reservations/pendingReservationsList',upload.single('file') , async (req, res) => {
    try {
      console.log("get pendingReservationsList")
      await connectToDatabase();

      let reservations = await ReservationModel.find({status: 'pending', restourant: req.body.restourant});

      for(let i = 0; i < reservations.length-1; i++){
        for(let j = 0; j < reservations.length-i-1; j++){
          let date1 = new Date(`${reservations[j].date}T${reservations[j].time}:00`)
          let date2 = new Date(`${reservations[j+1].date}T${reservations[j+1].time}:00`)

          if(date1 > date2){
            let tmp:any = reservations[j]
            reservations[j] = reservations[j+1]
            reservations[j+1] = tmp
          }

        }

      }

      res.json(reservations)
    } catch (error) {
      console.error('Error listing users:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.post('/reservations/acceptedReservationsList',upload.single('file') , async (req, res) => {
    try {
      console.log("get acceptedReservationsList")
      await connectToDatabase();

      let reservations = await ReservationModel.find({status: 'accepted', restourant: req.body.restourant, waiter: req.body.waiter});

      for(let reservation of reservations){
        const dateTimeString = `${reservation.date}T${reservation.time}:00`;
        const dateTime = new Date(dateTimeString);
        const now = new Date();
        const timeDiff = now.getTime() - dateTime.getTime();
        const hoursDiff = timeDiff / (1000 * 60 * 60);

        if(hoursDiff >= 3){
          reservation.status = 'finished'

          let restourant = await RestourantModel.findOne({name: reservation.restourant})

          if(restourant){
            let freeTables = restourant.freeTables ? restourant.freeTables.split(',').map(Number): []
            let takenTables = restourant.takenTables ? restourant.takenTables.split(',').map(Number): []

            if(reservation.table){
              const index = freeTables.indexOf(+reservation.table)

              if(index === -1){
                console.log("table not in freeTables")
              }
  
              takenTables.splice(index, 1)
              freeTables.push(req.body.table)
  
              restourant.freeTables = freeTables.join(',')
              restourant.takenTables = takenTables.join(',')
  
              await restourant.save()
            }
          }

          await reservation.save()

        }

      }

      res.json(reservations)
    } catch (error) {
      console.error('Error listing users:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.post('/reservations/acceptReservation',upload.single('file') , async (req, res) => {
    try {
      console.log("post acceptReservation")
      await connectToDatabase();

      let tmp = await ReservationModel.updateOne({user: req.body.user, restourant: req.body.restourant, date: req.body.date, time: req.body.time}, {status: req.body.status, waiter: req.body.waiter, table: req.body.table});

      let restourant = await RestourantModel.findOne({name: req.body.restourant})

      if(restourant){
        let freeTables = restourant.freeTables ? restourant.freeTables.split(',').map(Number): []
        let takenTables = restourant.takenTables ? restourant.takenTables.split(',').map(Number): []

        const index = freeTables.indexOf(req.body.table)

        if(index === -1){
          console.log("table not in freeTables")
        }

        freeTables.splice(index, 1)
        takenTables.push(req.body.table)

        restourant.freeTables = freeTables.join(',')
        restourant.takenTables = takenTables.join(',')

        await restourant.save()
      } else {
        console.log("no restourant found")
      }

      res.json({status: 'successfull'})
    } catch (error) {
      console.error('Error listing users:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.post('/reservations/declineReservation',upload.single('file') , async (req, res) => {
    try {
      console.log("get acceptReservation")
      await connectToDatabase();

      let status = await ReservationModel.updateOne({user: req.body.user, restourant: req.body.restourant, date: req.body.date, time: req.body.time}, {status: 'declined', declineComment: req.body.declineComment});



      res.json({status: 'successfull'})
    } catch (error) {
      console.error('Error listing users:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.post('/reservations/confirmArrival',upload.single('file') , async (req, res) => {
    try {
      console.log("get confirmArrival")
      await connectToDatabase();

      let status = await ReservationModel.updateOne({user: req.body.user, restourant: req.body.restourant, date: req.body.date, time: req.body.time}, {status: 'came'});

      res.json({status: 'successfull'})
    } catch (error) {
      console.error('Error listing users:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.post('/reservations/confirmNoArrival',upload.single('file') , async (req, res) => {
    try {
      console.log("post confirmNoArrival")
      await connectToDatabase();

      let status = await ReservationModel.updateOne({user: req.body.user, restourant: req.body.restourant, date: req.body.date, time: req.body.time}, {status: 'didnt came'});

      let restourant = await RestourantModel.findOne({name: req.body.restourant})

          if(restourant){
            let freeTables = restourant.freeTables ? restourant.freeTables.split(',').map(Number): []
            let takenTables = restourant.takenTables ? restourant.takenTables.split(',').map(Number): []

            console.log("free tables " + freeTables)
            console.log("taken tables" + takenTables)

            if(req.body.table){
              const index = freeTables.indexOf(+req.body.table)

              if(index === -1){
                console.log("table not in freeTables")
              }
  
              takenTables.splice(index, 1)
              freeTables.push(req.body.table)

              console.log("free tables " + freeTables)
              console.log("taken tables" + takenTables)
  
              restourant.freeTables = freeTables.join(',')
              restourant.takenTables = takenTables.join(',')
  
              await restourant.save()
            } else {
              console.log("no req.body.table")
            }
          } else{
            console.log("no restourant found")
          }

      res.json({status: 'successfull'})
    } catch (error) {
      console.error('Error listing users:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.get('/restourantWaiterList', async (req, res) => {
    try {
      console.log("get restourantWaiterList")
      await connectToDatabase();

      let allRestourants = await RestourantModel.find({});
      let allUsers = await UserModel.find({});
      let allWaiters = []

      for (let user of allUsers){
        if(user.profileType === "waiter"){
          allWaiters.push(user)
        }
      }

      let restourantWaiterList: any[] = []

      for(let restourant of allRestourants){
        for(let waiter of allWaiters){
          if(restourant.name === waiter.restourant){
            let restourantWaiter = new RestourantWaiterModel()
            restourantWaiter.waiterUsername = waiter.username
            restourantWaiter.waiterName = waiter.name
            restourantWaiter.waiterSurname = waiter.surname
            restourantWaiter.restourant = restourant.name
            restourantWaiter.restourantAddress = restourant.address
            restourantWaiter.restourantType = restourant.type

            restourantWaiterList.push(restourantWaiter)

            console.log(waiter.restourant)
            console.log(waiter.username)
          }

        }

      }

      res.json(restourantWaiterList)
    } catch (error) {
      console.error('Error listing users:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  