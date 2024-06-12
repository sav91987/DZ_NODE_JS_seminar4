const joi = require("joi");
const fs = require("fs");
const express = require("express");
const path = require("path");
const app = express();
const port = 3000;

const userSchema = joi.object({
    name: joi.string().min(1).required(),
    surname: joi.string().min(1).required(),
    age: joi.number().min(0).required(),
    city: joi.string(),
});

let uniqueId = 3;
const pathFile = path.join(__dirname, "users.json");

app.use(express.json());

app.get("/users", (req, res) => {
    const users = JSON.parse(fs.readFileSync(pathFile));

    res.send({ users });
});
app.get("/users/:id", (req, res) => {
    const users = JSON.parse(fs.readFileSync(pathFile));
    console.log(users);
    const user = users.find((item) => item.id === +req.params.id);
    if (user) {
        res.send({ user });
    } else {
        res.status(404).send({
            user: null,
            error: "пользователь не найден",
            status: "error",
        });
    }
});
app.put("/users/:id", (req, res) => {
    const result = userSchema.validate(req.body);
    if (result.error) {
        return res
            .status(404)
            .send({ error: result.error.details, status: "error" });
    }
    const users = JSON.parse(fs.readFileSync(pathFile));
    const user = users.find((item) => item.id === +req.params.id);
    if (user) {
        user.name = req.body.name;
        user.surname = req.body.surname;
        user.age = req.body.age;
        user.city = req.body.city;

        fs.writeFileSync(pathFile, JSON.stringify(users, null, 2));

        res.send({ user });
    } else {
        res.status(404).send({
            user: null,
            error: "пользователь не найден",
            status: "error",
        });
    }
});

app.post("/users/", (req, res) => {
    const result = userSchema.validate(req.body);
    if (result.error) {
        return res
            .status(404)
            .send({ error: result.error.details, status: "error" });
    }

    const users = JSON.parse(fs.readFileSync(pathFile));

    const user = {
        id: uniqueId++,
        name: req.body.name,
        surname: req.body.surname,
        age: req.body.age,
        city: req.body.city,
    };
    users.push(user);
    fs.writeFileSync(pathFile, JSON.stringify(users, null, 2));
    res.send({ user });
});

app.delete("/users/:id", (req, res) => {
    const users = JSON.parse(fs.readFileSync(pathFile));
    const userIndex = users.findIndex((item) => item.id === +req.params.id);
    if (userIndex > -1) {
        users.splice(userIndex, 1);
        fs.writeFileSync(pathFile, JSON.stringify(users, null, 2));
        res.send({ status: "ОК" });
    } else {
        res.status(404).send({
            user: null,
            error: "пользователь не найден",
            status: "error",
        });
    }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
