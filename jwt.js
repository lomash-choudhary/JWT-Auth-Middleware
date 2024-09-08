const express = require("express")
const app = express();
const port = 3000;
const jwt = require("jsonwebtoken")
const JWT_SECRET = "ILoveShreya"
app.use(express.json())

let users = []

app.post("/signup", function (req, res) {
  const username = req.body.username
  const password = req.body.password

  users.push({
    username: username,
    password: password
  })

  res.json({
    message: "You Signedup successfully"
  })
})

app.post("/signin", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  const user = users.find(u => u.username === username && u.password === password)

  if(user){
    const token = jwt.sign({
      username: user.username
    },JWT_SECRET)
    user.token = token
    res.json({
      token: token
    })
    console.log(users)
  }
  else{
    res.json({
      message: "invalid username and password"
    })
  }
})

app.get("/me", function (req, res) {
  const token = req.headers.token
  const userDeatils = jwt.verify(token, JWT_SECRET)

  const username = userDeatils.username
  const user = users.find(u => u.username === username)
  if(user){
    res.json({
      username: user.username
    })
  }
  else{
    res.json({
      message: "Unauthorized"
    })
  }
})

app.listen(port, () => {
  console.log("app is listening on port:", port)
})