interface Slug {
  id: string;
  depth: number;
  tagName: string;
  text: string;
}

interface FrontMatter {
  title?: string;
  description?: string;
  date?: string;
  author?: string;
  categories?: [string, string];
  tags?: string[];
  complexity?: 'easy' | 'ordinary' | 'hard';
}

interface BlogContent {
  id: number;
  md5: string;
  filename: string;
  slugs: Slug[] | null;
}

type BlogDesc = FrontMatter & BlogContent;

interface ManifestBlog {
  index: number;
  cache: {
    [key: string]: BlogDesc;
  };
}
