IrregularShapes
===============

The irregular shapes library Github

This is a library for canvas, to draw some geometric shapes, lines and curves in an "imperfect" way, some "hand drawn" styled.

Demo
----
- [http://javisperez.com/experiments/irregularshapes/](http://javisperez.com/experiments/irregularshapes/)
- [https://codepen.io/javisperez/pen/IfCAG/](https://codepen.io/javisperez/pen/IfCAG/)

Methods
-------

* setContext(context)  
Set the reference to the context to use.

* setChunkSize(float size)  
Set the size of each "chunk" of path used to form the final shape.
Expect any decimal value, the larger the value, the less CPU and memory usage, but less realistic looks.

* setNoise(float x, float y)  
The amount of distortion to use on X and Y axis.

* drawLine(int from x, int from y, int to x, int to y)  
Draw a line, this method tries to mimic the native "lineTo" method.

* drawRect(int x, int y, int width, int height)  
Draw a rectangle. This method tries to mimic the native "fillRect" method.

* drawArc(int x, int y, int radius, float start angle, float end angle)  
Draw an arc or circle if angles goes from 0 to Math.PI*2.
This method mimic the original "arc" method.

* drawQuadraticCurve(int from x, int from y, int point x, int point y, int to x, in to y)  
Draw a quadratic curve from point "(from x, from y)" to "(to x, to y)" and applies the given control point position.
This method pretend to be used as the original "quadraticCurveTo" method.

* drawBezierCurve(int from x, int from y, int point1 x, int point1 y, int point2 x, int point2 y, int to x, in to y)  
Draw a bezier curve from point "(from x, from y)" to "(to x, to y)" and applies the given control points positions.
This method pretend to be used as the original "bezierCurveTo" method.

* drawPoly(int x, int y, int sides, int edge size, float rotation angle)  
Draw a polygon of the given sides, and with edges of the given size. Also rotates the polygon in the given rotation angle, from 0 to Math.PI*2.

* drawStar(int x, int y, int points, int outter radius, int inner radius)  
Draw a star of the given number of points, and applies the outter and inner radius.

Sample Code
-----------

Javascript

    var canvas    = document.getElementById('canvas');
    var ctx       = canvas.getContext('2d');
    var irregular = new IrregularShapes();
    
    irregular.setContext(ctx);
    irregular.drawPoly(400, 400, 5, 100);

    ctx.stroke();

HTML
<pre>
    <script src="IrregularShapes.js"></script>
    <canvas id="canvas" width="800" height="800"></canvas>
</pre>

Author
------

Javis V. Pérez. 2013, [http://www.javisperez.com](http://www.javisperez.com), @javisperez
