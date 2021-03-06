var models = require('../models/models.js');

// Autoload :id de comentarios
exports.load = function(req, res, next, commentId) {
	models.Comment.find({
			where: {
				id: Number(commentId)
			}
	}).then(function(comment) {
			if(comment) {
				req.comment = comment;
				next();
			} else {next(new Error('No existe commentId=' + commentId))}
		}
	).catch(function(error){next(error)});
};

// GET /quizes/:quizId/comments/new
exports.new = function(req,res) {
	res.render('comments/new.ejs', {quizid: req.params.quizId, errors: []});
};

// POST /quizes/:quizId/comments
exports.create = function(req,res) {
	var comment = models.Comment.build (
	{ texto: req.body.comment.texto,
	  QuizId: req.params.quizId
	  });
	
	comment
	.validate()
	.then(
		function(err){
			if (err){
				res.render('comments/new.ejs',
				{comment: comment, quizid: req.params.quizId, errors: err.errors});
			} else { 
				comment //guarda en DB el campo de texto de comment
				.save()
				.then( function(){ res.redirect('/quizes/'+req.params.quizId);})	//res.redirect: Redireccion HTTP a la lista de preguntas
			}
		}
	).catch(function(error){next(error)});
};

// GET /quizes/:quizId/comments/:commentId/publish
exports.publish = function(req, res) {
	req.comment.publicado = true;
	
	req.comment.save({fields: ["publicado"]})
	.then( function(){res.redirect('/quizes/'+req.params.quizId);} )
	.catch(function(error){next(error)});
};

//PUT /quizes/:id
exports.update = function(req, res) {
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;
	req.quiz.tema = req.body.quiz.tema;
	
	req.quiz
	.validate()
	.then(
		function(err){
			if(err){
				res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
			} else {
				req.quiz
				.save( {fileds: ["pregunta", "respuesta", "tema"]})
				.then( function(){ res.redirect('/quizes');});
			} // Redireccion HTTP a lista de preguntas (URL relativo)
		}
	);
};

// DELETE /quizes/:id
exports.destroy = function(req,res) {
	req.quiz.destroy().then( function() {
		res.redirect('/quizes');
	}).catch(function(error){next(error)});
};
