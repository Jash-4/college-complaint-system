const Complaint = require('../models/Complaint');

/**
 * @desc    Submit a new complaint
 * @route   POST /api/complaints
 * @access  Private (Student)
 */
const createComplaint = async (req, res, next) => {
  try {
    const { title, description, category, location, priority } = req.body;

    // Validate required fields
    if (!title || !description || !category || !location) {
      return res.status(400).json({
        success: false,
        message:
          'Please provide all required fields: title, description, category, and location',
      });
    }

    const complaint = await Complaint.create({
      title,
      description,
      category,
      location,
      priority: priority || 'Medium',
      student: req.user._id,
    });

    // Populate student information in response
    await complaint.populate('student', 'name email department');

    res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully',
      complaint,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all complaints
 *          - If student: returns their own complaints
 *          - If admin: returns all complaints with optional filters (status, category, priority)
 * @route   GET /api/complaints
 * @access  Private (Student / Admin)
 */
const getComplaints = async (req, res, next) => {
  try {
    const query = {};

    // If logged-in user is a student, only return their complaints
    if (req.user.role === 'student') {
      query.student = req.user._id;
    }

    // Admin filters
    if (req.user.role === 'admin') {
      const { status, category, priority, search } = req.query;

      if (status) {
        query.status = status;
      }
      if (category) {
        query.category = category;
      }
      if (priority) {
        query.priority = priority;
      }
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { location: { $regex: search, $options: 'i' } },
          { assignedTo: { $regex: search, $options: 'i' } },
        ];
      }
    }

    const complaints = await Complaint.find(query)
      .populate('student', 'name email department')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single complaint by ID
 * @route   GET /api/complaints/:id
 * @access  Private (Owner Student / Admin)
 */
const getComplaintById = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate(
      'student',
      'name email department'
    );

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: `Complaint not found with ID: ${req.params.id}`,
      });
    }

    // Ensure student only accesses their own complaint
    if (
      req.user.role === 'student' &&
      complaint.student._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You are not authorized to view this complaint',
      });
    }

    res.status(200).json({
      success: true,
      complaint,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update complaint status, priority, assignment & resolution details
 * @route   PUT /api/complaints/:id/status
 * @access  Private (Admin only)
 */
const updateComplaintStatus = async (req, res, next) => {
  try {
    const { status, priority, assignedTo, resolutionDetails } = req.body;

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: `Complaint not found with ID: ${req.params.id}`,
      });
    }

    // Update fields if provided
    if (status !== undefined) complaint.status = status;
    if (priority !== undefined) complaint.priority = priority;
    if (assignedTo !== undefined) complaint.assignedTo = assignedTo;
    if (resolutionDetails !== undefined)
      complaint.resolutionDetails = resolutionDetails;

    await complaint.save();

    await complaint.populate('student', 'name email department');

    res.status(200).json({
      success: true,
      message: 'Complaint updated successfully',
      complaint,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a complaint (Only owner student and only if status is 'Submitted')
 * @route   DELETE /api/complaints/:id
 * @access  Private (Student only)
 */
const deleteComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: `Complaint not found with ID: ${req.params.id}`,
      });
    }

    // Verify ownership
    if (complaint.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message:
          'Forbidden: You are not authorized to delete this complaint',
      });
    }

    // Check if complaint is still in 'Submitted' status
    if (complaint.status !== 'Submitted') {
      return res.status(400).json({
        success: false,
        message: `Cannot delete complaint once it has been processed. Current status is '${complaint.status}'.`,
      });
    }

    await Complaint.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Complaint deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get complaint analytics and statistics
 * @route   GET /api/complaints/stats
 * @access  Private (Admin only)
 */
const getComplaintStats = async (req, res, next) => {
  try {
    // Total count
    const totalComplaints = await Complaint.countDocuments();

    // Aggregation by status
    const statusStats = await Complaint.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // Aggregation by category
    const categoryStats = await Complaint.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
    ]);

    // Aggregation by priority
    const priorityStats = await Complaint.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 },
        },
      },
    ]);

    // Format status breakdown into friendly object
    const statusMap = {
      Submitted: 0,
      'Under Review': 0,
      Assigned: 0,
      'In Progress': 0,
      Resolved: 0,
      Closed: 0,
    };
    statusStats.forEach((item) => {
      if (item._id) statusMap[item._id] = item.count;
    });

    // Format category breakdown into friendly object
    const categoryMap = {
      Classroom: 0,
      Hostel: 0,
      'Wi-Fi': 0,
      Infrastructure: 0,
      Cleanliness: 0,
      Labs: 0,
      Other: 0,
    };
    categoryStats.forEach((item) => {
      if (item._id) categoryMap[item._id] = item.count;
    });

    // Format priority breakdown into friendly object
    const priorityMap = {
      Low: 0,
      Medium: 0,
      High: 0,
      Critical: 0,
    };
    priorityStats.forEach((item) => {
      if (item._id) priorityMap[item._id] = item.count;
    });

    // Pending vs Resolved summary
    const resolvedCount = (statusMap['Resolved'] || 0) + (statusMap['Closed'] || 0);
    const pendingCount = totalComplaints - resolvedCount;

    res.status(200).json({
      success: true,
      stats: {
        total: totalComplaints,
        pending: pendingCount,
        resolved: resolvedCount,
        byStatus: statusMap,
        byCategory: categoryMap,
        byPriority: priorityMap,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaintStatus,
  deleteComplaint,
  getComplaintStats,
};
