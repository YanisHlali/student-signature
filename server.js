const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');
const passport = require('./config/passportConfig');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const ensureAuthenticated = require('./middlewares/authMiddleware');
const roleMiddleware = require('./middlewares/roleMiddleware');

dotenv.config();
dotenv.config({ path: ".env.local", override: true });

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const authRoutes = require('./routes/authRoutes');
const promotionRoutes = require('./routes/promotionRoutes');
const courseRoutes = require('./routes/courseRoutes');
const schoolRoutes = require('./routes/schoolRoutes');
const studentRoutes = require('./routes/studentRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const classeRoutes = require('./routes/classeRoutes');
const subjectRoutes = require('./routes/subjectRoutes');
const userRoutes = require('./routes/userRoutes');
const professorRoutes = require('./routes/professorRoutes');
const profileRoutes = require('./routes/profileRoutes');

app.use('/auth', authRoutes);
app.use('/promotions', ensureAuthenticated, promotionRoutes);
app.use('/courses', ensureAuthenticated, roleMiddleware(['ROLE_ADMIN', 'ROLE_PROF']), courseRoutes);
app.use('/schools', ensureAuthenticated, roleMiddleware(['ROLE_ADMIN', 'ROLE_PROF']), schoolRoutes);
app.use('/students', ensureAuthenticated, roleMiddleware(['ROLE_ADMIN', 'ROLE_PROF']), studentRoutes);
app.use('/attendances', ensureAuthenticated, attendanceRoutes);
app.use('/classes', ensureAuthenticated, roleMiddleware(['ROLE_ADMIN', 'ROLE_PROF']), classeRoutes);
app.use('/subjects', ensureAuthenticated, roleMiddleware(['ROLE_ADMIN', 'ROLE_PROF']), subjectRoutes);
app.use('/users', ensureAuthenticated, userRoutes);
app.use('/professors', ensureAuthenticated, roleMiddleware(['ROLE_ADMIN']), professorRoutes);
app.use('/profile', ensureAuthenticated, profileRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
