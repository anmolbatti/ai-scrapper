const Users = require("../models/users");
const jwt = require('jsonwebtoken');
const generateToken = (payload) => {
    const secretKey = process.env.JWT_KEY;
    const options = {
      expiresIn: '1h',
    };
  
    const token = jwt.sign(payload, secretKey, options);
    return token;
};

const createUser = async (req, res) => {
    const { email, password } = req.body;
  
    if((!email || email === "") && (!password || password === "")){
        return res.status(400).json({status: false, message: "email or password not provided!"});
    }

    try {

        const checkUser = await Users.findOne({"email": email});

        if(checkUser){
            return res.status(409).json({status: false, message: `User already exists with mail ${email}`});
        }

        const newUser = await new Users({
            email,
            password,
            role: "admin"
        }).save();

        if(newUser){
            return res.status(200).json({status: true, data: {email, password}, message: "user created successfully!"});
        }else{
            return res.status(500).json({status: false, data: newUser, message: "Something went wrong. Please try again..."});
        }
    } catch (err) {
        console.error(`Error creating the user: ${err}`);

        if(err.code === 11000){
            return res.status(400).json({status: false, message: "User already exists!"});    
        }
        
        return res.status(500).json({status: false, message: "Internal Server Error. Please try again later...", error: err});
    }
};

const adminLogin = async (req, res) => {
    const { email, password } = req.body;
  
    if((!email || email === "") && (!password || password === "")){
        return res.status(400).json({status: false, message: "email or password not provided!"});
    }

    try {
        const user = await Users.findOne({email});

        if (!user) {
            return res.status(400).json({status: false, message: "User not found!"});;
        }

        user.comparePassword(password, function(err, isMatch) {
            if(err){
                return res.status(401).json({status: false, message: "Password incorrect"});
            }
            
            if(isMatch){
                const token = generateToken({email, role: user.role, id: user._id});
                
                return res.status(200).json({status: true, message: "User logged in successfully!", token});
            }else{
                return res.status(401).json({status: false, message: "Password incorrect"});
            }
        });

    } catch (err) {
        console.error(`Error creating the user: ${err}`);

        return res.status(500).json({status: false, message: "Internal Server Error. Please try again later..."});
    }
};


const getCurrentUser = async (req, res) => {
    const user = req.user;

    try {

        if (!user) {
            return res.status(401).json({status: false, message: "User not found!"});;
        }

        return res.status(200).json({status: true, user});
    } catch (err) {
        return res.status(500).json({status: false, message: "Internal Server Error. Please try again later..."});
    }
};

module.exports = {createUser, adminLogin, getCurrentUser};