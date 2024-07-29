const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');
const passport = require('./config/passportConfig');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const ensureAuthenticated = require('./middlewares/authMiddleware');

dotenv.config();
dotenv.config({ path: ".env.local", override: true });

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

app.use(session({
  secret: process.env.SECRET || 'your_secret_key',
  resave: false,
  saveUninitialized: false
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');

const authRoutes = require('./routes/authRoutes');
const promotionRoutes = require('./routes/promotionRoutes');
const courseRoutes = require('./routes/courseRoutes');
const schoolRoutes = require('./routes/schoolRoutes');
const studentRoutes = require('./routes/studentRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const classeRoutes = require('./routes/classeRoutes');
const subjectRoutes = require('./routes/subjectRoutes');
const userRoutes = require('./routes/userRoutes');
const homeRoutes = require('./routes/homeRoutes');
const professorRoutes = require('./routes/professorRoutes');
const profileRoutes = require('./routes/profileRoutes');

app.use('/home', homeRoutes);
app.use('/auth', authRoutes);
app.use('/promotions', promotionRoutes);
app.use('/courses', courseRoutes);
app.use('/schools', schoolRoutes);
app.use('/students', studentRoutes);
app.use('/attendances', attendanceRoutes);
app.use('/classes', classeRoutes);
app.use('/subjects', subjectRoutes);
app.use('/users', userRoutes);
app.use('/professors', professorRoutes);
app.use('/profile', profileRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
