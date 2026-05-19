import mongoose from 'mongoose';

const dailyReportSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      index: true,
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    workType: {
      type: String,
      enum: ['Foundation', 'Structure', 'Slab', 'Finishing', 'Other'],
      default: 'Other',
    },
    images: {
      type: [String], // Array of URLs
      default: [],
    },
    aiAnalysis: {
      progressDetected: {
        type: Boolean,
        default: true,
      },
      delayRisk: {
        type: Boolean,
        default: false,
      },
      notes: {
        type: String,
        default: 'Standard progress. No issues detected.',
      },
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to quickly fetch project reports by date order
dailyReportSchema.index({ projectId: 1, date: -1 });

const DailyReport = mongoose.model('DailyReport', dailyReportSchema);
export default DailyReport;
