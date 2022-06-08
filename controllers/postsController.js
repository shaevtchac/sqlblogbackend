const { Post, User, Like, Comment } = require("../models");

const getAllPosts = async (req, res) => {
    const posts = await Post.findAll({
        include: [
            { model: User, attributes: ["username"] },
            { model: Like, attributes: ["UserId"] },
            {
                model: Comment,
                attributes: ["id", "body", "username", "createdAt"],
            },
        ],
        order: [["id", "DESC"]],
    });
    if (!posts) return res.status(204).json({ message: "No posts found." });
    res.json(posts);
};

const createNewPost = async (req, res) => {
    if (!req?.body?.title || !req?.body?.body) {
        return res.status(400).json({ message: "Title and body are required" });
    }

    try {
        const result = await Post.create({
            title: req.body.title,
            body: req.body.body,
            UserId: req.user.id,
        });

        res.status(201).json(result);
    } catch (err) {
        res.status(500).json(err);
    }
};

const updatePost = async (req, res) => {
    if (!req?.body?.id) {
        return res.status(400).json({ message: "ID parameter is required." });
    }

    const post = await Post.findOne({ where: { id: req.body.id } });
    if (!post) {
        return res
            .status(204)
            .json({ message: `No post matches ID ${req.body.id}.` });
    }

    if (req?.checkOwnership) {
        if (Number.parseInt(post.UserId) !== Number.parseInt(req.user.id))
            return res.status(401).send("User is not an owner of the resource");
    }
    if (req.body?.title) post.title = req.body.title;
    if (req.body?.body) post.body = req.body.body;
    const result = await post.save();
    res.json(result);
};

const deletePost = async (req, res) => {
    if (!req?.body?.id)
        return res.status(400).json({ message: "Post ID required." });

    const post = await Post.findOne({ where: { id: req.body.id } });
    if (!post) {
        return res
            .status(204)
            .json({ message: `No post matches ID ${req.body.id}.` });
    }
    if (req?.checkOwnership) {
        if (Number.parseInt(post.UserId) !== Number.parseInt(req.user.id))
            return res.status(401).send("User is not an owner of the resource");
    }
    const result = await post.destroy();
    res.json(result);
};

const getPost = async (req, res) => {
    if (!req?.params?.id)
        return res.status(400).json({ message: "Post ID required." });

    const post = await Post.findOne({
        where: { id: req.params.id },
        include: User,
    });
    if (!post) {
        return res
            .status(204)
            .json({ message: `No post matches ID ${req.params.id}.` });
    }
    res.json(post);
};

const getUsersPosts = async (req, res) => {
    if (!req?.params?.id)
        return res.status(400).json({ message: "User ID required." });

    const posts = await Post.findAll({
        where: { UserId: req.params.id },
        include: [
            { model: User, attributes: ["username"] },
            { model: Like, attributes: ["UserId"] },
            {
                model: Comment,
                attributes: ["id", "body", "username", "createdAt"],
            },
        ],
        order: [["id", "DESC"]],
    });
    if (!posts) {
        return res
            .status(204)
            .json({ message: ` User ID ${req.params.id} has no posts` });
    }
    res.json(posts);
};

module.exports = {
    getAllPosts,
    createNewPost,
    updatePost,
    deletePost,
    getPost,
    getUsersPosts,
};
