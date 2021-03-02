import mongoose from 'mongoose';

const Logging = mongoose.Schema({
    logDate: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    level: {
        type: String,
        enum: ['INFO', 'ERROR', 'WARNING', 'DEBUG'],
        default: 'ERROR'
    },
    source: String,
    summary: String,
    instance: mongoose.Schema.Types.Mixed
}, { collection: 'logging' });

Logging.set('toJSON', { virtuals: true });
module.exports = mongoose.model('Logging', Logging);

