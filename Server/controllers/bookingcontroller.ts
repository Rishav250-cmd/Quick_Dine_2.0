import { Response } from "express";
import { Authrequest } from "../middlewares/auth.js";
import { Restuarent } from "../models/restuarent.js";
import { Booking } from "../models/booking.js";

// CREATE BOOKING
export const createbooking = async (
    req: Authrequest,
    res: Response
): Promise<void> => {
    try {
        const {
            restuarentId,
            date,
            time,
            guests,
            occasion,
            specialRequests
        } = req.body;

        if (!restuarentId || !date || !time || !guests || !occasion) {
            res.status(400).json({
                message: "Please provide all required information"
            });
            return;
        }

        const restaurant = await Restuarent.findById(restuarentId);

        if (!restaurant) {
            res.status(404).json({
                message: "Restaurant not found"
            });
            return;
        }

        if (restaurant.status !== "approved") {
            res.status(400).json({
                message: "Restaurant is not open for reservation yet"
            });
            return;
        }

        const requestedGuests = Number(guests);

        // Check existing bookings
        const existingBookings = await Booking.find({
            restaurant: restuarentId,
            date: new Date(date),
            time,
            status: "confirmed"
        });

        const bookedSeats = existingBookings.reduce(
            (sum, booking) => sum + booking.guests,
            0
        );

        const totalSeats = restaurant.totalseats || 20;
        const availableSeats = totalSeats - bookedSeats;

        if (requestedGuests > availableSeats) {
            res.status(400).json({
                message: `Unable to reserve. Only ${availableSeats} seats are available for this time slot.`
            });
            return;
        }

        // Create booking
        const booking = await Booking.create({
            user: req.user?._id,
            restaurant: restuarentId,
            date: new Date(date),
            time,
            guests: requestedGuests,
            occasion,
            specialRequests,
            status: "confirmed"
        });

        // Populate restaurant information
        const populatedBooking = await booking.populate(
            "restaurant",
            "name location image address slug"
        );

        res.status(201).json(populatedBooking);

    } catch (error) {
        console.log(error);

        const message =
            error instanceof Error
                ? error.message
                : "Something went wrong";

        res.status(400).json({ message });
    }
};


// GET MY BOOKINGS
export const getmybooking = async (
    req: Authrequest,
    res: Response
): Promise<void> => {
    try {

        const bookings = await Booking.find({
            user: req.user?._id
        })
            .populate(
                "restaurant",
                "name location image address slug"
            )
            .sort({
                date: -1,
                time: -1
            });

        res.json(bookings);

    } catch (error) {

        console.log(error);

        const message =
            error instanceof Error
                ? error.message
                : "Something went wrong";

        res.status(400).json({ message });
    }
};


// CANCEL BOOKING
export const cancelbooking = async (
    req: Authrequest,
    res: Response
): Promise<void> => {

    try {

        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            res.status(404).json({
                message: "Booking not found"
            });
            return;
        }

        if (
            booking.user.toString() !==
            req.user?._id.toString()
        ) {
            res.status(401).json({
                message: "Not authorized to cancel this booking"
            });
            return;
        }

        booking.status = "cancelled";

        await booking.save();

        const populatedBooking = await booking.populate(
            "restaurant",
            "name location image address"
        );

        res.json(populatedBooking);

    } catch (error) {

        console.log(error);

        const message =
            error instanceof Error
                ? error.message
                : "Something went wrong";

        res.status(400).json({ message });
    }
};