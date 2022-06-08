const authController = require("./auth-controller");
const postController = require("./post-controller");
const friendController = require("./friend-controller");


module.exports = (app) => {

  // Authorizing
  app.post("/signup", authController.signUp);
  app.post("/login", authController.login);
  app.post("/checkifloggedin", authController.checkIfLoggedIn);


  // Posting
  app.post("/makepost", postController.makePost);
  app.post("/get-posts", postController.getPosts);
  app.post("/delete-post", postController.deletePost);
  app.post("/edit-post", postController.editPost);
 
  // Friend-ing
  app.post("/send-request", friendController.sendRequest);
  app.post("/confirm-friend", authController.confirmFriend);
  app.post("/delete-request", friendController.deleteRequest);
  app.post("/get-request", friendController.getRequestStatus);
  app.post("/delete-friend", authController.deleteFriend);
  app.post("/friend-check", friendController.checkFriendship);
  app.post("/get-friend-requests", friendController.getFriendRequests);

  // Viewing User Info
  app.post("/get-friends", authController.getFriends);
  app.post("/get-user", authController.getUser);
  app.post("/get-username", authController.getUserName);
  app.post("/search-users", authController.searchUsers);
}