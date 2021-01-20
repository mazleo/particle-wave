import * as THREE from './three.module.js';

const SEPARATION = 100, AMOUNTX = 500, AMOUNTY = 1000;

let canvas; 
let camera, scene, renderer;

let particles, count = 0;

let mouseX = 0, mouseY = 0;

let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

let orange = 0xFFB04D;
let orangeMaterial = new THREE.LineBasicMaterial({color: orange});

init();
animate();

function init() {

    canvas = document.querySelector('#canvas');

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 1000;
    camera.position.y = 500;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1C0038);

    //

    const numParticles = AMOUNTX * AMOUNTY;

    const positions = new Float32Array( numParticles * 3 );
    const scales = new Float32Array( numParticles );

    let i = 0, j = 0;

    for ( let ix = 0; ix < AMOUNTX; ix ++ ) {

        for ( let iy = 0; iy < AMOUNTY; iy ++ ) {

            positions[ i ] = ix * SEPARATION - ( ( AMOUNTX * SEPARATION ) / 2 ); // x
            positions[ i + 1 ] = 0; // y
            positions[ i + 2 ] = iy * SEPARATION - ( ( AMOUNTY * SEPARATION ) / 2 ); // z

            scales[ j ] = 1;

            i += 3;
            j ++;

        }

    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
    geometry.setAttribute( 'scale', new THREE.BufferAttribute( scales, 1 ) );

    const material = new THREE.ShaderMaterial( {

        uniforms: {
            color: { value: new THREE.Color( orange ) },
        },
        vertexShader: document.getElementById( 'vertexshader' ).textContent,
        fragmentShader: document.getElementById( 'fragmentshader' ).textContent

    } );

    //

    particles = new THREE.Points( geometry, material );
    scene.add( particles );

    //

    renderer = new THREE.WebGLRenderer( { antialias: true, canvas: canvas } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );

    canvas.style.touchAction = 'none';

    //

    window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

//

function animate() {

    requestAnimationFrame( animate );

    render();

}

function render() {
    camera.lookAt( scene.position );

    const positions = particles.geometry.attributes.position.array;
    const scales = particles.geometry.attributes.scale.array;

    let i = 0, j = 0;

    for ( let ix = 0; ix < AMOUNTX; ix ++ ) {

        for ( let iy = 0; iy < AMOUNTY; iy ++ ) {

            positions[ i + 1 ] = ( Math.sin( ( ix + count ) * 0.37 ) * 150 ) +
                            ( Math.sin( ( iy + count ) * 0.3 ) * 150 );

            scales[ j ] = ( Math.sin( ( ix + count ) * 0.3 ) + 1 ) * 20 +
                            ( Math.sin( ( iy + count ) * 0.5 ) + 1 ) * 20;

            i += 3;
            j ++;

        }

    }

    particles.geometry.attributes.position.needsUpdate = true;
    particles.geometry.attributes.scale.needsUpdate = true;

    drawVerticalLines();

    renderer.render( scene, camera );

    count += 0.1;

}

function drawVerticalLines() {
    let lines = new Array();
    const positions = particles.geometry.attributes.position.array;

    let points = new Array();
    points.push(new THREE.Vector3(0, 0, 1005));
    points.push(new THREE.Vector3(10, 0, 1005));
    points.push(new THREE.Vector3(-10, 0, 1005));

    let lineGeo = new THREE.BufferGeometry().setFromPoints(points);
    let line = new THREE.Line(lineGeo, orangeMaterial);

    scene.add(line);
    // for (let ix = 0; ix < AMOUNTX; ix++) {
    //     let points = new Array();

    //     for (let iy = 0; iy < AMOUNTY; iy++) {
    //         const x = positions[ix * 3];
    //         const y = positions[(iy * 3) + 1];
    //         const z = positions[(iy * 3) + 2];

    //         points.push(new THREE.Vector3(x, y, z));
    //     }

    //     let lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
    //     let line = new THREE.Line(lineGeometry, orangeMaterial);
    //     lines.push(line);
    // }

    // for (let l = 0; l < lines.length; l++) {
    //     scene.add(lines[l]);
    // }
}