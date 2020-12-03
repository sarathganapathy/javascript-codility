import Event from "../../models/event";
import logger from "../../logger";
import { errorMessage } from "../../../sharedUtils/utils";
import { QueryStatus, QueryFlags, ParamsDictionary, ParsedQs } from "../../types/util";
import {
    Event as IEvent,
    EventDocument,
    EventsResponseObjects,
    EventsResponseObject,
    EventParams,
    EventQueries
} from "../../types/event";

// exclude id  ("fileName" - include, "-fieldName" - exclude)
const excludeFields = "-_id";

/**
 * return the events as promise object.
 * @params params - extracted request params
 * @params query - extracted request query
 * @return  events
 */
export const getAllEvents = async (params: null, query: EventQueries)
    : Promise<EventsResponseObjects> | never => {
    try {
        const events: IEvent[] = await Event.find(query)
            .find(query)
            .populate("addedByUserDetails", "-_id username firstName lastName")
            .populate("problemDetails", "-_id")
            .select(excludeFields)
            .lean()
            .exec();
        return ({
            count: events.length,
            events
        });
    } catch (error) {
        logger.error("event controller:: getAllEvents", error);
        throw error;
    }
};

/**
 * creates the event as document in the collection.
 * @param eventData - event data object
 * @return created events
 */
export const createEvent = async (eventData: IEvent): Promise<EventsResponseObject> | never => {
    try {
        const eventDocument: EventDocument = await new Event(eventData).save();
        const { _id, ...remainingData } = eventDocument.toObject();
        return { event: remainingData };
    } catch (error) {
        logger.error("event controller:: createEvent", error);
        throw error;
    }
};

/**
 * return the event by event identifier
 * @param EventParams- event request parameters
 * @return selected event
 */
export const getEventById = async ({ eventId }: EventParams): Promise<EventsResponseObject> | never => {
    try {
        const event: IEvent | null = await Event.findOne({eventId})
            .populate("addedByUserDetails", "-_id username firstName lastName")
            .populate("problemDetails", "-_id")
            .select(excludeFields)
            .lean()
            .exec();
        if (!event) {
            throw errorMessage("No event found");
        }
        return { event };
    } catch (error) {
        logger.error("event controller:: getEventById", error);
        throw error;
    }
};

/**
 * updates the mongodb document in event collection.
 * @param EventParams- event request parameters
 * @param eventData- event data
 * @return updated event
 */
export const updateEvent = async ({ eventId }: EventParams, eventData: IEvent)
    : Promise<EventsResponseObject> | never => {
    try {
        const event: IEvent | null = await Event
            .findOneAndUpdate({ eventId }, { $set: eventData }, { new: true })
            .populate("addedByUserDetails", "-_id username firstName lastName")
            .populate("problemDetails", "-_id")
            .select(excludeFields)
            .lean()
            .exec();
        if (!event) {
            throw errorMessage("No event found");
        }
        return { event };
    } catch (error) {
        logger.error("event controller:: updateEvent", error);
        throw error;
    }
};

/**
 * deletes the document in event collection by id.
 * @param EventParams- event request parameters
 * @return object containing delete info
 */
export const deleteEvent = async ({ eventId }: EventParams)
    : Promise<QueryStatus<QueryFlags.DELETED>> | never => {
    try {
        const { deletedCount } = await Event.remove({ eventId }).exec();
        if (!deletedCount) {
            throw errorMessage("No user Found");
        }
        return { message: QueryFlags.DELETED };
    } catch (error) {
        logger.error("event controller:: deleteEvent", error);
        throw error;
    }
};

/**
 * returns the eventId from request param
 * @param requestParams - request params
 * @returns return extracted param
 */
export const getEventIdFromParams = ({ eventId }: ParamsDictionary): EventParams => ({ eventId });

/**
 * returns the extracted query
 * @param query - request query
 * @returns extracted query
 */
export const extractQueryParams = ({ eventId, eventTitle, eventDate }: ParsedQs)
    : EventQueries => ({
        ...eventId ? { eventId: String(eventId) } : null,
        ...eventTitle ? { eventTitle: { $regex: eventTitle, $options: 'i' } } : null,
        ...eventDate ? { eventDate: { $gte: eventDate } } : null,
    });