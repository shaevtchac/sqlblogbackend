const express = require("express");
const router = express.Router();
const commentsController = require("../../controllers/commentsController");
const ROLES_LIST = require("../../config/roles_list");
const verifyJWT = require("../../middleware/verifyJWT");
const verifyRoles = require("../../middleware/verifyRoles");

router
    .route("/")
    .get(commentsController.getAllComments)
    .post(verifyJWT, commentsController.createNewComment)
    .put(
        verifyJWT,
        verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor, ROLES_LIST.Owner),
        commentsController.updateComment
    )
    .delete(
        verifyJWT,
        verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor, ROLES_LIST.Owner),
        commentsController.deleteComment
    );

router.route("/:id").get(commentsController.getComment);
router.route("/bypost/:id").get(commentsController.getPostComments);

module.exports = router;
