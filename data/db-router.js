const express = require("express");

const Posts = require("./db.js");

const router = express.Router();

router.use(express.json()); // << for URL's beginning with /api/posts

router.get("/", (req, res) => {
  Posts.find()
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(error => {
      res
        .status(500)
        .json({ error: "The posts information could not be retrieved" });
    });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;

  Posts.findById(id)
    .then(post => {
      if (post && post.length) {
        res.status(200).json(post);
      } else {
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exist" });
      }
    })
    .catch(error => {
      res
        .status(500)
        .json({ error: "The post information could not be retrieved." });
    });
});

// router.get("/:id/comments", (req, res) => {
//   const { id } = req.params;

//   if (!id) {
//     res
//       .status(404)
//       .json({ errorMessage: "The post with the specified ID does not exist" });
//   } else {
//     Posts.findCommentById(id)
//       .then(comments => {
//         if (comments && comments.length) {
//           res.status(200).json(comments);
//         }
//       })
//       .catch(error => {
//         res
//           .status(500)
//           .json({ error: "The comments information could not be retrieved" });
//       });
//   }
// });

router.post("/", (req, res) => {
  const userPost = req.body;
  console.log(req.body);
  if (!userPost.title || !userPost.contents) {
    res
      .status(400)
      .json({
        errorMessage: "Please provide title and contents for the post."
      });
  } else {
    Posts.insert(req.body)
      .then(post => {
        res.status(201).json(post);
      })
      .catch(error => {
        res
          .status(500)
          .json({
            error: "there was an error while saving the post to the database"
          });
      });
  }
});

module.exports = router; // <<<< Export modules.  Always remember to export module(s).
