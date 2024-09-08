const express = require("express")
const app = express();
const port = 3000
const jwt = require("jsonwebtoken")
const JWT_SECRET = "ILoveShreya"

app.use(express.json())

let users = []

app.post("/signup", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  
  users.push({
    username: username,
    password: password
  })
  res.json({
    message: "You signed up successfully"
  })
})

app.post("/signin", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  const user = users.find(u => u.username === username && u.password === password)

  if(user){
    const token = jwt.sign({
      username: user.username
    }, JWT_SECRET)
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

function auth(req, res, next){
  const token = req.headers.token

  if(token){
    jwt.verify(token, JWT_SECRET, function (err, decode) {
      if(err){
        res.json({
          message: "Unauthorized"
        })
      }
      else{
        req.user = decode;
        next()
      }
    })
  }
  else{
    res.json({
      message: "unAuthorized"
    })
  }
}

app.get("/me", auth, function (req, res) {
  const user = req.user
  res.json({
    username: user.username
  })
})

app.listen(port, () => {
  console.log("app is listening on port:", port)
})