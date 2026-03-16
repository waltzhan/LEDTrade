"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = exports.sanityClient = void 0;
exports.urlFor = urlFor;
exports.urlForImage = urlForImage;
const client_1 = require("@sanity/client");
const image_url_1 = require("@sanity/image-url");
// 硬编码 Sanity 配置，避免构建时环境变量问题
const projectId = 'nckyp28c';
const dataset = 'production';
exports.sanityClient = (0, client_1.createClient)({
    projectId,
    dataset,
    apiVersion: '2024-03-10',
    useCdn: false
});
// 导出 client 供其他模块使用
exports.client = exports.sanityClient;
const builder = (0, image_url_1.createImageUrlBuilder)(exports.sanityClient);
function urlFor(source) {
    return builder.image(source);
}
function urlForImage(source) {
    if (!source)
        return '';
    return builder.image(source).url();
}
