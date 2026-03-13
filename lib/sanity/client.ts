import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';

// 硬编码 Sanity 配置，避免构建时环境变量问题
const projectId = 'nckyp28c';
const dataset = 'production';

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion: '2024-03-10',
  useCdn: false
});

const builder = createImageUrlBuilder(sanityClient);

export function urlFor(source: any) {
  return builder.image(source);
}

export function urlForImage(source: any): string {
  if (!source) return '';
  return builder.image(source).url();
}
