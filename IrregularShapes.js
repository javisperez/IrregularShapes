/**
 * Irregular / imperfect geometric shapes library for canvas
 *  
 * Released under the MIT license
 * 
 * Copyright (c) 2013, Javis Perez, http://www.javisperez.com/
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
(function(window) {
    
    // Constructor
    var IrregularShapes = function(){
        
        /**
         * Defaults
         */
        this.CHUNK_SIZE = 5;
        this.X_DIRT = this.CHUNK_SIZE * .17;
        this.Y_DIRT = this.CHUNK_SIZE * .17;
        this.CTX = null;
        var _self = this;
        
        /**
         * Helpers
         */
        this.coord = function (x,y) {
            return {x: x || 0, y: y || 0};
        };
    
        // Finds the coordinates of a point at a certain stage through a bezier curve
        // Bezier function, credits: http://13thparallel.com/archive/bezier-curves/
        this.getBezier = function(percent,startPos,endPos,control1,control2) {
    
            var Q1 = function(t) { return (t*t*t); }
            var Q2 = function(t) { return (3*t*t*(1-t)); }
            var Q3 = function(t) { return (3*t*(1-t)*(1-t)); }
            var Q4 = function(t) { return ((1-t)*(1-t)*(1-t)); }
            
            var pos = new _self.coord();
    
            pos.x = startPos.x * Q1(percent) + control1.x * Q2(percent) + control2.x * Q3(percent) + endPos.x * Q4(percent);
            pos.y = startPos.y * Q1(percent) + control1.y * Q2(percent) + control2.y * Q3(percent) + endPos.y * Q4(percent);
            
            return pos;
        };
        
    };
    
    // Some variables to use as globals
    // Also, some setters and getters
    IrregularShapes.prototype.setChunkSize = function(newSize) {
        this.CHUNK_SIZE = newSize;
    };
    
    IrregularShapes.prototype.setNoise = function(noiseX, noiseY) {
        this.X_DIRT = noiseX;
        this.Y_DIRT = noiseY;
    };
    
    IrregularShapes.prototype.setContext = function(context) {
        this.CTX = context;
    };
    
    
    // Start the fun
    
    // drawLine method; Draws a single line
    // Arguments: from x, from y, to x, to y
    IrregularShapes.prototype.drawLine = function(x1, y1, x2, y2) {
        var cx = this.CTX;
        
        cx.save();
        cx.moveTo(x1, y1);
        
        // Distance of each point of the vector
        var distances = {
            x: x2 - x1,
            y: y2 - y1
        };
        // Get the total of chunkes (to use in main loop) by getting the vector module and dividing by chunk size
        var chunkes = Math.floor(Math.sqrt(Math.pow(distances.x,2) + Math.pow(distances.y, 2)) / this.CHUNK_SIZE);
        
        // Get chunks related to axis, not vector's module
        var chunksX = distances.x / chunkes;
        var chunksY = distances.y / chunkes;
        
        chunkes--;
        
        while (chunkes--) {
            // Position the chunk
            x1 += chunksX;
            y1 += chunksY;
            
            // Add noise
            x1 += Math.random()*this.X_DIRT*2 - this.X_DIRT;
            y1 += Math.random()*this.Y_DIRT*2 - this.Y_DIRT;
            
            // Draw the line
            cx.lineTo(x1, y1);
        }
        
        cx.lineTo(x2, y2);
        
        cx.restore();
    }
    
    // drawArc; Draws an arc, same arguments than original "arc" method
    // Arguments: center x, center y, radius, start angle, end angle
    IrregularShapes.prototype.drawArc = function(x, y, radius, startAngle, endAngle) {
        var cx = this.CTX;
        
        cx.save();
        cx.lineCap = 'round';
        
        var degrees = {
            start: startAngle * 180 / Math.PI,
            end: endAngle * 180 / Math.PI
        };
        
        var n = degrees.end - degrees.start;
        var chunkes = Math.floor( ((n / 360) * 2 * Math.PI * radius) / this.CHUNK_SIZE );
        var delta = (endAngle - startAngle) / chunkes;
        var g = startAngle;
        
        var ex = x + Math.sin(startAngle) * radius;
        var ey = y + Math.cos(startAngle) * radius;
        
        cx.moveTo(ex, ey);
        
        endAngle -= delta;
        
        while(g < endAngle) {
            var randX = Math.random() * this.X_DIRT;
            var randY = Math.random() * this.Y_DIRT;
            
            g += delta;
            
            ex = x + Math.sin(g) * radius;
            ey = y + Math.cos(g) * radius;
            
            x += Math.random()*this.X_DIRT*2 - this.X_DIRT;
            y += Math.random()*this.Y_DIRT*2 - this.Y_DIRT;
            
            cx.lineTo(ex, ey);           
        }
        cx.restore();
    };
    
    // drawRect; Draws a rectangle, same arguments than original "fillRect" method
    // Arguments: top left corner x, top left corner y, width, height
    IrregularShapes.prototype.drawRect = function(x, y, width, height) {
        var cx = this.CTX;
        cx.save();
        
        var x1 = x,
            y1 = y,
            x2 = x+width,
            y2 = y;
        
        cx.moveTo(x1, y1);
        
        for (var side=0; side<4; side++) {
            var distances = {
                x: x2 - x1,
                y: y2 - y1
            };
            
            var chunkes = Math.floor(Math.sqrt(Math.pow(distances.x,2) + Math.pow(distances.y, 2)) / this.CHUNK_SIZE);
            
            var chunksX = distances.x / chunkes;
            var chunksY = distances.y / chunkes;
            
            chunkes--;
            
            while (chunkes--) {
                // Position the chunk
                x1 += chunksX;
                y1 += chunksY;
                
                // Add noise
                x1 += Math.random()*this.X_DIRT*2 - this.X_DIRT;
                y1 += Math.random()*this.Y_DIRT*2 - this.Y_DIRT;
                
                // Draw the line
                cx.lineTo(x1, y1);
            }
            
            cx.lineTo(x2, y2);
            
            x1=x2;
            y1=y2;
            x2=x;
            y2=y+height;
            
            if(side==0) {
                x2 = x+width;
            } else
                if(side==2) {
                    y2 = y;
                }
        }
        
        cx.restore();
    };
    
    // drawBezierCurve; Draws a bezier curve, just like the original "bezierCurveTo" method
    // Arguments: from x, from y, control point 1 x, control point 1 y, control point 2 x, control point 2 y, to x, to y
    IrregularShapes.prototype.drawBezierCurve = function(fromX, fromY, p1X, p1Y, p2X, p2Y, endX, endY) {
    
        var cx = this.CTX;
        
        cx.save();
        cx.moveTo(endX, endY);
        
        var distances = {
            x: fromX - endX,
            y: fromY - endY
        };
        
        var chunkes = Math.floor(Math.sqrt(Math.pow(distances.x,2) + Math.pow(distances.y, 2)) / this.CHUNK_SIZE);
        
        var chunksX = distances.x / chunkes;
        var chunksY = distances.y / chunkes;
        
        var C1 = new this.coord(fromX, fromY);
        var C3 = new this.coord(p1X, p1Y);
        var C4 = new this.coord(p2X, p2Y);
        var C2 = new this.coord(endX, endY);
        
        var i = 0;
        
        while (i < chunkes) {
            
            var percent = i / chunkes;
            var pos = this.getBezier(percent, C1, C2, C3, C4);
            
            pos.x += Math.random()*this.X_DIRT*2 - this.X_DIRT;
            pos.y += Math.random()*this.Y_DIRT*2 - this.Y_DIRT;
            
            cx.lineTo(pos.x, pos.y);            
            i++;
        }
        
        cx.restore();
    };
    
    // drawQuadraticCurve; Draws a quadratic curve just like the "quadraticCurveTo" method
    // Arguments: from x, from y, control point x, control point y, to x, to y
    IrregularShapes.prototype.drawQuadraticCurve = function(fromX, fromY, pX, pY, endX, endY) {
        this.drawBezierCurve(fromX, fromY, pX, pY, pX, pY, endX, endY);
    }
    
    // drawPoly; Draws a polygon with multiples sides
    // Arguments: center x, center y, quantity of sides, edge size, rotation angle
    IrregularShapes.prototype.drawPoly = function(x, y, sides, size, angle) {
        
        var cx = this.CTX;
    
        cx.save();
    
        var a  = 2*Math.PI/sides;
        var d  = angle || Math.PI;
        var x1 = size;
        var y1 = 0;
        
        cx.translate(x,y);
        cx.rotate(d);
        cx.moveTo(x1, y1);
        
        for (var i = 1; i <= sides; i++) {
            var sizeX = size*Math.cos(a*i);
            var sizeY = size*Math.sin(a*i);
            
            var chunkes = Math.floor(size / this.CHUNK_SIZE);
            
            var chunksX = sizeX / chunkes;
            var chunksY = sizeY / chunkes;
            
            while (chunkes--) {
                // Position the chunk
                x1 += chunksX;
                y1 += chunksY;
                
                // Add noise
                x1 += Math.random()*this.X_DIRT*2 - this.X_DIRT;
                y1 += Math.random()*this.Y_DIRT*2 - this.Y_DIRT;
                
                // Draw the line
                cx.lineTo(x1, y1);
            }
        }
        cx.restore();
    }
    
    // drawStar; Draws a star width different points and internal radius
    // Taken from: http://codepen.io/stuffit/pen/hBrGf
    // Arguments: center x, center y, outter radius, inner radius, rotation angle
    IrregularShapes.prototype.drawStar = function(x, y, sides, outterRadius, innerRadius, rotation) {
    
        var cx = this.CTX;
        
        cx.save();
        
        var angle = Math.PI / sides;
        
        var lastX = x + Math.cos(-angle) * innerRadius;
        var lastY = y + Math.sin(-angle) * innerRadius;
        
        cx.moveTo(lastX, lastY);
        
        for (var i = 0; i < 2 * sides; i++) {
            var r = i % 2 == 1 ? innerRadius : outterRadius;
            var pointsX = x + Math.cos(i * angle) * r;
            var pointsY = y + Math.sin(i * angle) * r;
            
            var distances = {
                x: pointsX - lastX,
                y: pointsY - lastY
            };
            
            var chunkes = Math.floor(Math.sqrt(Math.pow(distances.x,2) + Math.pow(distances.y, 2)) / this.CHUNK_SIZE);
            
            var chunksX = distances.x / chunkes;
            var chunksY = distances.y / chunkes;
            
            while(chunkes--) {
                lastX += chunksX;
                lastY += chunksY;
                
                lastX += Math.random()*this.X_DIRT*2 - this.X_DIRT;
                lastY += Math.random()*this.Y_DIRT*2 - this.Y_DIRT;
                
                cx.lineTo(lastX, lastY);
            }
            
            lastX = pointsX;
            lastY = pointsY;
        }
        
        cx.restore();
    }
    
    // Create the global instance
    window.IrregularShapes = IrregularShapes;

})(window);
