# Sensory fun

## Description

Sensory fun is a website that allows parents to book sensory experiences for their children. Sensory fun offers few rooms across Czech Republic, filled with different traces of sensory experiences. Parents can book the room (or buy a gift voucher) through different events for a specific time and date.

## Localization

The entire public-facing website content must be in the **Czech language**. The admin interface can be in English or Czech, but priority is on the public site being fully localized. 

## Login and registration
Everyone can register to the site, but registration is not required to book an event. 

On the registration page, we collect only the first and last name of the user and their email. Other data are not collected during registration. Every user can be assigned by an admin to be a customer or an admin. Admin cannot add a new user manually or update the profile, only change the role of the user.

## Admin Dashboard
The system requires a robust Admin Dashboard for managing the platform.
- **Navigation**: Sidebar navigation for Rooms, Events, Bookings, Traces, Gallery, and Users.
- **Room Management**: Create, edit, disable/enable rooms.
- **Event Management**: Create, edit, manage events. Includes setting prices, capacities, and a **"Featured"** flag to highlight specific events on the homepage.
- **Booking Management**: View all bookings, filter by status (Processing, Accepted, Declined), and manually approve or decline them.

## The content of the site

The following article describes main part of the site.

### Room

Admin can create unlimited number of rooms same as disable them as inactive. Admin can delete the room only if there is no event assigned to it. Room self has a name, location, number of seats (can be infinite) profile picture, gallery of images, list of Traces and description. 
rooms can be public so that everyone can see them on rooms page, or private so they are only visible through related event. 

### Event
Admin can create event and assign it to a room. There cannot exist event without assigned room to it. Event has a name, and details from the room, where can be overriden the price, description and duration. Event self does not manage seats availability. Events can be public so that everyone can see them on events page, or private so they can be accessed only directly from url. there should not be any other way to access private event.

There are three types of event.

#### Single (one time) event:
This event happen only once and has a calendar to pick exact start date and time, and duration in minutes. 

#### Repeating events:
This event happen multiple times and has a calendar to pick start date when it become active. additionaly it will have listed all 7 days of a week as a table with a checkbox that this event happen on this day, and columns for adding start time and duration in minutes.

#### Campaign events:
This event happens only once, but has long duration. so it has a calendar to pick start date when it become active and end date when it ends.
campaign events are mostly to sell gift vouchers, so user can later book a room for a specific date and time and use the voucher to pay for it.

#### Traces

Admin can add an item to his portfolio. Trace has a name, description, and set of pictures. Admin can assign it to a room so that it is visible on the room page or to the specific event so that it is visible on the event page.

#### Gallery collection items

Admin can create a collection of images that can be assigned to a room, or event, or Trace. 

#### Gift vouchers

Admin can create  gift vouchers. Gift voucher has a name, image, description, rooms it belongs to, price per seat and duration in days.  
User can book gift vouchers from the campaign events for reduced price, or buy it on the gift voucher page, or directly from the room if available. The Gift voucher code is created at moment of purchase and can be used to book a any event in selected rooms if the availability allows it. Gift voucher codecan be used only once, and if user bought multiple seats, then he receives voucher code for each seat separately.

## Booking system

The crucial part of the system is the booking. Every event, if available, should be offered to book. Users can book one or more seats for a specific event, but no more than the number of available seats. Users can book the event only if it is available and not in the past.

Booking has three states: **Processing**, **Accepted**, and **Declined**. 
Once a user books the event, the system creates a booking in the **Processing** state. The payment should be reserved on the user bank account. Both admin and user receive the notification about the booking. Admin has to accept or decline the booking. If admin accepts the booking, the payment is confirmed on bank account. If admin declines the booking, the payment is released.

## Notifications
The system uses **Resend** for transactional emails.
- **User Notifications**:
    - **Booking Received**: Sent when a booking is placed (Status: Processing).
    - **Booking Approved**: Sent when admin approves the booking (Status: Accepted).
    - **Booking Declined**: Sent when admin declines the booking.
- **Admin Notifications**:
    - **New Booking Alert**: Sent to admin when a new booking is placed.

## Payment system

The payment system is currently based on the **PayPal API** for simplicity and quick start. 
- **Future Plan**: The architecture must be designed to allow easy migration to the **Global Payments API** (Auth & Capture flow) in the future. The payment engine should be modular to support this switch without major refactoring.

## Page Components

### Banner
Banners will be used to promote rooms or events, but can be used for any other purpose. 
it should have a title (up to 50 characters), subtitle (up to 100 characters), textfor button (up to 20 characters) and one of room or event or voucher or link, where:

if it has room, it should have button that redirects to the room page and is visible only if the room is active,  
if it has event, it should have button that redirects to the event page and is visible only if the event is active,
if it has voucher, it should have button that redirects to the voucher page and is visible only if the voucher is active,
if it has link, it should have button that redirects to the link

### Button 
Buttons are of three types: primary used mostly for navigation, submit button used for submitting data, and cancel button used for erasing entered data.

### Room card
Room card should display details of the room similar to banner with button to open room details and upto three upcomming events in that room. The roomId should be passed as parameter. 

### Room detail 
Room Detail should display details of the room as page with banner, description, and listed Traces The roomId should be passed as parameter.

### Room List 
Room List should display list of all available rooms as cards with name, location icon, and button to navigate to the room details. The pagination should be implemented if number of rooms exceeds 20.

### Event card
Event card should display details of the event similar to banner with button to open event. The eventId should be passed as parameter.

### Event detail
Event detail should display details of the event as page with banner, description, and listed Traces The eventId should be passed as parameter.

### Booking Gift voucher card
Booking gift voucher should have list of available gift vouchers, and allow user to select one of them. then user picks number of seats and submit button. Once Submited, the payment procedure should be started.

### Gift voucher List
Gift voucher List should display list of all available gift vouchers in system as cards with name, image, description, and buttons to navigate to the room or to book the gift voucher.

### Booking non-campaign event card
Booking non-campaign event card should offer user to book a specific time, contact phone number and number of seats for a event provided as parameter. it will have submit and cancel button. Once Submited, the payment procedure should be started.
For each selected seat we need additional info like name of the child (optional) and age (optional).

### Booking campaign event card
Booking campaign event card should offer user to book a number of seats for a event provided as parameter. it will have submit and cancel button. Once Submited, the payment procedure should be started. 

### Trace list component
Trace list component should display list of Traces as a bullet list with title and by hovering over the Trace, it should display related Trace detail card.

### Trace detail card
Trace detail card should display details of the Trace as a popup card with title, description, and gallery of images.

### Gift voucher card
Gift voucher card should display details of the gift voucher as a popup card with title, image and description. 

## Pages

### Home page
Home page should display banners in rotation, list of rooms and list of gift vouchers.

### Room Detail page
Room page should display room details, list of closest 5 events, calendar with highlighted events for that room and list of gift vouchers for that room, followed by room gallery and then Trace gallery.

### Event Detail page
Event page should display event details and booking event card based on type of event,followed by event gallery, room gallery and then Trace gallery.
if it is repeating event, it should show available dates in calendar and allow user to select one of them.

### Gift voucher Detail page
Gift voucher Detail page should display details of the gift voucher, with the booking gift voucher card, followed by list of rooms it belongs to.

### Gift voucher List page
Gift voucher List page should display list of all available gift vouchers in system as gift voucher cards.

### Traces page
Traces page should display list of all available Traces in system as Trace cards.

### Trace Detail page
Trace Detail page should display details of the Trace, with the name, description, and gallery of images, followed by list of rooms it belongs to, and list of events it belongs to.

### profile page
Profile page should display user profile, with the name, email, and list of bookings.

### About us page
About us page should display information about the company, Here it may be simple Editor on admin side, where admin enters WYSIWYG content, and that will be displayed here.

### Contact page
Contact page should display our contact information, and simple form to send email to us.

### Privacy Policy page
Privacypolicy page should display our privacy policy, and may be simple Editor on admin side, where admin enters WYSIWYG content, and that will be displayed here.   

### Terms page
Terms page should display our terms and conditions, and may be simple Editor on admin side, where admin enters WYSIWYG content, and that will be displayed here.
