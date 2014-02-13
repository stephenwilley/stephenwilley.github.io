var ESSTEC = ESSTEC || {};
ESSTEC.WebGLTest = new function() {
	// Internal vars
	var camera,
		controls,
		scene,
		renderer,
		$container = $('#container'),
		width      = $container.width(),
		height     = $container.height(),
		callbacks,

	// Other Internal vars
		attributesBasic01,
		uniformsBasic01,

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
		    
		// Start rendering
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
		controls.addEventListener('change', render);

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
		basic01Material = new THREE.ShaderMaterial({
			vertexShader: ESSTEC.Shaders.basic01.vertex,
			fragmentShader: ESSTEC.Shaders.basic01.fragment
		});

		sphereGeometry = new THREE.Mesh( new THREE.SphereGeometry(50, 16, 16),
			basic01Material);

		scene.add(sphereGeometry);
	}

	/**
	 * Updates stuff
	 */
	function update() {
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