import { DataSource } from 'typeorm';
import { Category } from '../entities/category.entity';

export const seedCategories = async (dataSource: DataSource) => {
  const categoryRepository = dataSource.getRepository(Category);

  const categories = [
    {
      name: 'Action',
      nameKurdish: 'Çalakî',
      slug: 'action',
      description: 'Action movies and series',
      icon: '⚡',
      color: '#ff4757',
      isActive: true,
      sortOrder: 1,
    },
    {
      name: 'Drama',
      nameKurdish: 'Drama',
      slug: 'drama',
      description: 'Drama movies and series',
      icon: '🎭',
      color: '#2ed573',
      isActive: true,
      sortOrder: 2,
    },
    {
      name: 'Comedy',
      nameKurdish: 'Komedy',
      slug: 'comedy',
      description: 'Comedy movies and series',
      icon: '😄',
      color: '#ffa502',
      isActive: true,
      sortOrder: 3,
    },
    {
      name: 'Horror',
      nameKurdish: 'Tirs',
      slug: 'horror',
      description: 'Horror movies and series',
      icon: '👻',
      color: '#5352ed',
      isActive: true,
      sortOrder: 4,
    },
    {
      name: 'Romance',
      nameKurdish: 'Eşq',
      slug: 'romance',
      description: 'Romance movies and series',
      icon: '💕',
      color: '#ff6b81',
      isActive: true,
      sortOrder: 5,
    },
    {
      name: 'Sci-Fi',
      nameKurdish: 'Zanistî',
      slug: 'sci-fi',
      description: 'Science fiction movies and series',
      icon: '🚀',
      color: '#70a1ff',
      isActive: true,
      sortOrder: 6,
    },
  ];

  for (const categoryData of categories) {
    const existingCategory = await categoryRepository.findOne({
      where: { slug: categoryData.slug },
    });

    if (!existingCategory) {
      const category = categoryRepository.create(categoryData);
      await categoryRepository.save(category);
      console.log(`✅ Category created: ${categoryData.name}`);
    } else {
      console.log(`ℹ️ Category already exists: ${categoryData.name}`);
    }
  }
};
