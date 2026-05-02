const express = require('express');
const { z } = require('zod');
const { getWorkflows, createWorkflow, updateWorkflow, toggleWorkflow, deleteWorkflow } = require('../controllers/workflowController');
const { verifyJWT } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

const workflowSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  trigger: z.object({
    app: z.enum(['gmail', 'gcal']),
    condition: z.string().optional()
  }),
  action: z.object({
    type: z.enum(['create_task', 'summarize', 'notify']),
    priority: z.enum(['Urgent', 'High', 'Normal', 'Low']).optional()
  }),
  on: z.boolean().optional()
});

const updateWorkflowSchema = workflowSchema.partial();

router.use(verifyJWT);

router.get('/', getWorkflows);
router.post('/', validateRequest(workflowSchema), createWorkflow);
router.put('/:id', validateRequest(updateWorkflowSchema), updateWorkflow);
router.patch('/:id/toggle', toggleWorkflow);
router.delete('/:id', deleteWorkflow);

module.exports = router;
