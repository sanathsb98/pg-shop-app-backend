const db = require('../db');
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')
const nodemailer = require('nodemailer')

dotenv.config();


const getAllUsers = async () => {
    try {
        const users = await db.pool.query('SELECT * FROM users');
        return users.rows;
    } catch (error) {
        console.error('Error getting all users data', error);
        throw error;
    }
}

const createUser = async (name, email, password) => {
    try {
        // Check if the email already exists
        const emailExists = await db.pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (emailExists.rows.length > 0) {
            throw new Error('User with this email ID already exists');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const token = jwt.sign(
            {
                email: email,
            },
            process.env.JWT_SECRET,
            { expiresIn: '6h' }
        )

        // Insert the new user into the database
        const newUser = await db.pool.query(
            'INSERT INTO users (name, email, password, userToken) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, email, hashedPassword, token]
        );

        return newUser.rows[0];
    } catch (error) {
        console.error('Error in creating user', error);
        throw error;
    }
}

const userLogin = async (email, password) => {
    try {
        const loggedDetails = await db.pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (loggedDetails.rows.length > 0) {
            const user = loggedDetails.rows[0];

            const verifiedPassword = await bcrypt.compare(password, user.password);

            if (verifiedPassword) {
                const newToken = jwt.sign(
                    { email: user.email },
                    process.env.JWT_SECRET, // Ensure the secret key is correctly referenced
                    { expiresIn: '6h' }
                );

                const loggedUserDetails = await db.pool.query(
                    'UPDATE users SET usertoken = $1 WHERE email = $2 RETURNING *',
                    [newToken, email]
                );

                return loggedUserDetails.rows[0];
            } else {
                throw new Error('Incorrect Password');
            }
        } else {
            throw new Error('Invalid Email');
        }
    } catch (error) {
        console.error('Error occurred in login', error);
        throw error;
    }
};

const resetPassword = async (email, password) => {
    try {
        const resetData = await db.pool.query('SELECT * FROM users WHERE email = $1', [email])
        const user = resetData.rows[0]

        if (resetData.rows.length > 0) {
            const token = jwt.sign(
                { email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '5m' }
            )
            db.pool.query('UPDATE users SET resettoken = $1 WHERE email = $2', [token, email])
            // send mail
            await sendResetEmail(email, token)
        } else {
            console.log('invalid mail address')
        }
    } catch (error) {
        console.log('error in resetting password', error)
        throw error;
    }
}

const sendResetEmail = async (email, token) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.APP_PASSWORD
        }
    })
    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Password Reset',
        text: `Click the link to reset your password:${process.env.HOST_ADD}/users/verifyResetToken?token=${token}`,
    }
    await transporter.sendMail(mailOptions)
}

const verifyResetToken = async (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const email = decoded.email;
        const result = await db.pool.query('SELECT * FROM users WHERE email = $1 AND resettoken = $2', [email, token])
        if (result.rows.length > 0) {
            return email;
        } else {
            throw new Error('Invalid Or Expired Reset Token')
        }
    } catch (error) {
        console.error('Error in verifying reset token');
        throw error;
    }
}

const updatePassword = async (token, newPassword) => {
    try {
        const email = await verifyResetToken(token);
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
       await db.pool.query('UPDATE users SET password = $1, resettoken = NULL WHERE email = $2', [hashedPassword, email])
       return {message : 'Password updated successfully'}
    } catch (error) {
        console.error('Error in updating password', error);
        throw error;
    }
}

module.exports = {
    getAllUsers,
    createUser,
    userLogin,
    resetPassword,
    verifyResetToken,
    updatePassword
};
