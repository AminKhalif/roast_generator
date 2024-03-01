import { useRouter } from 'next/router';
import React from 'react';

const PostPage = () => {
  const router = useRouter();
  const { post_name } = router.query;

// Linking  
//   import Link from 'next/link';
//   ...
//   <Link href={`/posts/${yourPostNameVariable}`}>
//     <a>Go to Post</a>
//   </Link>
  

  // You can now use `post_name` to fetch data, render content, etc.
  return (
    <div>
      <h1>Post: {post_name}</h1>
      {/* Render your post content based on `post_name` */}
    </div>
  );
};

export default PostPage;
