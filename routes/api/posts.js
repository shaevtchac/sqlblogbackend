const express = require("express");
const router = express.Router();
const postsController = require("../../controllers/postsController");
const ROLES_LIST = require("../../config/roles_list");
const verifyJWT = require("../../middleware/verifyJWT");
const verifyRoles = require("../../middleware/verifyRoles");

router
    .route("/")
    .get(postsController.getAllPosts)
    .post(verifyJWT, postsController.createNewPost)
    .put(
        verifyJWT,
        verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor, ROLES_LIST.Owner),
        postsController.updatePost
    )
    .delete(
        verifyJWT,
        verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor, ROLES_LIST.Owner),
        postsController.deletePost
    );

router.route("/byuser/:id").get(postsController.getUsersPosts);
router.route("/:id").get(postsController.getPost);

module.exports = router;
