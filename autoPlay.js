/**
 * 自动寻路逻辑，受 A* 算法的启发而编写
 */
function autoPlay(Game) {
    let head = Game.head.split('-');
    let food = Game.food[0].split('-');

    // 得到头部四周的点
    let x = parseInt(head[0]), y = parseInt(head[1]);
    let around = {
        l: {x: x, y: y - 1}, // left
        r: {x: x, y: y + 1}, // right
        u: {x: x - 1, y: y}, // up
        d: {x: x + 1, y: y}  // down
    };

    // 蛇的视野，即头部正前方横排的三个点，按照目前的方向分为 [上, 下, 中] 或 [左, 右, 中] 两种集合
    let scan = (function (direction) {
        switch (direction) {
            case 37: // left
                return [[x - 1, y - 1], [x + 1, y - 1], [x, y - 1], 'l'];
            case 38: // up
                return [[x - 1, y - 1], [x - 1, y + 1], [x - 1, y], 'r'];
            case 39: // right
                return [[x - 1, y + 1], [x + 1, y + 1], [x, y + 1], 'u'];
            case 40: // down
                return [[x + 1, y - 1], [x + 1, y + 1], [x + 1, y], 'd'];
        }
    })(Game.direction);

    // 如果视野内全是身体，就需要考虑一下拐弯的时候会不会拐进一个自己绕出来的死胡同了...
    // 这时候，蛇也不知道自己有没有已经绕出死胡同啊，那么就往看到的身体的反方向拐弯就行了

    // 得到【上下】或【左右】在身体里的索引值，因为添加身体时使用的是【unshift】，所以索引大的一端是反方向
    let ai = Game.snake.indexOf(scan[0].join('-'));
    let bi = Game.snake.indexOf(scan[1].join('-'));
    let ci = Game.snake.indexOf(scan[2].join('-'));
    if (ai >= 0 && bi >= 0) {
        if (ci >= 0) {
            // 区分纵向和横向移动，从头部四周的点里删除正方向的坐标
            if (scan[0][0] == scan[1][0]) {
                ai > bi ? delete around.r : delete around.l
            } else {
                ai > bi ? delete around.d : delete around.u
            }
        } else {
            // 如果正前方没有身体，有可能是个 U 型凹槽，不要进去
            // delete around[scan[3]]
        }
    }

    // 初始化搜索
    let minF = {
        coordinate: [0, 0],
        step: Infinity
    };

    // 开始搜索四周的点里的安全点
    for (let i in around) {
        let value = around[i];
        let coordinate = [value.x, value.y];
        // 判断该点的安全性
        if (isSafety(value, coordinate, Game)) {

            // 得出距离
            let a = Math.abs(food[0] - value.x);
            let b = Math.abs(food[1] - value.y);
            let f = a + b;

            // 比较距离选择最近的点
            if (f <= minF.step) {
                minF.coordinate = coordinate;
                minF.step = f
            }
        }
    }

    // 根据选点结果和头部比较判断出下一步要往的方向
    // 至此，该部分逻辑结束
    if (minF.coordinate[0] > head[0]) {
        Game.direction = 40
    }
    if (minF.coordinate[0] < head[0]) {
        Game.direction = 38
    }
    if (minF.coordinate[1] > head[1]) {
        Game.direction = 39
    }
    if (minF.coordinate[1] < head[1]) {
        Game.direction = 37
    }
}

// 判断安全性
function isSafety(value, coordinate, Game) {
    let safety = [
        // 蛇身，障碍物
        Game.snake.indexOf(coordinate.join('-')) == -1,
        Game.obstacle.indexOf(coordinate.join('-')) == -1,
        // 地图边沿
        value.x <= Game.width - 1,
        value.x >= 0,
        value.y <= Game.height - 1,
        value.y >= 0
    ];
    for (let i in safety) {
        if (!safety[i]) return false
    }
    return true
}