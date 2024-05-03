const db = require('./db');

const Alerts = db.sequelize.define('postagens', {
    title: {
        type: db.Sequelize.STRING
    },
    subtitle: {
        type: db.Sequelize.TEXT
    },
    content: {
        type: db.Sequelize.TEXT
    },
    risk: {
        type: db.Sequelize.STRING
    },
    affectedRegions: {
        type: db.Sequelize.STRING
    },
});


module.exports = Alerts

// Alerts.sync({force: true})

