let _id = 9000;

export const uid = () => _id++;

export function countAll(comments) {
  return comments.reduce((s, c) => s + 1 + countAll(c.replies), 0);
}

export function addReplyTo(comments, parentId, reply) {
  return comments.map(c => {
    if (c.id === parentId) return {...c, replies:[...c.replies, reply]};
    return {...c, replies: addReplyTo(c.replies, parentId, reply)};
  });
}

export function toggleLikeIn(comments, cid, wasLiked) {
  return comments.map(c => {
    if (c.id === cid) return {...c, likes: wasLiked ? c.likes-1 : c.likes+1};
    return {...c, replies: toggleLikeIn(c.replies, cid, wasLiked)};
  });
}

export function wcCount(html) {
  return (html || "").replace(/<[^>]*>/g," ").trim().split(/\s+/).filter(Boolean).length;
}