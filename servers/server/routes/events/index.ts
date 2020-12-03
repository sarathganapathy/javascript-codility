import { Router } from "express";
import isUserSignedIn from "../../middleware/isUserSignedIn";
import permissions from "../../config/accessControlConfig";
import { generateAccess, Operations } from "../../middleware/accessControl";
import { Routes } from "../../types/util";
import { Event, EventParams, EventQueries } from "../../types/event";
import {
    deleteResponseHandler,
    getResponseHandler,
    postResponseHandler,
    updateResponseHandler
} from "../../../sharedUtils/routeHandler";
import {
    createEvent,
    deleteEvent,
    extractQueryParams,
    getAllEvents,
    getEventById,
    getEventIdFromParams,
    updateEvent
} from "../../controller/event";

const hasAccess = generateAccess(permissions);
const router = Router();

// REST services for event data

// get request
router.get(
    "/",
    isUserSignedIn,
    getResponseHandler<null, EventQueries>(getAllEvents, (x) => null, extractQueryParams)
);
router.get(
    "/:eventId",
    isUserSignedIn,
    getResponseHandler<EventParams>(getEventById, getEventIdFromParams, (x) => null)
);
// create request
router.post(
    "/",
    isUserSignedIn,
    hasAccess(Routes.Event, Operations.Create),
    postResponseHandler<Event>(createEvent)
);
// update request
router.put(
    "/:eventId",
    isUserSignedIn,
    hasAccess(Routes.Event, Operations.Update),
    updateResponseHandler<EventParams, Event>(updateEvent, getEventIdFromParams)
);
router.patch(
    "/:eventId",
    isUserSignedIn,
    hasAccess(Routes.Event, Operations.Update),
    updateResponseHandler<EventParams, Event>(updateEvent, getEventIdFromParams)
);
// delete request
router.delete(
    "/:eventId",
    isUserSignedIn,
    hasAccess(Routes.Event, Operations.Delete),
    deleteResponseHandler<EventParams>(deleteEvent, getEventIdFromParams)
);
export default router;
