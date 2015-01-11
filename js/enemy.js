function Enemy() {
    var ballGeometry = new THREE.SphereGeometry(3, 20, 20);
    var ballMaterial = new THREE.MeshBasicMaterial({color: 0xff0000});
    var ball = new Physijs.SphereMesh(ballGeometry, ballMaterial, 10);
    ball.addEventListener('collision', function(collided_with, linearVelocity, angularVelocity) {
        //ball.applyCentralForce(new THREE.Vector3(100,100,0));

     });
    //ball = new THREE.Mesh(ballGeometry, ballMaterial);
    ball.castShadow = true;
    ball.name = "enemy";
    ball.position.z = 60;
    scene.add(ball);
    scene.addEventListener( 'update', function(){
        ball.applyCentralForce(new THREE.Vector3(30,30,0));
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