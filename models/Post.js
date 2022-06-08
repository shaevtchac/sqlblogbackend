module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define("Post", {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        body: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    });

    Post.associate = (models) => {
        Post.hasMany(models.Comment, {
            onDelete: "cascade",
        });
        Post.hasMany(models.Like, {
            onDelete: "cascade",
        });
        Post.belongsTo(models.User, {
            onDelete: "cascade",
        });
    };

    return Post;
};
