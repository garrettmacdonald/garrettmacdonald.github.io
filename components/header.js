// Define your navigation items here
const navItems = [
    { path: '/', text: 'Home' },
    { path: '/blog', text: 'Blog' },
    { path: '/calculator', text: 'Options Calculator' }
];

function createHeader() {
    const header = document.createElement('header');
    header.innerHTML = `
        <h1>Garrett MacDonald</h1>
        <nav>
            ${navItems.map(item => 
                `<a href="${item.path}" ${window.location.pathname === item.path ? 'class="active"' : ''}>${item.text}</a>`
            ).join('\n            ')}
        </nav>
    `;
    return header;
}

// Add styles for the header
const styles = document.createElement('style');
styles.textContent = `
    header {
        text-align: center;
        margin-bottom: 40px;
    }
    nav {
        text-align: center;
        margin-bottom: 30px;
    }
    nav a {
        margin: 0 15px;
        color: #333;
        text-decoration: none;
    }
    nav a:hover {
        text-decoration: underline;
    }
    nav a.active {
        font-weight: bold;
    }
    h1 {
        color: #333;
    }
`;

// Insert the header at the start of the body
document.head.appendChild(styles);
document.body.insertBefore(createHeader(), document.body.firstChild);