const { Comment } = require("../models");

const getAllComments = async (req, res) => {
    const comments = await Comment.findAll();
    if (!comments)
        return res.status(204).json({ message: "No comments found." });
    res.json(comments);
};

const createNewComment = async (req, res) => {
    if (!req?.body?.body || !req?.body?.PostId) {
        return res
            .status(400)
            .json({ message: "Username and body and PostId are required" });
    }

    try {
        const result = await Comment.create({
            username: req.user.username,
            body: req.body.body,
            PostId: req.body.PostId,
        });

        res.status(201).json(result);
    } catch (err) {
        res.status(500).json(err);
    }
};

const updateComment = async (req, res) => {
    if (!req?.body?.id) {
        return res.status(400).json({ message: "ID parameter is required." });
    }

    const comment = await Comment.findOne({ where: { id: req.body.id } });
    if (!comment) {
        return res
            .status(204)
            .json({ message: `No comment matches ID ${req.body.id}.` });
    }

    if (req?.checkOwnership) {
        if (comment.username !== req.user.username)
            return res.status(401).send("User is not an owner of the resource");
    }
    if (req.body?.body) comment.body = req.body.body;
    const result = await comment.save();
    res.json(result);
};

const deleteComment = async (req, res) => {
    if (!req?.body?.id)
        return res.status(400).json({ message: "Comment ID required." });

    const comment = await Comment.findOne({ where: { id: req.body.id } });
    if (!comment) {
        return res
            .status(204)
            .json({ message: `No comment matches ID ${req.body.id}.` });
    }
    if (req?.checkOwnership) {
        if (comment.username !== req.user.username)
            return res.status(401).send("User is not an owner of the resource");
    }
    const result = await comment.destroy();
    res.json(result);
};

const getComment = async (req, res) => {
    if (!req?.params?.id)
        return res.status(400).json({ message: "Comment ID required." });

    const comment = await Comment.findOne({ where: { id: req.params.id } });
    if (!comment) {
        return res
            .status(204)
            .json({ message: `No comment matches ID ${req.params.id}.` });
    }
    res.json(comment);
};

const getPostComments = async (req, res) => {
    if (!req?.params?.id)
        return res.status(400).json({ message: "Post ID required." });

    const comments = await Comment.findAll({
        where: { PostId: req.params.id },
    });
    if (!comments) {
        return res
            .status(204)
            .json({ message: ` Post ID ${req.params.id} has no comments` });
    }
    res.json(comments);
};

module.exports = {
    getAllComments,
    createNewComment,
    updateComment,
    deleteComment,
    getComment,
    getPostComments,
};
