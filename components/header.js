// Define your navigation items here
const navItems = [
    { path: '/', text: 'Home' },
    { path: '/blog', text: 'Blog' },
    { path: '/calculator', text: 'Options Calculator' }
];

function createHeader() {
    const header = document.createElement('header');
    
    // Create main heading
    const heading = document.createElement('h1');
    heading.textContent = 'Garrett MacDonald';
    
    // Create navigation
    const nav = document.createElement('nav');
    navItems.forEach(item => {
        const link = document.createElement('a');
        link.href = item.path;
        link.textContent = item.text;
        
        // Set active class based on current path
        if (window.location.pathname === item.path || 
            (item.path !== '/' && window.location.pathname.startsWith(item.path))) {
            link.classList.add('active');
        }
        
        nav.appendChild(link);
    });
    
    // Append heading and nav to header
    header.appendChild(heading);
    header.appendChild(nav);
    
    return header;
}

// Insert the header at the start of the body
document.body.insertBefore(createHeader(), document.body.firstChild);