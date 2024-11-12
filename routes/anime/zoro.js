"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const extensions_1 = require("@consumet/extensions");
const models_1 = require("@consumet/extensions/dist/models");
const routes = (fastify, options) => __awaiter(void 0, void 0, void 0, function* () {
    const zoro = new extensions_1.ANIME.Zoro(process.env.ZORO_URL);
    let baseUrl = "https://hianime.to";
    if (process.env.ZORO_URL) {
        baseUrl = `https://${process.env.ZORO_URL}`;
    }
    fastify.get('/', (_, rp) => {
        rp.status(200).send({
            intro: `Welcome to the zoro provider: check out the provider's website @ ${baseUrl}`,
            routes: ['/:query', '/recent-episodes', '/top-airing', '/most-popular', '/most-favorite', '/latest-completed', '/recent-added', '/info?id', '/watch/:episodeId'],
            documentation: 'https://docs.consumet.org/#tag/zoro',
        });
    });
    fastify.get('/:query', (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
        const query = request.params.query;
        const page = request.query.page;
        const res = yield zoro.search(query, page);
        reply.status(200).send(res);
    }));
    fastify.get('/recent-episodes', (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
        const page = request.query.page;
        const res = yield zoro.fetchRecentlyUpdated(page);
        reply.status(200).send(res);
    }));
    fastify.get('/top-airing', (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
        const page = request.query.page;
        const res = yield zoro.fetchTopAiring(page);
        reply.status(200).send(res);
    }));
    fastify.get('/most-popular', (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
        const page = request.query.page;
        const res = yield zoro.fetchMostPopular(page);
        reply.status(200).send(res);
    }));
    fastify.get('/most-favorite', (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
        const page = request.query.page;
        const res = yield zoro.fetchMostFavorite(page);
        reply.status(200).send(res);
    }));
    fastify.get('/latest-completed', (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
        const page = request.query.page;
        const res = yield zoro.fetchLatestCompleted(page);
        reply.status(200).send(res);
    }));
    fastify.get('/recent-added', (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
        const page = request.query.page;
        const res = yield zoro.fetchRecentlyAdded(page);
        reply.status(200).send(res);
    }));
    fastify.get('/top-upcoming', (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
        const page = request.query.page;
        const res = yield zoro.fetchTopUpcoming(page);
        reply.status(200).send(res);
    }));
    fastify.get('/schedule/:date', (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
        const date = request.params.date;
        const res = yield zoro.fetchSchedule(date);
        reply.status(200).send(res);
    }));
    fastify.get('/studio/:studioId', (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const studioId = request.params.studioId;
        const page = (_a = request.query.page) !== null && _a !== void 0 ? _a : 1;
        const res = yield zoro.fetchStudio(studioId, page);
        reply.status(200).send(res);
    }));
    fastify.get('/spotlight', (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield zoro.fetchSpotlight();
        reply.status(200).send(res);
    }));
    fastify.get('/search-suggestions/:query', (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
        const query = request.params.query;
        const res = yield zoro.fetchSearchSuggestions(query);
        reply.status(200).send(res);
    }));
    fastify.get('/info', (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
        const id = request.query.id;
        if (typeof id === 'undefined')
            return reply.status(400).send({ message: 'id is required' });
        try {
            const res = yield zoro
                .fetchAnimeInfo(id)
                .catch((err) => reply.status(404).send({ message: err }));
            return reply.status(200).send(res);
        }
        catch (err) {
            reply
                .status(500)
                .send({ message: 'Something went wrong. Contact developer for help.' });
        }
    }));
    const watch = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
        let episodeId = request.params.episodeId;
        if (!episodeId) {
            episodeId = request.query.episodeId;
        }
        const server = request.query.server;
        if (server && !Object.values(models_1.StreamingServers).includes(server))
            return reply.status(400).send({ message: 'server is invalid' });
        if (typeof episodeId === 'undefined')
            return reply.status(400).send({ message: 'id is required' });
        try {
            const res = yield zoro
                .fetchEpisodeSources(episodeId, server)
                .catch((err) => reply.status(404).send({ message: err }));
            reply.status(200).send(res);
        }
        catch (err) {
            reply
                .status(500)
                .send({ message: 'Something went wrong. Contact developer for help.' });
        }
    });
    fastify.get('/watch', watch);
    fastify.get('/watch/:episodeId', watch);
});
exports.default = routes;
