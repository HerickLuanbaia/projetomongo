// 1. importar as bibliotecas 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

//config servidor express

const app = express();
app.use(cors());// permite que o front end acesse este back end
app.use(express.json());

//3. conectar ao mongoDB
//!!! SUBSTITUIA PELA SUA STRING DE CONEXÃO!!!
const mongoURI = '';
mongoose.connect(mongoURI, {useNewUrlparse: true, useUnifiedTopology: true})
    .then(() => console.log('conectando ao mongoDB com sucesso'))
    .catch(() => console.error('Erro ao conectar ao MongoDB:', err));

//4. definir o "Schema" - A estrutura dos dados 
// que corresponderá à estrutura do seu formulario
const relatorioSchemar = new mongoose.Schema({
    titulo: String,
    tipo: String,
    ano: Number,
    status: String,
    data_envio: Date,
    responsavel:{
        nome: String,
        cargo: String,
        departamento: String
    },
    palavras_chaves:[String],
    revisoes: [{
        data: Date,
        revisado_por: String,
        comentario: String
    }]
});

// 5. criar o "model" - o objeto que representa sua coleção no banco
const Relatorio = mongoose.model('Relatorio', relatorioSchema);

//6. criar a "Rota" "Endpoint" = a url que o front irá chamar

app.post('/salvar-relatorio', async(req, res) => {
    try{
        //pegar os daods que o front end enviou(estão em req.body)
        const dadosDoFormulario = req.body;
        // criar um novo documento com base nos dados
        const novoRelatorio = new Relatorio(dadosDoFormulario);
        // salva o documento no banco de dados
        await novoRelatorio.save();
        // envia uma resposta de sucesso de volta para o front
        res.status(201).json({mensage:'Relatorio salvo com sucesso!'});
        console.log('reçatório salvo:', novoRelatorio);
    }catch(error){
        // se der erro, envia uma menssagem de erro
        res.status(500).json({ message: ' Ocorreu um erro ao salvo o relatorio.',
        error: error});
        console.error('Erro ao salvar:', erro);
    }
});

const PORT= 3000;// a port em que o back end irá roda
app.listen(PORT, () =>{
    console.log(`Sevidor back-end rodando na porta ${PORT}`);
});

