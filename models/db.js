const Sequelize = require('sequelize')

  // Conexão com banco de dados MySql: 
  const sequelize = new Sequelize('postagens', 'root', '1234abc@', {
    host: "localhost",
    dialect: 'mysql',
    query:{raw:true}
});

module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize
}