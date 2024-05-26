export const Constants = {
    SERVER_URL: (() => {
        const currentBaseUrl = window.location.hostname;
        if (currentBaseUrl === 'canderdb.com') {
            return new URL('https://cander-db.com');
        } else {
            return new URL('https://cander-db.com');
        }
    })(),
    APP_NAME: 'CanderDB'
}



