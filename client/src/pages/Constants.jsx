export const Constants = {
    SERVER_URL: (() => {
        const currentBaseUrl = window.location.hostname;
        if (currentBaseUrl === 'canderdb.com') {
            return 'https://cander-db.com';
        } else {
            return 'http://localhost:3333';
        }
    })(),
    APP_NAME: 'CanderDB'
}



