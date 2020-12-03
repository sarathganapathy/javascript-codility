import { Model, model, Schema } from "mongoose";
import * as uniqueValidator from "mongoose-unique-validator";
import { EventDocument } from "../types/event";

// Schema for events
const eventSchema: Schema = new Schema(
    {
        addedBy: { type: String, required: [true, "Added by user is required"] },
        eventDate: { type: String, required: [true, "Event date is required"] },
        eventId: {
            type: String, unique: true, required: [true, "Event id cannot be blank"]
        },
        eventTitle: {
            type: String, unique: true, required: [true, "Event title can't be blank"]
        },
        problemIds: {
            type: [{
                problemId: { type: String, unique: false, required: [true, "Added by user is required"] }
            }]
        },
        totalTime: { type: String, required: [true, "Total time is required"] }
    },
    {
        versionKey: false,
        timestamps: true
    },
);

eventSchema.plugin(uniqueValidator, { message: 'Already exists.' });

// virtual to build relationship with user table
eventSchema.virtual('addedByUserDetails', {
    ref: 'User',
    localField: 'addedBy',
    foreignField: 'username',
    justOne: true
});

// virtual to build relationship with problem table
eventSchema.virtual('problemDetails', {
    ref: 'Problem',
    localField: 'problemIds.problemId',
    foreignField: 'problemId'
});

const event: Model<EventDocument> = model<EventDocument>('Event', eventSchema);
export default event;
