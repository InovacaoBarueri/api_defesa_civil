const express = require('express');
const app = express();
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const Alerts = require('./models/Post');

app.locals.helpers = {
    ifEqual: function(v1, v2, options) {
      return v1 === v2 ? options.fn(this) : options.inverse(this);
    }
  };

// Config
    // Template Engine
        app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}));
        app.set('view-engine', 'handlebars');
    // Body parser
        app.use(bodyParser.urlencoded({extended: false}));
        app.use(bodyParser.json());
  

// Rotas

    app.get('/cad', function(req, res){
        res.render('formulario.handlebars');
    })

    //Para mudar a forma que está ordenada usar atributo order:
    app.get('/', function(req,res){
        Alerts.findAll().then(function(alerts){
            res.render('home.handlebars', {alerts: alerts})
        })
    })

    app.get('/json', function(req, res) {
        Alerts.findAll().then(function(alerts) {
            res.json(toJson(alerts));
        });
    });
    
    function toJson(alerts) {
        return alerts.map(alert => {
            return {
                id: alert.id,
                title: alert.title,
                subtitle: alert.subtitle,
                content: alert.content,
                risk: alert.risk,
                affectedRegions: alert.affectedRegions,
                // Adicione outras propriedades que deseja incluir no JSON
            };
        });
    }

    app.post('/add', function(req, res){
        Alerts.create({
            title: req.body.title,
            content: req.body.content,
            subtitle: req.body.subtitle,
            risk: req.body.risk,
            affectedRegions: req.body.affectedRegions,
            image: req.body.image,
        }).then(function(){
            res.redirect('/')
        }).catch(function(erro){
            res.send("Houve um erro: " + erro)
        });
    })

    app.get('/deletar/:id', function(req, res){
        Alerts.destroy({where: {'id': req.params.id}}).then(function(){
            res.send('Postagem deletada com sucesso!')
        }).catch(function(erro){
            res.send('Essa postagem não existe!')
        });
    });

    app.get('/update/:id', function(req, res) {
        // Fetch the alert with the specified ID
        Alerts.findByPk(req.params.id).then(function(alert) {
          if (!alert) {
            // Handle case where alert is not found
            return res.send('Alert not found!');
          }
      
          // Render the update form template, passing the alert data
          res.render('update.handlebars', { alert: alert });
        }).catch(function(error) {
          // Handle database errors
          res.send('Error fetching alert: ' + error);
        });
      });
      
      app.post('/update', function(req, res) {
        // Extract updated data from form submission
        const { title, subtitle, content, risk, affectedRegions } = req.body;
      
        // Validate input (optional, replace with your validation logic)
        if (!title || !subtitle || !content || !risk || !affectedRegions) {
          return res.send('Please fill in all required fields!');
        }
      
        // Update the alert with new data, excluding the ID
        Alerts.update({
          title,
          subtitle,
          content,
          risk,
          affectedRegions
        }, {
          where: { id: req.body.id } // Update by ID
        }).then(function() {
          res.redirect('/'); // Redirect to home page
        }).catch(function(error) {
          // Handle database errors
          res.send('Error updating alert: ' + error);
        });
      });
 
      const PORT = 3000; // Porta desejada
      const HOST = '192.168.180.16'; // Endereço IP da sua máquina
      app.listen(PORT, HOST, () => {
          console.log(`Servidor rodando em http://${HOST}:${PORT}`);
      });