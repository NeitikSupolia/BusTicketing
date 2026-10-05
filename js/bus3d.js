/**
 * NexaBus 3D Highway Experience
 * Realistic procedural Three.js simulation of a luxury multi-axle express coach cruising on a scenic highway.
 */

class Bus3DSimulation {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.speedKmH = 90; // Default 90 km/h
    this.speedFactor = 1.0;
    this.isHeadlightsOn = true;
    this.isCabinLightsOn = true;
    this.cameraMode = 'orbit'; // 'orbit', 'chase', 'front', 'top'
    this.timeOfDay = 'night'; // 'night', 'dusk', 'day'
    this.roadOffset = 0;
    this.wheels = [];
    this.streetLamps = [];
    this.milestones = [];
    this.audioCtx = null;

    this.init();
  }

  init() {
    // 1. Scene & Fog
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x0a0e1a, 0.007);

    // 2. Camera
    const aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.5, 1000);
    this.setCameraPreset('orbit');

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;
    this.container.appendChild(this.renderer.domElement);

    // 4. Lighting
    this.setupLighting();

    // 5. Environment & Highway
    this.createSkyDome();
    this.createHighway();
    this.createScenery();

    // 6. Luxury 3D Bus Model
    this.createLuxuryBus();

    // 7. Interaction Handlers
    this.setupMouseControls();
    window.addEventListener('resize', () => this.onWindowResize());

    // 8. Start Animation Loop
    this.clock = new THREE.Clock();
    this.animate();
  }

  setupLighting() {
    this.ambientLight = new THREE.AmbientLight(0x1a233a, 0.8);
    this.scene.add(this.ambientLight);

    this.dirLight = new THREE.DirectionalLight(0x7dd3fc, 0.6);
    this.dirLight.position.set(50, 80, 50);
    this.dirLight.castShadow = true;
    this.dirLight.shadow.mapSize.width = 1024;
    this.dirLight.shadow.mapSize.height = 1024;
    this.scene.add(this.dirLight);

    // Highway overhead subtle glow
    this.overheadGlow = new THREE.PointLight(0x6366f1, 1.2, 50);
    this.overheadGlow.position.set(0, 15, 0);
    this.scene.add(this.overheadGlow);
  }

  createSkyDome() {
    const skyGeo = new THREE.SphereGeometry(400, 32, 16);
    const skyMat = new THREE.MeshBasicMaterial({
      color: 0x050814,
      side: THREE.BackSide
    });
    this.skyMesh = new THREE.Mesh(skyGeo, skyMat);
    this.scene.add(this.skyMesh);

    // Add starry particles
    const starsGeo = new THREE.BufferGeometry();
    const starCount = 600;
    const starPos = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i += 3) {
      starPos[i] = (Math.random() - 0.5) * 600;
      starPos[i + 1] = Math.random() * 200 + 40;
      starPos[i + 2] = (Math.random() - 0.5) * 600;
    }

    starsGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starsMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 1.4,
      transparent: true,
      opacity: 0.7
    });
    this.stars = new THREE.Points(starsGeo, starsMat);
    this.scene.add(this.stars);
  }

  createHighway() {
    this.roadGroup = new THREE.Group();

    // Main Asphalt Highway (3 lanes)
    const roadWidth = 24;
    const roadLength = 500;
    const roadGeo = new THREE.PlaneGeometry(roadWidth, roadLength, 1, 60);
    const roadMat = new THREE.MeshStandardMaterial({
      color: 0x111622,
      roughness: 0.85,
      metalness: 0.1
    });
    this.roadMesh = new THREE.Mesh(roadGeo, roadMat);
    this.roadMesh.rotation.x = -Math.PI / 2;
    this.roadMesh.receiveShadow = true;
    this.roadGroup.add(this.roadMesh);

    // Roadside Guardrails
    const railMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8, roughness: 0.3 });
    [-roadWidth / 2, roadWidth / 2].forEach(x => {
      const railGeo = new THREE.BoxGeometry(0.4, 0.8, roadLength);
      const rail = new THREE.Mesh(railGeo, railMat);
      rail.position.set(x, 0.4, 0);
      this.roadGroup.add(rail);

      // Guardrail posts
      for (let z = -200; z <= 200; z += 15) {
        const postGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.8, 8);
        const post = new THREE.Mesh(postGeo, railMat);
        post.position.set(x, 0.4, z);
        this.roadGroup.add(post);
      }
    });

    // Dashed Lane Dividers (Lane 1 & Lane 2 markers)
    this.laneDashes = [];
    const dashMat = new THREE.MeshBasicMaterial({ color: 0xe2e8f0 });
    [-4, 4].forEach(x => {
      for (let z = -220; z <= 220; z += 12) {
        const dashGeo = new THREE.PlaneGeometry(0.3, 5);
        const dash = new THREE.Mesh(dashGeo, dashMat);
        dash.rotation.x = -Math.PI / 2;
        dash.position.set(x, 0.02, z);
        this.roadGroup.add(dash);
        this.laneDashes.push(dash);
      }
    });

    // Solid Edge Lines (Yellow & White)
    const edgeMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
    [-10.5, 10.5].forEach(x => {
      const edgeGeo = new THREE.PlaneGeometry(0.35, roadLength);
      const edge = new THREE.Mesh(edgeGeo, edgeMat);
      edge.rotation.x = -Math.PI / 2;
      edge.position.set(x, 0.02, 0);
      this.roadGroup.add(edge);
    });

    this.scene.add(this.roadGroup);
  }

  createScenery() {
    // Streetlights along the highway
    this.streetLampsGroup = new THREE.Group();
    const lampMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.9, roughness: 0.2 });
    const bulbMat = new THREE.MeshBasicMaterial({ color: 0xffedd5 });

    for (let i = 0; i < 10; i++) {
      const zPos = -180 + i * 45;
      const side = (i % 2 === 0) ? -13 : 13;

      const lampGroup = new THREE.Group();
      lampGroup.position.set(side, 0, zPos);

      // Pole
      const poleGeo = new THREE.CylinderGeometry(0.18, 0.25, 9, 8);
      const pole = new THREE.Mesh(poleGeo, lampMat);
      pole.position.y = 4.5;
      lampGroup.add(pole);

      // Arm curving over highway
      const armGeo = new THREE.CylinderGeometry(0.12, 0.12, 3.5, 8);
      const arm = new THREE.Mesh(armGeo, lampMat);
      arm.rotation.z = side < 0 ? -Math.PI / 3 : Math.PI / 3;
      arm.position.set(side < 0 ? 1.2 : -1.2, 8.8, 0);
      lampGroup.add(arm);

      // Glowing Bulb
      const bulbGeo = new THREE.SphereGeometry(0.35, 12, 8);
      const bulb = new THREE.Mesh(bulbGeo, bulbMat);
      bulb.position.set(side < 0 ? 2.5 : -2.5, 8.4, 0);
      lampGroup.add(bulb);

      // PointLight on ground
      const light = new THREE.PointLight(0xffd8a8, 0.9, 28);
      light.position.set(side < 0 ? 2.5 : -2.5, 8, 0);
      lampGroup.add(light);

      this.streetLamps.push(lampGroup);
      this.streetLampsGroup.add(lampGroup);
    }
    this.scene.add(this.streetLampsGroup);

    // Highway Milestones (Indian Highway Milestone Style)
    this.milestonesGroup = new THREE.Group();
    const milestoneLabels = ['NH 48 • Mumbai 120 km', 'NH 44 • Delhi 85 km', 'NH 75 • Bengaluru 45 km', 'NH 66 • Goa 60 km', 'NH 19 • Kolkata 110 km'];
    
    for (let i = 0; i < 5; i++) {
      const mGroup = new THREE.Group();
      mGroup.position.set(13.2, 0, -150 + i * 90);

      // Stone body (yellow top, white bottom)
      const stoneGeo = new THREE.CylinderGeometry(0.35, 0.4, 1.2, 16);
      const stoneMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 });
      const stone = new THREE.Mesh(stoneGeo, stoneMat);
      stone.position.y = 0.6;
      mGroup.add(stone);

      const topGeo = new THREE.SphereGeometry(0.35, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2);
      const topMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.8 });
      const top = new THREE.Mesh(topGeo, topMat);
      top.position.y = 1.2;
      mGroup.add(top);

      this.milestones.push(mGroup);
      this.milestonesGroup.add(mGroup);
    }
    this.scene.add(this.milestonesGroup);
  }

  createLuxuryBus() {
    this.busGroup = new THREE.Group();
    this.busGroup.position.set(0, 0, 0);

    // Coach Dimensions (Multi-axle Volvo 9600 format)
    const coachLength = 15;
    const coachWidth = 3.2;
    const coachHeight = 4.2;

    // Materials
    // Body Paint: Deep Royal Metallic Sapphire
    this.bodyMat = new THREE.MeshPhysicalMaterial({
      color: 0x1e1b4b,
      metalness: 0.85,
      roughness: 0.18,
      clearcoat: 0.8,
      clearcoatRoughness: 0.1
    });

    // Gold/Cyan Accent Stripes
    const stripeMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      emissive: 0x0891b2,
      emissiveIntensity: 0.35,
      metalness: 0.9,
      roughness: 0.2
    });

    // Panoramic Dark Tinted Glass
    this.glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x090d16,
      transparent: true,
      opacity: 0.88,
      roughness: 0.1,
      metalness: 0.6,
      transmission: 0.3
    });

    // Interior Warm Glow
    this.interiorMat = new THREE.MeshBasicMaterial({
      color: 0xfef08a
    });

    // 1. Lower Chassis & Bus Floor
    const chassisGeo = new THREE.BoxGeometry(coachWidth, 0.6, coachLength);
    const chassisMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.9 });
    const chassis = new THREE.Mesh(chassisGeo, chassisMat);
    chassis.position.y = 1.1;
    this.busGroup.add(chassis);

    // 2. Main Aerodynamic Coach Body
    const bodyGeo = new THREE.BoxGeometry(coachWidth, coachHeight, coachLength);
    this.busBody = new THREE.Mesh(bodyGeo, this.bodyMat);
    this.busBody.position.y = 1.1 + coachHeight / 2;
    this.busBody.castShadow = true;
    this.busBody.receiveShadow = true;
    this.busGroup.add(this.busBody);

    // 3. Aerodynamic Curved Nose (Front Windshield Slant)
    const noseGeo = new THREE.BoxGeometry(coachWidth - 0.05, coachHeight - 0.4, 2.2);
    const nose = new THREE.Mesh(noseGeo, this.glassMat);
    nose.position.set(0, 1.1 + coachHeight / 2, coachLength / 2 + 0.8);
    nose.rotation.x = -Math.PI / 18;
    this.busGroup.add(nose);

    // 4. Double Decker Window Ribbons (Left & Right Flanks)
    [-coachWidth / 2 - 0.02, coachWidth / 2 + 0.02].forEach(x => {
      // Upper Deck Window Band
      const upperWinGeo = new THREE.PlaneGeometry(coachLength - 3, 1.1);
      const upperWin = new THREE.Mesh(upperWinGeo, this.glassMat);
      upperWin.position.set(x, 4.3, 0.4);
      upperWin.rotation.y = x < 0 ? -Math.PI / 2 : Math.PI / 2;
      this.busGroup.add(upperWin);

      // Lower Deck Window Band
      const lowerWinGeo = new THREE.PlaneGeometry(coachLength - 3, 1.0);
      const lowerWin = new THREE.Mesh(lowerWinGeo, this.glassMat);
      lowerWin.position.set(x, 2.6, 0.4);
      lowerWin.rotation.y = x < 0 ? -Math.PI / 2 : Math.PI / 2;
      this.busGroup.add(lowerWin);

      // Cyan Accent Stripe running full length
      const stripeGeo = new THREE.PlaneGeometry(coachLength + 0.5, 0.15);
      const stripe = new THREE.Mesh(stripeGeo, stripeMat);
      stripe.position.set(x, 3.45, 0.3);
      stripe.rotation.y = x < 0 ? -Math.PI / 2 : Math.PI / 2;
      this.busGroup.add(stripe);

      // Brand Logo Text Plaque on flank
      const plaqueGeo = new THREE.PlaneGeometry(3.5, 0.45);
      const plaqueMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const plaque = new THREE.Mesh(plaqueGeo, plaqueMat);
      plaque.position.set(x, 1.6, 2.0);
      plaque.rotation.y = x < 0 ? -Math.PI / 2 : Math.PI / 2;
      this.busGroup.add(plaque);
    });

    // 5. Rooftop AC Unit & Satellite Pod
    const acGeo = new THREE.BoxGeometry(2.4, 0.45, 6);
    const acMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.6 });
    const acUnit = new THREE.Mesh(acGeo, acMat);
    acUnit.position.set(0, 1.1 + coachHeight + 0.2, -1);
    this.busGroup.add(acUnit);

    // 6. Wheels (6 Wheels Multi-Axle: 2 Front, 4 Rear Tandem)
    this.createWheels(coachWidth, coachLength);

    // 7. Projector Headlights (Front) & Beams
    this.setupHeadlights(coachWidth, coachLength);

    // 8. Taillights (Rear)
    this.setupTaillights(coachWidth, coachLength);

    // 9. Aerodynamic Mirrors
    this.setupMirrors(coachWidth, coachLength);

    this.scene.add(this.busGroup);
  }

  createWheels(coachWidth, coachLength) {
    const wheelRadius = 0.68;
    const wheelThickness = 0.52;
    const rimRadius = 0.42;

    const tireMat = new THREE.MeshStandardMaterial({ color: 0x1e2430, roughness: 0.95 });
    const rimMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.95, roughness: 0.15 });

    // Multi-axle wheel positions: Front (z = 4.8), Rear Axle 1 (z = -3.8), Rear Axle 2 (z = -5.4)
    const zPositions = [4.8, -3.8, -5.4];

    zPositions.forEach(z => {
      [-coachWidth / 2 - 0.05, coachWidth / 2 + 0.05].forEach(x => {
        const wheelGroup = new THREE.Group();
        wheelGroup.position.set(x, wheelRadius, z);

        // Tire
        const tireGeo = new THREE.CylinderGeometry(wheelRadius, wheelRadius, wheelThickness, 24);
        const tire = new THREE.Mesh(tireGeo, tireMat);
        tire.rotation.z = Math.PI / 2;
        tire.castShadow = true;
        wheelGroup.add(tire);

        // Rim
        const rimGeo = new THREE.CylinderGeometry(rimRadius, rimRadius, wheelThickness + 0.02, 16);
        const rim = new THREE.Mesh(rimGeo, rimMat);
        rim.rotation.z = Math.PI / 2;
        wheelGroup.add(rim);

        // Rim Spokes
        for (let s = 0; s < 5; s++) {
          const spokeGeo = new THREE.BoxGeometry(0.1, rimRadius * 1.8, 0.04);
          const spoke = new THREE.Mesh(spokeGeo, rimMat);
          spoke.rotation.x = (s * Math.PI) / 5;
          spoke.position.x = x > 0 ? wheelThickness / 2 + 0.02 : -wheelThickness / 2 - 0.02;
          wheelGroup.add(spoke);
        }

        this.wheels.push(wheelGroup);
        this.busGroup.add(wheelGroup);
      });
    });
  }

  setupHeadlights(coachWidth, coachLength) {
    const zFront = coachLength / 2 + 1.1;
    const yLight = 1.3;

    // Headlight Meshes (White/Cyan Glow)
    const lightMat = new THREE.MeshBasicMaterial({ color: 0xe0f2fe });
    this.headlights = [];

    [-coachWidth / 2 + 0.45, coachWidth / 2 - 0.45].forEach(x => {
      const hGeo = new THREE.BoxGeometry(0.5, 0.25, 0.1);
      const hMesh = new THREE.Mesh(hGeo, lightMat);
      hMesh.position.set(x, yLight, zFront);
      this.busGroup.add(hMesh);

      // Three.js SpotLight projecting beam onto the highway
      const spotLight = new THREE.SpotLight(0xf8fafc, 5.0, 75, Math.PI / 6, 0.4, 1.2);
      spotLight.position.set(x, yLight, zFront);
      
      const target = new THREE.Object3D();
      target.position.set(x, 0, zFront + 45);
      this.busGroup.add(target);
      spotLight.target = target;
      spotLight.castShadow = true;

      this.busGroup.add(spotLight);
      this.headlights.push(spotLight);
    });

    // Daytime LED Eyebrows
    const ledMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    [-coachWidth / 2 + 0.45, coachWidth / 2 - 0.45].forEach(x => {
      const ledGeo = new THREE.PlaneGeometry(0.6, 0.08);
      const led = new THREE.Mesh(ledGeo, ledMat);
      led.position.set(x, yLight + 0.22, zFront + 0.02);
      this.busGroup.add(led);
    });
  }

  setupTaillights(coachWidth, coachLength) {
    const zRear = -coachLength / 2 - 0.02;
    const tailMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });

    [-coachWidth / 2 + 0.4, coachWidth / 2 - 0.4].forEach(x => {
      // Vertical LED Lightbar
      const tGeo = new THREE.PlaneGeometry(0.25, 1.4);
      const tMesh = new THREE.Mesh(tGeo, tailMat);
      tMesh.position.set(x, 2.2, zRear);
      tMesh.rotation.y = Math.PI;
      this.busGroup.add(tMesh);

      // Red PointLight trailing behind
      const redLight = new THREE.PointLight(0xef4444, 1.8, 14);
      redLight.position.set(x, 2.0, zRear - 1.5);
      this.busGroup.add(redLight);
    });
  }

  setupMirrors(coachWidth, coachLength) {
    const zFront = coachLength / 2 + 0.4;
    const mirrorMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.9 });

    [-coachWidth / 2 - 0.4, coachWidth / 2 + 0.4].forEach(x => {
      const armGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.8, 8);
      const arm = new THREE.Mesh(armGeo, mirrorMat);
      arm.rotation.z = x < 0 ? -Math.PI / 4 : Math.PI / 4;
      arm.position.set(x < 0 ? x + 0.2 : x - 0.2, 4.4, zFront);
      this.busGroup.add(arm);

      const headGeo = new THREE.BoxGeometry(0.2, 0.9, 0.35);
      const head = new THREE.Mesh(headGeo, mirrorMat);
      head.position.set(x, 4.2, zFront + 0.1);
      this.busGroup.add(head);
    });
  }

  setupMouseControls() {
    this.isDragging = false;
    this.prevMousePos = { x: 0, y: 0 };
    this.spherical = { radius: 34, theta: 0.7, phi: 1.15 };

    const dom = this.renderer.domElement;

    dom.addEventListener('mousedown', (e) => {
      if (this.cameraMode !== 'orbit') return;
      this.isDragging = true;
      this.prevMousePos = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isDragging || this.cameraMode !== 'orbit') return;
      const deltaX = e.clientX - this.prevMousePos.x;
      const deltaY = e.clientY - this.prevMousePos.y;
      this.prevMousePos = { x: e.clientX, y: e.clientY };

      this.spherical.theta -= deltaX * 0.008;
      this.spherical.phi -= deltaY * 0.008;
      this.spherical.phi = Math.max(0.2, Math.min(Math.PI / 2 - 0.05, this.spherical.phi));

      this.updateOrbitCamera();
    });

    dom.addEventListener('wheel', (e) => {
      if (this.cameraMode !== 'orbit') return;
      e.preventDefault();
      this.spherical.radius += e.deltaY * 0.02;
      this.spherical.radius = Math.max(16, Math.min(65, this.spherical.radius));
      this.updateOrbitCamera();
    }, { passive: false });
  }

  updateOrbitCamera() {
    const x = this.spherical.radius * Math.sin(this.spherical.phi) * Math.sin(this.spherical.theta);
    const y = this.spherical.radius * Math.cos(this.spherical.phi);
    const z = this.spherical.radius * Math.sin(this.spherical.phi) * Math.cos(this.spherical.theta);

    this.camera.position.set(x, y, z);
    this.camera.lookAt(0, 2.5, 0);
  }

  setCameraPreset(mode) {
    this.cameraMode = mode;

    if (mode === 'orbit') {
      this.spherical = { radius: 32, theta: 0.65, phi: 1.1 };
      this.updateOrbitCamera();
    } else if (mode === 'chase') {
      this.camera.position.set(0, 5.5, -26);
      this.camera.lookAt(0, 2.5, 8);
    } else if (mode === 'front') {
      this.camera.position.set(9, 3.2, 28);
      this.camera.lookAt(0, 2.2, 0);
    } else if (mode === 'top') {
      this.camera.position.set(0, 48, 0);
      this.camera.lookAt(0, 0, 0);
    }
  }

  setSpeed(kmH) {
    this.speedKmH = kmH;
    this.speedFactor = kmH / 90;
    const speedo = document.getElementById('bus3dSpeedVal');
    if (speedo) speedo.textContent = `${kmH} km/h`;
  }

  toggleHeadlights() {
    this.isHeadlightsOn = !this.isHeadlightsOn;
    this.headlights.forEach(light => {
      light.intensity = this.isHeadlightsOn ? 5.0 : 0;
    });
    return this.isHeadlightsOn;
  }

  playHorn(hornKey) {
    if (window.indianHorns) {
      const horn = window.indianHorns.play(hornKey);
      
      // Flash headlights in rhythmic pulse with the horn
      if (this.headlights && this.headlights.length > 0) {
        let flashCount = 0;
        const flashInterval = setInterval(() => {
          flashCount++;
          const currentIntensity = (flashCount % 2 === 1) ? 8.0 : 1.0;
          this.headlights.forEach(l => l.intensity = currentIntensity);
          if (flashCount > 8) {
            clearInterval(flashInterval);
            this.headlights.forEach(l => l.intensity = this.isHeadlightsOn ? 5.0 : 0);
          }
        }, 120);
      }
      return horn;
    }
  }

  onWindowResize() {
    if (!this.container || !this.renderer) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = this.clock.getDelta();
    const currentSpeed = (this.speedKmH / 3.6) * delta * 2.8;

    // 1. Move Lane Dashes (simulates highway speed)
    this.laneDashes.forEach(dash => {
      dash.position.z -= currentSpeed;
      if (dash.position.z < -220) {
        dash.position.z += 440;
      }
    });

    // 2. Move Streetlamps along highway
    this.streetLamps.forEach(lamp => {
      lamp.position.z -= currentSpeed;
      if (lamp.position.z < -220) {
        lamp.position.z += 450;
      }
    });

    // 3. Move Highway Milestones
    this.milestones.forEach(m => {
      m.position.z -= currentSpeed;
      if (m.position.z < -200) {
        m.position.z += 450;
      }
    });

    // 4. Spin Wheels
    const wheelRotationSpeed = (currentSpeed / 0.68);
    this.wheels.forEach(w => {
      w.rotation.x += wheelRotationSpeed;
    });

    // 5. Gentle Coach Suspension Micro-sway (vibration & sway)
    const time = this.clock.getElapsedTime();
    if (this.busGroup && this.speedKmH > 0) {
      this.busGroup.position.y = Math.sin(time * 12) * 0.035;
      this.busGroup.rotation.z = Math.sin(time * 3.5) * 0.008;
      this.busGroup.rotation.x = Math.sin(time * 7) * 0.004;
    }

    // 6. Camera Orbit auto-drift in cinematic mode
    if (this.cameraMode === 'orbit' && !this.isDragging) {
      this.spherical.theta += 0.0015;
      this.updateOrbitCamera();
    }

    this.renderer.render(this.scene, this.camera);
  }
}

// Global instance launcher
let bus3dApp = null;
function init3DBusExperience() {
  if (!bus3dApp && document.getElementById('bus3dCanvasContainer')) {
    bus3dApp = new Bus3DSimulation('bus3dCanvasContainer');
  }
}
