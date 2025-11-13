const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const JSON_DATA_PATH = path.join(__dirname, '../../migrations/json-data');

async function migrateUsers() {
  console.log('Migrating users...');
  const userMappingsPath = path.join(JSON_DATA_PATH, 'user_mappings.json');
  const userMappings = JSON.parse(fs.readFileSync(userMappingsPath, 'utf8'));

  const users = [];
  for (const [username, userData] of Object.entries(userMappings)) {
    const store = userData.backingStore.store;
    users.push({
      username: username,
      user_principal_name: store.userPrincipalName?.value1 || '',
      email: store.mail?.value1 || '',
      display_name: store.displayName?.value1 || '',
      given_name: store.givenName?.value1 || '',
      surname: store.surname?.value1 || '',
      business_phones: store.businessPhones?.value1?.value0 || [],
      mobile_phone: store.mobilePhone?.value1 || null,
      preferred_language: store.preferredLanguage?.value1 || null,
      office_location: store.officeLocation?.value1 || null,
      enabled: true
    });
  }

  const { data, error } = await supabase
    .from('users')
    .upsert(users, { onConflict: 'username' });

  if (error) {
    console.error('Error migrating users:', error);
  } else {
    console.log(`Successfully migrated ${users.length} users`);
  }

  return users;
}

async function migratePlaces() {
  console.log('Migrating places...');
  const placePath = path.join(JSON_DATA_PATH, 'place.json');
  const placeData = JSON.parse(fs.readFileSync(placePath, 'utf8'));

  const place = {
    id: placeData.id,
    place_id: placeData.placeID,
    name: placeData.name,
    display_name: placeData.displayName,
    description: placeData.description,
    content_types: placeData.contentTypes || [],
    tags: placeData.tags || [],
    place_type: placeData.type,
    published: placeData.published
  };

  const { data, error } = await supabase
    .from('places')
    .upsert([place], { onConflict: 'id' });

  if (error) {
    console.error('Error migrating places:', error);
  } else {
    console.log('Successfully migrated place');
  }

  return place;
}

async function getUserIdByUsername(username) {
  const { data, error } = await supabase
    .from('users')
    .select('id')
    .eq('username', username)
    .maybeSingle();

  return data?.id || null;
}

async function migrateDocuments() {
  console.log('Migrating documents...');
  const documentPath = path.join(JSON_DATA_PATH, 'document.json');
  const documentData = JSON.parse(fs.readFileSync(documentPath, 'utf8'));

  const authorId = await getUserIdByUsername(documentData.author.jive.username);

  const document = {
    id: documentData.id,
    subject: documentData.subject,
    content_text: documentData.content.text,
    author_id: authorId,
    place_id: documentData.parentPlace?.id || null,
    tags: documentData.tags || [],
    like_count: documentData.likeCount || 0,
    follower_count: documentData.followerCount || 0,
    view_count: documentData.viewCount || 0,
    published: documentData.published,
    updated: documentData.updated,
    is_question: documentData.question || false,
    restrict_replies: documentData.restrictReplies || false
  };

  const { data, error } = await supabase
    .from('documents')
    .upsert([document], { onConflict: 'id' });

  if (error) {
    console.error('Error migrating document:', error);
  } else {
    console.log('Successfully migrated document');
  }

  if (documentData.contentImages && documentData.contentImages.length > 0) {
    const images = documentData.contentImages.map(img => ({
      content_id: documentData.id,
      content_type: 'document',
      image_id: img.id,
      image_ref: img.ref,
      image_name: img.name
    }));

    await supabase.from('content_images').insert(images);
    console.log(`Migrated ${images.length} images for document`);
  }
}

async function migrateEvents() {
  console.log('Migrating events...');
  const eventPath = path.join(JSON_DATA_PATH, 'event.json');
  const eventData = JSON.parse(fs.readFileSync(eventPath, 'utf8'));

  const authorId = await getUserIdByUsername(eventData.author.jive.username);

  const event = {
    id: eventData.id,
    subject: eventData.subject,
    content_text: eventData.content.text,
    author_id: authorId,
    place_id: eventData.parentPlace?.id || null,
    location: eventData.location || null,
    phone: eventData.phone || null,
    start_date: eventData.startDate,
    end_date: eventData.endDate,
    event_access: eventData.eventAccess,
    max_attendees: eventData.maxAttendees,
    tags: eventData.tags || [],
    like_count: eventData.likeCount || 0,
    follower_count: eventData.followerCount || 0,
    view_count: eventData.viewCount || 0,
    published: eventData.published,
    updated: eventData.updated
  };

  const { data, error } = await supabase
    .from('events')
    .upsert([event], { onConflict: 'id' });

  if (error) {
    console.error('Error migrating event:', error);
  } else {
    console.log('Successfully migrated event');
  }
}

async function migratePosts() {
  console.log('Migrating posts...');
  const postPath = path.join(JSON_DATA_PATH, 'post.json');
  const postData = JSON.parse(fs.readFileSync(postPath, 'utf8'));

  const authorId = await getUserIdByUsername(postData.author.jive.username);

  const post = {
    id: postData.id,
    subject: postData.subject,
    content_text: postData.content.text,
    author_id: authorId,
    place_id: postData.parentPlace?.id || null,
    tags: postData.tags || [],
    like_count: postData.likeCount || 0,
    follower_count: postData.followerCount || 0,
    view_count: postData.viewCount || 0,
    published: postData.published,
    updated: postData.updated,
    is_question: postData.question || false,
    restrict_replies: postData.restrictReplies || false
  };

  const { data, error } = await supabase
    .from('posts')
    .upsert([post], { onConflict: 'id' });

  if (error) {
    console.error('Error migrating post:', error);
  } else {
    console.log('Successfully migrated post');
  }

  if (postData.contentImages && postData.contentImages.length > 0) {
    const images = postData.contentImages.map(img => ({
      content_id: postData.id,
      content_type: 'post',
      image_id: img.id,
      image_ref: img.ref,
      image_name: img.name
    }));

    await supabase.from('content_images').insert(images);
    console.log(`Migrated ${images.length} images for post`);
  }
}

async function main() {
  console.log('Starting FUSION Intranet data migration...\n');

  try {
    await migrateUsers();
    console.log('');

    await migratePlaces();
    console.log('');

    await migrateDocuments();
    console.log('');

    await migrateEvents();
    console.log('');

    await migratePosts();
    console.log('');

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

main();
