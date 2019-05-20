const snake = new Vue({
    el: '#gameBar',
    data: {
        width: 50,
        height: 50,
        direction: 39, // 默认方向是右
        map: [],
        obstacle: [],
        food: [],
        snake: [],
        head: '',
        dead: false,
        game: {}
    },
    methods: {
        whatIsThis: function (item) {
            if (this.obstacle.indexOf(item) != -1) {
                return 'obstacle'
            }
            if (this.food.indexOf(item) != -1) {
                return 'snakeFood'
            }
            if (this.snake.indexOf(item) != -1) {
                return item == this.head ? 'snakeHead' : 'snakeBody'
            }
        },
        gameStart: () => snake.game.start(),
        gamePause: () => snake.game.pause()
    },
    mounted: function () {
        this.game = new Snake(this)
    }
});
