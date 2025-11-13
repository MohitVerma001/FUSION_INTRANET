const { supabase } = require('../config/database');

const placeData = {
  "id": "2867",
  "placeID": "449039",
  "contentTypes": ["blog", "documents", "files", "discussions", "polls", "videos", "events"],
  "name": "Mitsubishi Fuso Truck and Bus Corporation",
  "displayName": "MFTBC",
  "description": "Based in Kawasaki, Japan, Mitsubishi Fuso Truck and Bus Corporation (MFTBC) is one of Asia's leading commercial vehicle manufacturers.",
  "tags": ["fuso", "mftbc", "japan", "mitsubishi fuso", "kawasaki", "dta japan"],
  "published": "2018-03-06T01:22:16.255+0000",
  "type": "space"
};

const documentData = {
  "id": "477852",
  "subject": "Slides for power-saving calls",
  "content": {"text": "TEAMS slides for power-saving calls (for internal use only)"},
  "published": "2023-07-31T00:44:16.988+0000",
  "updated": "2023-07-31T00:52:35.134+0000",
  "author": {"id": "2325", "displayName": "Momoko Fujita"},
  "tags": [],
  "likeCount": 1,
  "viewCount": 69,
  "parentPlace": {"id": "2867"}
};

const postData = {
  "id": "173534",
  "subject": "BEHIND THE SCENES - To this day, and into the future",
  "content": {"text": "Let's step behind the curtain of the 2024 FUSO vibrant Ukiyo-e-style calendar..."},
  "published": "2023-11-13T02:27:26.950+0000",
  "updated": "2023-11-13T02:27:26.950+0000",
  "author": {"id": "2325", "displayName": "Momoko Fujita"},
  "tags": [],
  "likeCount": 9,
  "viewCount": 110,
  "parentPlace": {"id": "3892"}
};

async function migratePlace() {
  console.log('Migrating place data...');

  const { data, error } = await supabase
    .from('places')
    .upsert({
      id: placeData.id,
      place_id: placeData.placeID,
      name: placeData.name,
      display_name: placeData.displayName,
      description: placeData.description,
      place_type: placeData.type,
      tags: placeData.tags,
      published: placeData.published,
      banner_image_url: 'https://images.pexels.com/photos/2199293/pexels-photo-2199293.jpeg',
      follower_count: 2292,
      category: 'Purpose'
    }, { onConflict: 'id' })
    .select();

  if (error) {
    console.error('Error migrating place:', error);
  } else {
    console.log('✅ Place migrated successfully');
  }
}

async function migrateUsers() {
  console.log('Migrating users...');

  const sampleUsers = [
    {
      id: '2325',
      user_name: 'MOMFUJI',
      display_name: 'Momoko Fujita',
      email: 'momoko.fujita@daimlertruck.com',
      location: 'Japan',
      department: 'Communications'
    },
    {
      id: '955a0125-d667-4119-b048-7a9c78b5213b',
      user_name: 'RAKPURI',
      display_name: 'Puri, Rakesh (365)',
      email: 'rakesh.puri@daimlertruck.com',
      location: 'India',
      department: 'Technology'
    },
    {
      id: '9c0ab17c-ee3b-4eab-b9a9-b4d7b5c1d701',
      user_name: 'JUSHIMI',
      display_name: 'Shimizu, Junichiro (575)',
      email: 'junichiro.shimizu@daimlertruck.com',
      location: 'Japan',
      department: 'Engineering'
    }
  ];

  const { data, error } = await supabase
    .from('users')
    .upsert(sampleUsers, { onConflict: 'id' })
    .select();

  if (error) {
    console.error('Error migrating users:', error);
  } else {
    console.log(`✅ ${sampleUsers.length} users migrated successfully`);
  }
}

async function migrateDocument() {
  console.log('Migrating document...');

  const { data: authorData } = await supabase
    .from('users')
    .select('id')
    .eq('id', '2325')
    .maybeSingle();

  const authorId = authorData?.id || null;

  const { data, error } = await supabase
    .from('documents')
    .upsert({
      id: documentData.id,
      subject: documentData.subject,
      content_text: documentData.content.text,
      author_id: authorId,
      place_id: placeData.id,
      tags: documentData.tags,
      like_count: documentData.likeCount,
      view_count: documentData.viewCount,
      published: documentData.published,
      updated: documentData.updated
    }, { onConflict: 'id' })
    .select();

  if (error) {
    console.error('Error migrating document:', error);
  } else {
    console.log('✅ Document migrated successfully');
  }
}

async function migratePost() {
  console.log('Migrating post...');

  const { data: authorData } = await supabase
    .from('users')
    .select('id')
    .eq('id', '2325')
    .maybeSingle();

  const authorId = authorData?.id || null;

  const { data, error } = await supabase
    .from('posts')
    .upsert({
      id: postData.id,
      subject: postData.subject,
      content_text: "Let's step behind the curtain of the 2024 FUSO vibrant Ukiyo-e-style calendar commissioned to artist Fumiaki Muto. Transportation has long been an integral part of our lives.",
      author_id: authorId,
      place_id: placeData.id,
      tags: postData.tags,
      like_count: postData.likeCount,
      view_count: postData.viewCount,
      published: postData.published,
      updated: postData.updated
    }, { onConflict: 'id' })
    .select();

  if (error) {
    console.error('Error migrating post:', error);
  } else {
    console.log('✅ Post migrated successfully');
  }
}

async function migrateSamplePolls() {
  console.log('Migrating sample polls...');

  const { data: authorData } = await supabase
    .from('users')
    .select('id')
    .eq('id', '2325')
    .maybeSingle();

  const authorId = authorData?.id || null;

  const poll = {
    id: 'poll-sample-1',
    question: 'What sustainability initiative should MFTBC prioritize?',
    description: 'Help us shape our environmental roadmap',
    author_id: authorId,
    place_id: placeData.id,
    tags: ['sustainability', 'environment'],
    end_date: '2025-12-31',
    allow_multiple_votes: false,
    published: new Date().toISOString(),
    updated: new Date().toISOString()
  };

  const { data: pollData, error: pollError } = await supabase
    .from('polls')
    .upsert(poll, { onConflict: 'id' })
    .select()
    .single();

  if (pollError) {
    console.error('Error migrating poll:', pollError);
    return;
  }

  const options = [
    { poll_id: poll.id, option_text: 'Electric vehicle fleet', display_order: 0 },
    { poll_id: poll.id, option_text: 'Carbon neutral manufacturing', display_order: 1 },
    { poll_id: poll.id, option_text: 'Renewable energy adoption', display_order: 2 },
    { poll_id: poll.id, option_text: 'Waste reduction programs', display_order: 3 }
  ];

  const { error: optionsError } = await supabase
    .from('poll_options')
    .upsert(options, { onConflict: 'poll_id,display_order' });

  if (optionsError) {
    console.error('Error migrating poll options:', optionsError);
  } else {
    console.log('✅ Sample poll migrated successfully');
  }
}

async function migrateSampleVideos() {
  console.log('Migrating sample videos...');

  const { data: authorData } = await supabase
    .from('users')
    .select('id')
    .eq('id', '2325')
    .maybeSingle();

  const authorId = authorData?.id || null;

  const videos = [
    {
      id: 'video-sample-1',
      title: 'FUSO eCanter - Electric Truck Overview',
      description: 'Discover the future of sustainable transportation with our electric eCanter truck',
      video_url: 'https://example.com/video/ecanter.mp4',
      thumbnail_url: 'https://images.pexels.com/photos/1756957/pexels-photo-1756957.jpeg',
      duration: 180,
      author_id: authorId,
      place_id: placeData.id,
      tags: ['electric', 'ecanter', 'sustainability'],
      published: new Date().toISOString(),
      updated: new Date().toISOString()
    }
  ];

  const { error } = await supabase
    .from('videos')
    .upsert(videos, { onConflict: 'id' });

  if (error) {
    console.error('Error migrating videos:', error);
  } else {
    console.log('✅ Sample video migrated successfully');
  }
}

async function migrateSampleDiscussions() {
  console.log('Migrating sample discussions...');

  const { data: authorData } = await supabase
    .from('users')
    .select('id')
    .eq('id', '955a0125-d667-4119-b048-7a9c78b5213b')
    .maybeSingle();

  const authorId = authorData?.id || null;

  const discussions = [
    {
      id: 'discussion-sample-1',
      topic: 'Best practices for fleet management',
      content_text: 'What strategies have worked best for managing large vehicle fleets? Looking for insights on maintenance scheduling, fuel efficiency, and driver training.',
      author_id: authorId,
      place_id: placeData.id,
      tags: ['fleet management', 'operations'],
      is_question: true,
      is_answered: false,
      published: new Date().toISOString(),
      updated: new Date().toISOString()
    }
  ];

  const { error } = await supabase
    .from('discussions')
    .upsert(discussions, { onConflict: 'id' });

  if (error) {
    console.error('Error migrating discussions:', error);
  } else {
    console.log('✅ Sample discussion migrated successfully');
  }
}

async function main() {
  console.log('🚀 Starting data migration...\n');

  try {
    await migratePlace();
    await migrateUsers();
    await migrateDocument();
    await migratePost();
    await migrateSamplePolls();
    await migrateSampleVideos();
    await migrateSampleDiscussions();

    console.log('\n✅ All data migrated successfully!');
    console.log('\n📊 Migration Summary:');
    console.log('- 1 Space (MFTBC)');
    console.log('- 3 Users');
    console.log('- 1 Document');
    console.log('- 1 Blog Post');
    console.log('- 1 Poll with options');
    console.log('- 1 Video');
    console.log('- 1 Discussion');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main().then(() => process.exit(0)).catch(err => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = { migratePlace, migrateUsers, migrateDocument, migratePost };
