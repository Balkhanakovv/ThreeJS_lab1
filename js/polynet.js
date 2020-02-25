var container;
var camera, scene, renderer;
var geometry;
var N = 3;

init();
animate();

function init()
{
    container = document.getElementById( 'container' );
    
    scene = new THREE.Scene();
    
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 4000); 
    camera.position.set(6, 6, 6);
    camera.lookAt(new THREE.Vector3( 0, 0.0, 0));

    renderer = new THREE.WebGLRenderer( {antialias: false} );
    renderer.setSize( window.innerWidth, window.innerHeight);
    renderer.setClearColor( 0x000000, 1);

    container.appendChild( renderer.domElement );

    window.addEventListener( 'resize', onWindowResize, false);
    
    geometry = new THREE.Geometry();

    for(var i = 0; i < N; i++){
        for(var j = 0; j < N; j++){
            geometry.vertices.push(new THREE.Vector3( i, 0.0, j));
        }
    }

    for(var i = 0; i < N - 1; i++){
        for(var j = 0; j < N - 1; j++){
            var vertex1 =  i + j * N;
            var vertex2 = (i + 1) + j * N;
            var vertex3 = i + (j + 1) * N;
            var vertex4 = (i + 1) + (j + 1) * N;

            geometry.faces.push(new THREE.Face3(vertex1, vertex2, vertex4));
            geometry.faces.push(new THREE.Face3(vertex1, vertex4, vertex3));
        }        
    }

    var triangleMaterial = new THREE.MeshBasicMaterial({
        vertexColors: THREE.VertexColors,
        wireframe: true,
        side: THREE.DoubleSide
    });

    var triangleMesh = new THREE.Mesh(geometry, triangleMaterial);
    triangleMesh.position.set(0.0, 0.0, 0.0);

    scene.add(triangleMesh);
}

function onWindowResize()
{
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate()
{
    requestAnimationFrame( animate );

    render()
}

function render()
{
    renderer.render( scene, camera );
}
