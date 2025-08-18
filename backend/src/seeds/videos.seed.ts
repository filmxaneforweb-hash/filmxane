import { DataSource } from 'typeorm';
import { Video, VideoType, VideoStatus, VideoQuality } from '../entities/video.entity';

export const seedVideos = async (dataSource: DataSource) => {
  const videoRepository = dataSource.getRepository(Video);

  // Check if videos already exist
  const existingVideos = await videoRepository.count();
  if (existingVideos > 0) {
    console.log('Videos already seeded, skipping...');
    return;
  }

  const videos = [
    // Movies
    {
      title: 'Kurdish Movie 1',
      description: 'A beautiful Kurdish movie about love and friendship',
      genre: JSON.stringify(['Drama', 'Romance']),
      type: VideoType.MOVIE,
      status: VideoStatus.PUBLISHED,
      duration: 7200, // 2 hours in seconds
      year: 2023,
      rating: 4.5,
      viewCount: 1500,
      views: 1500,
      likeCount: 120,
      dislikeCount: 10,
      shares: 45,
      videoUrl: '/uploads/videos/sample1.mp4',
      thumbnailUrl: '/uploads/thumbnails/sample1.jpg',
      posterUrl: '/uploads/posters/sample1.jpg',
      trailerUrl: '/uploads/trailers/sample1.mp4',
      quality: VideoQuality.HD,
      isFeatured: true,
      isNew: true,
      uploadedById: '1', // Assuming user with ID 1 exists
      publishedAt: new Date(),
    },
    {
      title: 'Kurdish Movie 2',
      description: 'An action-packed Kurdish adventure film',
      genre: JSON.stringify(['Action', 'Adventure']),
      type: VideoType.MOVIE,
      status: VideoStatus.PUBLISHED,
      duration: 5400, // 1.5 hours in seconds
      year: 2022,
      rating: 4.2,
      viewCount: 2200,
      views: 2200,
      likeCount: 180,
      dislikeCount: 15,
      shares: 60,
      videoUrl: '/uploads/videos/sample2.mp4',
      thumbnailUrl: '/uploads/thumbnails/sample2.jpg',
      posterUrl: '/uploads/posters/sample2.jpg',
      trailerUrl: '/uploads/trailers/sample2.mp4',
      quality: VideoQuality.HD,
      isFeatured: false,
      isNew: false,
      uploadedById: '1',
      publishedAt: new Date(),
    },
    {
      title: 'Kurdish Movie 3',
      description: 'A comedy film that will make you laugh',
      genre: JSON.stringify(['Comedy', 'Family']),
      type: VideoType.MOVIE,
      status: VideoStatus.PUBLISHED,
      duration: 6300, // 1.75 hours in seconds
      year: 2021,
      rating: 4.0,
      viewCount: 1800,
      views: 1800,
      likeCount: 150,
      dislikeCount: 20,
      shares: 40,
      videoUrl: '/uploads/videos/sample3.mp4',
      thumbnailUrl: '/uploads/thumbnails/sample3.jpg',
      posterUrl: '/uploads/posters/sample3.jpg',
      trailerUrl: '/uploads/trailers/sample3.mp4',
      quality: VideoQuality.HD,
      isFeatured: false,
      isNew: false,
      uploadedById: '1',
      publishedAt: new Date(),
    },
    // Series
    {
      title: 'Kurdish Series 1',
      description: 'A dramatic series about Kurdish history',
      genre: JSON.stringify(['Drama', 'History']),
      type: VideoType.SERIES,
      status: VideoStatus.PUBLISHED,
      year: 2023,
      rating: 4.7,
      viewCount: 3000,
      views: 3000,
      likeCount: 250,
      dislikeCount: 12,
      shares: 80,
      videoUrl: '/uploads/videos/series1.mp4',
      thumbnailUrl: '/uploads/thumbnails/series1.jpg',
      posterUrl: '/uploads/posters/series1.jpg',
      trailerUrl: '/uploads/trailers/series1.mp4',
      quality: VideoQuality.HD,
      isFeatured: true,
      isNew: true,
      totalSeasons: 2,
      totalEpisodes: 24,
      uploadedById: '1',
      publishedAt: new Date(),
    },
    {
      title: 'Kurdish Series 2',
      description: 'A romantic series about modern Kurdish life',
      genre: JSON.stringify(['Romance', 'Drama']),
      type: VideoType.SERIES,
      status: VideoStatus.PUBLISHED,
      year: 2022,
      rating: 4.3,
      viewCount: 2500,
      views: 2500,
      likeCount: 200,
      dislikeCount: 18,
      shares: 65,
      videoUrl: '/uploads/videos/series2.mp4',
      thumbnailUrl: '/uploads/thumbnails/series2.jpg',
      posterUrl: '/uploads/posters/series2.jpg',
      trailerUrl: '/uploads/trailers/series2.mp4',
      quality: VideoQuality.HD,
      isFeatured: false,
      isNew: false,
      totalSeasons: 1,
      totalEpisodes: 12,
      uploadedById: '1',
      publishedAt: new Date(),
    },
    {
      title: 'Kurdish Series 3',
      description: 'A thriller series with unexpected twists',
      genre: JSON.stringify(['Thriller', 'Mystery']),
      type: VideoType.SERIES,
      status: VideoStatus.PUBLISHED,
      year: 2021,
      rating: 4.1,
      viewCount: 1900,
      views: 1900,
      likeCount: 160,
      dislikeCount: 25,
      shares: 50,
      videoUrl: '/uploads/videos/series3.mp4',
      thumbnailUrl: '/uploads/thumbnails/series3.jpg',
      posterUrl: '/uploads/posters/series3.jpg',
      trailerUrl: '/uploads/trailers/series3.mp4',
      quality: VideoQuality.HD,
      isFeatured: false,
      isNew: false,
      totalSeasons: 3,
      totalEpisodes: 36,
      uploadedById: '1',
      publishedAt: new Date(),
    },
  ];

  for (const videoData of videos) {
    const video = videoRepository.create(videoData);
    await videoRepository.save(video);
  }

  console.log(`✅ Seeded ${videos.length} videos`);
};
