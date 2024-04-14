import createError from 'http-errors';
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import indexRouter from './routes/index';
import usersRouter from './routes/users';

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'client')));
app.use(express.static(path.join(__dirname, '/client/Content/style.css')));
app.use(express.static(path.join(__dirname, '/client/Data/')));
app.use(express.static(path.join(__dirname, '/client/assets/images/')));
app.use(express.static(path.join(__dirname, '/client/Script/')));

app.use(express.static(path.join(__dirname, 'node_modules')));
app.use('/', indexRouter);
app.use('/users', usersRouter);


// catch 404 and forward to error handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(createError(404));
});

interface UserDoc extends Document {
  username: string;
  email: string;
  password: string;
}

const UserSchema = new Schema<UserDoc>({
  username: String,
  email: String,
  password: String
});

const User: Model<UserDoc> = mongoose.model('User', UserSchema);

// Middleware
app.use(express.json());
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true
}));

// Registration
app.post('/register', async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await User.create({ username, email, password: hashedPassword });
    res.status(201).send(user);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Login
app.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(401).send('Invalid username or password');
  }
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(401).send('Invalid username or password');
  }
  req.session.userId = user._id;
  res.send('Logged in successfully');
});

// Authentication middleware
const requireAuth = (req: Request, res: Response, next: Function) => {
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  next();
};

// Get all users
app.get('/users', requireAuth, async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).send('Error fetching users');
  }
});

// Get user by ID
app.get('/users/:id', requireAuth, async (req: Request, res: Response) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).send('Error fetching user');
  }
});

// Update user
app.put('/users/:id', requireAuth, async (req: Request, res: Response) => {
  const userId = req.params.id;
  const { username, email, password } = req.body;
  try {
    const user = await User.findByIdAndUpdate(userId, { username, email, password });
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.status(200).send('User updated successfully');
  } catch (err) {
    res.status(500).send('Error updating user');
  }
});

// Delete user
app.delete('/users/:id', requireAuth, async (req: Request, res: Response) => {
  const userId = req.params.id;
  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.status(200).send('User deleted successfully');
  } catch (err) {
    res.status(500).send('Error deleting user');
  }
});

// error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
