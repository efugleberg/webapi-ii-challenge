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

router.get("/comments", (req, res) => {
    Posts.fetchAllComments()
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
//   console.log(id);
//   Posts.findCommentById(id)
//     .then(comments => {
//       if (comments.length === 0) {
//         res
//           .status(404)
//           .json({ message: "The post with the specified ID does not exist." });
//         return;
//       }
//       res.json({ comments });
//     })
//     .catch(error => {
//       res
//         .status(500)
//         .json({ error: "The comments information could not be retrieved" });
//     });
// });

router.get("/:id/comments", (req, res) => {
    const { id } = req.params;
    console.log(id);
    Posts.findPostComments(id)
      .then(comments => {
        if (comments.length === 0) {
          res
            .status(404)
            .json({ message: "The post with the specified ID does not exist." });
          return;
        }
        res.json({ comments });
      })
      .catch(error => {
        res
          .status(500)
          .json({ error: "The comments information could not be retrieved" });
      });
  });

router.post("/", (req, res) => {
  const userPost = req.body;
  console.log(req.body);
  if (!userPost.title || !userPost.contents) {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post."
    });
  } else {
    Posts.insert(req.body)
      .then(post => {
        res.status(201).json(post);
      })
      .catch(error => {
        res.status(500).json({
          error: "there was an error while saving the post to the database"
        });
      });
  }
});

/// Close but not quite working yet
router.post("/:id/comments", (req, res) => {
  const { id } = req.params;
  const Comment = req.body;
  Comment.post_id = id;
  console.log(id);
  //   console.log(text);
  console.log(Comment);
  Posts.findById(id).then(post => {
    if (post.length === 0) {
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist" });
      return;
    }
    Posts.insertComment(Comment)
      .then(comment => {
        if (Comment === "") {
          res
            .status(400)
            .json({ errorMessage: "Please provide text for the comment." });
          return;
        }
        res.status(201).json(comment);
      })
      .catch(error => {
        res.status(500).json({
          error: "There was an error while saving the comment to the database."
        });
      });
  });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  Posts.remove(id)
    .then(deleted => {
      if (deleted) {
        res.status(204).end();
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(error => {
      res.status(500).json({ error: "the post could not be removed." });
    });
});

router.put("/:id", (req, res) => {
  const id = req.params.id;
  const changes = req.body;

  if (!changes.title || !changes.contents) {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post."
    });
  }
  Posts.update(id, changes)
    .then(updated => {
      if (!updated) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      } else {
        res.status(200).json(updated);
      }
    })
    .catch(error => {
      res
        .status(500)
        .json({ error: "The post information could not be modified." });
    });
});

module.exports = router; // <<<< Export modules.  Always remember to export module(s).
