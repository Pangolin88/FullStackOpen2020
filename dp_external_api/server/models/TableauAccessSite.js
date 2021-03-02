import mongoose from 'mongoose';

const TableauAccessSite = mongoose.Schema({
    department: {type: String, default: ''},
    sites: [String]
}, { collection: 'tableau_access_site' });

TableauAccessSite.set('toJSON', { virtuals: true });
module.exports = mongoose.model('TableauAccessSite', TableauAccessSite);

