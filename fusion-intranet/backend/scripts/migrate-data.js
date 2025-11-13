const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// JSON folder path
const JSON_DATA_PATH = path.join(__dirname, '../../migrations/json-data');

// ---------------------------------------------
// 2️⃣ GET USER ID FOR FOREIGN KEYS
// ---------------------------------------------
async function getUserId(username) {
  const { data } = await supabase
    .from("users")
    .select("id")
    .eq("username", username)
    .maybeSingle();

  return data?.id ?? null;
}

// ---------------------------------------------
// 3️⃣ MIGRATION FUNCTIONS
// ---------------------------------------------
async function migrateUsers() {
  console.log('👤 Migrating users...');
  const file = path.join(JSON_DATA_PATH, 'user_mappings.json');
  const raw = JSON.parse(fs.readFileSync(file));

  const users = Object.entries(raw).map(([username, user]) => {
    const s = user.backingStore.store;

    return {
      username,
      user_principal_name: s.userPrincipalName?.value1 || '',
      email: s.mail?.value1 || '',
      display_name: s.displayName?.value1 || '',
      given_name: s.givenName?.value1 || '',
      surname: s.surname?.value1 || '',
      business_phones: s.businessPhones?.value1?.value0 || [],
      mobile_phone: s.mobilePhone?.value1 || null,
      preferred_language: s.preferredLanguage?.value1 || null,
      office_location: s.officeLocation?.value1 || null,
      enabled: true
    };
  });

  // Use upsert to avoid duplicate key error on 'username'
  const { error } = await supabase.from('users').upsert(users, { onConflict: ['username'] });

  if (error) console.error("❌ Error migrating users:", error);
  else console.log(`✔ ${users.length} users migrated\n`);
}

async function migratePlaces() {
  console.log('📍 Migrating places...');
  const file = path.join(JSON_DATA_PATH, 'place.json');
  const data = JSON.parse(fs.readFileSync(file));

  const place = {
    id: data.id,
    place_id: data.placeID,
    name: data.name,
    display_name: data.displayName,
    description: data.description,
    content_types: data.contentTypes || [],
    tags: data.tags || [],
    place_type: data.type,
    // Ensure that 'published' is correctly interpreted as a boolean
    published: (data.published === "true" || data.published === true) // Convert to boolean
  };

  const { error } = await supabase.from('places').upsert(place);

  if (error) console.error("❌ Error migrating place:", error);
  else console.log("✔ Place migrated\n");
}

async function migrateDocuments() {
  console.log('📄 Migrating documents...');
  const file = path.join(JSON_DATA_PATH, 'document.json');
  const data = JSON.parse(fs.readFileSync(file));

  const authorId = await getUserId(data.author.jive.username);

  const document = {
    id: data.id,
    subject: data.subject,
    content_text: data.content?.text || '',
    author_id: authorId,
    place_id: data.parentPlace?.id || null,
    tags: data.tags || []
  };

  // Upsert document
  await supabase.from('documents').upsert(document);

  // Handle content images
  if (data.contentImages?.length > 0) {
    const images = data.contentImages.map(img => ({
      content_id: data.id,
      content_type: 'document',
      image_id: img.id,
      image_ref: img.ref,
      image_name: img.name
    }));

    await supabase.from('content_images').insert(images);
    console.log(`✔ ${images.length} document images migrated\n`);
  }
}

async function migrateEvents() {
  console.log('📅 Migrating events...');
  const raw = JSON.parse(fs.readFileSync(path.join(JSON_DATA_PATH, 'event.json')));
  const authorId = await getUserId(raw.author.jive.username);

  const event = {
    id: raw.id,
    subject: raw.subject,
    content_text: raw.content?.text || '',
    author_id: authorId,
    place_id: raw.parentPlace?.id || null
  };

  await supabase.from('events').upsert(event);
  console.log("✔ Event migrated\n");
}

async function migratePosts() {
  console.log('📝 Migrating posts...');
  const raw = JSON.parse(fs.readFileSync(path.join(JSON_DATA_PATH, 'post.json')));
  const authorId = await getUserId(raw.author.jive.username);

  const post = {
    id: raw.id,
    subject: raw.subject,
    content_text: raw.content?.text || '',
    author_id: authorId,
    place_id: raw.parentPlace?.id || null,
    tags: raw.tags || []
  };

  await supabase.from('posts').upsert(post);

  // Handle content images for posts
  if (raw.contentImages?.length > 0) {
    const images = raw.contentImages.map(img => ({
      content_id: raw.id,
      content_type: 'post',
      image_id: img.id,
      image_ref: img.ref,
      image_name: img.name
    }));

    await supabase.from('content_images').insert(images);
    console.log(`✔ ${images.length} post images migrated\n`);
  }
}

// ---------------------------------------------
// 4️⃣ MAIN EXECUTION
// ---------------------------------------------
async function main() {
  console.log("🚀 Starting full FUSION migration...\n");

  // No need to create tables since they are already created manually
  await migrateUsers();
  await migratePlaces();
  await migrateDocuments();
  await migrateEvents();
  await migratePosts();

  console.log("🎉 Migration completed successfully!");
}

main();
