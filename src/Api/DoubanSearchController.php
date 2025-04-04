<?php

namespace Doubanapi\Douban\Api;

use Flarum\Http\RequestUtil;
use Laminas\Diactoros\Response\JsonResponse;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use GuzzleHttp\Client;

class DoubanSearchController implements RequestHandlerInterface
{
    protected $client;

    public function __construct()
    {
        $this->client = new Client([
            'timeout' => 10,
            'verify' => false
        ]);
    }

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $queryParams = $request->getQueryParams();
        $search = $queryParams['search'] ?? '';
        $url = $queryParams['url'] ?? '';

        if (!empty($url)) {
            return $this->getDoubanInfoByUrl($url);
        }

        if (!empty($search)) {
            return $this->searchDouban($search);
        }

        return new JsonResponse(['error' => 'Invalid request'], 400);
    }

    protected function searchDouban(string $keyword)
    {
        try {
            $response = $this->client->get('https://dbapis.ypsou.com/', [
                'query' => ['search' => $keyword]
            ]);

            $data = json_decode($response->getBody()->getContents(), true);
            return new JsonResponse($data);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage()], 500);
        }
    }

    protected function getDoubanInfoByUrl(string $url)
    {
        try {
            $response = $this->client->get('https://dbapis.ypsou.com/', [
                'query' => ['url' => $url]
            ]);

            $data = json_decode($response->getBody()->getContents(), true);
            return new JsonResponse($data);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage()], 500);
        }
    }
}