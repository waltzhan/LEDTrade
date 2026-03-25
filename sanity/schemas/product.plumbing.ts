/**
 * 水暖卫浴产品 Schema
 * Plumbing & Sanitary Ware Product Schema
 */

export default {
  name: 'product',
  title: 'Products',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Product Name',
      type: 'object',
      fields: [
        {
          name: 'zh',
          title: '中文名称',
          type: 'string',
          validation: (Rule: any) => Rule.required().min(2).max(80),
        },
        {
          name: 'en',
          title: 'English Name',
          type: 'string',
          validation: (Rule: any) => Rule.required().min(2).max(80),
        },
      ],
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name.zh',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'category',
      title: 'Product Category',
      type: 'reference',
      to: [{type: 'category'}],
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'object',
      fields: [
        {
          name: 'zh',
          title: '中文描述',
          type: 'text',
          rows: 3,
          validation: (Rule: any) => Rule.max(300),
        },
        {
          name: 'en',
          title: 'English Description',
          type: 'text',
          rows: 3,
          validation: (Rule: any) => Rule.max(300),
        },
      ],
    },
    {
      name: 'images',
      title: 'Product Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              title: 'Alternative Text',
              type: 'string',
              description: 'Important for SEO and accessibility',
            },
          ],
        },
      ],
      options: {
        layout: 'grid',
      },
      validation: (Rule: any) => Rule.min(1),
    },
    {
      name: 'specifications',
      title: 'Specifications',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'label',
              title: 'Specification Name',
              type: 'object',
              fields: [
                {name: 'zh', title: '中文', type: 'string'},
                {name: 'en', title: 'English', type: 'string'},
              ],
            },
            {
              name: 'value',
              title: 'Value',
              type: 'object',
              fields: [
                {name: 'zh', title: '中文值', type: 'string'},
                {name: 'en', title: 'English value', type: 'string'},
              ],
            },
          ],
          preview: {
            select: {
              labelZh: 'label.zh',
              labelEn: 'label.en',
              valueZh: 'value.zh',
              valueEn: 'value.en',
            },
            prepare(selection: any) {
              return {
                title: `${selection.labelZh || selection.labelEn}: ${selection.valueZh || selection.valueEn}`,
              };
            },
          },
        },
      ],
      description: 'Product specifications like material, size, finish, etc.',
    },
    {
      name: 'features',
      title: 'Key Features',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'feature',
              title: 'Feature',
              type: 'object',
              fields: [
                {name: 'zh', title: '中文特点', type: 'string'},
                {name: 'en', title: 'English feature', type: 'string'},
              ],
            },
          ],
          preview: {
            select: {
              zh: 'feature.zh',
              en: 'feature.en',
            },
            prepare(selection: any) {
              return {
                title: selection.zh || selection.en,
              };
            },
          },
        },
      ],
      description: 'Highlight key selling points and features',
    },
    {
      name: 'applications',
      title: 'Applications',
      type: 'array',
      of: [
        {
          type: 'string',
          options: {
            list: [
              {title: 'Residential Bathroom', value: 'residential_bathroom'},
              {title: 'Commercial Restroom', value: 'commercial_restroom'},
              {title: 'Hotel', value: 'hotel'},
              {title: 'Hospital', value: 'hospital'},
              {title: 'Kitchen', value: 'kitchen'},
              {title: 'Public Facility', value: 'public_facility'},
            ],
          },
        },
      ],
      description: 'Where this product can be used',
    },
    {
      name: 'certifications',
      title: 'Certifications',
      type: 'array',
      of: [
        {
          type: 'string',
          options: {
            list: [
              {title: 'CE', value: 'ce'},
              {title: 'ISO 9001', value: 'iso9001'},
              {title: 'UPC', value: 'upc'},
              {title: 'CSA', value: 'csa'},
              {title: 'WaterMark', value: 'watermark'},
              {title: 'WRAS', value: 'wras'},
              {title: 'NSF', value: 'nsf'},
            ],
          },
        },
      ],
      description: 'Industry certifications and compliance',
    },
    {
      name: 'seo',
      title: 'SEO Settings',
      type: 'object',
      fields: [
        {
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'object',
          fields: [
            {name: 'zh', title: '中文标题', type: 'string'},
            {name: 'en', title: 'English Title', type: 'string'},
          ],
        },
        {
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'object',
          fields: [
            {name: 'zh', title: '中文描述', type: 'text', rows: 2},
            {name: 'en', title: 'English Description', type: 'text', rows: 2},
          ],
        },
        {
          name: 'keywords',
          title: 'Keywords',
          type: 'array',
          of: [{type: 'string'}],
          description: 'SEO keywords (comma-separated)',
        },
      ],
    },
  ],
  preview: {
    select: {
      nameZh: 'name.zh',
      nameEn: 'name.en',
      media: 'images[0]',
    },
    prepare(selection: any) {
      return {
        title: selection.nameZh || selection.nameEn,
        subtitle: 'Product',
        media: selection.media,
      };
    },
  },
};
