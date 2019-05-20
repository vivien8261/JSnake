/**
 * 自动寻路逻辑，根据 A* 算法（F = G + H）的启发编写的逻辑
 * A* 算法有利于在静态路网中求得最短路径，但得出来的是当前准确且固定的路径，若加上动态因素则无法确保该路径永远是对的（安全的）
 * 所以我的过程是，在 A* 的算法基础上，省去 H 值，不思考要走的路有多长，只专注当下要怎么走
 * 在确保下一步没有危险的基础上，再考虑怎么走才是最短的，也就是 F = G
 */
function autoPlay(Game) {
    const head = Game.head.split('-');
    const food = Game.food[0].split('-');

    // 得到头部四周的点
    const x = parseInt(head[0]), y = parseInt(head[1]);
    const openList = [
        {x: x, y: y - 1},
        {x: x + 1, y: y},
        {x: x, y: y + 1},
        {x: x - 1, y: y}
    ];

    // 初始化搜索
    const minF = {
        coordinate: [0, 0],
        step: Infinity
    };

    // 开始搜索安全点
    openList.map(function (value, index) {
        const coordinate = [value.x, value.y];
        if (isSafety(value, coordinate)) {

            // 得出 G 值，因为 F = G，所以这也是 F 值
            const a = Math.abs(food[0] - value.x);
            const b = Math.abs(food[1] - value.y);
            const f = a + b;

            if (f <= minF.step) {
                minF.coordinate = coordinate;
                minF.step = f
            }
            
            openList[index].f = f
        } else {
            openList[index].f = Infinity
        }
    });

    // 判断下一步的安全性
    function isSafety(value, coordinate) {
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

    // 根据最终结果决定下一步的 direction 值
    if (minF.coordinate[0] > head[0]) {
        return 40
    }
    if (minF.coordinate[0] < head[0]) {
        return 38
    }
    if (minF.coordinate[1] > head[1]) {
        return 39
    }
    if (minF.coordinate[1] < head[1]) {
        return 37
    }
}