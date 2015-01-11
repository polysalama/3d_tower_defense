function Tower(vector) {

    var enemies = [];
    var bullets =  [];
    //this.enemiesIner = enemies;
    //ustvari grupo
    /*var towerGroup = new  THREE.Group();
    towerGroup.position.x = vector.x;
    towerGroup.position.y = vector.y;
    towerGroup.position.z = vector.z + 6;
    towerGroup.rotation.x = 0.5 * Math.PI;
    towerGroup.name = "towerGroup";*/

    //spodni del stolpa
    var base_texture = THREE.ImageUtils.loadTexture("assets/tower_base.gif")
    var baseGeometry = new THREE.CylinderGeometry(3, 6, 12);
    var baseMaterial = new THREE.MeshLambertMaterial();
    baseMaterial.map = base_texture;
    var base = new Physijs.CapsuleMesh(baseGeometry, baseMaterial, 0);
    base.castShadow = true;
    base.position.x = vector.x;
    base.position.y = vector.y;
    base.position.z = vector.z + 12;
    base.rotation.x = 0.5 * Math.PI;
    //scene.add(base);
    this.baseOut = base;


    var pivot = new THREE.Object3D();
    pivot.name = "pivot";
    //top
    var canon_texture = THREE.ImageUtils.loadTexture("assets/top.gif");
    var topGeometry = new THREE.CylinderGeometry(1, 1, 7);
    var topMaterial = new THREE.MeshPhongMaterial();
    topMaterial.map = canon_texture;
    var top = new Physijs.CapsuleMesh(topGeometry, topMaterial, 0);
    top.name = "top";
    top.castShadow=true;
    //top.rotation.x = 0.5 * Math.PI
    top.position.y = 3;
    //top.position.x = -0.5;
    /*top.rotation.x = 0.5 * Math.PI;
    top.castShadow = true;*/

    pivot.position.y = 11;
    pivot.rotation.x = 0.5 * Math.PI;
    //pivot.castShadow = true;
    pivot.add(top);
    base.add(pivot);
    base.scale.set(2,2,2);

    var range = new Physijs.SphereMesh(new THREE.SphereGeometry(60, 20 ,20),
        new THREE.MeshBasicMaterial({wireframe: true}), 0);

    range.position.x = vector.x;
    range.position.y = vector.y;
    range.position.z = vector.z + 6;
    this.rangeOut = range;
    //range.position.y = 10;

    range.addEventListener('collision', function(collided_with, linearVelocity, angularVelocity) {
        if(collided_with.name == "enemy") {
            enemies.push(collided_with);
            //t  = setInterval(runFunction,300);
            //console.log(collided_with);
        }
    });
    range._physijs.collision_flags = 4;
    // range.name = "range";



    scene.addEventListener( 'update', function(){
        if (enemies.length == 0) {
            return;
        }
        var i;
        for(i in enemies) {
            var dist = range.position.distanceTo(enemies[i].position);
            var tRange = range.geometry.parameters.radius;
            if(dist > tRange + 3) {
                enemies.shift();
            }
        }
        if (enemies.length != 0) {
            base.getObjectByName("pivot").getObjectByName("top").lookAt(enemies[0].position);
            //var t =setInterval(runFunction,1000);
        }
        /*if (bullets.length != 0) {
            var b;
            for(b in bullets) {
                var location = new THREE.Vector3(bullets[b].userData.position.x, bullets[b].userData.position.y, bullets[b].userData.position.z);
                var enemyDir = location.normalize();
                var old = bullets[b].getLinearVelocity();
                bullets[b].setLinearVelocity(new THREE.Vector3(enemyDir.x + 50, enemyDir.y + 50, old.z))
                console.log(bullets[b].getLinearVelocity());
            }
        }*/
    });

    this.moveBullets = setInterval(function(){
        if (bullets.length != 0) {
            var b;
            for(b in bullets) {
                var location = new THREE.Vector3(bullets[b].userData.position.x, bullets[b].userData.position.y, bullets[b].userData.position.z);
                var enemyDir = location.normalize();
                var old = bullets[b].getLinearVelocity();
                var x = location.x;
                var y = location.y;
                if(x < 0) {
                    x -= 50;
                } else {
                    x += 50;
                }
                if(y < 0) {
                    y -= 50;
                } else {
                    y += 50;
                }
                bullets[b].applyCentralImpulse(new THREE.Vector3(x, y, -5));
                //console.log(bullets[b].getLinearVelocity());
                //console.log(bullets[b].userData.getLinearVelocity());
            }
        }
    }, 200);

    this.t  = setInterval(function() {
        if (enemies.length == 0) {
            return;
        }
        var bulletGeo = new THREE.SphereGeometry(1, 10, 10);
        var bulletMaterial = new THREE.MeshPhongMaterial({map: canon_texture});
        var bullet = new Physijs.SphereMesh(bulletGeo, bulletMaterial, 1)
        bullet.userData = enemies[0];
        bullet.__dirtyPosition = true;
        bullet.position.x = base.position.x;
        bullet.position.y = base.position.y;
        bullet.position.z = base.position.z + 10;
        //bullet.position.z = vector.z + 15;
        bullets.push(bullet);
        bullet.name = "bullet"
        bullet.castShadow=true;
        //var enemyDir = bullet.userData.position.normalize();
        var location = new THREE.Vector3(bullet.userData.position.x, bullet.userData.position.y, bullet.userData.position.z);
        //var enemyDir = location.normalize();
        //bullet.setLinearVelocity(new THREE.Vector3(enemyDir.x + 10, enemyDir.y + 10, 0));
        scene.add(bullet);
    }, 600);


    //zdruzi v grupo in doda na sceno
    //towerGroup.add(base);
    range.visible = false;
    scene.add(base);
    scene.add(range);

}

