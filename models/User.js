module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        refreshToken: {
            type: DataTypes.STRING,
        },
    });

    User.associate = (models) => {
        User.hasMany(models.Post, {
            onDelete: "cascade",
        });
        User.hasMany(models.Like, {
            onDelete: "cascade",
        });
        User.belongsToMany(models.Role, { through: models.UserRole });
    };

    return User;
};
