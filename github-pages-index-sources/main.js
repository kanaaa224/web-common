import * as api from '../web-app-sources/api.js';

document.body.innerHTML = `
    <header>
        <h1></h1>
        <p>このリポジトリに含まれているアプリケーション</p>
    </header>
    <main>
        <article>
            <section>
                <span class="mdi mdi-loading mdi-spin"></span>
            </section>
        </article>
    </main>
    <footer>
        <p>© 2022 <a href="https://kanaaa224.github.io" target="_blank">kanaaa224</a>. All rights reserved.</p>
    </footer>
`;

(async () => {
    const url     = new URL(window.location.href);
    const user    = url.hostname.split('.')[0];
    const repo    = url.pathname.split('/').filter(Boolean)[0];
    const path    = url.pathname.split('/').filter(Boolean).slice(1).join('/');
    const title   = `${user} / ${repo}`;
    const article = document.querySelector('main article');

    document.querySelector('header h1').textContent = document.title = title;

    try {
        let directories = await api.call({ baseURL: 'https://api.github.com', path: `/repos/${user}/${repo}/contents/${path}` });
            directories = directories.data;
            directories = directories.filter(item => item.type === 'dir');

        article.querySelector('section').remove();

        if(directories.length === 0)        article.innerHTML += '<section><span>このリポジトリにはアプリケーションがありません</span></section>';
        for(const directory of directories) article.innerHTML += `<section><a href="${url}${directory.name}" target="_blank">${directory.name}</a></section>`;
    } catch(e) {
        console.error(e);
    }
})();