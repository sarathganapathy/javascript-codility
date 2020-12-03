import { Document } from "mongoose";

/**
 * @def interface for problemReference
 * @interface
 */
interface ProblemReference {
    problemId: string;
}

/**
 * @def interface for problem
 * @interface
 */
export interface Event {
    addedBy: string;
    eventDate: string;
    eventId: string;
    eventTitle: string;
    problemIds: ProblemReference[];
    totalTime: string;
}

/**
 * @def interface for event document
 * @interface
 */
export interface EventDocument extends Event, Document {
    // TODO- add methods
}

/**
 * @def interface for all events response object
 * @interface
 */
export interface EventsResponseObjects {
    count: number;
    events: Event[];
}

/**
 * @def interface for event object
 * @interface
 */
export interface EventsResponseObject {
    event: Event;
}

/**
 * @interface
 * @def interface for event request params
 */
export interface EventParams {
    eventId: string;
}

/**
 * @interface
 * @def interface for event queries
 */
export interface EventQueries {
    eventId?: string;
    eventDate?: object;
    eventTitle?: object;
}