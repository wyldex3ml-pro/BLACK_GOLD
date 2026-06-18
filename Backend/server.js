const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.post('/register', (req, res) => {
  const { firstName, lastName, email, phone, department, jobTitle, joinDate } = req.body;

  if (!firstName || !lastName || !email || !phone || !department || !jobTitle || !joinDate) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const sql = `
    INSERT INTO employees (first_name, last_name, email, phone, department, job_title, join_date)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [firstName, lastName, email, phone, department, jobTitle, joinDate];

  db.query(sql, values, (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ message: 'This email is already registered.' });
      }
      return res.status(500).json({ message: 'Database error. Try again.' });
    }
    res.status(200).json({ message: 'Employee registered successfully!', id: result.insertId });
  });
});

app.listen(PORT, () => {
  console.log('BLACK_GOLD server running on http://localhost:' + PORT);
});