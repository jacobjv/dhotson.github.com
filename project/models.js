var Task = Backbone.Model.extend({
	initialize: function(options) {
		this.set({
			label: options.label || '',
			start: options.start || 0,
			length: options.length || 0,
			dependencies: new TaskList(options.dependencies || [])
		});

		this.get('dependencies').bind('reset', _.bind(function() {
			this.get('dependencies').each(function(task) {
				task.bind('change', function() {
					this.trigger('change');
				});
			});
		}, this)).trigger('reset');

	},

	start: function(log) {
		var depStart = this.get('dependencies').end();
		return depStart ? depStart : this.get('start');
	},

	end: function() {
		return this.start() + this.len();
	},

	len: function() {
		return this.get('length');
	},

	dependsOn: function(task) {
		this.get('dependencies').add(task);
	}
});

var TaskList = Backbone.Collection.extend({
	model: Task,

	start: function() {
		var min = this.min(function(task) {
			return task.start();
		});

		return min ? min.start() : 0;
	},

	end: function() {
		var max = this.max(function(task) {
			return task.end();
		});

		return max ? max.end() : 0;
	},

	len: function() {
		return this.end() - this.start();
	}
});
