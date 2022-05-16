module.exports = (sequelize, DataTypes) => {
    return sequelize.define('study_time', {
        study_id: DataTypes.STRING,
        date: {
            type: DataTypes.STRING,
        },
        study_start_time: {
            type: DataTypes.STRING,
        },
        studying_time: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        }
    }, {
        timestampes: true,
    })
}