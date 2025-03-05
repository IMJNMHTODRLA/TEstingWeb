import express from 'express';
import fs from 'fs';
import path from 'path';

const app = express();
const DATA_FILE = path.join(__dirname, 'data.json');
const adminIp = ['192.168.219.105', ''];

// 데이터 로드 함수
function loadPosts() {
    if (!fs.existsSync(DATA_FILE)) {
        return [];
    }
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(data) || [];
    } catch (error) {
        return [];
    }
}

// 데이터 저장 함수
function savePosts(posts) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(posts, null, 2), 'utf-8');
}

// 미들웨어 설정
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 메인 페이지
app.get('/', (req, res) => {
    const userIp = req.ip;
    const posts = loadPosts();

    const postList = posts.map((post, index) => ({
        id: index,
        title: post[index]?.[0]?.Title
    }));

    const adminMessage = adminIp.includes(userIp)
        ? `안녕하세요. 어드민, 당신의 IPv4 주소는 ${userIp} 입니다.`
        : '';

    res.render('index', { posts: postList, adminMessage });
});

// 글 작성 페이지
app.route('/write')
    .get((req, res) => {
        res.render('write');
    })
    .post((req, res) => {
        const { title, content } = req.body;
        const posts = loadPosts();

        const newPost = {
            [posts.length]: [{
                Title: title,
                Content: content,
                Comments: []
            }]
        };

        posts.push(newPost);
        savePosts(posts);
        res.redirect('/');
    });

// 게시물 보기 및 댓글 작성
app.route('/post/:post_id')
    .get((req, res) => {
        const { post_id } = req.params;
        const posts = loadPosts();

        if (!posts[post_id]) {
            return res.status(404).send('게시물을 찾을 수 없습니다.');
        }

        const postData = posts[post_id][post_id]?.[0];
        res.render('post', { post: postData });
    })
    .post((req, res) => {
        const { post_id } = req.params;
        const { comment } = req.body;
        const posts = loadPosts();

        if (!posts[post_id]) {
            return res.status(404).send('게시물을 찾을 수 없습니다.');
        }

        posts[post_id][post_id][0].Comments.push(comment);
        savePosts(posts);
        res.redirect(`/post/${post_id}`);
    });

