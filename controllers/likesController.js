const { Like } = require("../models");

const toggleLike = async (req, res) => {
    if (!req?.body?.PostId) {
        return res.status(400).json({ message: "PostId is required" });
    }

    try {
        const like = await Like.findOne({
            where: {
                PostId: req.body.PostId,
                UserId: req.user.id,
            },
        });
        if (like) {
            try {
                await like.destroy();
                res.sendStatus(204);
            } catch (error) {
                return res.status(500).json(error);
            }
        } else {
            try {
                await Like.create({
                    PostId: req.body.PostId,
                    UserId: req.user.id,
                });

                res.sendStatus(201);
            } catch (err) {
                res.status(500).json(err);
            }
        }
    } catch (error) {
        return res.status(500).json(error);
    }
};

module.exports = {
    toggleLike,
};
