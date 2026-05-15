document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('.image-block > img');

    images.forEach((image) => {
        image.addEventListener('click', () => {
            const imageViewer = document.querySelector('#image-viewer');

            imageViewer.addEventListener('click', () => {
                imageViewer.classList.remove('visible');
                imageViewer.classList.add('hidden');
            });
            const imageViewerImage = imageViewer.firstElementChild;
            imageViewerImage.src = image.src;
            imageViewer.classList.remove('hidden');
            imageViewer.classList.add('visible');
        });
    })
    
    const codeBlocks = document.querySelectorAll('pre > code');

    codeBlocks.forEach((code) => {
        const pre = code.parentElement;
        pre.style.position = 'relative';

        const button = document.createElement('button');
        button.className = 'copy-btn';
        button.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
                <path d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM19 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5ZM19 21H8V7H19V21Z"/>
            </svg>
            <span class='copy-btn-content'></span>
        `;

        pre.appendChild(button);

        button.addEventListener('click', () => {
            const text = code.innerText || code.textContent;
            copyToClipboard(text, button);
        });
    });
});

async function copyToClipboard(text, button) {
    const originalHTML = button.innerHTML;

    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
        } else {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = 0;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
        }

        showSuccess(button);

    } catch (err) {
        console.error('Copy failed:', err);
        button.textContent = 'Failed';
        setTimeout(() => button.innerHTML = originalHTML, 2000);
    }
}

function showSuccess(button) {
    setTimeout(() => {
        button.classList.add('success');
        button.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
            </svg>
            <span class='copy-btn-content'></span>
        `;
        setTimeout(() => {
            button.classList.remove('success');
            button.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM19 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5ZM19 21H8V7H19V21Z"/>
                </svg>
                <span class='copy-btn-content'></span>
            `;
        }, 300);   
    }, 0)
}