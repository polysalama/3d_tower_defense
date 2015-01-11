function Enemy() {
    var ballGeometry = new THREE.SphereGeometry(3, 20, 20);
    var ballMaterial = new THREE.MeshBasicMaterial({color: 0xff0000});
    var ball = new Physijs.SphereMesh(ballGeometry, ballMaterial, 40);
    var dir = 1;
    if(Math.random() < 0.5) {
        dir = -1;
    }
    var direction = new THREE.Vector3(Math.floor(dir * (Math.random() * 25) + 15),
        dir * Math.floor((Math.random() * 25) + 15),0)
    ball.addEventListener('collision', function(collided_with, linearVelocity, angularVelocity) {
        if(collided_with.name == "wall") {
            console.log(collided_with);
            var dir = 1;
            if(Math.random() < 0.5) {
                dir = -1;
            }
            direction = new THREE.Vector3(dir*direction.x,dir*direction.y,0);

        }
     });
    //ball = new THREE.Mesh(ballGeometry, ballMaterial);
    ball.castShadow = true;
    ball.name = "enemy";
    ball.position.x = (Math.random() * 200) * -dir;
    ball.position.y = (Math.random() * 200) * -dir;
    ball.position.z = 45;
    scene.add(ball);
    scene.addEventListener( 'update', function(){
        //ball.applyCentralForce(direction);
        var old = ball.getLinearVelocity();
        ball.setLinearVelocity(new THREE.Vector3(direction.x, direction.y, old.z));
    });

    //ball.applyForce(new THREE.Vector3(1,1,0), new THREE.Vector3(0,0,0));
    //initBallTween(ball);
    //return(this.ball);
    //document.getElementById("addBallButton").disabled = true;

}

Enemy.prototype.initEnemyTween = function(ball) {
    var current = {x: 0};
    var update = function () {
        ball.__dirtyPosition = true;
        ball.position.x = current.x;
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
}