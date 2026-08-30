const express = require('express');
const router = express.Router();
const {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaintStatus,
  deleteComplaint,
  getComplaintStats,
} = require('../controllers/complaintController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public route for landing page live counter stats
router.get('/public-stats', getComplaintStats);

// All routes below require authentication
router.use(protect);

// Admin analytics/stats route - MUST be declared before /:id route
router.get('/stats', authorize('admin'), getComplaintStats);

// Create new complaint (student) & list complaints (student gets own, admin gets all with filters)
router
  .route('/')
  .post(authorize('student'), createComplaint)
  .get(getComplaints);

// Single complaint operations
router
  .route('/:id')
  .get(getComplaintById)
  .delete(authorize('student'), deleteComplaint);

// Admin status & assignment update route
router.put('/:id/status', authorize('admin'), updateComplaintStatus);

module.exports = router;
