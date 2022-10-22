const router = require("express").Router();
const { User } = require("../models/user");
const passport = require("passport");
const joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const validate = (data) => {
  const schema = joi.object({
    email: joi.string().email().required().label("Email"),
    password: joi.string().required().label("Password"),
  });

  return schema.validate(data);
};

router.post("/", async (req, res) => {
  try {
    console.log(req.body);
    const { error } = validate(req.body);
    if (error) {
      return res.status(400).send({
        message: error.details[0].message,
      });
    }

    const user = await User.findOne({
      email: req.body.email,
    });

    if (!user) {
      return res.status(401).send({ message: "Invalid Email or Password" });
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!validPassword) {
      return res.status(401).send({
        message: "Invalid Email or Password",
      });
    }

    const token = user.generateAuthToken();

    res.status(200).send({
      data: {
        token: token,
        userInfo: {
          email: user.email,
          name: user.firstName + " " + user.secondName,
          picture: "",
        },
      },
      message: "Logged in successfully",
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
});

router.post("/verify", (req, res) => {
  //verify the JWT token generated for the user
  console.log(req.body);
  jwt.verify(
    req.body.token,
    process.env.JWTPRIVATEKEY,
    async (err, authorizedData) => {
      if (err) {
        //If error send Forbidden (403)
        console.log("ERROR: Could not connect to the protected route");
        console.log(err);
        res.status(403).send({
          message: err,
        });
      } else {
        //If token is successfully verified, we can send the autorized data

        const user = await User.findById(authorizedData._id);

        res.json({
          message: "Successful log in",
          _json: {
            name: user.firstName + " " + user.lastName,
            picture: "",
            email: user.email,
          },
        });
      }
    }
  );
});

router.get("/login/success", (req, res) => {
  if (req.user) {
    res.status(200).json({
      error: false,
      message: "Successfully Logged in",
      user: req.user,
    });
  } else {
    res.status(403).json({
      error: true,
      message: "Not Authorized",
    });
  }
});

router.get("/login/failed", (req, res) => {
  res.status(401).json({
    error: true,
    message: "Log in failure",
  });
});

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: process.env.CLIENT_URL,
    failureRedirect: "/login/failed",
  })
);

router.get("/google", passport.authenticate("google", ["profile", "email"]));

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect(process.env.CLIENT_URL);
});

module.exports = router;
