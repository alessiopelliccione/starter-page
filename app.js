const searchInput = document.querySelector('#search');
const cardsContainer = document.querySelector('#cards');
const cardTemplate = document.querySelector('#card-template');

const categories = Array.isArray(window.STARTER_FAVORITES) ? window.STARTER_FAVORITES : [];
const allItems = categories.flatMap((category) => {
  const topLevelItems = (category.items || []).map((item) => ({
    ...item,
    category: category.category,
    categoryLabel: category.label || category.category,
    subCategory: category.category,
    subCategoryLabel: category.label || category.category,
  }));

  const nestedGroups = (category.groups || []).flatMap((group) =>
    (group.items || []).map((item) => ({
      ...item,
      category: category.category,
      categoryLabel: category.label || category.category,
      subCategory: group.category,
      subCategoryLabel: group.label || group.category,
    }))
  );

  return [...topLevelItems, ...nestedGroups];
});

let filtered = [...allItems];

render();

searchInput.addEventListener('input', (event) => {
  const query = event.target.value.trim().toLowerCase();
  filtered = filterFavorites(allItems, query);
  render(query);
});

searchInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    const first = filtered[0];
    if (first) {
      window.open(first.url, '_blank', 'noopener');
    }
  }
});

function filterFavorites(list, query) {
  if (!query) {
    return list;
  }

  const tokens = query.split(/\s+/).filter(Boolean);
  const tagTokens = tokens
    .filter((token) => token.startsWith('#'))
    .map((token) => token.slice(1));
  const textTokens = tokens.filter((token) => !token.startsWith('#'));

  return list.filter((item) => {
    const haystack = `${item.name} ${item.description} ${item.tags.join(' ')}`.toLowerCase();

    const matchesText = textTokens.every((token) => haystack.includes(token));
    const matchesTags = tagTokens.every((tag) => item.tags.some((itemTag) => itemTag.toLowerCase().includes(tag)));

    return matchesText && matchesTags;
  });
}

function render(query = '') {
  cardsContainer.innerHTML = '';

  if (!filtered.length) {
    cardsContainer.appendChild(createEmptyState(query));
    return;
  }

  const grouped = groupByCategory(filtered);

  grouped.forEach(({ label: groupLabel, subgroups }) => {
    const section = document.createElement('section');
    section.className = 'category-group';

    const heading = document.createElement('h3');
    heading.className = 'category-title';
    heading.textContent = groupLabel;
    section.appendChild(heading);

    subgroups.forEach(({ label: subLabel, items }) => {
      const subgroup = document.createElement('div');
      subgroup.className = 'subcategory-group';

      if (subLabel && subLabel !== groupLabel) {
        const subHeading = document.createElement('h4');
        subHeading.className = 'subcategory-title';
        subHeading.textContent = subLabel;
        subgroup.appendChild(subHeading);
      }

      const grid = document.createElement('div');
      grid.className = 'subcategory-grid';

      items.forEach((favorite) => {
        const card = createCard(favorite, query);
        grid.appendChild(card);
      });

      subgroup.appendChild(grid);
      section.appendChild(subgroup);
    });

    cardsContainer.appendChild(section);
  });
}

function createCard(favorite, query) {
  const { name, url, description, tags } = favorite;
  const clone = cardTemplate.content.firstElementChild.cloneNode(true);

  clone.href = url;
  clone.querySelector('.card-title').innerHTML = highlight(name, query);
  clone.querySelector('.card-description').innerHTML = highlight(description, query);

  const domainElement = clone.querySelector('.card-domain');
  domainElement.textContent = extractHostname(url);

  const tagsContainer = clone.querySelector('.card-tags');
  tagsContainer.innerHTML = '';
  tags.forEach((tag) => {
    const li = document.createElement('li');
    li.className = 'card-tag';
    li.innerHTML = highlight(tag, query);
    tagsContainer.appendChild(li);
  });

  return clone;
}

function createEmptyState(query) {
  const container = document.createElement('div');
  container.className = 'empty-state';
  container.innerHTML = `
    <p>No matches for <span>${escapeHtml(query)}</span>.</p>
    <p>Try a different name, description, or #tag.</p>
  `;
  return container;
}

function groupByCategory(list) {
  const map = new Map();

  list.forEach((item) => {
    const catKey = item.category || 'other';
    const catLabel = item.categoryLabel || item.category || 'Other';
    const subKey = item.subCategory || 'misc';
    const subLabel = item.subCategoryLabel || item.subCategory || 'Misc';

    if (!map.has(catKey)) {
      map.set(catKey, {
        label: catLabel,
        subgroups: new Map(),
      });
    }

    const categoryEntry = map.get(catKey);
    if (!categoryEntry.subgroups.has(subKey)) {
      categoryEntry.subgroups.set(subKey, {
        label: subLabel,
        items: [],
      });
    }

    categoryEntry.subgroups.get(subKey).items.push(item);
  });

  return Array.from(map.values()).map((category) => ({
    label: category.label,
    subgroups: Array.from(category.subgroups.values()),
  }));
}

function extractHostname(url) {
  try {
    const { hostname } = new URL(url);
    return hostname.replace('www.', '');
  } catch (error) {
    return url;
  }
}

function highlight(text, query) {
  if (!query) {
    return escapeHtml(text);
  }

  const tokens = query
    .split(/\s+/)
    .filter(Boolean)
    .map((token) => (token.startsWith('#') ? token.slice(1) : token))
    .filter(Boolean)
    .sort((a, b) => b.length - a.length);

  if (!tokens.length) {
    return escapeHtml(text);
  }

  let result = escapeHtml(text);

  tokens.forEach((token) => {
    const pattern = new RegExp(`(${escapeRegExp(token)})`, 'gi');
    result = result.replace(pattern, '<mark>$1</mark>');
  });

  return result;
}

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
