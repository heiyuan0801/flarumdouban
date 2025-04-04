<?php

namespace Doubanapi\Douban;

use Flarum\Extend;
use Doubanapi\Douban\Api\DoubanSearchController;

return [
    (new Extend\Frontend('forum'))
        ->js(__DIR__.'/js/dist/forum.js')
        ->css(__DIR__.'/less/forum.less'),

    (new Extend\Routes('api'))
        ->get('/douban/search', 'douban.search', DoubanSearchController::class),
];