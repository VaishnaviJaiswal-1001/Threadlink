const express = require('express');
const { z } = require('zod');
const { getTasks, getTask, createTask, updateTask, deleteTask, generateTasks } = require('../controllers/taskController');
const { verifyJWT } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  priority: z.enum(['Urgent', 'High', 'Normal', 'Low']).optional(),
  deadline: z.string().optional(),
  source: z.enum(['Gmail', 'Calendar', 'Manual']).optional(),
  time: z.string().optional(),
  externalId: z.string().optional()
});

const updateTaskSchema = taskSchema.partial().extend({
  done: z.boolean().optional()
});

router.use(verifyJWT);

router.get('/', getTasks);
router.post('/', validateRequest(taskSchema), createTask);
router.post('/generate', generateTasks);
router.get('/:id', getTask);
router.put('/:id', validateRequest(updateTaskSchema), updateTask);
router.delete('/:id', deleteTask);

module.exports = router;
