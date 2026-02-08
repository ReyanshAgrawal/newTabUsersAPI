const express = require("express")
const bcrypt = require("bcrypt")
const mongoose = require("mongoose")
const User = require("./models/user.model.js")
const app = express()
require("dotenv").config

app.use(express.json())

app.get("/", (req, res) => {
    res.status(200).send("Welcome")
})
app.get("/api/users", async (req, res) => {
    if (req.query.name) {
        try {
            const user = await User.findOne({
                name: req.query.name
            })
            if (!user) {
                return res.status(404).json({
                    message: "User not found"
                })
            }
            res.status(200).json(user)
        } catch (err) {
            res.status(500).json({
                message: err.message
            })
        }
    } else {
        try {
            const users = await User.find({})
            res.status(200).json(users)
        } catch (err) {
            res.status(500).json({
                message: err.message
            })
        }
    }
})
app.post("/api/users", async (req, res) => {
    const user = await User.findOne({
        name: req.body.name
    })
    if (user) {
        return res.status(409).json({
            message: "This username is already taken, please choose another one"
        })
    } else {
        const hashedPass = await bcrypt.hash(req.body.pass, 10)
        const mongoDBpushBody = {
            name: req.body.name,
            pass: hashedPass,
            searchEngine: 1,
            shortcuts: []
        }
        try {
            const user = await User.create(mongoDBpushBody)
            res.status(201).send(user)
        } catch (err) {
            res.status(500).json({
                message: err.message
            })
        }
    }
})
app.post("/api/users/login", async (req, res) => {
    const user = await User.findOne({
        name: req.body.name
    })
    if (user) {
        if (await bcrypt.compare(req.body.pass, user.pass)) {
            res.status(200).json({
                message: `Login into ${user.name} was successful!`
            })
        } else {
            res.status(401).json({
                message: `Unauthorized`
            })
        }
    } else {
        return res.status(404).json({
            message: "User not found"
        })
    }
})
app.put("/api/users", async (req, res) => {
    try {
        const user = await User.findOne({
            name: req.body.name
        })
        if (!user) { 
            return res.status(404).json({
                message: "User not found"
            })
        }
        const id = user.id
        if (await bcrypt.compare(req.body.pass, user.pass)) {
            delete req.body.name
            delete req.body.pass
            if (req.body.passw) {
                req.body.pass = await bcrypt.hash(req.body.passw, 10)
                if (req.body.namew) {
                    const testUser = await User.findOne({
                        name: req.body.namew
                    })
                    if (testUser) {
                        return res.status(409).json({
                            message: "That username is already taken, please choose another one"
                        })
                    }
                    req.body.name = req.body.namew
                }
                const user = await User.findByIdAndUpdate(id, req.body)
                const updatedUser = await User.findById(id)
                res.status(200).json(updatedUser)
            } else {
                if (req.body.namew) {
                    const testUser = await User.findOne({
                        name: req.body.namew
                    })
                    if (testUser) {
                        return res.status(409).json({
                            message: "That username is already taken, please choose another one"
                        })
                    }
                    req.body.name = req.body.namew
                }
                const user = await User.findByIdAndUpdate(id, req.body)
                const updatedUser = await User.findById(id)
                res.status(200).json(updatedUser)
            }
        } else {
            res.status(401).json({
                message: `Unauthorized`
            })
        }   
    } catch (err) {
            res.status(500).json({
                message: err.message
            })
        }
})
app.delete("/api/users", async (req, res) => {
    try {
        const user = await User.findOne({
            name: req.body.name
        })
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }
        const id = user.id
        let userConf;
        if (await bcrypt.compare(req.body.pass, user.pass)) {
            userConf = await User.findByIdAndDelete(id)
        } else {
            return res.status(401).json({
                message: `Unauthorized`
            })
        }
        res.status(200).json(userConf)
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
})

mongoose.connect(`mongodb+srv://Reyansh:NEWPASSneverCatch@usersdb.edwuhvj.mongodb.net/UsersDB?appName=UsersDB`)
    .then(() => {
        console.log("Connected to the database!")
        const port = process.env.PORT || 1000
        app.listen(port, () => console.log(`Listening on port ${port}`))
    })
    .catch(() => {
        console.log("Couldn't connect to the database")
    })
