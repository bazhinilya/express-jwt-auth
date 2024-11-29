import { connect } from 'mongoose';

import { DB_URL } from './envConfig.js';

export const connect = () =>
    connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log('Connect to mongodb'))
        .catch(err => console.error('Failed to connect to mongodb:', err));