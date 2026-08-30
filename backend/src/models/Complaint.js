const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a complaint title'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a detailed description'],
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: {
        values: [
          'Classroom',
          'Hostel',
          'Wi-Fi',
          'Infrastructure',
          'Cleanliness',
          'Labs',
          'Other',
        ],
        message:
          '{VALUE} is not a valid category. Valid options: Classroom, Hostel, Wi-Fi, Infrastructure, Cleanliness, Labs, Other',
      },
    },
    location: {
      type: String,
      required: [true, 'Please specify the location (e.g. Block A Room 204, Boys Hostel 2, Library)'],
      trim: true,
      maxlength: [200, 'Location cannot exceed 200 characters'],
    },
    priority: {
      type: String,
      enum: {
        values: ['Low', 'Medium', 'High', 'Critical'],
        message:
          '{VALUE} is not a valid priority. Valid options: Low, Medium, High, Critical',
      },
      default: 'Medium',
    },
    status: {
      type: String,
      enum: {
        values: [
          'Submitted',
          'Under Review',
          'Assigned',
          'In Progress',
          'Resolved',
          'Closed',
        ],
        message:
          '{VALUE} is not a valid status. Valid options: Submitted, Under Review, Assigned, In Progress, Resolved, Closed',
      },
      default: 'Submitted',
    },
    assignedTo: {
      type: String,
      trim: true,
      default: 'Unassigned',
      maxlength: [100, 'Assigned staff name cannot exceed 100 characters'],
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Complaint must belong to a student'],
    },
    resolutionDetails: {
      type: String,
      trim: true,
      default: '',
      maxlength: [2000, 'Resolution details cannot exceed 2000 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Index for query optimization on filtering complaints
complaintSchema.index({ student: 1, status: 1, category: 1, createdAt: -1 });

module.exports = mongoose.model('Complaint', complaintSchema);
