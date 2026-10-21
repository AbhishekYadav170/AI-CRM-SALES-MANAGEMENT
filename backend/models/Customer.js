const mongoose = require("mongoose");
 

const customerSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },
 
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
 
    name: {
      type: String,
      required: true,
      trim: true,
    },
 
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
 
    phone: {
      type: String,
      trim: true,
    },
 
    company: {
      type: String,
      trim: true,
    },
 
    address: {
      type: String,
      trim: true,
    },
 
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
 
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
 
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
 
    notes: {
      type: String,
      trim: true,
    },
 
    source: {
      type: String,
      trim: true,
    },
 
    convertedFromLead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);
 
customerSchema.index({ companyId: 1, email: 1 });
customerSchema.index({ companyId: 1, assignedTo: 1 });
 
module.exports = mongoose.model("Customer", customerSchema);