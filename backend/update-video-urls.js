const { DataSource } = require('typeorm');
const { Video } = require('./src/entities/video.entity');

async function updateVideoUrls() {
  const dataSource = new DataSource({
    type: 'sqlite',
    database: 'filmxane.db',
    entities: [Video],
    synchronize: false,
  });

  try {
    await dataSource.initialize();
    console.log('✅ Database connected');

    const videoRepository = dataSource.getRepository(Video);
    
    // Tüm videoları getir
    const videos = await videoRepository.find();
    console.log(`📹 Found ${videos.length} videos`);

    let updatedCount = 0;
    
    for (const video of videos) {
      let needsUpdate = false;
      
      // videoUrl güncelle
      if (!video.videoUrl && video.videoPath) {
        video.videoUrl = video.videoPath;
        needsUpdate = true;
        console.log(`🔄 Updating videoUrl for: ${video.title}`);
      }
      
      // thumbnailUrl güncelle
      if (!video.thumbnailUrl && video.thumbnailPath) {
        video.thumbnailUrl = video.thumbnailPath;
        needsUpdate = true;
        console.log(`🔄 Updating thumbnailUrl for: ${video.title}`);
      }
      
      if (needsUpdate) {
        await videoRepository.save(video);
        updatedCount++;
      }
    }
    
    console.log(`✅ Updated ${updatedCount} videos`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await dataSource.destroy();
    console.log('🔌 Database disconnected');
  }
}

updateVideoUrls();
