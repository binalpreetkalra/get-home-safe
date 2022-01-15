# Get Home Safe
A software solution to help university solutions get to their destinations safely.

Languages/Tools: React, React Native, Google Firebase, MapBox GL

There are two main components of this project:
### React Native mobile application where users can share their location through an automated text message with their selected contacts until they choose to end their location sharing session.

User Flow:
//enter gifs + short description of the process 

### React web application that is opened with the custom link sent to the users’ selected contacts where the contacts can track the user’s live location to ensure their friends get home safe.

//enter gifs + short description of the process 

# Highlighted Features:

## Security
- Since tracking a user’s location poses a high security concern, we took multiple measures to ensure their location and private information is secured.
- 
The only information about the user that is stored is their phone number and location coordinates. This limits the information others can obtain about the user if anything goes wrong. 
The web app only displays the user’s randomly generated ID, again, limiting the private information one can see with this link.
Random link generation w/ 32 bit hash: when a user shares their location, the web-app link is made up of the user’s randomly generated ID and a random alphanumeric string to allow that user’s location markers to show up on that web app. Once the link is shared from the user’s side, the alphanumeric string is stored as a 32 bit hash in the user’s database. When someone opens the shared link, the random string code is put through the same hash function to check if it matches the user’s stored hashed code before displaying the location. This process creates an extra level of security to ensure if someone gets access to the database, they aren’t able to simply take the stores alphanumeric strings to find a user’s current location.

## Other
Simplified the signup process by only asking for the user’s phone number to reduce friction during the onboarding process and collection of unnecessary information from the user
Only needed to collect for the user’s phone number to connect the text messaging API when a location-tracking link needs to be sent and to store the user’s selected contacts
Location-tracking works even if the user does not keep the application open; if a situation arises and the app is force-closed, the sharing session will resume once the user reopens the app
The user’s location is collected every 5 seconds and is set up to only store unique locations (if the user is at the same place 5 seconds later, the previous same location is not saved to ensure their last seen time is still up to date)


# Next Steps
Allow users to share their location through more platforms than only text messaging (ex. Discord, Instagram, Messenger, etc.)
Add another code verification when a selected contact opens the user’s location tracking web app for more security purposes
