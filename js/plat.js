var container;
var camera, scene, renderer;
var imagedata;
var geomerty;
var spotlight = new THREE.PointLight(0xffffff);
var sphere;
var N = 256;
   
init();
animate();
 
function init()
{
    container = document.getElementById( 'container' );
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 4000 );    
    camera.position.set(N/2, N/2, N*2.5); 
    camera.lookAt(new THREE.Vector3( N/2, 0.0, N/2));    
    
    renderer = new THREE.WebGLRenderer( { antialias: false } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor( 0x000000, 1);
    container.appendChild( renderer.domElement );
    window.addEventListener( 'resize', onWindowResize, false );

    spotlight.position.set(100, 100, N/2);
    scene.add(spotlight);
    var geometry = new THREE.SphereGeometry( 5, 32, 32 );
    var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
    sphere = new THREE.Mesh( geometry, material );
    scene.add( sphere );
 
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    var img = new Image();
    
    img.onload = function()
    {    
        canvas.width = img.width;    
        canvas.height = img.height;    
        context.drawImage(img, 0, 0 );    
        imagedata = context.getImageData(0, 0, img.width, img.height);
       
        CreateTerrain();
    }
    img.src = 'pics/plateau.jpg';
}
 
 
function onWindowResize()
{
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

var a = 0.0;

function animate()
{
    a += 0.01;
    
    requestAnimationFrame( animate );
    render();
    
    spotlight.position.x = N/2+N*Math.cos(a);
    spotlight.position.y = N*Math.sin(a);
    sphere.position.copy(spotlight.position);


    var x = N/2 + 2*N*Math.cos(a);
    var z = N/2 + 2*N*Math.sin(a);

    camera.position.set(x, N/2, z);
 
    camera.lookAt(new THREE.Vector3( N/2, 0.0, N/2));

}
function render()
{
    renderer.render( scene, camera );
}
 
function CreateTerrain()
{
    geometry = new THREE.Geometry();
 
    for (var i=0; i < N; i++)
        for (var j=0; j < N; j++)
        {
            var position = getPixel( imagedata, i, j );
            geometry.vertices.push(new THREE.Vector3( i, position/10.0, j));
        }

    for(var i = 0; i < N - 1; i++){
        for(var j = 0; j < N - 1; j++){
            var vertex1 =  i + j * N;
            var vertex2 = (i + 1) + j * N;
            var vertex3 = i + (j + 1) * N;
            var vertex4 = (i + 1) + (j + 1) * N;

            geometry.faces.push(new THREE.Face3(vertex1, vertex2, vertex4));
            geometry.faces.push(new THREE.Face3(vertex1, vertex4, vertex3));

            geometry.faceVertexUvs[0].push([
                new THREE.Vector2(i/(N-1), j/(N-1)),
                new THREE.Vector2((i+1)/(N-1), j/(N-1)),
                new THREE.Vector2((i+1)/(N-1), (j+1)/(N-1))
            ]);

            geometry.faceVertexUvs[0].push([
                new THREE.Vector2(i/(N-1), j/(N-1)),
                new THREE.Vector2((i+1)/(N-1), (j+1)/(N-1)),
                new THREE.Vector2(i/(N-1), (j+1)/(N-1))
            ]);
        } 
    }
        
    geometry.computeFaceNormals();  
    geometry.computeVertexNormals();

    var loader = new THREE.TextureLoader();
    var tex = loader.load( 'pics/grasstile.jpg' );
        
    var mat = new THREE.MeshLambertMaterial({    
        map: tex,    
        wireframe: false,    
        side: THREE.DoubleSide 
    });
 
    var matMesh = new THREE.Mesh(geometry, mat); 
    scene.add(matMesh);
}

function getPixel( imagedata, x, y )  
{    
    var position = ( x + imagedata.width * y ) * 4, data = imagedata.data;    
    return data[ position ];
}
