import { Model, model, Schema } from "mongoose";
import * as uniqueValidator from "mongoose-unique-validator";
import { ResultDocument } from "../types/result";

// Schema for result
const resultSchema: Schema = new Schema(
    {
        resultId: { type: String, unique: true, required: [true, "Result Id is required"] },
        eventId: { type: String,  required: [true, "Event Id is required"] },
        resultsData: {
            type: [{
                problemId: { type: String, required: [true, "Problem id is required"] },
                result: { type: Array, default: [] },
                percentage: { type: Number, default: 0, match: [{ $gte: 0, $lte: 100 }, 'Invalid percentage'] },
            }]
        },
        solution: {
            type: [{
                problemId: { type: String, required: [true, "Problem id is required"] },
                language: { type: String, required: [true, "Language is required"] },
                code: { type: String, required: [true, "Code is required"] },
            }]
        },
        solvedBy: { type: String, required: [true, "Problem solvers name is required"] },
    },
    {
        versionKey: false,
        timestamps: true
    }
);

resultSchema.plugin(uniqueValidator, { message: 'Already exists.' });

// virtual to build relationship with user table
resultSchema.virtual('problemSolverDetails', {
    ref: 'User',
    localField: 'solvedBy',
    foreignField: 'username',
    justOne: true
});


// virtual to build relationship with problem table
resultSchema.virtual('EventDetails', {
    ref: 'Event',
    localField: 'eventId',
    foreignField: 'eventId',
    justOne: true
});

const result: Model<ResultDocument> = model<ResultDocument>('Result', resultSchema);
export default result;
