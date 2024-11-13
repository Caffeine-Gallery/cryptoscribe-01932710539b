import { backend } from 'declarations/backend';

const newPostBtn = document.getElementById('newPostBtn');
const postForm = document.getElementById('postForm');
const postsDiv = document.getElementById('posts');
const loadingSpinner = document.getElementById('loadingSpinner');

let quill = new Quill('#editor', {
    theme: 'snow',
    modules: {
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{'list': 'ordered'}, {'list': 'bullet'}],
            [{'header': [1, 2, 3, 4, 5, 6, false]}],
            ['link', 'image']
        ]
    }
});

newPostBtn.addEventListener('click', () => {
    postForm.style.display = postForm.style.display === 'none' ? 'block' : 'none';
});

postForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    loadingSpinner.style.display = 'block';
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const body = quill.root.innerHTML;

    try {
        await backend.addPost(title, body, author);
        await loadPosts();
        postForm.reset();
        quill.setContents([]);
        postForm.style.display = 'none';
    } catch (error) {
        console.error('Error submitting post:', error);
    } finally {
        loadingSpinner.style.display = 'none';
    }
});

async function loadPosts() {
    loadingSpinner.style.display = 'block';
    try {
        const posts = await backend.getPosts();
        postsDiv.innerHTML = '';
        posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.className = 'card mb-3';
            postElement.innerHTML = `
                <div class="card-body">
                    <h5 class="card-title">${post.title}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">By ${post.author}</h6>
                    <p class="card-text">${post.body}</p>
                    <small class="text-muted">Posted on ${new Date(post.timestamp / 1000000).toLocaleString()}</small>
                </div>
            `;
            postsDiv.appendChild(postElement);
        });
    } catch (error) {
        console.error('Error loading posts:', error);
    } finally {
        loadingSpinner.style.display = 'none';
    }
}

loadPosts();
