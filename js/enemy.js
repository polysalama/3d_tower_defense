function Enemy() {
    var ballGeometry = new THREE.SphereGeometry(1, 20, 20);
    var ballMaterial = new THREE.MeshBasicMaterial({color: 0xff0000});
    this.ball = new Physijs.SphereMesh(ballGeometry, ballMaterial, 10);
    /*ball.addEventListener('collision', function(collided_with, linearVelocity, angularVelocity) {
     console.log("TEST");
     });*/
    //ball = new THREE.Mesh(ballGeometry, ballMaterial);
    this.ball.castShadow = true;
    this.ball.name = "enemy";
    this.ball.position.z = 60;
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