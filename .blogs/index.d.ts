interface Blog {
  id: number;
  md5: string;
  title: string;
  description?: string;
  date?: string;
  author?: string;
  tags?: string[];
  complexity: 'easy' | 'ordinary' | 'hard';
}
interface ManifestBlog {
  index: number;
  titleMap: {
    [key: string]: Blog;
  };
}
