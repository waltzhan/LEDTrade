// @ts-nocheck
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'product',
  title: '产品',
  type: 'document',
  fields: [
    // 基础信息 - 多语言支持
    defineField({
      name: 'name',
      title: '产品名称 (多语言)',
      type: 'object',
      fields: [
        { name: 'zh', title: '中文 (必填)', type: 'string', validation: (Rule: any) => Rule.required() },
        { name: 'en', title: 'English (必填)', type: 'string', validation: (Rule: any) => Rule.required() },
        // 其他语言可按需添加
      ],
    }),
    
    defineField({
      name: 'slug',
      title: 'URL 标识',
      type: 'slug',
      options: {
        source: 'name.zh',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    }),
    
    // 分类
    defineField({
      name: 'category',
      title: '产品分类',
      type: 'reference',
      to: [{ type: 'category' }],
    }),
    
    // 描述 - 多语言
    defineField({
      name: 'description',
      title: '产品描述 (多语言)',
      type: 'object',
      fields: [
        { name: 'zh', title: '中文', type: 'text', rows: 3 },
        { name: 'en', title: 'English', type: 'text', rows: 3 },
      ],
    }),
    
    // 图片
    defineField({
      name: 'images',
      title: '产品图片',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              title: '图片说明',
              type: 'string',
            },
          ],
        },
      ],
    }),
    
    // SEO
    defineField({
      name: 'seo',
      title: 'SEO 设置',
      type: 'object',
      fields: [
        {
          name: 'metaTitle',
          title: 'Meta 标题',
          type: 'object',
          fields: [
            { name: 'zh', title: '中文', type: 'string' },
            { name: 'en', title: 'English', type: 'string' },
          ],
        },
        {
          name: 'metaDescription',
          title: 'Meta 描述',
          type: 'object',
          fields: [
            { name: 'zh', title: '中文', type: 'text', rows: 2 },
            { name: 'en', title: 'English', type: 'text', rows: 2 },
          ],
        },
      ],
    }),
  ],
  
  preview: {
    select: {
      title: 'name.zh',
      media: 'images.0',
    },
  },
});
