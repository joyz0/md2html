
export interface Blog {
  id: number;
  md5: string;
  filename: string;
  title?: string;
  description?: string;
  date?: string;
  author?: string;
  categories?: [string, string];
  tags?: string[];
  complexity: 'easy' | 'ordinary' | 'hard';
}
export interface ManifestBlog {
  index: number;
  cache: {
    [key: string]: Blog;
  };
}
