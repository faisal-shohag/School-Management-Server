import jwt from 'jsonwebtoken';
import "dotenv/config"
import { find_admin, find_admin_only_with_id } from "./Check.js"
import prisma from "../DB/db.config.js";

//create jwt token with maxAge
const maxAge = 1 * 24 * 60 * 60
const createToken = (id) => jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '1d'})


// const admin_signup = async (req, res) => {
//     try {
//         const res = await prisma.admin.create({
//             data: {
//                 email: 'admin@gmail.com',
//                 name: 'admin',
//                 password: 'admin'
//             }
//         })
        
//         console.log(res)
//         res.status(200).send({status: "OK", result: res})

//     } catch(err) {
//         res.status(400).send({status: 'error', err: err})
//     }

// }


// admin login controller
const admin_login = async (req, res) => {
    const { email, password } = req.body 
    try {
        const admin = await find_admin(email, password)
        const token = createToken(admin.id)
        res.cookie('jwt_admin', token, {httpOnly: true, maxAge: maxAge * 1000})
        res.status(200).json({...admin})
    } catch (error) {
        console.log(error)
        const errors = handleError(error)
        res.status(201).json({errors})
    }
}

//admin logout
const admin_logout = async(req, res) => {
    try{
        res.cookie('jwt_admin', '', {httpOnly: true, maxAge: 1})
        res.status(200).json({"message": "logged out!"})
    } catch(error) {
        const errors = handleError(error)
        res.status(400).json({errors})
    }
}


const check_admin_login = async (req, res) => {
    const token = req.cookies.jwt_admin 
    // console.log(token)
    if(token) {
        jwt.verify(token, process.env.JWT_SECRET, (err) => {
            if(err) res.status(201).json({loggedIn: false})
        })

        const decode = jwt.verify(token, process.env.JWT_SECRET)

        try {
            const admin = await find_admin_only_with_id(decode.id)
            res.status(200).json({...admin, loggedIn: true})
        } catch (error) {
            res.status(201).json({loggedIn: false})
        }

    } else {
        res.status(201).json({loggedIn: false})
    }
}



const handleError = (err) =>{
    let errors = {err: err.message}
    console.log(errors)
    return errors;
}

export { admin_login, admin_logout, check_admin_login }
