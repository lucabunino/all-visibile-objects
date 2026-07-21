/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
    return resolve(event, {
        preload: ({ type }) => {
            return type === 'font' || type === 'js' || type === 'css';
        },
        transformPageChunk: ({ html }) => {
            if (event.route.id === '/about') {
                return html.replace('<html lang="en">', '<html lang="en" style="background-color: black">');
            }
            return html;
        }
    });
}