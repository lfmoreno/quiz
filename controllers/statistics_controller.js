var models = require('../models/models.js');
var totalpreguntas = 0;
var totalcomentarios = 0;
var comentporpreg = 0;
var totpregcoment = 0;
var totpregsincoment = 0;
	
// GET /quizes/statistics
exports.show = function(req,res) {

	
	models.Quiz.count().then(function (preguntas) {
				totalpreguntas = preguntas;
				// console.log("Hay " + totalpreguntas + " preguntas!");
			}
		);

	models.Comment.count().then(function (comentarios) {
				totalcomentarios = comentarios;
				// console.log("Hay " + totalcomentarios + " comentarios!");
				if (totalpreguntas > 0) 
					comentporpreg = totalcomentarios / totalpreguntas;
			
				// console.log("Hay " + comentporpreg + " comentarios por pregunta!");
			}
		);

	models.Quiz.findAll( {include: [{ model: models.Comment }]
		}).then(function (preguntas) {
				totpregcoment = 0;
				for (var index in preguntas) {
					if((preguntas[index].Comments) && (preguntas[index].Comments.length > 0)){
						totpregcoment++;
					}
				}
				// console.log("Hay " + totpregcoment + " preguntas con comentarios!");
				totpregsincoment = 0;
				totpregsincoment = totalpreguntas - totpregcoment;
				// console.log("Hay " + totpregsincoment + " preguntas sin comentarios!");
			}
		);
	
	
	res.render('statistics/show',
	{ tpreguntas: totalpreguntas, tcomentarios: totalcomentarios, cporpreg: comentporpreg, tpregcoment: totpregcoment, tpregsincoment: totpregsincoment, errors: []}
	);
	
};
