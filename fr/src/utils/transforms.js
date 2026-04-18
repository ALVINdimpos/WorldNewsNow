import { timeAgo } from './timeAgo';

export function transformArticle(a) {
  if (!a) return null;
  return {
    id:       a._id || a.id,
    _id:      a._id || a.id,
    category: a.category,
    breaking: a.breaking || false,
    featured: a.featured || false,
    title:    a.title,
    excerpt:  a.excerpt || '',
    content:  a.content || '',
    isHtml:   a.isHtml || false,
    author:   a.author
      ? { name: a.author.name, role: a.author.role, avatar: a.author.avatar }
      : { name: 'Unknown', role: 'journalist' },
    time:        timeAgo(a.publishedAt || a.createdAt),
    publishedAt: a.publishedAt,
    likes:       typeof a.likesCount === 'number' ? a.likesCount : (Array.isArray(a.likes) ? a.likes.length : a.likes || 0),
    likedByMe:   a.likedByMe || false,
    comments:    [],
    commentsCount: a.commentsCount || 0,
    viewCount:   a.viewCount || 0,
    isDraft:     a.isDraft || false,
    isPublished: a.isPublished || false,
    coverImage:  a.coverImage || '',
    tags:        a.tags || [],
  };
}

export function transformComment(c) {
  if (!c) return null;
  return {
    id:      c._id || c.id,
    _id:     c._id || c.id,
    author:  c.author ? c.author.name : 'Anonymous',
    role:    c.author ? c.author.role : 'anonymous',
    text:    c.text,
    time:    timeAgo(c.createdAt),
    likes:   typeof c.likesCount === 'number' ? c.likesCount : (Array.isArray(c.likes) ? c.likes.length : c.likes || 0),
    replies: (c.replies || []).map(transformComment),
  };
}

export function transformJournalist(j) {
  if (!j) return null;
  const user = j.user || {};
  return {
    id:        j._id || j.id,
    name:      user.name || '',
    email:     user.email || '',
    role:      'journalist',
    avatar:    user.avatar || '',
    specialty: j.specialty || '',
    bio:       j.bio || user.bio || '',
    articles:  j.articleCount || 0,
    x:         j.socialLinks?.x || '',
    linkedin:  j.socialLinks?.linkedin || '',
    isVerified: j.isVerified || false,
    userId:    user._id || '',
  };
}
