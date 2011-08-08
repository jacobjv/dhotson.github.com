$(function() {
	var tasks = new TaskList();

	var projectView = new ProjectView({
		el : $('#project'),
		tasks: tasks,
	});

	var editView = new EditView({
		el : $('#edit'),
		projectView: projectView,
		tasks: tasks,
	});
	editView.render();

	// Some hardcoded tasks..
	var t1 = new Task({ label: 'Planning', start: 1, length: 3 });
	var t2 = new Task({ label: 'Estimation', length: 2 });
	var t3 = new Task({ label: 'Design', length: 3 });
	var t4 = new Task({ label: 'Coding', length: 4 });
	var t5 = new Task({ label: 'Testing', length: 10 });
	var t6 = new Task({ label: 'Pub', length: 6 });

	t2.dependsOn(t1);
	t3.dependsOn(t1);
	t3.dependsOn(t2);
	t4.dependsOn(t3);
	t5.dependsOn(t1);
	t6.dependsOn(t4);
	t6.dependsOn(t5);

	tasks.add([t1, t2, t3, t4, t5, t6]);

	// export vars..
	window.tasks = tasks;
	window.editView = editView;

	var canvasSupported = !!document.createElement('canvas').getContext;
	if (canvasSupported) {
		// Generate a sexy noisy background..
		var size = 50;
		var canvas = document.createElement('canvas');
		canvas.setAttribute('width', size);
		canvas.setAttribute('height', size);
		var context = canvas.getContext("2d");

		var r = function() { return Math.floor(Math.random()*128); };
		for (var y=0; y<size; y++) {
			for (var x=0; x<size; x++) {
				context.fillStyle = 'rgba('+r()+','+r()+','+r()+',0.05)';
				context.fillRect(x,y,1,1);
			}
		}
		$('body').css({ 'background': 'url("' + canvas.toDataURL() + '")' });
	}
});
