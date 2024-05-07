const express = require('express');
const cors = require('cors');
const app = express();
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const Alerts = require('./models/Post');

app.locals.helpers = {
    ifEqual: function(v1, v2, options) {
      return v1 === v2 ? options.fn(this) : options.inverse(this);
    }
};

// Configuração de CORS
app.use(cors());

// Configuração do body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configuração do template engine
app.engine('handlebars', handlebars.engine({ defaultLayout: 'main' }));
app.set('view-engine', 'handlebars');

// Rotas
app.get('/cad', function(req, res){
    res.render('formulario.handlebars');
});

app.get('/', function(req,res){
    Alerts.findAll().then(function(alerts){
        res.render('home.handlebars', {alerts: alerts})
    });
});

app.get('/api/alerts', function(req, res) {
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
            image: alert.image // Adicionando a propriedade 'image'
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
        image: req.body.image // Adicionando a propriedade 'image'
    }).then(function(){
        res.redirect('/');
    }).catch(function(erro){
        res.send("Houve um erro: " + erro);
    });
});

app.get('/deletar/:id', function(req, res){
    Alerts.destroy({where: {'id': req.params.id}}).then(function(){
        res.send('Postagem deletada com sucesso!');
    }).catch(function(erro){
        res.send('Essa postagem não existe!');
    });
});

app.get('/update/:id', function(req, res) {
    Alerts.findByPk(req.params.id).then(function(alert) {
        if (!alert) {
            return res.send('Alert not found!');
        }
        res.render('update.handlebars', { alert: alert });
    }).catch(function(error) {
        res.send('Error fetching alert: ' + error);
    });
});

app.post('/update', function(req, res) {
    const { title, subtitle, content, risk, affectedRegions, image } = req.body;
  
    if (!title || !subtitle || !content || !risk || !affectedRegions) {
        return res.send('Please fill in all required fields!');
    }
  
    Alerts.update({
        title,
        subtitle,
        content,
        risk,
        affectedRegions,
        image // Adicionando a propriedade 'image'
    }, {
        where: { id: req.body.id }
    }).then(function() {
        res.redirect('/');
    }).catch(function(error) {
        res.send('Error updating alert: ' + error);
    });
});

const PORT = 3000;
const HOST = '192.168.180.16';
app.listen(PORT, HOST, () => {
    console.log(`Servidor rodando em http://${HOST}:${PORT}`);
});
