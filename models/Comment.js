module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define("Comment", {
        body: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });

    return Comment;
};
