import { supabase } from "./supabase";

export type CommunityMember = {
  name: string;
  handle: string;
  role: string;
  initials: string;
  tone: string;
  country?: string;
  verified?: boolean;
};

export type CommunityCommentRecord = {
  id: string;
  author: CommunityMember;
  body: string;
  time: string;
  createdAt: string;
  parentId?: string;
};

export type CommunityPostRecord = {
  id: string;
  author: CommunityMember;
  title?: string;
  body: string;
  topic: string;
  countryId?: string;
  createdAt: string;
  likes: number;
  comments: CommunityCommentRecord[];
  postType: "discussion" | "question" | "case" | "resource" | "poll";
  tags: string[];
};

type MemberRow = { author_id: string; author_name: string };
type CommentRow = MemberRow & {
  id: string;
  body: string;
  created_at: string;
  parent_comment_id: string | null;
  hidden: boolean;
};
type PostRow = MemberRow & {
  id: string;
  title: string | null;
  body: string;
  topic: string;
  country_id: string | null;
  post_type: CommunityPostRecord["postType"];
  tags: string[] | null;
  created_at: string;
  hidden: boolean;
  medweg_community_comments: CommentRow[];
};

const tones = ["blue", "peach", "mint", "lavender"];

function toMember(row: MemberRow): CommunityMember {
  const name = row.author_name?.trim() || "Community member";
  const initials = name
    .split(/\s+/)
    .map(part => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "M";
  return {
    name,
    handle: `member-${row.author_id.replace(/-/g, "").slice(0, 8)}`,
    role: "MedVade member",
    initials,
    tone: tones[(row.author_id.charCodeAt(0) || 0) % tones.length],
  };
}

function toComment(row: CommentRow): CommunityCommentRecord {
  return {
    id: row.id,
    author: toMember(row),
    body: row.body,
    time: row.created_at,
    createdAt: row.created_at,
    parentId: row.parent_comment_id || undefined,
  };
}

function toPost(row: PostRow): CommunityPostRecord {
  return {
    id: row.id,
    author: toMember(row),
    title: row.title || undefined,
    body: row.body,
    topic: row.topic,
    countryId: row.country_id || undefined,
    createdAt: row.created_at,
    likes: 0,
    postType: row.post_type,
    tags: row.tags || [],
    comments: (row.medweg_community_comments || [])
      .filter(comment => !comment.hidden)
      .map(toComment)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
  };
}

function configuredClient() {
  if (!supabase) throw new Error("The community database is not configured.");
  return supabase;
}

export async function fetchCommunityPosts(): Promise<CommunityPostRecord[]> {
  const { data, error } = await configuredClient()
    .from("medweg_community_posts")
    .select(
      "id, author_id, author_name, title, body, topic, country_id, post_type, tags, created_at, hidden, medweg_community_comments(id, author_id, author_name, body, created_at, parent_comment_id, hidden)"
    )
    .eq("hidden", false)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return ((data || []) as unknown as PostRow[]).map(toPost);
}

export async function createCommunityPost(input: {
  id: string;
  userId: string;
  title: string | null;
  body: string;
  topic: string;
  countryId: string | null;
  postType: CommunityPostRecord["postType"];
  tags: string[];
}): Promise<void> {
  const { error } = await configuredClient().from("medweg_community_posts").insert({
    id: input.id,
    author_id: input.userId,
    title: input.title,
    body: input.body,
    topic: input.topic,
    country_id: input.countryId,
    post_type: input.postType,
    tags: input.tags,
  });
  if (error) throw error;
}

export async function createCommunityComment(input: {
  id: string;
  userId: string;
  postId: string;
  parentId: string | null;
  body: string;
}): Promise<void> {
  const { error } = await configuredClient()
    .from("medweg_community_comments")
    .insert({
      id: input.id,
      post_id: input.postId,
      parent_comment_id: input.parentId,
      author_id: input.userId,
      body: input.body,
    });
  if (error) throw error;
}

export async function createCommunityReport(input: {
  postId: string;
  userId: string;
  reason: string;
}): Promise<void> {
  const { error } = await configuredClient()
    .from("medweg_community_reports")
    .insert({
      post_id: input.postId,
      reporter_id: input.userId,
      reason: input.reason,
    });
  if (error) throw error;
}

export type LegacyCommunityPost = {
  id: string;
  title?: string;
  body: string;
  topic: string;
  countryId?: string;
  postType?: CommunityPostRecord["postType"];
  tags?: string[];
  comments?: Array<{ id: string; body: string; parentId?: string; createdAt?: string; time?: string }>;
};

/** Import old device-only content on explicit user action; source storage is never removed. */
export async function importLegacyCommunityPosts(
  legacyPosts: LegacyCommunityPost[],
  userId: string,
): Promise<number> {
  const client = configuredClient();
  const posts = legacyPosts.filter(post =>
    post.id && post.body?.trim() && post.topic && !["uk-plab", "specialty-fit", "first-month"].includes(post.id),
  );
  if (posts.length === 0) return 0;

  const { data: existingPosts, error: existingPostsError } = await client
    .from("medweg_community_posts")
    .select("id")
    .in("id", posts.map(post => post.id));
  if (existingPostsError) throw existingPostsError;
  const existingPostIds = new Set((existingPosts || []).map(row => row.id));
  const postsToInsert = posts.filter(post => !existingPostIds.has(post.id));
  if (postsToInsert.length) {
    const { error } = await client.from("medweg_community_posts").insert(
      postsToInsert.map(post => ({
        id: post.id,
        author_id: userId,
        title: post.title?.trim() || null,
        body: post.body.trim(),
        topic: post.topic,
        country_id: post.countryId || null,
        post_type: post.postType || "discussion",
        tags: (post.tags || []).slice(0, 5),
      })),
    );
    if (error) throw error;
  }

  const comments = posts.flatMap(post =>
    (post.comments || [])
      .filter(comment => comment.id && comment.body?.trim() && comment.body.trim().length <= 500)
      .map(comment => ({ postId: post.id, ...comment })),
  );
  if (comments.length) {
    const { data: existingComments, error: existingCommentsError } = await client
      .from("medweg_community_comments")
      .select("id")
      .in("id", comments.map(comment => comment.id));
    if (existingCommentsError) throw existingCommentsError;
    const existingCommentIds = new Set((existingComments || []).map(row => row.id));
    const commentPostById = new Map(comments.map(comment => [comment.id, comment.postId]));
    const commentsToInsert = comments.filter(comment => !existingCommentIds.has(comment.id));
    if (commentsToInsert.length) {
      const { error } = await client.from("medweg_community_comments").insert(
        commentsToInsert.map(comment => ({
          id: comment.id,
          post_id: comment.postId,
          parent_comment_id: comment.parentId && commentPostById.get(comment.parentId) === comment.postId ? comment.parentId : null,
          author_id: userId,
          body: comment.body.trim(),
        })),
      );
      if (error) throw error;
    }
  }
  return postsToInsert.length;
}
