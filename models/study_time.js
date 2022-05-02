module.exports = (sequelize, DataTypes) => {
    return sequelize.define('study_time', {
        user_id: DataTypes.STRING,
        date: {
            type: DataTypes.DATEONLY,
        },
        study_time: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        }
    }, {
        timestampes: false,
    })
}