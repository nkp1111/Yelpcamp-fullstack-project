# YelpCamp-fullstack-project

## Links

- Solution Url: [GitHub](https://github.com/nkp1111/Yelpcamp-fullstack-project)
- Live Site Url: [Render](https://nkp1111-yelpcamp.onrender.com/)

## What I used

- **express**- framework for creating node app
- **ejs, ejs-mate**- templating language to generate HTML markup with plain JavaScript
- **mongoose**- library to interact with *mongoDB* database
- **dotenv**- to get secrets from env file
- **bootstrap**- frontend library for quick and ready-made styles
- **method-override**- to use all routes in html forms
- **axios**- for http requests
- **joi**- for server side data validation
- **express-session**- for creating and managing session server side
- **connect-flash**- for sending flash messages to client/user
- **passport**- library for user/client authentication
- **passport-local**- *passport* strategy for authenticating with username and password
- **passport-local-mongoose**- simplifies building username and password login with passport
- **multer**- to handle file uploads
- **cloudinary, multer-storage-cloudinary**- To store image on [cloudinary](https://cloudinary.com/)
- **leaflet**- library for interactive maps
- **Leaflet.markercluster**- library for creating cluster map on the base of *leaflet* map
- **sanitize-html, express-mongoose-sanitize**- for preventing mongo injection
- **helmet**- for securing app
- **connect-mongo**- for using session storage to mongo

## Steps completed

1. YelpCamp campground CRUD
    - Basic *express* app
    - Mongo connection- *mongoose*
    - Add starting data to database
    - GET route to view all campgrounds
    - GET route for one campground detail view
    - GET and POST route to add new campground
    - GET and PUT route to update campground
    - DELETE route to delete campground

2. Adding basic styles
    - Add *ejs-mate* library for layout
    - Add bootstrap links, navbar and footer
    - Add dummy image and description for database
    - Add basic style to index file
    - Add basic style to all route files

3. Errors and Validating data
   - Add client side form validation
   - Add server side data validation
   - Add function to catch async errors
   - Add error page layout
   - Add *joi* library for server side validation
   - Add custom Middleware for validation using *joi*

4. Adding the Reviews Model
    - Add Review model
    - Add Review form
    - POST route for adding review
    - Add Review data validation
    - DELETE route for deleting review
    - mongoose middleware for deleting reviews with campground

5. Restructuring
    - Express Router to separate campground routes
    - Express Router to separate review routes
    - Add public directory for static files
    - Add *express-session* for session management
    - Use *connect-flash* for sending flash messages
    - Add bootstrap alert for flash messages

6. Adding Authentication
    - Add *passport, passport-local, passport-local-mongoose* library
    - Add User model
    - Initialize passport and add user to database
    - Add register form for user
    - POST route for registering new user
    - Add form and POST route for user login
    - Add middleware for verifying login
    - Add GET route for logout and update navbar links
    - Update register route for logging user

7. Basic Authorization
    - Update campground model and route to add author/user
    - Show edit/delete button only to author
    - Add middleware to verify author of campground
    - Add authorization for viewing review form and review submission
    - Add authorization for review DELETE route

8. Controllers and Star ratings
    - Refactor campground routes separate control logic to controllers
    - Refactor reviews routes and user routes to separate control logic
    - Refactor routes by common routes path
    - Add [starability](https://github.com/LunarLogic/starability) css file for ratings

9. Image Upload
    - Add *multer* for handling image uploads
    - Add *cloudinary, multer-storage-cloudinary* for uploading image on cloudinary
    - Refactor model, view and controller for multiple images
    - Add bootstrap carousel for images
    - Refactor campground PUT route for image addition/upload
    - Refactor file input
    - Add delete image on PUT route for campground
    - Add separate schema for image and thumbnail size for edit form

10. Adding Maps
    - Add [positionstack](https://positionstack.com/) for location geocode(latitude, longitude)
    - Refactor campground model to add geometry/ geoJson coordinates of location
    - Add [leaflet](https://leafletjs.com/) for viewing maps
    - Add campground data in jS to pinpoint correct location of campground on map
    - Add popup on map to show campground info

11. Cluster Map
    - Add [Leaflet.markercluster](https://github.com/Leaflet/Leaflet.markercluster) links/library for cluster map
    - Add campgrounds data to see campground's cluster map
    - Changing size and color of cluster on zoom
    - Add virtual in model to add link as popup for cluster map

12. Applying Styles
    - Add html content and styles to home page
    - Add style to login, register form and new, edit campground form

13. Common Security Issue
    - Add sanitize-html and express-mongoose-sanitize for preventing mongo injection
    - Minor changes to cookies
    - Add helmet for security

14. Deploying the App
    - Add Mongo store for session storage

## Acknowledgement

This project was done following the final project of

- **The Web Developer Bootcamp 2022** by **Colt Steele**

## Things to Note

### *Adding Maps*(10th section) of project is different

- [*positionstack*](https://positionstack.com/) api for geocode (latitude, longitude) of location
- [*leaflet*](https://leafletjs.com/) library for viewing maps

### *Cluster Map*(11th section) of project is different

- [*Leaflet.markercluster*](https://www.npmjs.com/package/leaflet.markercluster) library used for cluster map on top of leaflet map
