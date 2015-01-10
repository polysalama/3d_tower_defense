function Tower(vector) {

    var enemies = [];
    //this.enemiesIner = enemies;
    //ustvari grupo
    var towerGroup = new  THREE.Group();
    towerGroup.position.x = vector.x;
    towerGroup.position.y = vector.y;
    towerGroup.position.z = vector.z + 6;
    towerGroup.rotation.x = 0.5 * Math.PI;
    towerGroup.name = "towerGroup";

    //spodni del stolpa
    var base_texture = THREE.ImageUtils.loadTexture("assets/tower_base.gif")
    var baseGeometry = new THREE.CylinderGeometry(3, 6, 12);
    var baseMaterial = new THREE.MeshLambertMaterial();
    baseMaterial.map = base_texture;
    var base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.castShadow = true;

    //kupola
    var loader = new THREE.JSONLoader();
    loader.load("assets/kupola.json", function(geometry) {
        var material = new THREE.MeshBasicMaterial();
        var tex = THREE.ImageUtils.loadTexture("assets/top.gif");
        material.map = tex;
        material.side = THREE.DoubleSide;
        var mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh)
    });

    //top
    var canon_texture = THREE.ImageUtils.loadTexture("assets/top.gif");
    var topGeometry = new THREE.CylinderGeometry(1, 1, 5);
    var topMaterial = new THREE.MeshPhongMaterial();
    topMaterial.map = canon_texture;
    var top = new THREE.Mesh(topGeometry, topMaterial);
    top.name = "top";
    top.position.y = 11;
    top.rotation.x = 0.5 * Math.PI;
    top.castShadow = true;


    var range = new Physijs.SphereMesh(new THREE.SphereGeometry(20, 20 ,20),
        new THREE.MeshBasicMaterial({wireframe: true}), 0);

    range.position.x = vector.x;
    range.position.y = vector.y;
    range.position.z = vector.z + 6;

    //range.position.y = 10;
    range.addEventListener('collision', function(collided_with, linearVelocity, angularVelocity) {
        if(collided_with.name == "enemy") {
            enemies.push(collided_with);
            console.log(collided_with);
        }
    });
    range._physijs.collision_flags = 4;
    // range.name = "range";

    //zdruzi v grupo in doda na sceno
    towerGroup.add(base);
    towerGroup.add(top);
    range.visible = true;
    scene.add(towerGroup);
    scene.add(range);


    this.animateTower = function() {
        var current = {x: 0};
        var update = function () {
            if (enemies.length == 0) {
                return;
            }
            var i;
            for(i in enemies) {
                var dist = range.position.distanceTo(enemies[i].position);
                var tRange = range.geometry.parameters.radius;
                if(dist > tRange + 1) {
                    enemies.shift();
                }
            }
            if (enemies.length != 0) {
                towerGroup.getObjectByName("top").lookAt(enemies[0].position);
            }
        }

        var tweenHead = new TWEEN.Tween(current).to({x: 20}, 5000)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onUpdate(update);

        var tweenBack = new TWEEN.Tween(current).to({x: -20}, 5000)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onUpdate(update);

        tweenBack.chain(tweenHead);
        tweenHead.chain(tweenBack);
        tweenHead.start();
    };
}

