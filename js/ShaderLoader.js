/**
 * via AEROTWIST
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

var ESSTEC = ESSTEC || {};
ESSTEC.Shaders = ESSTEC.Shaders || {};

// on doc ready load them in
$(document).ready(function() {
	// get all the shaders from the DOM
	var fragmentShaders = $('script[type="x-shader/x-fragment"]');
	var vertexShaders	= $('script[type="x-shader/x-vertex"]');
	var shaderCount		= fragmentShaders.length + vertexShaders.length;
	
	/**
	 * Checks if we have finished loading
	 * all of the shaders in the DOM
	 */
	function checkForComplete() {
		if(!shaderCount) {
			// GO!
			ESSTEC.WebGLTest.init();
		}
	}
	
	/**
	 * Loads a shader using AJAX
	 * 
	 * @param {Object} The script tag from the DOM
	 * @param {String} The type of shader [vertex|fragment]
	 */
	function loadShader(shader, type) {
		// wrap up the shader for convenience
		var $shader = $(shader);
		
		// request the file over AJAX
		$.ajax({
			url: $shader.data('src'),
			dataType: 'text',
			context: {
				name: $shader.data('name'),
				type: type
			},
			complete: processShader
		});
	}
	
	/**
	 * Processes a shader that comes back from
	 * the AJAX and stores it in the Shaders
	 * Object for later on
	 * 
	 * @param {Object} The jQuery XHR object
	 * @param {String} The response text, e.g. success, error
	 */
	function processShader(jqXHR, textStatus) {
		// one down... some to go?
		shaderCount--;
		
		// create a placeholder if needed
		if(!ESSTEC.Shaders[this.name]) {
			ESSTEC.Shaders[this.name] = {
				vertex: '',
				fragment: ''
			};
		}
		
		// store it and check if we're done
		ESSTEC.Shaders[this.name][this.type] = jqXHR.responseText;
		checkForComplete();
	}
	
	// load the fragment shaders
	for(var f = 0; f < fragmentShaders.length; f++) {
		var fShader = fragmentShaders[f];
		loadShader(fShader, 'fragment');
	}
	
	// and the vertex shaders
	for(var v = 0; v < vertexShaders.length; v++) {
		var vShader = vertexShaders[v];
		loadShader(vShader, 'vertex');
	}
	
	// there may be none so just
	// check that here
	checkForComplete();
});