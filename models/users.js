module.exports = (sequelize, DataTypes) => {
    return sequelize.define('users', {
        user_id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        user_name: {
            type:DataTypes.STRING,
            allowNull:false,
        },
        balance: {
            type:DataTypes.INTEGER,
            defaultValue: 10000000,
            allowNull: false,
        },
    }, {
        timestamps: false,
    });
};