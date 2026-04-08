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
    }
  }

  const name = fieldsI18n['name'][language];
  const description = fieldsI18n['description'][language];
  const content = fieldsI18n['content'][language];

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
    pc.image,
    json_group_array(
      json_object(
        'product_id', p.id,
        'product_name', p.name_fr,
        'product_subname', p.subname_fr,
        'product_description', p.description_fr,
        'product_name', p.name_fr,
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

async function getProducts(language, pathogens = [], technologies = []) {
  const lang = LANGUAGES.includes(language) ? language : 'en';
  const joinList = [];
  const whereList = [];

  technologies = technologies.map((technology) => `'${technology}'`);

  if (pathogens.length > 0) {
    joinList.push('INNER JOIN product_pathogens pp ON pp.product_id = p.id');
    whereList.push(`pp.pathogens_id IN (${pathogens.join(', ')})`);
  }

  if (technologies.length > 0) {
    joinList.push('INNER JOIN product_technologies pt ON pt.product_id = p.id');
    whereList.push(`pt.technologies_id IN (${technologies.join(', ')})`);
  }

  const join = joinList.join(' ');
  const where = whereList.length > 0 ? 'WHERE ' + whereList.join(' AND ') : '';

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
    ${join}
    ${where}`;

  return runQuery(query);
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
