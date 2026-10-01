import NameDateStatusPage from '../../shared/NameDateStatusPage';
import { CATEGORIES } from './data/blogCategories.data';

const BlogCategories = () => (
  <NameDateStatusPage
    title="Blog Categories"
    cardTitle="Categories List"
    noun="Category"
    plural="categories"
    columnLabel="Category"
    filterLabel="Category"
    scope="blogCategories"
    rows={CATEGORIES}
  />
);

export default BlogCategories;
