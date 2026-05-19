import mongoose from 'mongoose';

const materialSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    unit: {
      type: String,
      required: true,
      default: 'bags', // bags, kg, ton, pieces, etc.
    },
    totalIn: {
      type: Number,
      default: 0,
    },
    totalUsed: {
      type: Number,
      default: 0,
    },
    remaining: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure name is unique per project
materialSchema.index({ projectId: 1, name: 1 }, { unique: true });

const Material = mongoose.model('Material', materialSchema);
export default Material;
