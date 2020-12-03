import { Model, model, Schema } from "mongoose";
import * as uniqueValidator from "mongoose-unique-validator";
import { ProblemDocument } from "../types/problem";

// schema for problem
const problemSchema: Schema = new Schema(
  {
    addedBy: { type: String, required: [true, "Added by user cant be blank"] },
    category: {
      type: String, required: [true, "Category cant be blank"]
    },
    complexity: {
      type: Number, enum: [0, 1, 2], default: 0
    },
    description: {
      type: String, required: [true, "Description can't be blank"]
    },
    inputs: {
      type: Array, required: [true, "Inputs can't be blank"]
    },
    outputs: {
      type: Array, required: [true, "Outputs can't be blank"]
    },
    problemId: {
      type: String, unique: true, required: [true, "Problem id cannot be blank"]
    },
    problemSkeleton: {
      type: [
        {
          language: { type: String, required: [true, "Language can't be blank"] },
          placeholder: { type: String, required: [true, "Placeholder can't be blank"] },
        }
      ]
    },
    problemTitle: {
      type: String, unique: true, required: [true, "Title can't be blank"]
    },
    totalTime: { type: String, required: [true, "Total time cannot be blank"] }
  },
  {
    versionKey: false,
    timestamps: true
  }
);

problemSchema.plugin(uniqueValidator, { message: 'Already exists.' });

// virtual to build relationship with user table
problemSchema.virtual('addedByUserDetails', {
  ref: 'User',
  localField: 'addedBy',
  foreignField: 'username',
  justOne: true
});

problemSchema.plugin(uniqueValidator, { message: 'Already exists.' });

const problem: Model<ProblemDocument> = model<ProblemDocument>('Problem', problemSchema);
export default problem;
