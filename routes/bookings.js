// imprting these modules to use in this file
// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const { ObjectId } = require('mongoose').Types;
const booking = require('../models/bookings');
const bookings = require('../models/bookings');

var bookingRouter = express.Router(); // Using express.Router() to make a router instance

bookingRouter.route('/create')
    .get((req, res, next) => {
        res.render('newbooking', { title: 'New Booking' });
    })
    .post((req, res, next) => {
        // Create a new booking with the submitted data
        const newBooking = new booking({
            workshop: req.body.workshop,
            time: req.body.time,
            name: req.body.name,
            email: req.body.email,
            date: req.body.date,
            card: req.body.card,
        });
        // Saving booking to database
        newBooking.save()
            .then((booking) => {
                // converting to a string and then slicing to keep the last 5 digits
                const bookingReference = booking._id.toString().slice(-5);; // _id is the unique identifier for the booking database
                res.render('currentorder', { title: 'Thank you for your booking', booking: newBooking,  bookingReference: bookingReference, workshop: newBooking.workshop, time: newBooking.time });
            })
            .catch((err) => next(err));
    });

// route for displaying list of all bookings
bookingRouter.route('/view')
    .get((req, res, next) => {
        booking.find({})
            .then((bookings) => {
                // Redirect to display all bookings
                res.render('findbookinglist', { title: 'All Bookings', bookings: bookings });
            })
            .catch((err) => next(err));
    });

// finding bookings for the report
bookingRouter.route('/find')
  .get((req, res, next) => {
    res.render('findbooking.ejs', { title: 'Find a Booking' });
  })
  .post((req, res, next) => {
    // getting input from request
    const userName = req.body.userName;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;

    // searching database for bookings matching the users name and date range
    booking.find({ name: userName, date: { $gte: startDate, $lte: endDate } })
      .then((bookingsFound) => {
        if (bookingsFound && bookingsFound.length > 0) {
          res.render('bookingreport', { user: userName, bookings: bookingsFound, title: 'Booking Summary Report' });
        } else {
          res.render('nobookings', { title: 'No booking found' });
        }
      })
      .catch((err) => next(err));
  });

bookingRouter.route('/update')
.get((req,res,next) => {
    res.render('findbooking_forupdate.ejs', { title: 'Find a Booking to Update' });   
})

.post((req, res, next) => {
    // getting input from request
    const userName = req.body.userName;
    const bookingDate = req.body.bookingDate;
    
    booking.find({ name: userName, date: bookingDate })
    .then((bookingsFound) => {
        if (bookingsFound && bookingsFound.length > 0) {
            res.render('bookinglist', { bookings: bookingsFound, title: 'Modify your Booking' });
        } else {
            res.render('nobookingstoupdate', { title: 'No booking found' });
        }
    })
    .catch((err) => next(err));
});

bookingRouter.route('/updatebooking/:id')
.get((req, res, next) => {
    bookings.find(ObjectId(req.params.id))
    .then((bookingsfound) => {
                if (bookingsfound.length > 0)
                   res.render('updatebooking.ejs', { title: 'Update Booking', booking: bookingsfound[0] });   
                else
                     res.end("There are no bookings matching these details")
    }, (err) => next(err))
    .catch((err) => next(err));
    
});

bookingRouter.route('/update_complete')
    .post((req, res, next) => {
        const updatedBookingId = req.body._id;
        const updatedBookingData = {
            workshop: req.body.workshop,
            time: req.body.time,
            name: req.body.name,
            email: req.body.email,
            date: req.body.date,
            card: req.body.card,
        };

        booking.findByIdAndUpdate(updatedBookingId, updatedBookingData, { new: true })
            .then((updatedBooking) => {

                if (updatedBooking) {
                    res.render('updatecompletebooking', { 'bookings': [updatedBooking], title: 'View Updated Booking' });
                } else {
                    res.status(404).send("There are no bookings matching these details");
                }
            })
            .catch((err) => {
                next(err);
            });
    });


    bookingRouter.route('/deletebooking/:id')
    .get((req, res, next) => {
      const bookingId = req.params.id;
  
      bookings.findById(bookingId)
        .then((deletedBooking) => {
          if (deletedBooking) {
            bookings.deleteOne({ _id: ObjectId(bookingId) })
              .then(() => {
                // confirming the booking has been deleted
                res.render('bookingdeleted', { title: 'Booking Deleted', booking: deletedBooking });
              })
              .catch((err) => next(err));
          } else {
            res.end("There are no bookings with these details");
          }
        })
        .catch((err) => next(err));
    });
  

// booking deleted confirmation
bookingRouter.route('/bookingdeleted/:id')
  .get((req, res, next) => {
    const bookingId = req.params.id;
    res.render('bookingdeleted', { title: 'Booking Deleted', bookingId: bookingId });
  });

  

// exporting the bookingRouter object to make it available in other files 
module.exports = bookingRouter;