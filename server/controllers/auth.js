import jwt from 'jsonwebtoken';
import pool from '../db.js';

const salt = '_J9..9UEN';
const secret = 'c30b0911a4f8fc2bbaf37754287c39060508a935';

export const signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await pool.query(
            "SELECT * FROM person WHERE email = $1 AND password = crypt($2,$3)",
            [email, password, salt]
        );

        const user = result.rows[0];

        if (!user) return res.status(404).json({ message: 'User with that email and password does not exists.' });

        const token = jwt.sign({ email: user.email, id: user.id }, secret, { expiresIn: "1h" });

        res.status(200).json({ result: user, token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

export const signup = async (req, res) => {
    const { name, surname, email, password, confirmPassword } = req.body;

    try {
        if (password !== confirmPassword) return res.status(400).json({ message: 'Passwords don\'t match.' });

        var result = await pool.query(
            "SELECT * FROM person WHERE email = $1",
            [email]
        );

        const user = result.rows[0];

        if (user) return res.status(400).json({ message: 'User already exists.' });

        result = await pool.query(
            "INSERT INTO person VALUES (default, $1, $2, $3, $4) RETURNING *",
            [name, surname, email, password]
        );

        const newUser = result.rows[0];

        const token = jwt.sign({ email: newUser.email, id: newUser.id }, secret, { expiresIn: "1h" });

        res.status(200).json({ result: newUser, token });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}