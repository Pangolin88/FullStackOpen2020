import mongoose from 'mongoose';
import { Utils } from '../extras';
import { STATUS_JOB_LIST } from '../config';

const facebookAnalyticAppEvent = mongoose.Schema({

    maskedType: {type: String, default: ''},  // which should be unmasked:  deviceId, email or phone
    storedFileName: {type: String, default: ''}, // stored file name which includes masked identities list

    countReceived: {type: Number, default: 0}, // from DAL

    businessId: {type: String, default: ''}, // PG3, GS2...
    gameId: {type: String, default: ''}, // TSQ,...

    facebookAppId: {type: String, default: ''}, // FB app id

    preview: [{type: String, default: []}], // callback to DAL system when submitting to FB done

    status: {type: String, default: STATUS_JOB_LIST.INIT},
    created_date: {type: Date},
}, { collection: 'facebook_analytic' });


// facebookAnalyticAppEvent.virtual('id').get(function (){
//     return this._id.toString();
// });
//
//
facebookAnalyticAppEvent.statics.findByListId = function(listId, status, callback) {
    return this.findOne({storedFileName: listId, status: status}).then(callback);
};

facebookAnalyticAppEvent.set('toJSON', { virtuals: true });
module.exports = mongoose.model('FacebookAnalyticAppEvent', facebookAnalyticAppEvent);

