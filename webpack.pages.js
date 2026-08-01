// Маппинг HTML-страниц и их JS-чанков для автоматической генерации HtmlWebpackPlugin
module.exports = {
	'index.html': {
		chunks: ['main'],
	},
	'concept.html': {
		chunks: ['main', 'concept'],
	},
	'restaurant.html': {
		chunks: ['main', 'restaurant'],
	},
	'garden.html': {
		chunks: ['main', 'garden'],
	},
	'system.html': {
		chunks: ['main', 'system'],
	},

	// Добавляйте новые страницы просто новой записью, например:
	// 'gallery.html': {
	//   chunks: ['main', 'gallery'],
	// },
	// 'contact.html': {
	//   chunks: ['main', 'contact'],
	// },
};