const express = require("express");
const router = express.Router();
const passport = require("passport");

const Post = require("../../models/Post");
const Profile = require("../../models/Profile");
const validatePostInput = require("../../validation/post");

router.get("/test", (req, res) => res.json({ msg: "posts work!" }));

// @route   GET api/post
// @desc    Get all posts
// @access  Public
router.get("/", (req, res) => {
  const errors = {};
  Post.find()
    .sort({ date: -1 })
    .then(posts => {
      if (!posts) {
        errors.noposts = "There are no posts";
        return res.status(404).json(errors);
      }
      res.json(posts);
    })
    .catch(err => res.status(400).json({ post: "There are no posts" }));
});

// @route   GET api/post/:id
// @desc    Get a single post by id
// @access  Public
router.get("/:id", (req, res) => {
  const errors = {};
  Post.findById(req.params.id)
    .sort({ date: -1 })
    .then(post => {
      res.json(post);
    })
    .catch(err => res.status(400).json({ post: "Post does not exist" }));
});

// @route   POST api/post
// @desc    Create new post
// @access  Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }
    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    });
    newPost.save().then(post => res.json(post));
  }
);

// @route   POST api/post/like/:id
// @desc    Like post
// @access  Private
router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          // Check if the user had already liked this before
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length > 0
          ) {
            return res
              .status(400)
              .json({ alreadyLiked: "User already liked this post" });
          }

          // Add user id to likes
          post.likes.unshift({ user: req.user.id });

          post.save().then(post => res.json(post));
        })
        .catch(err =>
          res.status(404).json({ postnotfound: "No post was found" })
        );
    });
  }
);

// @route   POST api/post/unlike/:id
// @desc    Unlike post
// @access  Private
router.post(
  "/unlike/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          // Check if the user had already liked this before
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length === 0
          ) {
            return res
              .status(400)
              .json({ notLiked: "You have not liked this post yet" });
          }

          // Get remove index
          const removeIndex = post.likes
            .map(item => item.user.toString())
            .indexOf(req.user.id);

          post.likes.splice(removeIndex, 1);

          // save
          post.save().then(post => res.json(post));
        })
        .catch(err =>
          res.status(404).json({ postnotfound: "No post was found" })
        );
    });
  }
);

// @route   DELETE api/post/like/:id
// @desc    Deletes a post
// @access  Private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (post.user.toString() !== req.user.id) {
            return res
              .status(401)
              .json({ notauthorized: "The user is not authorized" });
          }

          // Delete now that the user is correct
          post.remove().then(() => {
            res.status(200).json({ success: "Post was successfully deleted" });
          });
        })
        .catch(err =>
          res.status(404).json({ postnotfound: "No post was found" })
        );
    });
  }
);

module.exports = router;
