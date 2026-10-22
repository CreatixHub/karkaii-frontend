import NameDateStatusPage from '../../shared/NameDateStatusPage';
import { TAGS } from './data/blogTags.data';

const BlogTags = () => (
  <NameDateStatusPage
    title="Blog Tags"
    cardTitle="Tags List"
    noun="Tag"
    plural="tags"
    columnLabel="Tags"
    filterLabel="Tags"
    scope="blogTags"
    rows={TAGS}
  />
);

export default BlogTags;
