# YelpCamp-fullstack-project

## What I used

- **express**- Framework for creating node app
- **ejs, ejs-mate**- Templating language to generate HTML markup with plain JavaScript
- **mongoose**- Library to interact with *mongoDB* database
- **dotenv**- To get secrets from env file
- **bootstrap**- Frontend library for quick and ready-made styles
- **method-override**- To use all routes in html forms
- **axios**- For http requests
- **joi**- For server side data validation

## Steps completed

1. YelpCamp campground CRUD
    - Basic express app
    - Mongo connection
    - Add starting data to database
    - GET route to view all campgrounds
    - GET route for one campground detail view
    - GET and POST route to add new campground
    - GET and PUT route to update campground
    - DELETE route to delete campground

2. Adding basic styles
    - Add ejs-mate library for layout
    - Add bootstrap links, navbar and footer
    - Add dummy image and description for database
    - Add basic style to index file
    - Add basic style to all route files

3. Errors and Validating data
   - Add client side form validation
   - Add server side data validation
   - Add function to catch async errors
   - Add error page layout
   - Add **joi** library for server side validation
   - Add custom Middleware for validation using **joi**

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
