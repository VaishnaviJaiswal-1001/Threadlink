const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const Workflow = require('../models/Workflow');
const { ERROR_CODES } = require('../utils/constants');

const getWorkflows = asyncHandler(async (req, res) => {
  const workflows = await Workflow.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json(ApiResponse.success(workflows, 'Workflows fetched'));
});

const createWorkflow = asyncHandler(async (req, res) => {
  const { name, trigger, action, on } = req.body;
  const workflow = await Workflow.create({
    userId: req.user._id,
    name,
    trigger,
    action,
    on: on !== undefined ? on : true
  });
  res.status(201).json(ApiResponse.success(workflow, 'Workflow created'));
});

const updateWorkflow = asyncHandler(async (req, res) => {
  const workflow = await Workflow.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!workflow) {
    return res.status(404).json(ApiResponse.error(ERROR_CODES.NOT_FOUND, 'Workflow not found'));
  }
  res.json(ApiResponse.success(workflow, 'Workflow updated'));
});

const toggleWorkflow = asyncHandler(async (req, res) => {
  const workflow = await Workflow.findOne({ _id: req.params.id, userId: req.user._id });
  if (!workflow) {
    return res.status(404).json(ApiResponse.error(ERROR_CODES.NOT_FOUND, 'Workflow not found'));
  }
  workflow.on = !workflow.on;
  await workflow.save();
  res.json(ApiResponse.success(workflow, `Workflow toggled to ${workflow.on ? 'on' : 'off'}`));
});

const deleteWorkflow = asyncHandler(async (req, res) => {
  const workflow = await Workflow.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  if (!workflow) {
    return res.status(404).json(ApiResponse.error(ERROR_CODES.NOT_FOUND, 'Workflow not found'));
  }
  res.json(ApiResponse.success(null, 'Workflow deleted'));
});

module.exports = { getWorkflows, createWorkflow, updateWorkflow, toggleWorkflow, deleteWorkflow };
