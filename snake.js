/**
 * 贪吃蛇
 * @constructor
 */
function Snake(Game) {

    let starting;
    let length = 7;
    let speed = 20;

    // 初始化地图
    for (let col = 0; col < Game.height; col++) {
        Game.map.push([]);
        for (let row = 0; row < Game.width; row++) {
            Game.map[col].push(col + '-' + row)
        }
    }

    // 初始化蛇
    for (let body = 1; body <= length; body++) {
        Game.snake.unshift([1, body].join('-'))
    }
    Game.head = Game.snake[0];

    // 初始化食物
    for (let food = 0; food < 1; food++) {
        newFood()
    }

    // 初始化障碍物
    // for (let ob = 0; ob < 5; ob++) {
    //     newObstacle()
    // }

    // 游戏开始
    function gameStart() {
        gamePause();
        starting = setInterval(function () {
            snakeMove()
        }, speed)
    }

    // 游戏暂停
    function gamePause() {
        clearInterval(starting)
    }

    // 创建食物
    function newFood() {
        const food = point();
        // 若随机点与现状冲突，则重新创建
        if (Game.obstacle.indexOf(food) == -1 &&
            Game.food.indexOf(food) == -1 &&
            Game.snake.indexOf(food) == -1) {

            Game.food.push(food)
        } else {
            newFood()
        }
    }

    // 创建障碍物
    function newObstacle() {
        const size = Math.ceil(Math.random() * 20);
        if (size > 0) {
            // 想象中的障碍物，应该是块状的，也就是根据体积获得若干个点堆积在一起
            // 所以当得到一个合法的随机节点后，就开始在它四周，随机抽取一个没有点的方向，创建新的点
            // 再以这个新的点，重复这个动作，直到达到指定体积
            const items = [];
            const createItem = function (item) {
                const direction = Math.round(Math.random() * 3);
                const newItem = item.split('-');
                newItem[0] = parseInt(newItem[0]);
                newItem[1] = parseInt(newItem[1]);
                switch (direction) {
                    case 0:
                        newItem[0] = newItem[0] - 1 < 0 ? 0 : newItem[0] - 1;
                        break;
                    case 1:
                        newItem[0] = newItem[0] + 1 > Game.width - 1 ? Game.width - 1 : newItem[0] + 1;
                        break;
                    case 2:
                        newItem[1] = newItem[1] - 1 < 0 ? 0 : newItem[1] - 1;
                        break;
                    case 3:
                        newItem[1] = newItem[1] + 1 > Game.height ? Game.height : newItem[1] + 1;
                        break;
                }
                if (items.indexOf(newItem) >= 0) {
                    createItem(item)
                } else {
                    items.push(newItem.join('-'))
                }
            };

            // 这是原点
            items.push(point());

            // 然后根据体积开始上面的操作
            for (let i = 0; i < size - 1; i++) {
                createItem(items[Math.floor(Math.random() * items.length)])
            }

            // 把创建好的障碍物添加到场景
            Game.obstacle = Game.obstacle.concat(items)
        } else {
            // 障碍物一旦创建必然出现，如果体积是0，就重新创建直到成功
            newObstacle()
        }
    }

    // 返回一个随机节点
    function point() {
        const x = Math.floor(Math.random() * Game.width);
        const y = Math.floor(Math.random() * Game.height);
        return [x, y].join('-')
    }

    // 移动逻辑
    function snakeMove() {
        const head = Game.head.split('-');

        autoPlay(Game); // 使用自动移动函数更变 direction 的值

        // 根据新的 direction 值定位下一步头的坐标
        // PS: direction 的值是根据键盘方向键的键值设计的，因为最初这只是一个贪吃蛇小游戏 demo ^_^
        switch (Game.direction) {
            case 37: // left
                head[1]--;
                break;
            case 38: // up
                head[0]--;
                break;
            case 39: // right
                head[1]++;
                break;
            case 40: // down
                head[0]++;
                break;
        }
        const nextHead = head.join('-');

        // 判断下一步是否会 Game over
        if (isDead(head, nextHead)) {
            clearInterval(starting);
            Game.dead = true;
            return false
        }

        // 判断下一步的坐标是否在当前食物的坐标列表中
        const foodIndex = Game.food.indexOf(nextHead);
        if (foodIndex != -1) {
            // 如果在，代表下一步会吃到食物，所以本次移动将不会【削掉尾巴】，只会移除食物
            Game.food.splice(foodIndex, 1);
            newFood()
        } else {
            // 在还没吃到食物的状态，每次头部移动到下一个坐标时，只是会在身体坐标列表里新增一个坐标
            // 相当于蛇变长了一格，所以要移除身体的最后一个坐标【削掉尾巴】
            Game.snake.splice(Game.snake.length - 1, 1)
        }

        // 在身体坐标里新增下一步的坐标
        Game.snake.unshift(nextHead);
        Game.head = nextHead
    }

    // 死亡
    function isDead(head, nextHead) {
        let dead = [
            // 蛇身，障碍物
            Game.snake.indexOf(nextHead) != -1,
            Game.obstacle.indexOf(nextHead) != -1,
            // 地图边沿
            head[0] > Game.width - 1,
            head[0] < 0,
            head[1] > Game.height - 1,
            head[1] < 0
        ];
        for (let i in dead) {
            if (dead[i]) return true
        }
        return false
    }

    return {
        start: gameStart,
        pause: gamePause
    }
}