module.exports = (sequelize, DataTypes) => {
    return sequelize.define('coins', {
        coin_userid: DataTypes.STRING,
        coin_name: DataTypes.STRING,
        coin_market: DataTypes.STRING,
        average_price: {
            type: DataTypes.FLOAT,
            allowNull: false,
            'default': 0.0,
        },
        amount: {
            type: DataTypes.FLOAT,
            allowNull: false,
            'default': 0.0,
        },
    }, {
        timestamps: false,
    })
}