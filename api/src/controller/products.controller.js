const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./directus/database/afyiadb.sqlite');
const { LANGUAGES } = require('./news.controller');

async function getCategories(language, id) {
  const fieldsI18n = {
    name: {
      fr: 'name_fr',
      en: 'name_en',
    },
    description: {
      fr: 'description_fr',
      en: 'description_en',
    },
    content: {
      fr: 'content_fr',
      en: 'content_en',
    },
    content_stats: {
      fr: 'content_stats_fr',
      en: 'content_stats_en',
    }
  }

  const productFieldsI18n = {
    name: 'name_' + language,
    subname: 'subname_' + language,
    description: 'description_' + language,
  }

  const name = fieldsI18n['name'][language];
  const description = fieldsI18n['description'][language];
  const content = fieldsI18n['content'][language];
  const content_stats = fieldsI18n['content_stats'][language];

  let where = '';
  const params = [];

  if (id) {
    where = 'WHERE pc.id = ?';
    params.push(id);
  }

  const query = `
    SELECT pc.id,
    pc.${name} as name,
    pc.${description} as description,
    pc.${content} as content,
    pc.${content_stats} as stats,
    pc.image,
    pc.image_about,
    json_group_array(
      json_object(
        'product_id', p.id,
        'product_name', p.${productFieldsI18n['name']},
        'product_subname', p.${productFieldsI18n['subname']},
        'product_description', p.${productFieldsI18n['description']},
        'product_image', p.product_image
      )
    ) FILTER (WHERE p.id IS NOT NULL) AS products
    FROM product_categories pc
    LEFT JOIN product_categories_product pcp ON pcp.product_categories_id = pc.id
    LEFT JOIN product p ON p.id = pcp.product_id
    ${where}
    GROUP BY pc.id
  `;

  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) {
        console.error(err.message);
        reject(new Error('Error while fetching categories'));
      } else {
        resolve(rows);
      }
    });
  });
}

async function getProducts(language, pathogens = [], technologies = [], id = null) {
  const lang = LANGUAGES.includes(language) ? language : 'en';
  const joinList = [];
  const whereList = [];
  const params = [];
  const fieldsI18n = Object.fromEntries(
    ['name', 'subname', 'description', 'description_full', 'content', 'features_table']
    .map(key => [key, `${key}_${language}`])
  );

  technologies = technologies.map((technology) => `'${technology}'`);

  if (pathogens.length > 0) {
    joinList.push('INNER JOIN product_pathogens pp ON pp.product_id = p.id');
    whereList.push(`pp.pathogens_id IN (${pathogens.join(', ')})`);
  }

  if (technologies.length > 0) {
    joinList.push('INNER JOIN product_technologies pt ON pt.product_id = p.id');
    whereList.push(`pt.technologies_id IN (${technologies.join(', ')})`);
  }

  if (id) {
    whereList.push('p.id = ?');
    params.push(id);
  }

  const join = joinList.join(' ');
  const where = whereList.length > 0 ? 'WHERE ' + whereList.join(' AND ') : '';

  const query = `
    SELECT p.id as product_id,
      p.${fieldsI18n['name']} as product_name,
      p.${fieldsI18n['subname']} as product_subname,
      p.${fieldsI18n['description']} as product_description,
      p.${fieldsI18n['description_full']} as product_full_description,
      p.${fieldsI18n['content']} as product_content,
      p.is_ruo,
      p.is_ce,
      p.is_coming_soon,
      p.product_image,
      p.description_image,
      p.show_software_link,
      p.${fieldsI18n['features_table']} as features_table
    FROM product p
    ${join}
    ${where}`;

  return runQuery(query, params);
}

async function getPathogens(language) {
  const query = `SELECT id, name FROM pathogens`;

  return runQuery(query);
}

async function getTechnologies(language) {
  const query = `SELECT id, name FROM technologies`;

  return runQuery(query);
}

async function getFeaturedProducts(language) {
  const lang = LANGUAGES.includes(language) ? language : 'en';

  const query = `
    SELECT p.id,
      p.name_fr as name,
      subname_fr as subname,
      description_fr as description,
      content_fr as content,
      is_ruo as isRuo,
      is_ce as isCe,
      is_coming_soon as isComingSoon,
      product_image
    FROM product p
    WHERE is_homepage_visible = 1
    ORDER BY order_index`;

  return runQuery(query);
}

function runQuery(query, params = []) {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) {
        console.error(err.message);
        reject(new Error(err.message));
      } else {
        resolve(rows);
      }
    }
  )});
}

module.exports = {
  getCategories,
  getProducts,
  getPathogens,
  getTechnologies,
  getFeaturedProducts,
}
