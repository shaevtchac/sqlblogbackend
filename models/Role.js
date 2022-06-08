module.exports = (sequelize, DataTypes) => {
    const Role = sequelize.define(
        "Role",
        {
            name: {
                type: DataTypes.STRING,
            },
            value: {
                type: DataTypes.INTEGER,
            },
        },
        { timestamps: false }
    );
    Role.associate = (models) => {
        Role.belongsToMany(models.User, { through: models.UserRole });
    };

    return Role;
};
