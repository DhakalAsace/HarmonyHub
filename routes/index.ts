import { Request, Response, NextFunction, Router } from 'express';
const router = Router();

/* GET home page. */
router.get('/', function(req: Request, res: Response, next: NextFunction) {
  res.render('index', { title: 'Home',page: 'Home', displayName:'' });
});

/* GET home page. */
router.get('/portfolio', function(req: Request, res: Response, next: NextFunction) {
  res.render('index', { title: 'Portfolio',page: 'portfolio', displayName:'' });
});
/* GET home page. */
router.get('/services', function(req: Request, res: Response, next: NextFunction) {
  res.render('index', { title: 'services',page: 'services', displayName:'' });
});

router.get('/team', function(req: Request, res: Response, next: NextFunction) {
  res.render('index', { title: 'team',page: 'team', displayName:'' });
});

router.get('/blog', function(req: Request, res: Response, next: NextFunction) {
  res.render('index', { title: 'blog',page: 'blog', displayName:'' });
});

router.get('/Careers', function(req: Request, res: Response, next: NextFunction) {
  res.render('index', { title: 'Careers',page: 'Careers', displayName:'' });
});

router.get('/Events', function(req: Request, res: Response, next: NextFunction) {
  res.render('index', { title: 'Events',page: 'Events', displayName:'' });
});

router.get('/EventsList', function(req: Request, res: Response, next: NextFunction) {
  res.render('index', { title: 'EventList',page: 'EventList', displayName:'' });
});

router.get('/feedback', function(req: Request, res: Response, next: NextFunction) {
  res.render('index', { title: 'feedback',page: 'feedback', displayName:'' });
});

router.get('/feedbacklist', function(req: Request, res: Response, next: NextFunction) {
  res.render('index', { title: 'feedbacklist',page: 'feedbacklist', displayName:'' });
});

router.get('/EventPlanning', function(req: Request, res: Response, next: NextFunction) {
  res.render('index', { title: 'EventPlanning',page: 'EventPlanning', displayName:'' });
});

router.get('/Gallery', function(req: Request, res: Response, next: NextFunction) {
  res.render('index', { title: 'Gallery',page: 'Gallery', displayName:'' });
});

router.get('/Humour', function(req: Request, res: Response, next: NextFunction) {
  res.render('index', { title: 'Humour',page: 'Humour', displayName:'' });
});


router.get('/Statistics', function(req: Request, res: Response, next: NextFunction) {
  res.render('index', { title: 'Statistics',page: 'Statistics', displayName:'' });
});

router.get('/login', function(req: Request, res: Response, next: NextFunction) {
  res.render('index', { title: 'login',page: 'login', displayName:'' });
});

router.get('/register', function(req: Request, res: Response, next: NextFunction) {
  res.render('index', { title: 'register',page: 'register', displayName:'' });
});

// Create an event
router.post('/events', async (req: Request, res: Response) => {
  try {
    const { name, description, date } = req.body;
    const event = await Event.create({ name, description, date });
    res.status(201).json(event);
  } catch (error) {
    // @ts-ignore
    res.status(400).json({ message: error.message });
  }
});

// Get all events
router.get('/events', async (req: Request, res: Response) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    // @ts-ignore
    res.status(500).json({ message: error.message });
  }
});

// Get a single event
// @ts-ignore
router.get('/events/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    // @ts-ignore
    res.status(500).json({ message: error.message });
  }
});

// Update an event
// @ts-ignore
router.put('/events/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const event = await Event.findByIdAndUpdate(id, req.body, { new: true });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    // @ts-ignore
    res.status(500).json({ message: error.message });
  }
});

// Delete an event
// @ts-ignore
router.delete('/events/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const event = await Event.findByIdAndDelete(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    // @ts-ignore
    res.status(500).json({ message: error.message });
  }
});

export default router;
