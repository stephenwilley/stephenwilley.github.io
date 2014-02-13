var ESSTEC = ESSTEC || {};
ESSTEC.WebGLTest = new function() {
	// Internal vars
	var camera,
		controls,
		scene,
		renderer,
		$container  = $('#container'),
		width       = $container.width(),
		height      = $container.height(),
		callbacks,
		incrementer = 0.0,

	// Other Internal vars
		attributesUndulating,
		uniformsUndulating,

	// Core objects
		sphere,
		pointLight,

	// Constants
		NEAR     = 0.1,
		FAR      = 10000;

	/**
	 * Init function
	 */
	this.init = function() {
		// Add listeners
		addEventListeners();

		// Create stuff
		createRenderer();
		createObjects();
		    
		// Start rendering after a first resize
		callbacks.windowResize();
		update();
	}

	/**
	 * Sets up the event listeners for window resize
	 */
	function addEventListeners() {
		// Window event
		$(window).resize(callbacks.windowResize);
	}

	/**
	 * Create the WebGL Renderer
	 */
	function createRenderer() {
		renderer = new THREE.WebGLRenderer({antialias:true});

		camera = new THREE.PerspectiveCamera(45, width / height, NEAR, FAR);
		controls = new THREE.OrbitControls(camera);
		//controls.addEventListener('change', update);

		scene = new THREE.Scene();

		// Position the camera
		camera.position.z = 300;

		// Start the renderer
		renderer.setSize(width, height);
		$container.append(renderer.domElement);
	}

	/**
	 * Create the objects for the scene
	 */
	function createObjects() {
		createUndulatingSphere();
	}

	/**
	 * Create undulating sphere
	 */
	function createUndulatingSphere() {
		// Set up the uniforms for the shader
		uniformsUndulating = {
			amplitude: {
				type: 'f', // a float
				value: 0
			}
		};

		// Set up the attributes for the shader
		attributesUndulating = {
			displacement: {
				type: 'f', // a float
				value: [] // an empty array
			}
		};

		// Create the material
		undulatingMaterial = new THREE.ShaderMaterial({
			uniforms: uniformsUndulating,
			attributes: attributesUndulating,
			vertexShader: ESSTEC.Shaders.undulating.vertex,
			fragmentShader: ESSTEC.Shaders.undulating.fragment
		});

		// Create the geometry
		sphereGeometry = new THREE.Mesh( new THREE.SphereGeometry(50, 16, 16),
			undulatingMaterial);

		// Set the attributes
		var verts = sphereGeometry.geometry.vertices;
		var values = attributesUndulating.displacement.value;
		for (var v = 0; v < verts.length; v++) {
			values.push(Math.random() * 30);
		}

		// Add it to the scene
		scene.add(sphereGeometry);
	}

	/**
	 * Updates stuff
	 */
	function update() {
		uniformsUndulating.amplitude.value = Math.sin(incrementer) * 0.1;
		incrementer += 0.1;

		requestAnimationFrame(render);
	}

	/**
	 * Renders the current state
	 */
	function render() {
		// Just render
		if(renderer) {
			renderer.render(scene, camera);
		}

		// Next frame
		update();
	}

	/**
	 * Our internal callbacks object - a neat
	 * and tidy way to organise the various
	 * callbacks in operation.
	 */
	callbacks = {
		windowResize: function() {
			if(renderer)
			{
				WIDTH			= $container.width(),
				HEIGHT			= $container.height(),
				camera.aspect 	= WIDTH / HEIGHT,
				renderer.setSize(WIDTH, HEIGHT);
			
				camera.updateProjectionMatrix();
			}
		}
	}
}