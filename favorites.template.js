// Example structure for STARTER_FAVORITES. Replace placeholder values before use.
window.STARTER_FAVORITES = [
  {
    category: 'category-id', // unique identifier (e.g. 'dev')
    label: 'Category Name', // display label (e.g. 'Dev')
    // (optional) links directly under the category
    items: [
      {
        name: 'Link Name',
        url: 'https://example.com',
        description: 'Short description of the link',
        tags: ['tag1', 'tag2'],
      },
    ],
    // (optional) sub-groups inside the category
    groups: [
      {
        category: 'subcategory-id', // e.g. 'dev-tools'
        label: 'Subcategory Name', // e.g. 'Build & Tools'
        items: [
          {
            name: 'Link Name',
            url: 'https://example.com',
            description: 'Short description of the link',
            tags: ['tag1', 'tag2'],
          },
        ],
      },
    ],
  },
];
