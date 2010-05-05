function Vector(x, y)
{
	this.x = x;
	this.y = y;
}

Vector.prototype.add = function(v2)
{
	return new Vector(this.x + v2.x, this.y + v2.y);
};

Vector.prototype.subtract = function(v2)
{
	return new Vector(this.x - v2.x, this.y - v2.y);
};

Vector.prototype.multiply = function(n)
{
	return new Vector(this.x * n, this.y * n);
};

Vector.prototype.divide = function(n)
{
	return new Vector(this.x / n, this.y / n);
};

Vector.prototype.magnitude = function()
{
	return Math.sqrt(this.x*this.x + this.y*this.y);
};

Vector.prototype.normal = function()
{
	return new Vector(-this.y, this.x);
};

Vector.prototype.normalise = function()
{
	return this.divide(this.magnitude());
};

Vector.random = function()
{
	return new Vector(Math.random() * width, Math.random() * height);
};

function Point(position, mass)
{
	this.p = position; // position
	this.m = mass; // mass
	this.v = new Vector(0, 0); // velocity
	this.f = new Vector(0, 0); // force

	Point.points.push(this);
}
Point.points = [];

Point.prototype.applyForce = function(force)
{
	this.f = this.f.add(force.divide(this.m));
};

Point.updateVelocity = function(timestep)
{
	var damping = 0.9; // damping constant, points lose velocity over time
	Point.points.forEach(function(p) {
		p.v = p.v.add(p.f.multiply(timestep)).multiply(damping);
		p.f = new Vector(0,0);
	});
};

Point.updatePosition = function(timestep)
{
	Point.points.forEach(function(p) {
		p.p = p.p.add(p.v.multiply(timestep));
	});
};



function start()
{
	var intervalId = setInterval(function() {

		Point.points.forEach(function(p){
			var f1 = new Vector(
				20.0 * (Math.sin(p.p.x / 10.0)) + (Math.random() * 100 - 50),
				20.0 * (Math.sin(p.p.y / 10.0)) + (Math.random() * 100 - 50)
			);

			var d = new Date();
			var s = d.getSeconds();
			var ms = d.getMilliseconds();
			var pc = (s + ms/1000) / 10;

			var offset = new Vector(200 * Math.sin(4*Math.PI*pc), 200 * Math.cos(2.567*Math.PI*pc));
			var normal = mid.add(offset).subtract(p.p).normal();
			var f2 = normal.multiply(80).divide(normal.magnitude());
			var f3 = normal.multiply(0.1); //
			var f4 = mid.add(offset).subtract(p.p).multiply(20.0).divide(normal.magnitude());

			p.applyForce(f1);
			p.applyForce(f2);
			p.applyForce(f3);
			p.applyForce(f4);
		});

		Point.updateVelocity(0.05);
		Point.updatePosition(0.05);
	}, 10);
}
</script>



<script>

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var width = canvas.width;
var height = canvas.height;

var mid = new Vector(width/2, height/2);

var animIntervalId = setInterval(function() {

	ctx.globalCompositeOperation = 'source-over';
	ctx.fillStyle = 'rgba(0,0,0, 0.5)';
	ctx.fillRect(0, 0, width, height);

	Point.points.forEach(function(p){
		if (p.p.x < 0)
			p.p.x = width - p.p.x;
		else
			p.p.x = p.p.x % width;

		if (p.p.y < 0)
			p.p.y = height - p.p.y;
		else
			p.p.y = p.p.y % height;

		var tail1 = p.p.subtract(p.v.divide(5.0));
		ctx.lineWidth = 2.0;
		ctx.strokeStyle = '#FFFFFF';
		ctx.beginPath();
		ctx.moveTo(p.p.x, p.p.y);
		ctx.lineTo(tail1.x, tail1.y);
		ctx.stroke();
	});

}, 10);




for (var i=0; i<99; i++)
{
	new Point(Vector.random(), 1.0);
}

start();

